import { Component, OnInit } from '@angular/core';
import { EquationService } from 'src/app/services/equation.service';

@Component({
  selector: 'app-editor-window',
  templateUrl: './editor-window.component.html',
  styleUrls: ['./editor-window.component.scss']
})
export class EditorWindowComponent implements OnInit {
  constructor(public equationService: EquationService){}

  ngOnInit(): void {
  }

}
