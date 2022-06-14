import { LocalStorageService } from './../../services/local-storage.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private localStorageService: LocalStorageService
  ) {
    this.onInit();
  }

  onInit(){
    this.localStorageService.getProjectData().then(
      res => console.log('mierda',res)
    );
  }

}
