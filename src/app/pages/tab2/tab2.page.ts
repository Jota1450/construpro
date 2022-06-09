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


  /// Losm Tabs no se el pueden implementar el motodo ngOnInit
  /*
  notes = [
    {
      date: 'Lunes, 20 de Febrero, 2021',
      time: '05:00 PM',
      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla varius hendrerit lacinia. Sed id risus.'
    },
    {
      date: 'Lunes, 20 de Febrero, 2021',
      time: '05:00 PM',
      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla varius hendrerit lacinia. Sed id risus.'
    },
    {
      date: 'Lunes, 20 de Febrero, 2021',
      time: '05:00 PM',
      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla varius hendrerit lacinia. Sed id risus.'
    },
    {
      date: 'Lunes, 20 de Febrero, 2021',
      time: '05:00 PM',
      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla varius hendrerit lacinia. Sed id risus.'
    },
    {
      date: 'Lunes, 20 de Febrero, 2021',
      time: '05:00 PM',
      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla varius hendrerit lacinia. Sed id risus.'
    },
    {
      date: 'Lunes, 20 de Febrero, 2021',
      time: '05:00 PM',
      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla varius hendrerit lacinia. Sed id risus.'
    },
  ];
  */

  notes: Note[];

  constructor(
    private notesService: NotesService,
    private localStorageService: LocalStorageService,
  ) {this.onInit();}

  async onInit(){
    await this.getNotes();
    //this.notes[0].date.toISOString();
  }

  formatDate(date){
    return moment(date.toDate().toString()).format('dddd, D MMMM YYYY');
  }

  async getNotes() {
    // En este metodo todos los proyectos.
    const id: string = (await this.localStorageService.getProjectData()).id;
    if (id) {
      await this.notesService.getNotesById(id).subscribe(
        notes => this.notes = notes
      );
    }
  }
}
