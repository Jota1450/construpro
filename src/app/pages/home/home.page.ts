import { UsersService } from './../../services/users.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProjectsService } from './../../services/projects.service';
import { Project } from './../../models/project';
import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  projects: Project[] = [];
  user: User;

  constructor(
    private projectsService: ProjectsService,
    private localStorage: LocalStorageService,
    private router: Router,
    private usersService: UsersService
  ) { }

  async ngOnInit() {
    this.localStorage.deleteProjectData();
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAllProjects();
    await this.getCurrentUser();
    console.log(this.user);
  }

  async saveProjectData(project: Project){
    await this.localStorage.setProjectData(project);
    //this.findCurrentRol(project);
    this.router.navigate(['/menu/tabs']);
  }

  formatDateString(date: string){
    return moment(date).format('dddd, D MMMM YYYY');
  }

  findCurrentRol(project: Project){
    console.log('party',project.party);
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
    await this.projectsService.getAllProjects().subscribe(
      projects => this.projects = projects
    );
  }

}
