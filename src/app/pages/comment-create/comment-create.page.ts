import { CommentsService } from './../../services/comments.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from 'src/app/models/note';
import { User } from 'src/app/models/user';
import { Comment } from 'src/app/models/comment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NotesService } from 'src/app/services/notes.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { LoadingController, NavController } from '@ionic/angular';


@Component({
  selector: 'app-comment-create',
  templateUrl: './comment-create.page.html',
  styleUrls: ['./comment-create.page.scss'],
})
export class CommentCreatePage implements OnInit {

  note: Note;
  user: User;
  formSended = false;
  formComment: FormGroup;

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

  loadingScreen = this.loadingController.create({
    cssClass: 'my-custom-class',
    message: 'Cargando...',
  });

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private notesService: NotesService,
    private localStorage: LocalStorageService,
    private commentsService: CommentsService,
    public loadingController: LoadingController,
    private navController: NavController
  ) {
    this.initForm();
  }

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
    } catch (error) {
      console.log(error);
    }
  }

  initForm() {
    this.formComment = this.formBuilder.group(
      {
        body: new FormControl('', [
          Validators.required
        ]),
      }
    );
  }

  async saveComment() {
    this.formSended = true;
    if (this.formComment.valid) {
      const id: string = (await this.localStorage.getProjectData()).id;
      if (this.note && this.user) {
        await (await this.loadingScreen).present();
        const comment: Comment = {
          body: this.formComment.get('body').value,
          createdAt: new Date().toISOString(),
          user: this.user,
        };
        if (this.user.id) {
          await this.commentsService.saveComment(this.note.id, comment).then(
            (resp) => {
              console.log('response', resp);
              try {
                if (resp) {
                  this.alert.fire({
                    icon: 'success',
                    title: 'Bien!!!',
                    text: 'Comentario registrado correctamente',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                  }).then(
                    async (result) => {
                      if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                        (await this.loadingScreen).dismiss();
                        this.navController.navigateBack(['/note-detail/' + this.note.id]);
                      }
                    }
                  );
                }
              } catch (error) {
                this.alert.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                }).then(
                  async (result) => {
                    if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                      (await this.loadingScreen).dismiss();
                    }
                  }
                );
              }
            }
          ).catch(
            error => {
              if (error) {
                this.alert.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                });
              }
            }
          );
        }
      } else { }
    } else {
      console.log('formControl', this.formComment);
    }
  }

}
