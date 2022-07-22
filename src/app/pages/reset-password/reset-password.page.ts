import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  email: string;
  formEmail: FormGroup;


  alert = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: true,
  });
  /*
  loadingScreen = this.loadingController.create({
    cssClass: 'my-custom-class',
    message: 'Cargando...',
  });*/

  constructor(
    private navController: NavController,
    private authService: AuthService,
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit() {
    this.formEmail = this.formBuilder.group(
      {
        email: new FormControl('', [
          Validators.required,
          Validators.email
        ]),
      }
    );
  }

  log(){
    console.log('goku', this.formEmail);
  }

  resetPassword() {
    this.formEmail.get('email').setValue(this.email);
    if (this.formEmail.valid) {
      this.authService.passwordRecover(this.email).then(
        (result) => {
          this.alert.fire({
            icon: 'success',
            title: 'Correo Enviado',
            text: 'Hemos enviado un correo de restablecimiento revisa tu bandeja de entrada.',
            confirmButtonText: 'ok',
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
        }
      ).catch(
        (err) => {
          this.alert.fire({
            title: 'Parece que algo salió mal',
            text: 'Por favor revisa que el correo sea valido.',
            icon: 'error',
            confirmButtonText: 'ok',
            timer: 3000,
            timerProgressBar: true
          });
        }
      );
    }
  }

  goBack() {
    this.navController.navigateBack(['/login']);
  }
}
