import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/Storage-angular';
import * as moment from "moment";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit{

  constructor(private storage: Storage) {
    moment.locale('es_mx')
  }

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();
  }
}
