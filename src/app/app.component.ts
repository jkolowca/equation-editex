import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { EquationService } from './services/equation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  activeEquation = 0;
  equations: FormArray;

  constructor(private fb: FormBuilder, private router: Router, private equationService: EquationService) {
    this.equations = fb.array([]);
    this.equations.valueChanges.subscribe(changes => {
      const equations = JSON.stringify(this.equations.controls.map(c => c.value));
      localStorage.setItem('equationNames', equations);
    });

    const equationNames = JSON.parse(localStorage.getItem('equationNames')) as any[];
    if (equationNames && equationNames.length) {
			equationNames.forEach(e => {this.addNewEquation(e.name, e.selector); this.equationService.equation.push([]); });
		}
    else {this.addNewEquation('New equation'); }
  }

  openEquation(index: number, event: MouseEvent): void {
    (event.target as any).blur();
    this.activeEquation = index;
  }

  editText(event: MouseEvent): void {
    window.getSelection().collapseToEnd();
    (event.target as any).focus();
  }

  addNewEquation(name: string, selector?: number): void {
    if (!selector && selector !== 0) {
      selector = this.equations.controls.length;
    }
		this.equations.push(this.fb.group({name, selector}));
		this.equationService.equation.push([]);
    this.activeEquation = this.equations.length - 1;
    this.router.navigate(['/editor', selector]);
  }
}
