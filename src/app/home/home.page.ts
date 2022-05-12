import { Component } from '@angular/core';
import { ComponentsModule } from '../components/components.module';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  contracts=[
    {title: 'Casa 5',
     address: 'Calle 5 #5-5',
     startDate:'20-05-2022',
     endDate: '25-05-2022',
     contractNumber: '1',
     id: '1' 

    },
    {title: 'Casa 6',
    address: 'Calle 5 #5-5',
    startDate:'20-05-2022',
    endDate: '25-05-2022',
    contractNumber: '2',
    id: '2'

    },
    {title: 'Torre 6',
    address: 'Calle 7 #7-8',
    startDate:'20-05-2022',
    endDate: '25-05-2022',
    contractNumber: '3',
    id: '3'
    }

  ]

  constructor() {}

}
