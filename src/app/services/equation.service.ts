import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EquationService {
  equation: string[][] = [];
  constructor() { }
  add(equationId: number, value: string): void {
    this.equation[equationId].push(value);
  }
}
