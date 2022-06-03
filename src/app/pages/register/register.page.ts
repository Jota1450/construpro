import { User } from '../../models/user';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  options = [
    { value: 'C.C.', text: 'C.C.' },
    { value: 'T.I.', text: 'T.I.' }
  ];
  /*
  names: string;
  lastNames: string;
  email: string;
  password: string;
  confirmPassword: string;
  documentType: string;
  documentNumber: string;*/
  formRegister: FormGroup;

  constructor(
    private usersService: UsersService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.formRegister = this.formBuilder.group(
      {
        names: new FormControl('', [
          Validators.required,
          Validators.pattern('[a-zA-Z]*'),
          Validators.maxLength(5)
        ]),
        lastNames: new FormControl('', [
          Validators.required,
          Validators.pattern('[a-zA-Z]*'),
          Validators.maxLength(5)
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.email
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
          Validators.pattern('^(0|[1-9][0-9]*)$'),
          
        ]),
      }
    );
  }

  async saveUser() {
    if (this.formRegister.valid && this.passAreValid()) {
      const user: User = {
        names: this.formRegister.get('names').value,
        lastNames: this.formRegister.get('lastNames').value,
        email: this.formRegister.get('email').value,
        password: this.formRegister.get('password').value,
        documentType: this.formRegister.get('documentType').value,
        documentNumber: this.formRegister.get('documentNumber').value
      };
      await this.usersService.createUser(user).then(
        (resp) => {
          console.log('response', resp);
        }
      );
    } else {
      console.log('formControl', this.formRegister);
    }
    // creamos objeto para user para guardar
    //this.formRegister.get
  }

  setValue(name: string, value: any){
    this.formRegister.get(name).setValue(value);
  }

  passAreValid(): boolean{
    return this.formRegister.get('password').value === this.formRegister.get('confirmPassword').value;
  }
}
