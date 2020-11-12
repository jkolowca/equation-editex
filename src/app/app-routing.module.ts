import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from './components/editor/editor.component';

const routes: Routes = [
  { path: '', redirectTo: 'editor/0', pathMatch: 'full'},
  { path: 'editor/:equation', component: EditorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}