import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FunctionEqComponent } from 'src/app/shared/helpers/equation-components';

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
