import { User } from '../../models/user';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  options = [
    { value: 'C.C.', text: 'C.C.' },
    //{ value: 'T.I.', text: 'T.I.' }
    { value: 'Pasaporte', text: 'Pasaporte' }
  ];

  formSended = false;

  loadingScreen = this.loadingController.create({
    cssClass: 'my-custom-class',
    message: 'Cargando...',
  });

  formRegister: FormGroup;

  constructor(
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private navController: NavController,
    private localStorage: LocalStorageService,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.formRegister = this.formBuilder.group(
      {
        names: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-ZáÁéÉíÍóÓüúÚñÑ ]{3,30}$'),
          Validators.min(3)
        ]),
        lastNames: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-ZáÁéÉíÍóÓüúÚñÑ ]{3,30}$'),
          Validators.min(3)
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.min(8)
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.min(8)
        ]),
        documentType: new FormControl('', [
          Validators.required
        ]),
        documentNumber: new FormControl('', [
          Validators.required,
          //Validators.pattern('^(0|[1-9][0-9]*)$'),
        ]),
        professionalCard: new FormControl('', [
          Validators.required
        ]),
      }
    );
  }

  async saveUser() {
    this.formSended = true;

    await (await this.loadingScreen).present();
    if (this.formRegister.valid && this.passAreValid()) {
      const user: User = {
        names: this.formRegister.get('names').value.trim(),
        lastNames: this.formRegister.get('lastNames').value.trim(),
        email: this.formRegister.get('email').value.trim(),
        password: this.formRegister.get('password').value.trim(),
        documentType: this.formRegister.get('documentType').value.trim(),
        documentNumber: this.formRegister.get('documentNumber').value.trim(),
        canCreateProject: false,
        createdAt: new Date().toISOString().trim(),
        professionalCard: this.formRegister.get('professionalCard').value.trim(),
      };
      await this.usersService.createUser(user).then(
        async (resp) => {
          console.log('response', resp);
          if (resp) {
            this.localStorage.setUserData(resp);
            await (await this.loadingScreen).dismiss();
            this.navController.navigateBack(['/menu/home']);
          }
        }
      );
    } else {
      await (await this.loadingScreen).dismiss();
      console.log('formControl', this.formRegister);
    }
    // creamos objeto para user para guardar
    //this.formRegister.get
  }

  setValue(name: string, value: any) {
    //this.formRegister.get(name).markAsTouched();
    this.formRegister.get(name).setValue(value);
  }

  passAreValid(): boolean {
    return this.formRegister.get('password').value === this.formRegister.get('confirmPassword').value;
  }

  validateSelect(): boolean {
    if (this.formRegister.get('documentType').value === '') {
      return false;
    } else {
      return true;
    }
  }

  getDocumentNumberInputType(): string{
    return (this.formRegister.get('documentType').value.trim() === 'C.C.') ? 'number' : 'text' ;
  }

  validateField(field: string): boolean{
    return (
    this.formRegister.get(field).invalid && this.formRegister.get(field).touched ||
    this.formRegister.get(field).invalid && this.formSended
    );
  }

}
