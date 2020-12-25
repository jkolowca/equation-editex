import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatrixDialogComponent } from './components/matrix-dialog/matrix-dialog.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { KatexModule } from 'ng-katex';
import { SharedModule } from '../shared/shared.module';

const exports = [
  ToolbarComponent
];

@NgModule({
  declarations: [
    ...exports,
    MatrixDialogComponent,
    SearchBoxComponent
  ],
  exports: [...exports],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    KatexModule,
    SharedModule
  ]
})
export class ToolbarModule { }
