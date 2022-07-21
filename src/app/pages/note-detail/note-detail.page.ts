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
import { ProjectsService } from 'src/app/services/projects.service';
import { Project } from 'src/app/models/project';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.page.html',
  styleUrls: ['./note-detail.page.scss'],
})
export class NoteDetailPage implements OnInit {

  note: Note;
  user: User;
  project: Project;
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
      this.project= await this.localStorage.getProjectData();
      const id = this.activatedRoute.snapshot.paramMap.get('id');
      this.notesService.getNote(id).subscribe(
        (note) => {
          if (note) {
            this.note = note;
          }
        }
      );
      this.user = await this.localStorage.getUserData();
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
    return moment(date).format('MMMM D YYYY');
  }

  formatTimeString(date: string) {
    return moment(date).format('hh:mm A');
  }

  userCanSign(): boolean {
    return this.note.inspectorId === this.user.id;
  }

  deleteComment(commentId: string){
    this.commentsService.deleteComment(this.note.id, commentId);
  }

}
