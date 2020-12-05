import { Component, ViewChild } from '@angular/core';
import { parseEquation } from 'src/app/helpers/parsers';
import { EquationService } from 'src/app/services/equation.service';
import { MatrixDialogComponent } from './matrix-dialog/matrix-dialog.component';
import ToolbarContent from './toolbar.json';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @ViewChild(MatrixDialogComponent) popup: MatrixDialogComponent;
  toolbar: any;
  filter = false;
  filtered: any;

  constructor(private equationService: EquationService) { this.toolbar = ToolbarContent; }

  onClick(equation: any): void {
    if (equation[0].type === 'matrix') {
      this.popup.openPopup(equation[0].matrixType);
      return;
    }
    this.equationService.addComponentsToEquation(parseEquation(equation));
  }

  onFilterChanged(filter: string): void {
    if (!filter.length) {
      this.filter = false;
      return;
    }
    this.filtered = ToolbarContent.tabs.map(t => t.buttons)
      .filter(t => t !== undefined)
      .reduce((a, b) => a.concat(b), [])
      .filter(b => b.display.includes(filter));
    this.filter = true;
  }
}
