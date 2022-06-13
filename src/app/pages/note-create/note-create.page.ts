import { NotesService } from './../../services/notes.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Note } from './../../models/note';
import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { Rol } from 'src/app/models/rol';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-note-create',
  templateUrl: './note-create.page.html',
  styleUrls: ['./note-create.page.scss'],
})
export class NoteCreatePage implements OnInit {

  formNote: FormGroup;
  users: User[];
  roles: Rol[];

  today = new Date();

  /*
  Users = [
    { value: '1', text: 'Sapolin' },
    { value: '2', text: 'Sapolina' },
    { value: '3', text: 'Jugui Yuquina' },
    { value: '4', text: 'Mfrappe Yuquino' }
  ];
  */

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private notesService: NotesService,
    private usersService: UsersService,
  ) { }

  async ngOnInit() {
    this.initForm();
    await this.getAllUsers();
  }

  initForm() {
    this.formNote = this.formBuilder.group(
      {
        body: new FormControl('', [
          Validators.required
        ]),
        user: new FormControl('', [
          Validators.required
        ]),
      }
    );
  }

  setValue(name: string, value: any) {
    // Insertamos los valores dentro de FormGroup
    this.formNote.get(name).setValue(value);
  }

  formatDate() {
    return moment(this.today.toISOString()).format('dddd, D MMMM YYYY');
  }

  async saveNote() {
    if (this.formNote.valid) {
      const id: string = (await this.localStorageService.getProjectData()).id;
      if (id) {
        const date = new Date();
        //const colDate = date.toLocaleString('es-ES"', {timeZone: 'America/Bogota'});

        console.log('date', date);
        const note: Note = {
          date,
          dateIsoString: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
          body: this.formNote.get('body').value,
          projectId: id,
          inspectorId: this.formNote.get('user').value
        };
        await this.notesService.saveNote(note).then(
          (resp) => {
            console.log('response', resp);
          }
        );
      }
    } else {
      console.log('formControl', this.formNote);
    }
    // creamos objeto para user para guardar
    //this.formRegister.get
  }

  async getAllUsers(){
    // En este metodo obtenemos los roles
    this.usersService.getAllUsers().subscribe(
      users => this.users = users
    );
    //console.log('goku', this.roles);
  }

  mapUsers(users: User[]){
    // Con este metodo mapeamos el objeto Rol con de acuerdo a los
    // indicadores con que se mapean los elementos en el componente
    // Select.
    return users.map( user => ({ text: user.names, value: user.id}));
  }
}
