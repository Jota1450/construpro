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

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.page.html',
  styleUrls: ['./project-create.page.scss'],
})
export class ProjectCreatePage implements OnInit {

  formProject: FormGroup;
  users: User[];
  roles: Rol[];
  creator: User;

  isCurrentView: boolean;
  displayWarning: boolean;

  alert = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: true,
    //timer: 3000,
    //timerProgressBar: true,
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
    //private router: Router,
    private navController: NavController,
    private platform: Platform,
  ) {
    this.initForm();
   }

  async ngOnInit() {
    await (await this.loadingScreen).present();
    this.roles = await this.getAllRoles();
    this.users = await this.getAllUsers();
    this.creator = await this.localStorage.getUserData();
    this.addPartyUser();
    this.setUser('0', 'user', this.creator);

    this.platform.backButton.subscribeWithPriority(9999, (processNextHandler) => {
      if (this.isCurrentView) {
        this.displayWarning = true;
        // Or other stuff that you want to do to warn the user.
      } else {
        processNextHandler();
      }
    });
    await (await this.loadingScreen).dismiss();
    console.log('roles', this.roles);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get party() {
    // Con este metodo obtenemos el campo party del Formulario de
    // creacion de proyectos, que nos permitira agregar o eliminar
    // inputs en el formulario segun sea el caso.
    return this.formProject.get('party') as FormArray;
  }

  addPartyUser() {
    // Con este metodo adicionamos mas input al formulario
    // para esto es necesario añadir elementos que nos permitan capturar
    // los identificadores del usuario, y del rol que desempeñara dicho
    // usuario.

    const userFormGroup = this.formBuilder.group({
      user: new FormControl('', [
        Validators.required
      ]),
      rol: new FormControl('', [
        Validators.required
      ])
    });

    this.party.push(userFormGroup);

    //console.log('party', this.party);
    //console.log('party_1', this.party.get('0'));
    //this.party.get('0').get('rol').setValue('Milo te da energia la meta la pones tu.');
    //console.log('party_1_rol', this.party.get('0').get('rol'));

    console.log('formProject', this.formProject.controls);
  }


  removePartyUser(index: number) {
    this.party.removeAt(index);
  }

  initForm() {
    this.formProject = this.formBuilder.group(
      {
        name: new FormControl('', [
          Validators.required
        ]),
        contractNumber: new FormControl('', [
          Validators.required
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

  setValue(name: string, value: any) {
    // Insertamos los valores dentro de FormGroup
    this.formProject.get(name).setValue(value);
  }

  setUser(index: string, name: string, value: any) {
    // Insertamos los datos del usuario ya sea rol o id en el FormGroup,
    // de acuerdo a su posicion en la coleccion y el identificador del valor.
    console.log('$event',value);
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
        users => resolve(users)
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
        createdAt: element.user.createdAt,
        professionalCard: element.user.professionalCard
      };
      party.push(user);
    });
    //const creator: User = await this.localStorage.getUserData();
    //creator.rol = 'creator';
    //party.push(creator);
    return party;
  }

  async saveProject() {
    try {
      if (this.formProject.valid) {
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
          initialDate: new Date(this.formProject.get('initialDate').value).toISOString(),
          finalDate: new Date(this.formProject.get('finalDate').value).toISOString(),
          party,
          partyIds: this.getPartyIds(party),
          createdAt: new Date().toISOString(),
        };
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
                text: 'Something went wrong!',
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
              text: 'Something went wrong!',
            });
          }
        );
      } else {
        console.log('formControl', this.formProject);
        this.alert.fire({
          icon: 'error',
          title: 'Formulario Invalido',
          text: 'Por favor revisa los campos',
        });
      }
      // creamos objeto para user para guardar
      // this.formRegister.get
    } catch (error) {
      await (await this.loadingScreen).dismiss();
      this.alert.fire({
        icon: 'error',
        title: 'Formulario Invalido',
        text: error.toString(),
      });
    }
  }

  retroceder(){
    this.navController.navigateBack(['/menu/home']);
 }
}
