import { ProjectsService } from './../../services/projects.service';
import { UsersService } from './../../services/users.service';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Rol } from 'src/app/models/rol';
import { Project } from 'src/app/models/project';
import Swal from 'sweetalert2';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

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
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private localStorage: LocalStorageService,
    public loadingController: LoadingController,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.getAllRoles();
    this.getAllUsers();
    this.initForm();
    this.creator = await this.localStorage.getUserData();
    this.addPartyUser();
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
      id: new FormControl('', [
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

    console.log('goku', this.formProject.controls);
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
    this.party.get(index).get(name).setValue(value);
  }

  async getAllRoles() {
    // En este metodo obtenemos los roles
    this.roles = await new Promise((resolve, reject) => {
      this.usersService.getAllRoles().subscribe(
        roles => resolve(roles)
      );
    });
    //console.log('goku', this.roles);
  }

  async getAllUsers() {
    // En este metodo obtenemos los roles
    this.users = await new Promise((resolve, reject) => {
      this.usersService.getAllUsers().subscribe(
        users => resolve(users)
      );
    });
    //console.log('goku', this.roles);
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

  async mapParty() {
    const party: User[] = [];
    this.party.value.forEach((element) => {
      const user: User = {
        id: element.id.id,
        names: element.id.names,
        lastNames: element.id.lastNames,
        email: element.id.email,
        password: element.id.password,
        documentType: element.id.documentType,
        documentNumber: element.id.documentNumber,
        rol: element.rol,
        createdAt: element.id.createdAt
      };
      party.push(user);
    });
    const creator: User = await this.localStorage.getUserData();
    creator.rol = 'creator';
    party.push(creator);
    return party;
  }

  async saveProject() {
    if (this.formProject.valid) {
      await (await this.loadingScreen).present();
      const project: Project = {
        name: this.formProject.get('name').value,
        contractNumber: this.formProject.get('contractNumber').value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        NIT: this.formProject.get('NIT').value,
        address: this.formProject.get('address').value,
        initialDate: new Date(this.formProject.get('initialDate').value).toISOString(),
        finalDate: new Date(this.formProject.get('finalDate').value).toISOString(),
        party: await this.mapParty(),
        createdAt: new Date().toISOString(),
      };
      console.log('project', project);
      await this.projectsService.saveProject(project).then(
        async (resp) => {
          console.log('response', resp);
          if (resp) {
            await (await this.loadingScreen).dismiss();
            this.alert.fire({
              icon: 'success',
              title: 'Bien!!!',
              text: 'Proyecto registrado correctamente',
            }).then(
              (result) => {
                if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                  this.router.navigate(['/menu/home']);
                }
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
  }
}
