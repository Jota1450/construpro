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
import { ImagePicker, ImagePickerOptions } from '@awesome-cordova-plugins/image-picker/ngx';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-note-create',
  templateUrl: './note-create.page.html',
  styleUrls: ['./note-create.page.scss'],
})
export class NoteCreatePage implements OnInit {

  formNote: FormGroup;
  users: User[];
  roles: Rol[];
  images: any[] = [];
  imageUrls: any[] = [];
  user: User;

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

  loadingScreen = this.loadingController.create({
    cssClass: 'my-custom-class',
    message: 'Cargando...',
  });

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private notesService: NotesService,
    private usersService: UsersService,
    private fireStorage: AngularFireStorage,
    private imagePicker: ImagePicker,
    public loadingController: LoadingController,
    private navController: NavController
  ) {
    this.initForm();
   }

  async ngOnInit() {
    this.user = await this.localStorageService.getUserData();
    await this.getAllUsers();
  }

  async initForm() {
    this.imagePicker.hasReadPermission().then(
      (value) => {
        //console.log('value bool', value, value === true, value == true);
        if (value == true) {
          this.imagePicker.hasReadPermission();
        }
      }
    ).catch(

    );
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

  pickImages() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 10,
      outputType: 1
    };

    this.imagePicker.getPictures(options).then(
      (resp) => {
        resp.forEach(
          element => {
            const base64OfImage = 'data:image/png;base64,' + element;
            this.images.push(base64OfImage);
          });
        console.log('imagenes', this.images);
      }, (error) => {
        console.log('error', JSON.stringify(error));
      }
    ).catch(
      (error) => {
        //this.imagePicker.hasReadPermission();
        console.log('error', JSON.stringify(error));
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
      await (await this.loadingScreen).present();
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
          createdAt: date.toISOString(),
          isSigned: false,
          creatorUser: this.user
        };

        if (this.images.length > 0) {
          await this.uploadImages();
          note.imageUrls = this.imageUrls;
        }

        await this.notesService.saveNote(note).then(
          (resp) => {
            console.log('response', resp);
            if (resp) {
              this.alert.fire({
                icon: 'success',
                title: 'Bien!!!',
                text: 'Anotación registrada correctamente',
              }).then(
                async (result) => {
                  if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                    await (await this.loadingScreen).dismiss();
                    this.navController.navigateBack(['/tabs/tab2']);
                  }
                }
              );
            }
          }
        ).catch(
          error => {
            if (error) {
              this.alert.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Algo salio mal.!',
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
  }

  mapUsers(users: User[]) {
    // Con este metodo mapeamos el objeto Rol con de acuerdo a los
    // indicadores con que se mapean los elementos en el componente
    // Select.
    return users.map(user => ({ text: user.names, value: user.id }));
  }

  uploadImages() {
    return new Promise((resolve, reject) => {
      Promise.all(
        // Go over ALL captured images
        // UPDATE 1

        this.images.map((image, imageIndex) => {
          // Create a timestamp as filename
          // UPDATE 1
          // Create a reference to 'images/todays-date.jpg'
          //const imageRef = storageRef.child(`images/${filename}.jpg`);
          const imgRef = this.fireStorage.ref(`images/note_evidence_${this.generateRandomString(5)}_${new Date().toISOString()}`);

          const imageBase64 = image.split(';base64,');

          const raw = window.atob(imageBase64[1]);
          const rawL = raw.length;
          const array = new Uint8Array(rawL);
          for (let i = 0; i < rawL; i++) {
            array[i] = raw.charCodeAt(i);
          }
          const blob = new Blob([array], { type: imageBase64[0].split(':')[1] });
          // Upload that particular image and return the upload Promise
          const task = imgRef.put(blob);

          return new Promise((innerResolve, innerReject) => {
            task.snapshotChanges().pipe(
              finalize(() => imgRef.getDownloadURL().subscribe(
                (response) => {
                  if (response) {
                    //this.urlAwait = response;
                    this.imageUrls.push(response);
                    console.log('url_image', response);
                    innerResolve(response);
                    return;
                  }
                },
                error => {
                  if (error != null) {
                    innerReject(error);
                  }
                }
              ))
            ).subscribe();
          });

        }),
      ).then(
        () => {
          console.log('All images uploaded!');
          resolve('All images uploaded!');
        },
        err => {
          console.error('Some images failed to upload...', err);
          reject(err);
        },
      );
    });
  }

  generateRandomString(num) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
