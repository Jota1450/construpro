import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UsersService } from '../../services/users.service';

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

  names: string;
  lastNames: string;
  email: string;
  password: string;
  confirmPassword: string;
  documentType: string;
  documentNumber: string;

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit() {
  }

  async saveUser(){
    // creamos objeto para user para guardar
    const user: User = {
      names: this.names,
      lastNames: this.lastNames,
      email:  this.email,
      password:  this.password,
      documentType:  this.documentType,
      documentNumber:  this.documentNumber
    };
    await this.usersService.createUser(user).then(
      (resp) => {
        console.log('response', resp);
      }
    );
  }
}
