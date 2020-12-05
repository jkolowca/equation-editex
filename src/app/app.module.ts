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
import { InputComponent } from './components/editor/editor-window/equation/input/input.component';
import { OperatorComponent } from './components/editor/editor-window/equation/operator/operator.component';
import { SuperscriptComponent } from './components/editor/editor-window/equation/superscript/superscript.component';
import { SubscriptComponent } from './components/editor/editor-window/equation/subscript/subscript.component';
import { SubandsuperscriptComponent } from './components/editor/editor-window/equation/subandsuperscript/subandsuperscript.component';
import { FractionComponent } from './components/editor/editor-window/equation/fraction/fraction.component';
import { BinominalComponent } from './components/editor/editor-window/equation/binominal/binominal.component';
import { RootComponent } from './components/editor/editor-window/equation/root/root.component';
import { FunctionComponent } from './components/editor/editor-window/equation/function/function.component';
import { MatrixComponent } from './components/editor/editor-window/equation/matrix/matrix.component';

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
    MatrixDialogComponent,
    InputComponent,
    OperatorComponent,
    SuperscriptComponent,
    SubscriptComponent,
    SubandsuperscriptComponent,
    FractionComponent,
    BinominalComponent,
    RootComponent,
    FunctionComponent,
    MatrixComponent
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
