import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pro-card-note',
  templateUrl: './card-note.component.html',
  styleUrls: ['./card-note.component.scss'],
})
export class ProCardNote implements OnInit {

  @Input() date= '';
  @Input() time= '';
  @Input() note= '';
  @Input() names= '';
  @Input() lastNames= '';

  constructor() { }

  ngOnInit() {}

}
