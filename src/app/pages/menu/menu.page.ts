import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  nombre:string;
  apellido:string;
  constructor() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.apellido= user.lastNames;
    this.nombre = user.names;
    console.log(this.nombre)
   }

  ngOnInit() {
  }

}
