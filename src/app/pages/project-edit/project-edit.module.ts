import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectEditPageRoutingModule } from './project-edit-routing.module';

import { ProjectEditPage } from './project-edit.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectEditPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
  ],
  declarations: [ProjectEditPage]
})
export class ProjectEditPageModule {}
