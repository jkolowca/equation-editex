import { Component } from '@angular/core';
import { EquationService } from 'src/app/services/equation.service';
import { toString } from 'src/app/helpers/equation-components';

@Component({
  selector: 'app-preview-window',
  templateUrl: './preview-window.component.html',
  styleUrls: ['./preview-window.component.scss']
})
export class PreviewWindowComponent {
  equation: string;

  constructor(equationService: EquationService) {
    equationService.currentEquation.subscribe(equation => this.equation = toString(equation));
  }
}
