import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectInfoPageRoutingModule } from './project-info-routing.module';

import { ProjectInfoPage } from './project-info.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectInfoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ProjectInfoPage]
})
export class ProjectInfoPageModule {}
