import { SignatureComponent } from './signature/signature.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProButton } from './button/button.component';
import { ProButtonOutline } from './button-outline/button-outline.component';
import { ProCardNote } from './card-note/card-note.component';
import { ProCardProject } from './card-project/card-project.component';

import { ProSelect } from './select/select.component';
import { ProInput } from './input/input.component';

import { FormsModule } from '@angular/forms';


/* En este modulo debemos declarar e importar los componentes*/
@NgModule({
  declarations: [
    ProButton,
    ProButtonOutline,
    ProCardNote,
    ProCardProject,
    ProInput,
    ProSelect,
    SignatureComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    ProButton,
    ProButtonOutline,
    ProCardNote,
    ProCardProject,
    ProInput,
    ProSelect,
    SignatureComponent
  ]
})
export class ComponentsModule { }
