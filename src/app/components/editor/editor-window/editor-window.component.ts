import { Component } from '@angular/core';
import { EquationService } from 'src/app/services/equation.service';

@Component({
  selector: 'app-editor-window',
  templateUrl: './editor-window.component.html',
  styleUrls: ['./editor-window.component.scss']
})
export class EditorWindowComponent {
  constructor(public equationService: EquationService) { }
}
