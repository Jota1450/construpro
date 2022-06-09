import { Note } from './../models/note';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(
    private firestore: AngularFirestore,
  ) { }

  async saveNote(note: Note) {
    try {
      // Guardamos el usuario en Firestore Database.
      const result = await this.firestore.collection('Notes').add(note);
      return result;
    } catch (error) {
      return error;
    }
  }

  getNote(id: string): Observable<Note> {
    try {
      const rolDoc: AngularFirestoreDocument<Note> = this.firestore.doc<Note>(`Notes/${id}`);
      return rolDoc.snapshotChanges().pipe(
        map(
          action => {
            if(action.payload.exists === false){
              return null;
            } else {
              const data = action.payload.data() as Note;
              data.id = action.payload.id;
              return data;
            }
          }
        )
      );
      //return this.firestore.collection('Users').doc(id).get();
    } catch (error) {
      console.log(error);
    }
  }


  getAllNotes(): Observable<Note[]> {
    try {
      // Obtenemos todos los proyectos.
      const rolesCollection: AngularFirestoreCollection<Note> = this.firestore.collection('Notes', ref => ref);

      return rolesCollection.snapshotChanges().pipe(
        map(changes => changes.map(
          action => {
            const data = action.payload.doc.data() as Note;
            data.id = action.payload.doc.id;
            return data;
          }
        ))
      );
    } catch (error) {
      return error;
    }
  }

  getNotesById(projectId: string): Observable<Note[]> {
    try {
      // Obtenemos todos los proyectos.
      // eslint-disable-next-line max-len
      const rolesCollection: AngularFirestoreCollection<Note> = this.firestore.collection('Notes', ref => ref.where('projectId', '==', projectId) );

      return rolesCollection.snapshotChanges().pipe(
        map(changes => changes.map(
          action => {
            const data = action.payload.doc.data() as Note;
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
