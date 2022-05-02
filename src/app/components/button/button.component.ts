import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pro-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ProButton implements OnInit {

  @Input() text: string = "button";

  constructor() { }

  ngOnInit() {}


}