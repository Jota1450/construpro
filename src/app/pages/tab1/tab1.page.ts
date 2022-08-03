import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Project } from 'src/app/models/project';
import { Rol } from 'src/app/models/rol';
import { User } from 'src/app/models/user';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  project: Project;
  user: User;
  rol: Rol;

  constructor(
    private localStorageService: LocalStorageService,
    private navController: NavController
  ) {}

  async ionViewWillEnter() {
    console.log('entre again');
    this.project = await this.localStorageService.getProjectData();
    this.user = await this.localStorageService.getUserData();
    this.rol = await this.localStorageService.getCurrentRol();
  }

  goTo(route: string) {
    this.navController.navigateBack([route]);
  }

  canEdit(): boolean{
    const rolId = this.rol.id;
    return rolId === 'IZ00zAUWIUTo4ASO4ugR' || rolId === 'sc2gb0ZG1A19fBILZDCD';
  }

}
