import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum EqComponentTypes {
  Input = 'input',
  Function = 'function',
  Subscript = 'subscript',
  Superscript = 'superscript',
  SubAndSuperscript = 'subandsuperscript',
  Matrix = 'matrix',
  Binominal = 'binominal'
}

export interface EqComponent {
  value: string | Equation | Equation[];
  type: EqComponentTypes;
}

export interface Document {
  name: string;
  index: number;
  equation: Equation;
}

export type Equation = EqComponent[];
export type DocumentNames = Array<{name: string, index: number}>;

@Injectable({
  providedIn: 'root'
})
export class EquationService {
  currentDocumentIndex: number;
  private documents: Document[];
  private _currentEquation = new BehaviorSubject<Equation>(undefined);
  private _documentNames = new BehaviorSubject<DocumentNames>(undefined);

  get currentDocument(): Observable<Equation> {
    return this._currentEquation.asObservable();
  }

  get documentNames(): Observable<DocumentNames> {
    return this._documentNames.asObservable();
  }

  initialize(): void{
    const data = JSON.parse(localStorage.getItem('documents'));
    const currentDocument = JSON.parse(localStorage.getItem('currentDocument'));
    this.documents = data ? data : [];
    if (this.documents.length) {
      this.openDocument(currentDocument | 0);
      this.updateDocumentNames();
    }
    else {
      this.addEmptyDocument('New Equation');
    }
  }

  openDocument(index: number): void{
    this._currentEquation.next(this.documents[index].equation);
    this.currentDocumentIndex = index;
    localStorage.setItem('currentDocument', index.toString());
  }

  updateDocumentNames(): void {
    this._documentNames.next(this.documents.map(d => ({index: d.index, name: d.name})));
  }

  addEmptyDocument(name: string): void {
    const document = {name, index: this.documents.length, equation: [{value: '', type: EqComponentTypes.Input}]};
    this.documents.push(document);
    this.openDocument(document.index);
    this.updateDocumentNames();
    this.saveDocuments();
  }

  loadDocumentFromFile(fileName: string): void {
  }

  saveDocuments(): void {
    localStorage.setItem('documents', JSON.stringify(this.documents));
  }

  changeDocumentNames(newNames: DocumentNames): void{
    newNames.forEach(document => this.documents.find(d => d.index === document.index).name = document.name);
    this.saveDocuments();
  }
}

