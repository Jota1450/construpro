import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pro-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class ProSelect implements OnInit {

  @Input() value = '';
  @Input() options = [];
  @Input() title = 'Title';
  @Input() required = true;
  @Input() disabled = false;

  constructor() { }

  ngOnInit() {}

}