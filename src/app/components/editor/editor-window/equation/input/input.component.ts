import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EquationService } from 'src/app/services/equation.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() group: FormGroup;
  @Input() path: Array<string>;
  @Input() index: number;
  text: string;

  constructor(private equationService: EquationService) { }

  onFocus(): void {
    this.text = this.group.value.value;
    this.equationService.currentLocation = { path: this.path, position: this.index + 1 };
  }

  onKey(key: string): void {
    if (key === 'Backspace') {
      if (this.text !== this.group.value.value) { this.text = this.group.value.value; return; }
      this.equationService.removeComponentFromEquation();
    }
  }

}
