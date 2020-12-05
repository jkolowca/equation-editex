import { Component, OnInit } from '@angular/core';
import { parseEquation } from 'src/app/helpers/parsers';
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

  onClick(equation: any): void {
    this.equationService.addComponentsToEquation(parseEquation(equation));
  }
}
