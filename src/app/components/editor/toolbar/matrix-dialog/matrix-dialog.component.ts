import { Component, HostBinding } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputComponent } from 'src/app/helpers/components';
import { parseEquation } from 'src/app/helpers/parsers';
import { EquationService } from 'src/app/services/equation.service';

@Component({
  selector: 'app-matrix-dialog',
  templateUrl: './matrix-dialog.component.html',
  styleUrls: ['./matrix-dialog.component.scss']
})
export class MatrixDialogComponent {
  @HostBinding('style.display') display: string;
  matrixType: any;

  form = new FormGroup({
    columns: new FormControl(2, [Validators.required, Validators.min(1)]),
    rows: new FormControl(2, [Validators.required, Validators.min(1)])
  });

  constructor(public equationService: EquationService) {
    this.display = 'none';
  }

  openPopup(matrixType: any): void {
    this.matrixType = matrixType;
    this.display = 'block';
  }

  closePopup(): void {
    this.display = 'none';
  }

  async onApply(): Promise<void> {
    const equation = [{
      type: 'matrix',
      matrixType: this.matrixType,
      size: [this.form.value.rows, this.form.value.columns],
      value: []
    }, { type: 'input', value: '' }];
    for (let i = 0; i < equation[0].size[0] * equation[0].size[1]; i++) {
      (equation[0].value as any[]).push([{ type: 'input', value: '' }]);
    }
    this.equationService.addComponentsToEquation(parseEquation(equation));
    this.closePopup();
  }

  onCancel(): void {
    this.closePopup();
  }
}
