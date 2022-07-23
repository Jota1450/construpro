import { UsersService } from './../../services/users.service';
import { Router, Routes } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { User } from 'src/app/models/user';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;
  alert = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: true,
    timer: 3000,
    timerProgressBar: true,
  });
  loadingScreen = this.loadingController.create({
    cssClass: 'my-custom-class',
    message: 'Cargando...',
  });

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private navController: NavController,
    private localStorage: LocalStorageService,
    public loadingController: LoadingController
  ) { }

  async ngOnInit() {
    await (await this.loadingScreen).present();

    const user: User = await this.localStorage.getUserData();
    console.log('a', user);
    await (await this.loadingScreen).dismiss();
    if (user) {
      if (this.authService.getUid != null) {
        this.navController.navigateBack(['/menu/home']);
      };
    }
  }

  async logIn() {
    if (this.email && this.password && this.email !== '' && this.password !== '') {
      this.loadingScreen = this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Cargando...',
      });
      await (await this.loadingScreen).present();
      this.localStorage.clear();
      await this.authService.signIn(this.email, this.password).then(
        async (res) => {
          if (res) {
            await new Promise((resolve, reject) => {
              this.usersService.getUser(res.user.uid).subscribe(
                result => {
                  this.localStorage.setUserData(result);
                  resolve(result);
                }
              );
            });

            if (this.authService.getUid != null) {
              this.navController.navigateBack(['/menu/home']);
            };
            await (await this.loadingScreen).dismiss();
          }
        }
      ).catch(
        (error) => {
          //console.log(error);
          this.alert.fire({
            title: 'Parece que algo salió mal',
            text: 'Por favor revisa que los datos sean correctos.',
            icon: 'error',
            confirmButtonText: 'ok'
          }).then(
            async (result) => {
              if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                (await this.loadingScreen).dismiss();
              }
            }
          );
        }
      );
    } else {
      this.alert.fire({
        title: 'Parece que algo salió mal',
        text: 'Por favor revisa que los datos sean correctos.',
        icon: 'error',
        confirmButtonText: 'ok'
      });
    }
  }

  resetPassword() {
    this.navController.navigateBack(['/reset-password']);
  }
}
