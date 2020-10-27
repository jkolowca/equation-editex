import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquationService } from 'src/app/services/equation.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {

  constructor(private equationService: EquationService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.params);
    this.equationService.add(this.route.snapshot.params.equation, this.route.snapshot.params.equation);
  }

}
