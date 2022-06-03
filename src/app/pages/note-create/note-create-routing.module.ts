import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoteCreatePage } from './note-create.page';

const routes: Routes = [
  {
    path: '',
    component: NoteCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoteCreatePageRoutingModule {}
