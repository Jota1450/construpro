import { UsersService } from './../../services/users.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProjectsService } from './../../services/projects.service';
import { Project } from './../../models/project';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { Rol } from 'src/app/models/rol';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {

  projects: Project[] = null;
  user: User;
  roles: Rol[];
  private subscriptions = new Subscription();

  constructor(
    private projectsService: ProjectsService,
    private localStorage: LocalStorageService,
    private router: Router,
    private navController: NavController,
    private usersService: UsersService
  ) {
    this.initRoles();
  }

  async initRoles() {
    this.roles = await this.getAllRoles();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async ionViewWillEnter() {
    console.log('aa', this.subscriptions.closed);
    if (this.subscriptions.closed) {
      this.subscriptions.unsubscribe();
    }
    await this.localStorage.deleteProjectData();
    this.user = await this.localStorage.getUserData();
    await this.getAllProjects();
    this.subscriptions.unsubscribe();
    console.log(this.user);
  }

  ionViewDidLeave() {
    this.subscriptions.unsubscribe();
  }

  async saveProjectData(project: Project, userid: string, party: User[]) {
    this.localStorage.deleteProjectData();
    this.localStorage.setProjectData(project).then(
      () => {
        //this.navController.navigateRoot(['/menu/tabs']);
        const userRol: Rol = this.findUserRole(userid, party);
        this.localStorage.setCurrentRol(userRol).then(
          () => this.router.navigate(['/menu/tabs'])
        ).catch(
          (err) => {
            console.log(err);
          }
        );
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
    //this.findCurrentRol(project);
  }

  formatDateString(date: string) {
    return moment(date).format('dddd, D MMMM YYYY');
  }

  findCurrentRol(project: Project) {
    console.log('party', project.party);
    const rolId = project?.party?.find(element => element.id === this.user.id).id;
    this.usersService.getRol(rolId).subscribe(
      (rol) => {
        this.localStorage.setCurrentRol(rol);
      }
    );
  }

  async getCurrentUser() {
    this.localStorage.getUserData().then(
      async (response) => {
        this.user = await response;
      }
    );

    console.log(this.user);
  }

  async getAllProjects() {
    // En este metodo todos los proyectos.
    //this.projects = await this.projectsService.getProjectsByUser(this.user.id );
    //this.projectsService.getProjectsByUser(this.user.id).subscribe(
    return new Promise((resolve, reject) => {
      this.subscriptions.add(
        this.projectsService.getProjectsByUser(this.user.id).subscribe(
          projects => {
            this.projects = projects;
            resolve(projects);
          }
        )
      );
    });
  }

  findUserRole(userid: string, party: User[]): Rol {
    return this.roles.find(rol => rol.id === party.find(user => user.id === userid).rol);
  }

  async getAllRoles(): Promise<Rol[]> {
    // En este metodo obtenemos los roles
    return await new Promise((resolve, reject) => {
      this.usersService.getAllRoles().subscribe(
        roles => resolve(roles)
      );
    });
  }

  goTo(route: string) {
    this.navController.navigateBack([route]);
  }
}
