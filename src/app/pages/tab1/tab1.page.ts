import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Project } from 'src/app/models/project';
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

  constructor(
    private localStorageService: LocalStorageService,
    private navController: NavController
  ) {
    this.onInit();
  }

  async onInit() {
    this.project = await this.localStorageService.getProjectData();
    this.user = await this.localStorageService.getUserData();
  }

  goTo(route: string) {
    this.navController.navigateBack([route]);
  }
}
