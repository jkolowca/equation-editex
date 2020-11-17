import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { EqComponent } from 'src/app/helpers/equation-components';

@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styleUrls: ['./equation.component.scss']
})
export class EquationComponent {
  @Input() equation: EqComponent[];
  @Input() array: FormArray;
  @Input() group: FormArray;
}
