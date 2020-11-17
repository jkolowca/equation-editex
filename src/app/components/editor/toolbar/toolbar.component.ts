import { Component, OnInit } from '@angular/core';
import * as c from 'src/app/helpers/equation-components';
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
    const equation: Array<c.EqComponent> = [new c.InputComponent()];
    if (type) {
      switch (type) {
        case 'superscript': {
          equation.push(new c.SuperscriptComponent());
          break;
        }
        case 'subscript': {
          equation.push(new c.SubscriptComponent());
          break;
        }
        case 'subandsuperscript': {
          equation.push(new c.SubAndSuperscriptComponent());
          break;
        }
        case 'fraction': {
          equation.push(new c.FractionComponent());
          break;
        }
        case 'binominal': {
          equation.push(new c.BinominalComponent());
          break;
        }
      }
    } else { equation.push(new c.FunctionComponent(code)); }
    this.equationService.addComponentsToEquation(equation);
  }
}
