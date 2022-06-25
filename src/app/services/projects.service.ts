import { Project } from './../models/project';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

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
      console.log(error);
      return 'error';
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

  getProjectsByUser(id: string): Observable<Project[]> {
    try {
      // Obtenemos todos los proyectos.
      // eslint-disable-next-line max-len
      const rolesCollection: AngularFirestoreCollection<Project> = this.firestore.collection('Projects', ref => ref.where('partyIds', 'array-contains', id));

      return rolesCollection.snapshotChanges().pipe(
        map(changes => changes.map(
          action => {
            const data = action.payload.doc.data() as Project;
            data.id = action.payload.doc.id;
            const party: User[] = data.party;
            if (party.some(e => e.id === id)) {
              return data;
            }
          }
        ))
      );
    } catch (error) {
      return error;
    }
  }

  getAllProjectsByUser(): Observable<Project[]> {
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
}
