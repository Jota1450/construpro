import { Project } from './../../models/project';
import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { Rol } from 'src/app/models/rol';
import { User } from 'src/app/models/user';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { UsersService } from 'src/app/services/users.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-info',
  templateUrl: './users-info.page.html',
  styleUrls: ['./users-info.page.scss'],
})
export class UsersInfoPage implements OnInit {

  currentUser: User;
  users: User[];
  allUsers: User[];
  roles: Rol[];
  project: Project;
  formProject: FormGroup;
  numOriginalUsers: number;

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

  private subscriptions = new Subscription();


  constructor(
    private formBuilder: FormBuilder,
    private navController: NavController,
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private localStorage: LocalStorageService,
    public loadingController: LoadingController,
  ) {
    this.initForm();
  }

  async ngOnInit() {
    await (await this.loadingScreen).present();
    this.allUsers = await this.getAllUsers();
    this.currentUser = await this.localStorage.getUserData();
    this.roles = await this.getAllRoles();
    this.project = await this.localStorage.getProjectData();
    this.users = this.project.party;
    this.setInitialUsers();
    await (await this.loadingScreen).dismiss();
    this.numOriginalUsers = this.users.length;
  }

  initForm() {
    this.formProject = this.formBuilder.group(
      {
        party: this.formBuilder.array([]),
      }
    );
  }

  isLegacy(index): boolean{
    if (index < this.users.length) {
      return this.currentUser.id !== this.users[index].id;
    } else {
      return true;
    }
  }

  log(){
    console.table(this.formProject);
  }

  ionViewDidLeave() {
    this.subscriptions.unsubscribe();
  }

  setInitialUsers(){
    console.log('length', this.party.length);
    this.project.party.forEach(
      (user, index) => {
        this.addPartyUser();
        this.setUser(index.toString(), 'user', user);
        this.setUser(index.toString(), 'rol', user.rol);
      }
    );
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  get party() {
    return this.formProject.get('party') as FormArray;
  }

  addPartyUser() {
    const userFormGroup = this.formBuilder.group({
      user: new FormControl('', [
        Validators.required
      ]),
      rol: new FormControl('', [
        Validators.required
      ])
    });

    this.party.push(userFormGroup);
    console.log('formProject', this.formProject.controls);
  }

  removePartyUser(index: number) {
    this.party.removeAt(index);
  }

  removePartyUserWithUser(index: number) {
    this.party.removeAt(index);
    this.numOriginalUsers--;
  }

  setUser(index: string, name: string, value: any) {
    this.party.get(index).get(name).setValue(value);
  }

  getRol(id: string){
    const rol: Rol = this.roles.find(
      (rolResp) => rolResp.id === id
    );
    return { text: rol.espName, value: rol.id };
  }

  mapRoles(roles: Rol[]) {
    return roles.map(rol => ({ text: rol.espName, value: rol.id }));
  }

  mapUsers(users: User[]) {
    return users.map(user => ({ text: user.names, value: user }));
  }

  async getAllRoles(): Promise<Rol[]> {
    // En este metodo obtenemos los roles
    return await new Promise((resolve, reject) => {
      this.subscriptions.add(
        this.usersService.getAllRoles().subscribe(
          roles => resolve(roles)
        )
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

  getPartyIds(party: User[]) {
    const ids: string[] = [];
    party.forEach(element => {
      ids.push(element.id);
    });
    return ids;
  }

  async updateProject(){
    console.log(this.formProject);
    if (this.formProject.valid) {
      this.loadingScreen = this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Cargando...',
      });
      (await this.loadingScreen).present();
      const projectToUpdate: Project = this.project;
      const party = this.mapParty();
      projectToUpdate.party = party;
      projectToUpdate.partyIds = this.getPartyIds(party);
      this.projectsService.updateProject(this.project.id, projectToUpdate).then(
        async () => {
          await this.localStorage.setProjectData(projectToUpdate);
          this.alert.fire({
            icon: 'success',
            title: 'Bien!!!',
            text: 'Proyecto actualizado correctamente',
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
        }
      );
    }
  }

  mapParty() {
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
        canCreateProject: false,
        createdAt: element.user.createdAt,
        professionalCard: element.user.professionalCard
      };
      party.push(user);
    });
    return party;
  }

  retroceder() {
    this.navController.navigateBack(['/tabs/tab1']);
  }
}
