import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Equation, parseEquation } from '../helpers/equation-components';

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
  private _currentEquation = new BehaviorSubject<Equation>(undefined);
  private _documentNames = new BehaviorSubject<DocumentNames>(undefined);

  get currentEquation(): Observable<Equation> {
    return this._currentEquation.asObservable();
  }

  get documentNames(): Observable<DocumentNames> {
    return this._documentNames.asObservable();
  }

  initialize(): void {
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

  openDocument(index: number): void {
    this._currentEquation.next(this.documents[index].equation);
    this.currentDocumentIndex = index;
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
    this.saveDocuments();
  }

  loadDocumentFromFile(fileName: string): void {
  }

  saveDocuments(): void {
    localStorage.setItem('documents', JSON.stringify(this.documents));
    localStorage.setItem('timestamp', new Date().getTime().toString());
  }

  addToEquation(equation: Equation): void {
    let currentEquation = this.documents[this.currentDocumentIndex].equation;
    if (this.currentLocation.path) { currentEquation = currentEquation[this.currentLocation.path] as any; }
    currentEquation.value.splice(this.currentLocation.position, 0, ...equation.value);
    this._currentEquation.next(this.documents[this.currentDocumentIndex].equation);
    this.saveDocuments();
    console.log(this.documents[this.currentDocumentIndex].equation.toString());
  }

  updateEquation(equation: any[]): void {
    this.documents[this.currentDocumentIndex].equation = parseEquation(equation);
    this._currentEquation.next(this.documents[this.currentDocumentIndex].equation);
    this.saveDocuments();
  }

  changeDocumentNames(newNames: DocumentNames): void {
    newNames.forEach(document => this.documents.find(d => d.index === document.index).name = document.name);
    this.saveDocuments();
  }
}

