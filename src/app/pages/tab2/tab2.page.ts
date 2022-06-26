import { Project } from 'src/app/models/project';
import { NotesService } from './../../services/notes.service';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Note } from 'src/app/models/note';
import * as moment from 'moment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page{

  notes: Note[];
  project: Project;

  constructor(
    private notesService: NotesService,
    private localStorageService: LocalStorageService,
  ) {
    this.onInit();
  }

  async onInit(){
    this.notes = await this.getNotes();
    this.project = await this.localStorageService.getProjectData();
    console.log('notes', this.notes);
  }

  formatDate(date){
    return moment(date.toDate().toString()).format('dddd, D MMMM YYYY');
  }

  async getNotes(): Promise<Note[]> {
    // En este metodo todos los proyectos.
    const id: string = (await this.localStorageService.getProjectData()).id;
    if (id) {
      return new Promise((resolver, rechazar) => {
        this.notesService.getNotesById(id).subscribe(
          notes => resolver(notes)
        );
      });
    }
  }
}
