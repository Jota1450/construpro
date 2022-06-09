import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.page.html',
  styleUrls: ['./note-detail.page.scss'],
})
export class NoteDetailPage implements OnInit {

  public date= 'Lunes, 5 de Mayo 2022';
  public time= '5:43 PM';
  public note= 'El valecita tiro dos bloques de queso pa ralla y se fritaron dos patacones bien melos';

  details=[
    { date:'Lunes, 5 de Mayo 2022',
      time:'5:43 PM',
      note:'El valecita tiro dos bloques de queso pa ralla y se fritaron dos patacones bien melos'
    },
  ]

  constructor() { }

  ngOnInit() {
  }



}
