import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { EqComponentTypes, EqComponent, parseEquation, InputComponent } from '../helpers/equation-components';

export interface Document {
  name: string;
  index: number;
  equation: EqComponent[];
}

export type DocumentNames = Array<{ name: string, index: number }>;

@Injectable({
  providedIn: 'root'
})
export class EquationService {
  currentLocation = {
    path: undefined,
    position: 0
  };

  currentDocumentIndex: number;
  private documents: Document[];
  private form: FormGroup;
  private _currentEquation = new BehaviorSubject<EqComponent[]>(undefined);
  private _documentNames = new BehaviorSubject<DocumentNames>(undefined);
  private _equationForm = new BehaviorSubject<FormGroup>(undefined);
  private subscription: Subscription;

  constructor(private fb: FormBuilder) { }

  get equationForm(): Observable<FormGroup> {
    return this._equationForm.asObservable();
  }

  get currentEquation(): Observable<EqComponent[]> {
    return this._currentEquation.asObservable();
  }

  get documentNames(): Observable<DocumentNames> {
    return this._documentNames.asObservable();
  }

  initialize(): void {
    this.form = this.fb.group({ value: this.fb.array([]) });
    this.subscription = this.form.valueChanges.subscribe(form => this.onFormValueChange(form));
    const timestamp = JSON.parse(localStorage.getItem('timestamp'));
    if (timestamp) {
      const now = new Date().getTime();
      if (now - timestamp > 2 * 3600000) {
        localStorage.clear();
      }
    }
    else { localStorage.clear(); }
    const data = JSON.parse(localStorage.getItem('documents'));
    const currentDocument = JSON.parse(localStorage.getItem('currentDocument'));
    this.documents = data ? data.map(document => ({ ...document, equation: parseEquation(document.equation) })) : [];

    if (this.documents.length) {
      this.openDocument(currentDocument | 0);
      this.updateDocumentNames();
    }
    else {
      this.addEmptyDocument('New Equation');
    }
  }

  createForm(form: FormArray, equation: EqComponent[]): void {
    equation.forEach(component => {
      switch (component.type) {
        case EqComponentTypes.Function:
        case EqComponentTypes.Input: {
          form.push(this.fb.group(component));
          break;
        }
        case EqComponentTypes.Superscript:
        case EqComponentTypes.Subscript: {
          form.push(this.fb.group({ value: this.fb.array([]), type: component.type }));
          this.createForm(form.get([form.length - 1, 'value']) as FormArray, component.value as EqComponent[]);
          break;
        }
        case EqComponentTypes.SubAndSuperscript: {
          form.push(this.fb.group({value: this.fb.array([this.fb.array([]), this.fb.array([])]), type: component.type}));
          this.createForm(form.get([form.length - 1, 'value']).get([0]) as FormArray, component.value[0] as EqComponent[]);
          this.createForm(form.get([form.length - 1, 'value']).get([1]) as FormArray, component.value[1] as EqComponent[]);
        }
      }
    });
  }

  openDocument(index: number): void {
    this.currentDocumentIndex = index;
    this._currentEquation.next(this.documents[index].equation);
    this.updateEquationForm();
    localStorage.setItem('currentDocument', index.toString());
  }

  updateDocumentNames(): void {
    this._documentNames.next(this.documents.map(d => ({ index: d.index, name: d.name })));
  }

  addEmptyDocument(name: string): void {
    const document = { name, index: this.documents.length, equation: [new InputComponent()] };
    this.documents.push(document);
    this.openDocument(document.index);
    this.updateDocumentNames();
    this.storeData();
  }

  loadDocumentFromFile(fileName: string): void {
  }

  storeData(): void {
    localStorage.setItem('documents', JSON.stringify(this.documents));
    localStorage.setItem('timestamp', new Date().getTime().toString());
  }

  addComponentsToEquation(equation: EqComponent[]): void {
    let currentEquation = this.documents[this.currentDocumentIndex].equation;
    if (this.currentLocation.path) { currentEquation = currentEquation[this.currentLocation.path] as any; }
    currentEquation.splice(this.currentLocation.position, 0, ...equation);
    this.onEquationChange();
    this.updateEquationForm();
  }

  onEquationChange(): void {
    this._currentEquation.next(this.documents[this.currentDocumentIndex].equation);
    this.storeData();
  }

  updateEquationForm(): void {
    this.subscription.unsubscribe();
    (this.form.controls.value as FormArray).clear();
    this.createForm(this.form.controls.value as FormArray, this.documents[this.currentDocumentIndex].equation);
    this._equationForm.next(this.form);
    this.subscription = this.form.valueChanges.subscribe(form => this.onFormValueChange(form));
  }

  setEquationValue(equation: any[]): void {
    this.documents[this.currentDocumentIndex].equation = parseEquation(equation);
    this._currentEquation.next(this.documents[this.currentDocumentIndex].equation);
    this.storeData();
  }

  changeDocumentNames(newNames: DocumentNames): void {
    newNames.forEach(document => this.documents.find(d => d.index === document.index).name = document.name);
    this.storeData();
  }

  onFormValueChange(form: any): void {
    this.documents[this.currentDocumentIndex].equation = parseEquation(form.value);
    this._currentEquation.next(this.documents[this.currentDocumentIndex].equation);
    this.storeData();
  }
}

