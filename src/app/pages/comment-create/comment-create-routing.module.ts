import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommentCreatePage } from './comment-create.page';

const routes: Routes = [
  {
    path: '',
    component: CommentCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommentCreatePageRoutingModule {}
