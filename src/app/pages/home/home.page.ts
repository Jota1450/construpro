import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProjectsService } from './../../services/projects.service';
import { Project } from './../../models/project';
import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

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
  ) { }

  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAllProjects();
    await this.getCurrentUser();
    console.log(this.user);
  }

  async saveProjectData(project: Project){
    this.localStorage.setProjectData(project);
    this.router.navigate(['/tabs/tab1']);
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
