import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { EqComponentTypes, Equation, EquationService } from 'src/app/services/equation.service';

@Component({
  selector: 'app-editor-window',
  templateUrl: './editor-window.component.html',
  styleUrls: ['./editor-window.component.scss']
})
export class EditorWindowComponent implements OnInit {
  equationForm: FormGroup;
  constructor(public equationService: EquationService, private fb: FormBuilder) {
    equationService.currentEquation.subscribe(e => {
      this.equationForm = this.fb.group({ array: this.fb.array([]) });
      this.createForm(this.equationForm.controls.array as FormArray, e);
    });

    this.equationForm.valueChanges.subscribe(value => console.log(value));
  }

  createForm(form: FormArray, equation: Equation): void {
    equation.forEach(component => {
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
  ngOnInit(): void {
  }

}
