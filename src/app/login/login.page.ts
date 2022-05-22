import { Message } from './../../../node_modules/protobufjs/index.d';
import { Router, Routes } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  presionar(){
    console.log(this.email);
    console.log('password: ', this.password);
  }

  async logIn(){

    //debugger;
    const alert = Swal.mixin({
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


    /*const response = await this.authService.signIn(this.email, this.password);
    console.log(response);
    if (this.authService.getUid != null) {
      this.router.navigate(['/home']);
    }

    */
    this.authService.signIn(this.email, this.password).then(
      (res) => {
        if (res.user) {
          console.log(this.authService.getUid);
          if (this.authService.getUid != null) {
            this.router.navigate(['/home']);
          };
        }
      }
    ).catch(
      (error) => {
        //console.log(error);
        alert.fire({
          title: error.message,
          text: 'Do you want to continue',
          icon: 'error',
          confirmButtonText: 'Cool'
        });
      }
    );
  }
}
