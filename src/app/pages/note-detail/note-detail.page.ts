import { CommentsService } from './../../services/comments.service';
import { Comment } from 'src/app/models/comment';
import { SignatureEvent } from './../../../../node_modules/signature_pad/src/signature_pad';
import { NotesService } from './../../services/notes.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Note } from 'src/app/models/note';
import { User } from 'src/app/models/user';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import * as moment from 'moment';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.page.html',
  styleUrls: ['./note-detail.page.scss'],
})
export class NoteDetailPage implements OnInit {

  note: Note;
  user: User;
  comments: Comment[];

  // eslint-disable-next-line @typescript-eslint/member-ordering
  //@ViewChild('signature', { static: true }) signaturePadElement: any;
  //signaturePad: any;
  //signature: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private notesService: NotesService,
    private commentsService: CommentsService,
    private localStorage: LocalStorageService,
  ) { }

  async ngOnInit() {
    try {
      const id = this.activatedRoute.snapshot.paramMap.get('id');
      this.notesService.getNote(id).subscribe(
        (note) => {
          if (note) {
            this.note = note;
          }
        }
      );
      await this.localStorage.getUserData().then(
        (response) => {
          this.user = response;
        }
      );
      await this.getComments(id);
    } catch (error) {
      console.log(error);
    }
  }

  async getComments(id: string) {
    await this.commentsService.getAllComments(id).subscribe(
      (resp) => {
        this.comments = resp;
        console.log('resp', resp);
      }
    );
  }

  formatDate(date) {
    return moment(date).format('dddd, D MMMM YYYY');
  }

  formatDateString(date: string) {
    return moment(date).format('MMMM D YYYY, h:mm:ss a');
  }

  userCanSign(): boolean {
    return this.note.inspectorId === this.user.id;
  }

}
