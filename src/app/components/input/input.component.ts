import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'pro-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class ProInput implements OnInit {

  @Input() value = '';
  @Input() type = 'text';
  @Input() title = 'Title';
  @Input() required = true;
  @Input() disabled = false;
  @Input() minimo = '';
  @Output() outputValue = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  emitChange(){
    this.outputValue.emit(this.value);
  }
}

