import { Project } from 'src/app/models/project';
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
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-note-create',
  templateUrl: './note-create.page.html',
  styleUrls: ['./note-create.page.scss'],
})
export class NoteCreatePage implements OnInit {

  formNote: FormGroup;
  users: User[];
  roles: Rol[];

  project: Project;

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
    private fireStorage: AngularFireStorage,
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
    /*this.usersService.getAllUsers().subscribe(
      users => this.users = users
    );*/

    await this.localStorageService.getProjectData().then(
      (response) => {
        this.project = response;
      }
    );

    this.users = this.project.party.filter(
      (user: User) => user.rol === 'xNmfGl6yMzlbOTuBl8jm'
    );
    //console.log('goku', this.roles);
  }

  mapUsers(users: User[]) {
    // Con este metodo mapeamos el objeto Rol con de acuerdo a los
    // indicadores con que se mapean los elementos en el componente
    // Select.
    return users.map(user => ({ text: user.names, value: user.id }));
  }

  log($event){
    console.log('event', $event.target.files);
  }

  uploadIMG($event) {
    const file = $event.target.files[0];
    console.log('file', file, typeof(file));
    const imgRef = this.fireStorage.ref(`images/note_evidence_${file.name}_${new Date().toISOString()}`);
    /*
    const u = this.signaturePad.toDataURL();
    const partes = u.split(';base64,');

    console.log(partes);
    const meta = imgRef.getMetadata();
    console.log('imgRef', meta);

    const raw = window.atob(partes[1]);
    const rawL = raw.length;
    const array = new Uint8Array(rawL);
    for (let i = 0; i < rawL; i++) {
      array[i] = raw.charCodeAt(i);
    }

    const signatureBase64 = partes[1];
    const blob = new Blob([array], { type: 'image/png' });*/

    const task = imgRef.put(file);

    task.snapshotChanges().pipe(
      finalize(() => imgRef.getDownloadURL().subscribe(
        (response) => {
          if (response) {
            //this.urlAwait = response;
            console.log('url_image', response);
            return;
          }
        }
      ))
    ).subscribe();
    console.log('task', task);
  }
}
