import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SubAndSuperscriptEqComponent } from 'src/app/shared/helpers/equation-components';

@Component({
  selector: 'app-subandsuperscript',
  templateUrl: './subandsuperscript.component.html',
  styleUrls: ['./subandsuperscript.component.scss']
})
export class SubandsuperscriptComponent {
  @Input() component: SubAndSuperscriptEqComponent;
  @Input() group: FormGroup;
  @Input() path: Array<string>;
}
