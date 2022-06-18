import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommentCreatePageRoutingModule } from './comment-create-routing.module';

import { CommentCreatePage } from './comment-create.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommentCreatePageRoutingModule,
    ComponentsModule
  ],
  declarations: [CommentCreatePage]
})
export class CommentCreatePageModule {}
