import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Project } from 'src/app/models/project';
import { Rol } from 'src/app/models/rol';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-note-create',
  templateUrl: './note-create.page.html',
  styleUrls: ['./note-create.page.scss'],
})
export class NoteCreatePage implements OnInit {

  public tiempo: String;
  formProject: FormGroup;
  users: User[];
  roles: Rol[];

  Users = [
  {value:'1',text:'Sapolin'},
  {value:'2',text:'Sapolina'},
  {value:'3',text:'Jugui Yuquina'},
  {value:'4',text:'Mfrappe Yuquino'}
    ]
  
  constructor(
    private projectService:ProjectsService)
    {
   
    }

  ngOnInit() {

    this.tiempo=this.projectService.timestamp()
    
  }

}
