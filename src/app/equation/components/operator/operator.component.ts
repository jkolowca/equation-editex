import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OperatorEqComponent } from 'src/app/shared/helpers/equation-components';

@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.scss']
})
export class OperatorComponent {
  @Input() component: OperatorEqComponent;
  @Input() group: FormGroup;
}
