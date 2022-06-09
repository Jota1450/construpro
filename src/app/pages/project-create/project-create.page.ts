import { ProjectsService } from './../../services/projects.service';
import { UsersService } from './../../services/users.service';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Rol } from 'src/app/models/rol';
import { Project } from 'src/app/models/project';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.page.html',
  styleUrls: ['./project-create.page.scss'],
})
export class ProjectCreatePage implements OnInit {

  formProject: FormGroup;
  users: User[];
  roles: Rol[];

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private projectsService: ProjectsService
  ) { }

  async ngOnInit() {
    this.getAllRoles();
    this.getAllUsers();
    this.initForm();
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

  initForm(){
    this.formProject = this.formBuilder.group(
      {
        name: new FormControl('', [
          Validators.required
        ]),
        contractNumber: new FormControl('', [
          Validators.required
        ]),
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

  async getAllRoles(){
    // En este metodo obtenemos los roles

    await this.usersService.getAllRoles().subscribe(
      roles => this.roles = roles
    );
    //console.log('goku', this.roles);
  }

  async getAllUsers(){
    // En este metodo obtenemos los roles

    this.usersService.getAllUsers().subscribe(
      users => this.users = users
    );
    //console.log('goku', this.roles);
  }

  mapRoles(roles: Rol[]){
    // Con este metodo mapeamos el objeto Rol con de acuerdo a los
    // indicadores con que se mapean los elementos en el componente
    // Select.
    return roles.map( rol => ({ text: rol.espName, value: rol.id}));
  }

  mapUsers(users: User[]){
    // Con este metodo mapeamos el objeto Rol con de acuerdo a los
    // indicadores con que se mapean los elementos en el componente
    // Select.
    return users.map( user => ({ text: user.names, value: user.id}));
  }

  async saveProject() {
    console.log('Vegeta', this.party);
    if (this.formProject.valid) {
      const project: Project = {
        name: this.formProject.get('name').value,
        contractNumber: this.formProject.get('contractNumber').value,
        NIT: this.formProject.get('NIT').value,
        address: this.formProject.get('address').value,
        initialDate: new Date(this.formProject.get('initialDate').value),
        finalDate: new Date(this.formProject.get('finalDate').value),
        party: this.party.value
      };
      await this.projectsService.saveProject(project).then(
        (resp) => {
          console.log('response', resp);
        }
      );
    } else {
      console.log('formControl', this.formProject);
    }
    // creamos objeto para user para guardar
    //this.formRegister.get
  }
}
