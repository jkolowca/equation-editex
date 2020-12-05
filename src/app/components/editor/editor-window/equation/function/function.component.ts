import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FunctionEqComponent } from 'src/app/helpers/equation-components';

@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.scss']
})
export class FunctionComponent {
  @Input() function: FunctionEqComponent;
  @Input() group: FormGroup;
  @Input() path: Array<string>;
}