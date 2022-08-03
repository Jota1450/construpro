import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectCreatePage } from './project-create.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectCreatePageRoutingModule {}
