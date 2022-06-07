import { Project } from './../models/project';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Timestamp } from "firebase/firestore";
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(
    private firestore: AngularFirestore,
  ) { }


  async saveProject(project: Project) {
    try {
      // Guardamos el usuario en Firestore Database.
      const result = await this.firestore.collection('Projects').add(project);
      return result;
    } catch (error) {
      return error;
    }
  }


  getAllProjects(): Observable<Project[]> {
    try {
      // Obtenemos todos los proyectos.
      const rolesCollection: AngularFirestoreCollection<Project> = this.firestore.collection('Projects', ref => ref);

      return rolesCollection.snapshotChanges().pipe(
        map(changes => changes.map(
          action => {
            const data = action.payload.doc.data() as Project;
            data.id = action.payload.doc.id;
            return data;
          }
        ))
      );
    } catch (error) {
      return error;
    }

  }

  timestamp(): String{
    let tiempof = ""
    const tiempo = Timestamp.now();
    const tiempoformateado = moment(tiempo.toDate()).format('dddd, D MMMM YYYY')
    
    tiempof=tiempoformateado;

    return tiempof;
  }
}
