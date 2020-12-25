import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { SharedModule } from '../shared/shared.module';
import { FilePopupComponent } from './components/file-popup/file-popup.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

const exports = [
  MenuComponent
];

@NgModule({
  declarations: [...exports, FilePopupComponent],
  exports: [...exports, RouterModule],
  imports: [
    SharedModule,
    CommonModule,
    NgxDropzoneModule,
    CoreRoutingModule
  ]
})
export class CoreModule { }
