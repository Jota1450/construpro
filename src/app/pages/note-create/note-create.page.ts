import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-note-create',
  templateUrl: './note-create.page.html',
  styleUrls: ['./note-create.page.scss'],
})
export class NoteCreatePage implements OnInit {

  public tiempo: String;

  constructor(private projectService:ProjectsService) {

   }

  ngOnInit() {
    this.tiempo=this.projectService.timestamp()
  }

}
