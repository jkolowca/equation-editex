import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { EqComponent, SubscriptEqComponent } from 'src/app/shared/helpers/equation-components';

@Component({
  selector: 'app-subscript',
  templateUrl: './subscript.component.html',
  styleUrls: ['./subscript.component.scss']
})
export class SubscriptComponent {
  @Input() component: SubscriptEqComponent;
  @Input() group: FormGroup;
  @Input() path: Array<string>;
}
