import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  options= [
    {value: 1, text: 'C.C.'},
    {value: 2, text: 'T.I.'}
    ];

  constructor() { }

  ngOnInit() {
  }

}