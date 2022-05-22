import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(
    private firestore: AngularFirestore,
  ) { }

  saveProject(){
    return null;
  }
}
