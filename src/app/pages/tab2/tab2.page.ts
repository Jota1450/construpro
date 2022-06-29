import { Project } from 'src/app/models/project';
import { NotesService } from './../../services/notes.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Note } from 'src/app/models/note';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnDestroy {

  toggleFilter = false;
  notes: Note[];
  project: Project;
  filterStateOptions = [
    { text: 'Pendiente', value: false },
    { text: 'Finalizado', value: true }
  ];
  filterStateValue: boolean;
  filterCreatorValue: string;
  private subscriptions = new Subscription();

  constructor(
    private notesService: NotesService,
    private localStorageService: LocalStorageService,
    private navController: NavController
  ) { }

  async ionViewWillEnter() {
    if (this.subscriptions.closed) {
      this.subscriptions.unsubscribe();
    }
    this.project = await this.localStorageService.getProjectData();
    console.log('proyecto', this.project.party);
    this.notes = await this.getNotes();
    console.log('closed', this.subscriptions.closed);
  }

  ionViewDidLeave() {
    this.subscriptions.unsubscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  formatDate(date) {
    return moment(date.toDate().toString()).format('dddd, D MMMM YYYY');
  }

  formatTime(date){
    return moment(date.toDate().toString()).format('hh:mm A');
  }

  async getNotes(): Promise<Note[]> {
    // En este metodo todos los proyectos.
    const id: string = (await this.localStorageService.getProjectData()).id;
    if (id) {
      if (this.subscriptions.closed) {
        this.subscriptions.unsubscribe();
      }
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

  async getNotesByCreator(): Promise<Note[]> {
    if (this.filterCreatorValue !== null) {
      // En este metodo todos los proyectos.
      const id: string = (await this.localStorageService.getProjectData()).id;
      if (id) {
        if (this.subscriptions.closed) {
          this.subscriptions.unsubscribe();
        }
        return new Promise((resolver, rechazar) => {
          this.subscriptions.add(
            this.notesService.getNotesByCreator(id, this.filterCreatorValue).subscribe(
              notes => {
                this.notes = notes;
                resolver(notes);
              }
            )
          );
        });
      };
    }
  }

  async getNotesByState(): Promise<Note[]> {
    if (this.filterStateValue !== null) {
      // En este metodo todos los proyectos.
      const id: string = (await this.localStorageService.getProjectData()).id;
      if (id) {
        if (this.subscriptions.closed) {
          this.subscriptions.unsubscribe();
        }
        return new Promise((resolver, rechazar) => {
          this.subscriptions.add(
            this.notesService.getNotesByState(id, this.filterStateValue).subscribe(
              notes => {
                this.notes = notes;
                resolver(notes);
              }
            )
          );
        });
      };
    }
  }

  mapUsers(users: User[]) {
    // Con este metodo mapeamos el objeto Rol con de acuerdo a los
    // indicadores con que se mapean los elementos en el componente
    // Select.
    return users.map(user => ({ text: user.names, value: user.id }));
  }

  retroceder() {
    this.navController.navigateBack(['/menu/home']);
  }
}
