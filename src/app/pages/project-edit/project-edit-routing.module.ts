import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectEditPage } from './project-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectEditPageRoutingModule {}
