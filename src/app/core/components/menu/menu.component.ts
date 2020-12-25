import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { EquationService } from 'src/app/shared/services/equation.service';
import { FilePopupComponent } from '../file-popup/file-popup.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @ViewChild('popup') popup: FilePopupComponent;
  documentsMenu: FormArray;

  constructor(private fb: FormBuilder, private router: Router, public equationService: EquationService) {
    this.equationService.documentNames.subscribe(documentNames => {
      this.documentsMenu = this.fb.array(documentNames.map(document => this.fb.group(document)));
    });
    this.documentsMenu.valueChanges.subscribe(changes => {
      this.equationService.changeDocumentNames(changes);
    });
  }

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
  }

  openPopup(): void {
    this.popup.openPopup();
  }

  close(index: number): void {
    this.equationService.closeDocument(index);
  }
}
