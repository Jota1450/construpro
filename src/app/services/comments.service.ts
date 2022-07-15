import { Comment } from './../models/comment';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  alert = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: true,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  constructor(
    private firestore: AngularFirestore,
  ) { }

  async saveComment(noteId: string, comment: Comment) {
    try {
      const note = await this.firestore.collection('Notes').doc(noteId);
      const result = await note.collection('Comments').add(comment);
      return result;
    } catch (error) {
      this.alert.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Parece que algo salió mal!',
      });
      return null;
    }
  }

  getAllComments(noteId: string): Observable<Comment[]> {
    try {
      // Obtenemos todos los Comentarios.
      // eslint-disable-next-line max-len
      const rolesCollection: AngularFirestoreCollection<Comment> = this.firestore.collection('Notes').doc(noteId).collection('Comments', ref => ref);

      return rolesCollection.snapshotChanges().pipe(
        map(changes => changes.map(
          action => {
            const data = action.payload.doc.data() as Comment;
            data.id = action.payload.doc.id;
            return data;
          }
        ))
      );
    } catch (error) {
      this.alert.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Parece que algo salió mal!',
      });
      return null;
    }
  }
}
