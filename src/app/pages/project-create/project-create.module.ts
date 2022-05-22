import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectCreatePageRoutingModule } from './project-create-routing.module';

import { ProjectCreatePage } from './project-create.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectCreatePageRoutingModule,
    ComponentsModule
  ],
  declarations: [ProjectCreatePage]
})
export class ProjectCreatePageModule {}
