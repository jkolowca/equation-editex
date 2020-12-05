import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { EqComponentTypes, EqComponent, InputComponent, MatrixComponent, FunctionComponent } from '../helpers/components';
import { parseEquation } from '../helpers/parsers';

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
    path: [] as Array<string>,
    position: 3
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
        case EqComponentTypes.Operator:
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
        case EqComponentTypes.Binominal:
        case EqComponentTypes.SubAndSuperscript:
        case EqComponentTypes.Fraction:
        case EqComponentTypes.Root: {
          form.push(this.fb.group({ value: this.fb.array([this.fb.array([]), this.fb.array([])]), type: component.type }));
          this.createForm(form.get([form.length - 1, 'value']).get([0]) as FormArray, component.value[0] as EqComponent[]);
          this.createForm(form.get([form.length - 1, 'value']).get([1]) as FormArray, component.value[1] as EqComponent[]);
          break;
        }
        case EqComponentTypes.Function: {
          const funct = component as FunctionComponent;
          form.push(this.fb.group({
            value: this.fb.array(funct.value.map(e => this.fb.array([]))),
            type: component.type,
            functionCode: funct.functionCode
          }));
          funct.value.forEach((v, i) => this.createForm(form.get([form.length - 1, 'value']).get([i]) as FormArray, v));
          break;
        }
        case EqComponentTypes.Matrix:
          const matrix = component as MatrixComponent;
          form.push(this.fb.group({
            value: this.fb.array(matrix.value.map(e => this.fb.array([]))),
            type: matrix.type,
            matrixType: matrix.matrixType,
            size: this.fb.group({ 0: matrix.size[0], 1: matrix.size[1] })
          }));
          matrix.value.forEach((v, i) => this.createForm(form.get([form.length - 1, 'value']).get([i]) as FormArray, v));
          break;
      }
    });
  }

  openDocument(index: number): void {
    this.currentDocumentIndex = index;
    this._currentEquation.next(this.documents[index].equation);
    this.updateEquationForm();
    localStorage.setItem('currentDocument', index.toString());
    this.currentLocation = { path: [], position: this.documents[index].equation.length };
  }

  closeDocument(index: number): void {
    if (this.documents.length === 1) {
      this.documents = [];
      this.addEmptyDocument('UNNAMED');
    }
    else {
      this.documents.splice(index, 1);
      this.openDocument(0);
      this.updateDocumentNames();
      this.storeData();
    }
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

  loadDocumentsFromFiles(files: { name: string, equation: EqComponent[] }[]): void {
    const documents = files.map((f, i) => ({ name: f.name, index: this.documents.length + i, equation: f.equation }));
    this.documents.push(...documents);
    this.openDocument(this.documents.length - 1);
    this.updateDocumentNames();
    this.storeData();
  }

  storeData(): void {
    localStorage.setItem('documents', JSON.stringify(this.documents));
    localStorage.setItem('timestamp', new Date().getTime().toString());
  }

  addComponentsToEquation(equation: EqComponent[]): void {
    let currentEquation = this.documents[this.currentDocumentIndex].equation as any;
    this.currentLocation.path.forEach(p => currentEquation = currentEquation[p]);
    currentEquation.splice(this.currentLocation.position, 0, ...equation);
    this.currentLocation.position += equation.length;
    this.onEquationChange();
    this.updateEquationForm();
  }

  removeComponentFromEquation(): void {
    let currentEquation = this.documents[this.currentDocumentIndex].equation as any;
    if (this.currentLocation.position < 2) { return; }
    this.currentLocation.position -= 2;
    this.currentLocation.path.forEach(p => currentEquation = currentEquation[p]);
    currentEquation.splice(this.currentLocation.position, 1);
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

