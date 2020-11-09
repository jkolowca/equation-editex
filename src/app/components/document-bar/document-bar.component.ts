import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { EquationService } from 'src/app/services/equation.service';

@Component({
  selector: 'app-document-bar',
  templateUrl: './document-bar.component.html',
  styleUrls: ['./document-bar.component.scss']
})
export class DocumentBarComponent {
  constructor(private fb: FormBuilder, private router: Router, public equationService: EquationService) {}

  openEquation(index: number, event: MouseEvent): void {
    (event.target as any).blur();
    this.equationService.openDocument(index);
  }

  editText(event: MouseEvent): void {
    window.getSelection().collapseToEnd();
    (event.target as any).focus();
  }

  addNewEquation(name: string, selector?: number): void {
    this.equationService.addEmptyDocument(name);
    this.router.navigate(['/editor', selector]);
  }

  updateName(event: Event, index: number): void {
    console.log(event);
    this.equationService.changeDocumentName(index, 'name');
  }
}
