import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Equation, EqComponentTypes } from 'src/app/helpers/equation-components';
import { EquationService } from 'src/app/services/equation.service';

@Component({
  selector: 'app-editor-window',
  templateUrl: './editor-window.component.html',
  styleUrls: ['./editor-window.component.scss']
})
export class EditorWindowComponent {
  equationForm: FormGroup;
  constructor(public equationService: EquationService, private fb: FormBuilder) {
    equationService.currentEquation.subscribe(e => {
      this.equationForm = this.fb.group({ array: this.fb.array([]) });
      this.createForm(this.equationForm.controls.array as FormArray, e);
    });
  }

  onValueChanged(): void {
    this.equationService.updateEquation(this.equationForm.value.array);
  }

  createForm(form: FormArray, equation: Equation): void {
    equation.value.forEach(component => {
      switch (component.type) {
        case EqComponentTypes.Function:
        case EqComponentTypes.Input: {
          form.push(this.fb.group(component));
          break;
        }
        case EqComponentTypes.Superscript:
        case EqComponentTypes.Subscript: {
          form.push(this.fb.group({ value: this.fb.array([]), type: component.type }));
          this.createForm(form.get([form.length - 1, 'value']) as FormArray, component.value as Equation);
          break;
        }
      }
    });
  }
}
