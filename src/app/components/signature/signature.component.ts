import { Note } from 'src/app/models/note';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NotesService } from 'src/app/services/notes.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
})
export class SignatureComponent implements OnInit {

  urlAwait = '';

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild('signature', { static: true }) signaturePadElement: any;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Input() note: Note;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Input() user: User;
  signaturePad: any;
  signature: any;

  constructor(
    private fireStorage: AngularFireStorage,
    private notesService: NotesService,
    private localStorage: LocalStorageService,
  ) {}


  async ngOnInit() {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
  }

  urlToBlob(dataURL: any) {
    if (navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') === -1) {
      window.open(dataURL);
    } else {
      const partes = dataURL.split(';base64,');
      const contentType = partes[0].split(':')[1];
      const raw = window.atob(partes[1]);
      const rawL = raw.length;
      const array = new Uint8Array(rawL);
      for (let i = 0; i < rawL; i++) {
        array[i] = raw.charCodeAt(i);
      }
      return new Blob([array], { type: contentType });
    }
  }

  deshacer() {
    const datos = this.signaturePad.toData();
    if (datos) {
      datos.pop();
      this.signaturePad.fromData(datos);
      this.signaturePad.clear();
    }
  }

  uploadIMG() {
    const imgRef = this.fireStorage.ref(`images/signature_${this.note.id}`);
    const u = this.signaturePad.toDataURL();
    const partes = u.split(';base64,');

    console.log(partes);
    const meta = imgRef.getMetadata();
    console.log('imgRef', meta);

    const raw = window.atob(partes[1]);
    const rawL = raw.length;
    const array = new Uint8Array(rawL);
    for (let i = 0; i < rawL; i++) {
      array[i] = raw.charCodeAt(i);
    }

    const signatureBase64 = partes[1];
    const blob = new Blob([array], { type: 'image/png' });

    const task = imgRef.put(blob);

    task.snapshotChanges().pipe(
      finalize(() => imgRef.getDownloadURL().subscribe(
        (response) => {
          if (response) {
            this.urlAwait = response;
            this.note.signatureBase64 = signatureBase64;
            this.note.signatureImageUrl = response;
            this.note.signatureDate = new Date().toISOString();
            this.note.signatureUser = this.user;
            this.note.isSigned = true;
            this.notesService.updateNote(this.note.id, this.note);
            return;
          }
        }
      ))
    ).subscribe();
    console.log(task);
  }

}
