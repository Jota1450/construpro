import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoteCreatePageRoutingModule } from './note-create-routing.module';

import { NoteCreatePage } from './note-create.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { SwiperModule } from 'swiper/angular';
import { Component } from '@angular/core';
import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper';

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoteCreatePageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    SwiperModule,
  ],
  declarations: [NoteCreatePage]
})
export class NoteCreatePageModule {}
