import { ProjectsService } from './../../services/projects.service';
import { UsersService } from './../../services/users.service';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Rol } from 'src/app/models/rol';
import { Project } from 'src/app/models/project';
import Swal from 'sweetalert2';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { ImagePicker, ImagePickerOptions } from '@awesome-cordova-plugins/image-picker/ngx';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import * as tz from 'moment-timezone';
import * as moment from 'moment';


@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.page.html',
  styleUrls: ['./project-create.page.scss'],
})
export class ProjectCreatePage implements OnInit {

  formSended = false;
  formProject: FormGroup;
  users: User[] = [];
  mappedUsers: any[];
  roles: Rol[];
  selectedUsersId: string[] = [];
  creator: User;
  imageUrl: string;
  images: any[] = [];

  isCurrentView: boolean;
  displayWarning: boolean;

  alert = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: true,
  });

  loadingScreen = this.loadingController.create({
    cssClass: 'my-custom-class',
    message: 'Cargando...',
  });

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private localStorage: LocalStorageService,
    public loadingController: LoadingController,
    private navController: NavController,
    private platform: Platform,
    private imagePicker: ImagePicker,
    private fireStorage: AngularFireStorage,
  ) {
    this.initForm();
  }

  async ngOnInit() {
    await (await this.loadingScreen).present();
    await this.getAllUsers();
    this.mappedUsers = this.mapUsers(this.users);
    this.roles = await this.getAllRoles();
    this.creator = await this.localStorage.getUserData();
    this.addPartyUser();
    this.setUser('0', 'user', this.creator);
    this.selectedUsersId.push(this.creator.id);

    console.log(this.users);
    this.platform.backButton.subscribeWithPriority(9999, (processNextHandler) => {
      if (this.isCurrentView) {
        this.displayWarning = true;
        // Or other stuff that you want to do to warn the user.
      } else {
        processNextHandler();
      }
    });
    await (await this.loadingScreen).dismiss();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get party() {
    // Con este metodo obtenemos el campo party del Formulario de
    // creacion de proyectos, que nos permitira agregar o eliminar
    // inputs en el formulario segun sea el caso.
    return this.formProject.get('party') as FormArray;
  }

  addPartyUser(user: any = '') {
    // Con este metodo adicionamos mas input al formulario
    // para esto es necesario añadir elementos que nos permitan capturar
    // los identificadores del usuario, y del rol que desempeñara dicho
    // usuario.

    const userFormGroup = this.formBuilder.group({
      user: new FormControl(user, [
        Validators.required
      ]),
      rol: new FormControl('', [
        Validators.required
      ])
    });

    this.party.push(userFormGroup);
  }

  removePartyUser(index: number) {
    const userId = this.party.get(index.toString()).get('user').value.id;
    this.removeSelectedUsersId(userId);
    this.party.removeAt(index);
  }

  initForm() {
    this.imagePicker.hasReadPermission().then(
      (value) => {
        if (value === true) {
          this.imagePicker.hasReadPermission();
        }
      }
    ).catch();
    this.formProject = this.formBuilder.group(
      {
        name: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-ZáÁéÉíÍóÓüúÚñÑ ]{4,50}$')
        ]),
        contractNumber: new FormControl('', [
          Validators.required,
        ]),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        NIT: new FormControl('', [
          Validators.required
        ]),
        address: new FormControl('', [
          Validators.required
        ]),
        initialDate: new FormControl('', [
          Validators.required
        ]),
        finalDate: new FormControl('', [
          Validators.required
        ]),
        // El input party al ser un campo dinamico dentro del
        // formulario, es necesario tomarlo como un array
        // ya que la cantidad de usuarios que intervienen en
        // la obra es variable.
        party: this.formBuilder.array([]),
      }
    );
  }

  pickImages() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 1,
      outputType: 1
    };

    this.imagePicker.getPictures(options).then(
      (resp) => {
        resp.forEach(
          element => {
            const base64OfImage = 'data:image/png;base64,' + element;
            if (this.images.length > 0) {
              this.images.pop();
            }
            this.images.push(base64OfImage);
          });
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
    this.formProject.get(name).setValue(value);
  }

  setUser(index: string, name: string, value: any) {
    // Insertamos los datos del usuario ya sea rol o id en el FormGroup,
    // de acuerdo a su posicion en la coleccion y el identificador del valor.
    console.log('$event', value);
    this.party.get(index).get(name).setValue(value);
  }

  async getAllRoles(): Promise<Rol[]> {
    // En este metodo obtenemos los roles
    return await new Promise((resolve, reject) => {
      this.usersService.getAllRoles().subscribe(
        roles => resolve(roles)
      );
    });
  }

  async getAllUsers(): Promise<User[]> {
    // En este metodo obtenemos los roles
    return await new Promise((resolve, reject) => {
      this.usersService.getAllUsers().subscribe(
        users => {
          this.users = users;
          resolve(users);
        }
      );
    });
  }

  mapRoles(roles: Rol[]) {
    // Con este metodo mapeamos el objeto Rol con de acuerdo a los
    // indicadores con que se mapean los elementos en el componente
    // Select.
    return roles.map(rol => ({ text: rol.espName, value: rol.id }));
  }

  mapUsers(users: User[]) {
    // Con este metodo mapeamos el objeto Rol con de acuerdo a los
    // indicadores con que se mapean los elementos en el componente
    // Select.
    return users.map(user => ({ text: user.names, value: user }));
  }

  getPartyIds(party: User[]) {
    const ids: string[] = [];
    party.forEach(element => {
      ids.push(element.id);
    });
    return ids;
  }

  async mapParty() {
    const party: User[] = [];
    this.party.value.forEach((element) => {
      const user: User = {
        id: element.user.id,
        names: element.user.names,
        lastNames: element.user.lastNames,
        email: element.user.email,
        password: element.user.password,
        documentType: element.user.documentType,
        documentNumber: element.user.documentNumber,
        rol: element.rol,
        canCreateProject: element.user.canCreateProject,
        createdAt: element.user.createdAt,
        professionalCard: element.user.professionalCard
      };
      party.push(user);
    });
    return party;
  }

  uploadImage() {
    return new Promise((resolve, reject) => {
      const imgRef = this.fireStorage.ref(`images/note_evidence_${this.generateRandomString(5)}_${new Date().toISOString()}`);

      const imageBase64 = this.images[0].split(';base64,');

      const raw = window.atob(imageBase64[1]);
      const rawL = raw.length;
      const array = new Uint8Array(rawL);
      for (let i = 0; i < rawL; i++) {
        array[i] = raw.charCodeAt(i);
      }
      const blob = new Blob([array], { type: imageBase64[0].split(':')[1] });
      // Upload that particular image and return the upload Promise
      const task = imgRef.put(blob);

      task.snapshotChanges().pipe(
        finalize(() => imgRef.getDownloadURL().subscribe(
          (response) => {
            if (response) {
              this.imageUrl = response;
              console.log('url_image', response);
              resolve(response);
              return;
            }
          },
          error => {
            if (error != null) {
              reject(error);
            }
          }
        ))
      ).subscribe();
    });
  }

  async saveProject() {
    try {
      this.formSended = true;
      const initialDate = new Date(tz.tz(this.formProject.get('initialDate').value, 'America/Bogota').format());
      const finalDate = new Date(tz.tz(this.formProject.get('finalDate').value, 'America/Bogota').format());
      if (await this.areEnoughRoles()) {
        if (this.formProject.valid && initialDate < finalDate && this.party.length > 1) {
          this.loadingScreen = this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Cargando...',
          });
          (await this.loadingScreen).present();
          const party = await this.mapParty();
          const project: Project = {
            name: this.formProject.get('name').value,
            contractNumber: this.formProject.get('contractNumber').value,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            NIT: this.formProject.get('NIT').value,
            address: this.formProject.get('address').value,
            initialDate: initialDate.toISOString(),
            finalDate: finalDate.toISOString(),
            firstFinalDate: finalDate.toISOString(),
            party,
            isEditable: true,
            partyIds: this.getPartyIds(party),
            createdBy: this.creator,
            createdAt: new Date().toISOString(),
          };

          if (this.images.length > 0) {
            await this.uploadImage();
            project.imageUrl = this.imageUrl;
          }

          console.log('project', project);
          await this.projectsService.saveProject(project).then(
            async (resp) => {
              console.log('response', resp);

              if (resp !== 'error') {
                this.alert.fire({
                  icon: 'success',
                  title: 'Bien!!!',
                  text: 'Proyecto registrado correctamente',
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                }).then(
                  async (result) => {
                    if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                      (await this.loadingScreen).dismiss();
                      this.retroceder();
                    }
                  }
                );
              } else {
                this.alert.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Parece que algo salió mal!',
                }).then(
                  (result) => {
                  }
                );
              }
            }
          ).catch(
            (error) => {
              this.alert.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Parece que algo salió mal!',
              });
            }
          );
        } else {
          if (initialDate > finalDate) {
            this.alert.fire({
              icon: 'error',
              title: 'Formulario Invalido',
              text: 'Fecha inicio mayor a la final',
            });
          } else {
            this.alert.fire({
              icon: 'error',
              title: 'Formulario Invalido',
              text: 'Por favor revisa los campos',
            });
          }
          console.log('formControl', this.formProject);
        }
      }
      // creamos objeto para user para guardar
      // this.formRegister.get
    } catch (error) {
      await (await this.loadingScreen).dismiss();
      this.alert.fire({
        icon: 'error',
        title: 'Formulario Invalido',
        text: 'Al parecer hay un error inesperado.',
      });
    }
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

  creatorUsers() {
    const roles = this.roles.filter(rol => (rol.id === 'IZ00zAUWIUTo4ASO4ugR' || rol.id === 'sc2gb0ZG1A19fBILZDCD'));
    return roles.map(rol => ({ text: rol.espName, value: rol.id }));
  }

  addSelectedUsersId(userId: string) {
    this.selectedUsersId.push(userId);
    console.log('selected Index 2', userId);
  }

  removeSelectedUsersId(userId: string) {
    const index = this.selectedUsersId.indexOf(userId);
    this.selectedUsersId.splice(index, 1);
  }

  getFilterUsers() {
    const newArray = this.users.filter((user) => !this.selectedUsersId.includes(user.id));
    return newArray;
  }

  log() {
    console.log();
  }

  logForm() {
    console.log('formProject', this.formProject);
    console.log('formProject Controls', this.formProject.controls);
    console.log('party', this.formProject.controls.party.value);
  }

  async getValues() {
    const users = this.mapUsers(this.getFilterUsers());
    if (users.length > 0) {
      let options = '';
      users.forEach(option => {
        options += `<option value=' ${JSON.stringify(option.value)}'> ${option.text} </option>`;
      });
      let formValues;
      Swal.fire({
        title: 'Seleccionar Usuario',
        heightAuto: false,
        html: `
      <select id="user-data-input-swal" class="form-select select">
        ${options}
      </select>`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          formValues = document.getElementById('user-data-input-swal') as HTMLInputElement;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          if (formValues) {
            const selectedUser: User = JSON.parse(formValues.value) as User;
            console.log('values', selectedUser);
            this.addSelectedUsersId(selectedUser.id);
            this.addPartyUser(selectedUser);
          }
        }
      });
    } else {
      this.alert.fire({
        icon: 'error',
        title: 'Error',
        text: 'No hay más usuarios para agregar.',
      }).then(
        (result) => {
        }
      );
    }
  }

  getUserFromForm(index: number) {
    const formValue = this.party.get(index.toString());
    let userName = '';
    if (formValue) {
      userName = formValue.get('user').value.names;
    }
    return userName;
  }

  async areEnoughRoles(): Promise<boolean> {
    // Contratista, Contratante, Interventor
    //['IZ00zAUWIUTo4ASO4ugR', 'sc2gb0ZG1A19fBILZDCD', 'xNmfGl6yMzlbOTuBl8jm'];
    const party: any = await this.mapParty();
    const roles = party.map(user => user = user.rol);

    if (!roles.includes('IZ00zAUWIUTo4ASO4ugR')) {
      this.alert.fire({
        icon: 'warning',
        title: 'Formulario Invalido',
        text: 'No hay Contratistas',
      });
      return false;
    } else if (!roles.includes('sc2gb0ZG1A19fBILZDCD')) {
      this.alert.fire({
        icon: 'warning',
        title: 'Formulario Invalido',
        text: 'No hay Contratante',
      });
      return false;
    } else if (!roles.includes('xNmfGl6yMzlbOTuBl8jm')) {
      this.alert.fire({
        icon: 'warning',
        title: 'Formulario Invalido',
        text: 'No hay Interventor',
      });
      return false;
    } else {
      return true;
    }

  }

  initialMin() {
    const date = new Date();
    return moment(date).format('YYYY-MM-DD');
  }

  finalMin() {
    const initialDate = new Date(tz.tz(this.formProject.get('initialDate').value, 'America/Bogota').format());
    initialDate.setDate(initialDate.getDate() + 1);
    return moment(initialDate).format('YYYY-MM-DD');
  }

  retroceder() {
    this.navController.navigateBack(['/menu/home']);
  }
}
