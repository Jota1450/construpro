import { Rol } from './../models/rol';
import { Project } from './../models/project';
import { User } from './../models/user';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/Storage-angular';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private storage: Storage) { }

  setUserData(user: User) {
    // Store the value under "my-key"
    this.storage.set('user', user);
  }

  clear(){
    this.storage.clear();
  }

  deleteProjectData(){
    this.storage.remove('rol');
    return this.storage.remove('project');
  }

  setProjectData(project: Project) {
    // Store the value under "my-key"
    return this.storage.set('project', project);
  }

  setCurrentRol(rol: Rol) {
    // Store the value under "my-key"
    return this.storage.set('rol', rol);
  }

  async getUserData(): Promise<User>{
    // Store the value under "my-key"
    return (await this.storage.get('user'));
  }

  async getProjectData(): Promise<Project>  {
    // Store the value under "my-key"
    return await this.storage.get('project');
  }

  async getCurrentRol(): Promise<Rol>  {
    // Store the value under "my-key"
    return await this.storage.get('rol');
  }
}


