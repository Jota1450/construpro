import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-users-info',
  templateUrl: './users-info.page.html',
  styleUrls: ['./users-info.page.scss'],
})
export class UsersInfoPage implements OnInit {

  constructor(
    private navController:NavController
  ) { }

  ngOnInit() {
  }

  retroceder() {
    this.navController.navigateBack(['/tabs/tab1']);
  }
}
