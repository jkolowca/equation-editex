import { Component, OnInit } from '@angular/core';
import { EqComponentTypes, Equation, FunctionComponent, InputComponent } from 'src/app/helpers/equation-components';
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

  onClick(code: string): void {
    this.equationService.addComponentsToEquation(new Equation([new InputComponent(), new FunctionComponent(code)]));
  }

}
