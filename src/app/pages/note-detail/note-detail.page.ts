import { NotesService } from './../../services/notes.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Note } from 'src/app/models/note';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.page.html',
  styleUrls: ['./note-detail.page.scss'],
})
export class NoteDetailPage implements OnInit {

  note: Note;
  constructor(
    private activatedRoute: ActivatedRoute,
    private notesService: NotesService
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.notesService.getNote(id).subscribe(
      (note) => this.note = note
    );
  }

}
