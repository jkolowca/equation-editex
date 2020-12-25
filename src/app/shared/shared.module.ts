import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquationService } from './services/equation.service';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ContenteditableValueAccessorModule } from '@tinkoff/angular-contenteditable-accessor';
import { FileService } from './services/file.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    MaterialModule,
    ReactiveFormsModule,
    ContenteditableValueAccessorModule
  ],
  providers: [EquationService, FileService]
})
export class SharedModule { }
