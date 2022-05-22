import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  @Output() outputValue= new EventEmitter();

  constructor() { }

  ngOnInit() {}

  emitChange(){
    console.log(this.value);
    this.outputValue.emit(this.value);
  }

}
