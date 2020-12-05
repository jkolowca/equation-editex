import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
import { EditorComponent } from './components/editor/editor.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContenteditableValueAccessorModule } from '@tinkoff/angular-contenteditable-accessor';
import { ToolbarComponent } from './components/editor/toolbar/toolbar.component';
import { EditorWindowComponent } from './components/editor/editor-window/editor-window.component';
import { PreviewWindowComponent } from './components/editor/preview-window/preview-window.component';
import { CodeWindowComponent } from './components/editor/code-window/code-window.component';
import { SearchBoxComponent } from './components/editor/toolbar/search-box/search-box.component';
import { KatexModule } from 'ng-katex';
import { EquationComponent } from './components/editor/editor-window/equation/equation.component';
import { CommonModule } from '@angular/common';
import { DocumentBarComponent } from './components/document-bar/document-bar.component';
import { EquationService } from './services/equation.service';
import { FilePopupComponent } from './components/file-popup/file-popup.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatrixDialogComponent } from './components/editor/toolbar/matrix-dialog/matrix-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ToolbarComponent,
    EditorWindowComponent,
    PreviewWindowComponent,
    CodeWindowComponent,
    SearchBoxComponent,
    EquationComponent,
    DocumentBarComponent,
    FilePopupComponent,
    MatrixDialogComponent
  ],
  imports: [
    ClipboardModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ContenteditableValueAccessorModule,
    KatexModule,
    CommonModule,
    NgxDropzoneModule,
  ],
  providers: [EquationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
