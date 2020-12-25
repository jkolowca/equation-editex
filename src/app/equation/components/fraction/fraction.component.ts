import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FractionEqComponent } from 'src/app/shared/helpers/equation-components';

@Component({
  selector: 'app-fraction',
  templateUrl: './fraction.component.html',
  styleUrls: ['./fraction.component.scss']
})
export class FractionComponent {
  @Input() component: FractionEqComponent;
  @Input() group: FormGroup;
  @Input() path: Array<string>;

}
