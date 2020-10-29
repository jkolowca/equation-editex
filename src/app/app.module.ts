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
import { EquationService } from './services/equation.service';
import { KatexModule } from 'ng-katex';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ToolbarComponent,
    EditorWindowComponent,
    PreviewWindowComponent,
    CodeWindowComponent,
    SearchBoxComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ContenteditableValueAccessorModule,
    KatexModule,
  ],
  providers: [EquationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
