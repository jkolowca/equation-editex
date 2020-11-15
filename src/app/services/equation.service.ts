import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { EqComponentTypes, Equation, parseEquation } from '../helpers/equation-components';

export interface Document {
  name: string;
  index: number;
  equation: Equation;
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
  private _currentEquation = new BehaviorSubject<Equation>(undefined);
  private _documentNames = new BehaviorSubject<DocumentNames>(undefined);
  private _equationForm = new BehaviorSubject<FormGroup>(undefined);

  constructor(private fb: FormBuilder) { }

  get equationForm(): Observable<FormGroup> {
    return this._equationForm.asObservable();
  }

  get currentEquation(): Observable<Equation> {
    return this._currentEquation.asObservable();
  }

  get documentNames(): Observable<DocumentNames> {
    return this._documentNames.asObservable();
  }

  initialize(): void {
    this.form = this.fb.group({ value: this.fb.array([]) });
    this.form.valueChanges.subscribe(form => this.onFormValueChange(form));
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
    this.documents = data ? data.map(document => ({ ...document, equation: parseEquation(document.equation.value) })) : [];

    if (this.documents.length) {
      this.openDocument(currentDocument | 0);
      this.updateDocumentNames();
    }
    else {
      this.addEmptyDocument('New Equation');
    }
  }

  createForm(form: FormArray, equation: Equation): void {
    equation.value.forEach(component => {
      switch (component.type) {
        case EqComponentTypes.Function:
        case EqComponentTypes.Input: {
          form.push(this.fb.group(component));
          break;
        }
        case EqComponentTypes.Superscript:
        case EqComponentTypes.Subscript: {
          form.push(this.fb.group({ value: this.fb.array([]), type: component.type }));
          this.createForm(form.get([form.length - 1, 'value']) as FormArray, component.value as Equation);
          break;
        }
      }
    });
  }

  openDocument(index: number): void {
    this.currentDocumentIndex = index;
    this._currentEquation.next(this.documents[index].equation);
    this.createForm(this.form.controls.value as FormArray, this.documents[index].equation);
    this._equationForm.next(this.form);
    localStorage.setItem('currentDocument', index.toString());
  }

  updateDocumentNames(): void {
    this._documentNames.next(this.documents.map(d => ({ index: d.index, name: d.name })));
  }

  addEmptyDocument(name: string): void {
    const document = { name, index: this.documents.length, equation: new Equation() };
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

  addComponentsToEquation(equation: Equation): void {
    let currentEquation = this.documents[this.currentDocumentIndex].equation;
    if (this.currentLocation.path) { currentEquation = currentEquation[this.currentLocation.path] as any; }
    currentEquation.value.splice(this.currentLocation.position, 0, ...equation.value);
    this.onEquationChange();
    this.updateEquationForm();
  }

  onEquationChange(): void {
    this._currentEquation.next(this.documents[this.currentDocumentIndex].equation);
    this.storeData();
  }

  updateEquationForm(): void {
    this.form.controls.value = this.fb.array([]);
    this.createForm(this.form.controls.value as FormArray, this.documents[this.currentDocumentIndex].equation);
    this.form.valueChanges.subscribe(form => this.onFormValueChange(form));
    this._equationForm.next(this.form);
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
    this.setEquationValue(form.value);
  }
}

