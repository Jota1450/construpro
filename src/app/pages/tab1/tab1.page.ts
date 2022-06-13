import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  project: Project;

  constructor(
    private localStorageService: LocalStorageService,
  ) {
    this.onInit();
  }

  async onInit(){
    await this.localStorageService.getProjectData().then(
      (project) => this.project = project
    );
  }
}
