import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoteCreatePageRoutingModule } from './note-create-routing.module';

import { NoteCreatePage } from './note-create.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoteCreatePageRoutingModule,
    ComponentsModule
  ],
  declarations: [NoteCreatePage]
})
export class NoteCreatePageModule {}
