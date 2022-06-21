import { UsersService } from './../../services/users.service';
import { Router, Routes } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

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
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit() {
  }

  async logIn() {
    this.localStorage.clear();
    await this.authService.signIn(this.email, this.password).then(
      async (res) => {
        if (res) {
          this.usersService.getUser(res.user.uid).subscribe(
            result => {
              this.localStorage.setUserData(result);
            }
          );

          await this.localStorage.getUserData().then(
            response => {
              //console.log('goku', (response));
            }
          );

          if (this.authService.getUid != null) {
            this.router.navigate(['/menu/home']);
          };
        }
      }
    ).catch(
      (error) => {
        //console.log(error);
        this.alert.fire({
          title: error.message,
          text: 'Do you want to continue',
          icon: 'error',
          confirmButtonText: 'Cool'
        });
      }
    );
  }
}
