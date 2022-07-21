import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pro-card-project',
  templateUrl: './card-project.component.html',
  styleUrls: ['./card-project.component.scss'],
})
export class ProCardProject implements OnInit {

  @Input() title ='';
  @Input() address ='';
  @Input() startDate ='';
  @Input() endDate ='';
  @Input() contractNumber ='';
  @Input() contracts = [];
  @Input() id = '';
  @Input() img = '';
  @Input() rol = '';


  constructor() { }

  ngOnInit() {}


}

