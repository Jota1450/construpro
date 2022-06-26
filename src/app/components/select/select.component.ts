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
  @Input() selected = -1;
  @Output() outputValue= new EventEmitter();

  constructor() {
    if(this.selected > -1) {
      this.value = this.options[this.selected].value;
    }
    console.log(this.value);
   }

  ngOnInit() {}

  emitChange($event = 'aaa'){
    console.log('value',this.value);
    console.log($event);
    this.outputValue.emit(this.value);
  }

}
