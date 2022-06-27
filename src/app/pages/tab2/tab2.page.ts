import { Project } from 'src/app/models/project';
import { NotesService } from './../../services/notes.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Note } from 'src/app/models/note';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnDestroy {

  toggleFilter = false;
  notes: Note[];
  project: Project;
  private subscriptions = new Subscription();

  constructor(
    private notesService: NotesService,
    private localStorageService: LocalStorageService,
    private navController: NavController
  ) {
    this.onInit();
  }

  async onInit(){
    this.project = await this.localStorageService.getProjectData();
    console.log('notes', this.notes);
  }

  async ionViewWillEnter() {
    this.notes = await this.getNotes();
  }

  ionViewDidLeave() {
    this.subscriptions.unsubscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  formatDate(date){
    return moment(date.toDate().toString()).format('dddd, D MMMM YYYY');
  }

  async getNotes(): Promise<Note[]> {
    // En este metodo todos los proyectos.
    const id: string = (await this.localStorageService.getProjectData()).id;
    if (id) {
      return new Promise((resolver, rechazar) => {
        this.subscriptions.add(
          this.notesService.getNotesById(id).subscribe(
            notes => {
              this.notes = notes;
              resolver(notes);
            }
          )
        );
      });
    }
  }

  filtrar(){
    if (this.toggleFilter) {

    }
  }

  retroceder(){
     this.navController.navigateBack(['/menu/home']);
  }
}
