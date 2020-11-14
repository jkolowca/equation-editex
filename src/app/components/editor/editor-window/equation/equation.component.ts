import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Equation } from 'src/app/helpers/equation-components';

@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styleUrls: ['./equation.component.scss']
})
export class EquationComponent {
  @Input() equation: Equation;
  @Input() array: FormArray;
  @Input() group: FormArray;
  @Output() valueChanges = new EventEmitter<void>();
}
