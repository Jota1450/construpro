import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  nombre:string;
  apellido:string;

  constructor(private authService:AuthService, private router:Router) {

   }
  ngOnInit() {

  }

  signOut(){
    this.authService.signOut();
    this.router.navigate(['login']);
  }

}
