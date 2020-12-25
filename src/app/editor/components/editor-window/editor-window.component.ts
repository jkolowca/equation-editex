import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EqComponent } from 'src/app/shared/helpers/equation-components';
import { EquationService } from 'src/app/shared/services/equation.service';

@Component({
  selector: 'app-editor-window',
  templateUrl: './editor-window.component.html',
  styleUrls: ['./editor-window.component.scss']
})
export class EditorWindowComponent {
  currentEquation: EqComponent[];
  equationForm: FormGroup;
  constructor(public equationService: EquationService) {
    equationService.currentEquation.subscribe(e => this.currentEquation = e);
    equationService.equationForm.subscribe(e => this.equationForm = e);
  }
}
