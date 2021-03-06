import { Component } from '@angular/core';
import { EquationService } from 'src/app/shared/services/equation.service';
import { toString } from 'src/app/shared/helpers/equation-components';
import { FileService } from 'src/app/shared/services/file.service';

@Component({
  selector: 'app-code-window',
  templateUrl: './code-window.component.html',
  styleUrls: ['./code-window.component.scss']
})
export class CodeWindowComponent {
  equation: string;

  constructor(equationService: EquationService, private fileService: FileService) {
    equationService.currentEquation.subscribe(equation => this.equation = toString(equation));
  }

  toFile(): void {
    this.fileService.saveToFile(this.equation, 'equation');
  }
}
