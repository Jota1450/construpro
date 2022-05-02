import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pro-button-outline',
  templateUrl: './button-outline.component.html',
  styleUrls: ['./button-outline.component.scss'],
})
export class ProButtonOutline implements OnInit {

  @Input() text: string = "button";

  constructor() { }

  ngOnInit() {}

}