import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MenuController, NavController } from '@ionic/angular';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  user: User;

  constructor(
    private authService: AuthService,
    //private router: Router,
    private navController: NavController,
    private localStorage: LocalStorageService,
    private menu: MenuController,
  ) {

  }

  async ngOnInit() {
    this.user = await this.localStorage.getUserData();
  }

  signOut() {
    this.authService.signOut();
    this.localStorage.clear();
    this.menu.close();
    this.navController.navigateBack(['/login']);
  }

}
