import { Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Equation } from 'src/app/services/equation.service';

@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styleUrls: ['./equation.component.scss']
})
export class EquationComponent implements OnInit {
  @Input() equation: Equation;
  @Input() array: FormArray;
  @Input() group: FormArray;

  ngOnInit(): void {
    console.log(this.equation);
    console.log(this.group);
  }
}
