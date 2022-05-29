import { ProjectsService } from './../../services/projects.service';
import { Project } from './../../models/project';
import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  projects: Project[] = [];

  constructor(
    private projectsService: ProjectsService
  ) { }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAllProjects();
  }

  async getAllProjects(){
    // En este metodo todos los proyectos.
    await this.projectsService.getAllProjects().subscribe(
      projects => this.projects = projects
    );
  }

}
