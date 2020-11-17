import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { EqComponent } from 'src/app/helpers/equation-components';
import { EquationService } from 'src/app/services/equation.service';

@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styleUrls: ['./equation.component.scss']
})
export class EquationComponent {
  @Input() equation: EqComponent[];
  @Input() array: FormArray;
  @Input() group: FormArray;
  @Input() path: Array<string>;

  constructor(private equationService: EquationService) { }

  text: string;

  onFocus(path: Array<string>, position: number, text: string): void {
    this.text = text;
    this.equationService.currentLocation = { path, position };
  }

  onKey(key: string, text: string): void {
    if (key === 'Backspace') {
      if (this.text !== text) { this.text = text; return; }
      this.equationService.removeComponentFromEquation();
    }
  }
}
