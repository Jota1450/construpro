import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';
import { Project } from 'src/app/models/project';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.page.html',
  styleUrls: ['./project-info.page.scss'],
})
export class ProjectInfoPage implements OnInit {

  project: Project;

  constructor(private localStorageService: LocalStorageService,
              private navController:NavController) { }

  async ngOnInit() {
    this.project = await this.localStorageService.getProjectData()
    
  }

  formatDateString(date: string){
    return moment(date).format('dddd, D MMMM YYYY');
  }  
  retroceder() {
    this.navController.navigateBack(['/tabs/tab1']);
  }
}
