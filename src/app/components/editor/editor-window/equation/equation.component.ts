import { Component, Input } from '@angular/core';
import { EqComponent } from 'src/app/services/equation.service';

@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styleUrls: ['./equation.component.scss']
})
export class EquationComponent {
  @Input() equation: EqComponent[];

}
