import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  constructor(private navController:NavController) { }

  email: string;

  ngOnInit() {
  }

  resetPassword(){

  }

  goBack() {
    this.navController.navigateBack(['/login']);
  }
}
