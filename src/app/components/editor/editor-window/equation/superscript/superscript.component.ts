import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SuperscriptEqComponent } from 'src/app/helpers/equation-components';

@Component({
  selector: 'app-superscript',
  templateUrl: './superscript.component.html',
  styleUrls: ['./superscript.component.scss']
})
export class SuperscriptComponent {
  @Input() component: SuperscriptEqComponent;
  @Input() group: FormGroup;
  @Input() path: Array<string>;
}
