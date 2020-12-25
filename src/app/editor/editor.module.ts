import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './components/editor/editor.component';
import { CodeWindowComponent } from './components/code-window/code-window.component';
import { EditorWindowComponent } from './components/editor-window/editor-window.component';
import { PreviewWindowComponent } from './components/preview-window/preview-window.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { KatexModule } from 'ng-katex';
import { SharedModule } from '../shared/shared.module';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { EquationModule } from '../equation/equation.module';
import { MaterialModule } from '../shared/material.module';

const exports = [
  EditorComponent
];

@NgModule({
  declarations: [
    ...exports,
    CodeWindowComponent,
    EditorWindowComponent,
    PreviewWindowComponent
  ],
  exports: [...exports],
  imports: [
    ClipboardModule,
    KatexModule,
    SharedModule,
    ToolbarModule,
    EquationModule,
    CommonModule
  ]
})
export class EditorModule { }
