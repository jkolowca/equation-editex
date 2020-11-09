import { Component } from '@angular/core';
import { EquationService } from './services/equation.service';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar class="title-bar" color="primary">
      <div class="content-block">
	      Equation Edi<ng-katex equation="\LaTeX"></ng-katex>
      </div>
    </mat-toolbar>
    <app-document-bar></app-document-bar>
    <div class="content-block">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .title-bar {
      font-size: 48px;
      font-weight: bold;
      height: 78px;
      justify-content: center;
      background-color: var(--primary-darker-color);
    }

    .content-block {
      width: 1360px;
      max-width: 90%;
      height: fit-content;
      display: flex;
      margin: auto;
    }

    ng-katex {
      font-size: 33px;
      margin-top: -2px;
    }
  `]
})
export class AppComponent {
  constructor( private equationService: EquationService){
    this.equationService.initialize();
  }
}
