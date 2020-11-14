import { Component } from '@angular/core';
import { EquationService } from 'src/app/services/equation.service';

@Component({
  selector: 'app-code-window',
  templateUrl: './code-window.component.html',
  styleUrls: ['./code-window.component.scss']
})
export class CodeWindowComponent {
  equation: string;

  constructor(equationService: EquationService) {
    equationService.currentEquation.subscribe(equation => this.equation = equation.toString());
  }
}
