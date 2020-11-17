import { Component, OnInit } from '@angular/core';
import { EqComponent, FunctionComponent, InputComponent, SubscriptComponent, SuperscriptComponent } from 'src/app/helpers/equation-components';
import { EquationService } from 'src/app/services/equation.service';
import ToolbarContent from './toolbar.json';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  toolbar: any;

  constructor(private equationService: EquationService) { this.toolbar = ToolbarContent; }

  ngOnInit(): void {
  }

  onClick(code: string, type?: string): void {
    const equation: Array<EqComponent> = [new InputComponent()];
    if (type) {
      switch (type) {
        case 'superscript': {
          equation.push(new SuperscriptComponent());
          break;
        }
        case 'subscript': {
          equation.push(new SubscriptComponent());
          break;
        }
      }
    } else { equation.push(new FunctionComponent(code)); }
    this.equationService.addComponentsToEquation(equation);
  }
}
