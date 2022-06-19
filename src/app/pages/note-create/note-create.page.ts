import { NotesService } from './../../services/notes.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Note } from './../../models/note';
import { Component, OnInit } from '@angular/core';
import { Rol } from 'src/app/models/rol';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2';

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

  alert = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: true,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

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
        console.log('date', date);
        const note: Note = {
          date,
          dateIsoString: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
          body: this.formNote.get('body').value,
          projectId: id,
          inspectorId: this.formNote.get('user').value,
          createdAt: date.toISOString()
        };
        await this.notesService.saveNote(note).then(
          (resp) => {
            console.log('response', resp);
            if (resp) {
              this.alert.fire({
                icon: 'success',
                title: 'Bien!!!',
                text: 'Anotación registrada correctamente',
              });
            }
          }
        ).catch(
          error => {
            if (error) {
              this.alert.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
              });
            }
          }
        );
      }
    } else {
      console.log('formControl', this.formNote);
    }
    // creamos objeto para user para guardar
    //this.formRegister.get
  }

  async getAllUsers() {
    // En este metodo obtenemos los roles
    this.usersService.getAllUsers().subscribe(
      users => this.users = users
    );
    //console.log('goku', this.roles);
  }

  mapUsers(users: User[]) {
    // Con este metodo mapeamos el objeto Rol con de acuerdo a los
    // indicadores con que se mapean los elementos en el componente
    // Select.
    return users.map(user => ({ text: user.names, value: user.id }));
  }
}
