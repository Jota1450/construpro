import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  nombre: string;
  apellido: string;

  constructor(private authService: AuthService, private router: Router,
    private localStorage: LocalStorageService,
    private menu: MenuController,
    ) {

  }
  ngOnInit() {

  }

  signOut() {
    this.authService.signOut();
    this.localStorage.clear();
    this.menu.close();
    this.router.navigate(['login']);
  }

}
