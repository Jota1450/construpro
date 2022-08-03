import { Rol } from 'src/app/models/rol';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private roles: Rol[];

  constructor(
    private firestore: AngularFirestore,
    public authService: AuthService
  ) { }

  async isLoggedIn(): Promise<boolean | User>{
    const isLoggedIn = this.authService.isLoggedIn;
    if(isLoggedIn){
      const user: User = await new Promise(async (resolve, reject) => {
        this.getUser(await this.authService.getUid()).subscribe(
          (response) => {
            resolve(response);
          }
        );
      });
      return user;
    } else {
      return false;
    }
  }

  async createUser(user: User): Promise<User>  {
    return new Promise(async (resolve, reject) => {
      try {

        // creamos el usuario en Firebase Athentication
        const resultUser = await this.authService.registerUser(user.email, user.password);

        // obtenemos el uid resultante de la creacion del registro
        // !!!! -- Pendiente Crear validacion de error
        // !!!! -- No guardar contraseña
        // !!!! -- Agregar mensajes de payload
        //
        user.id = resultUser.uid;
        user.password = null;

        // guardamos el usuario en Firestore Database
        await this.firestore.collection('Users').doc(user.id).set(user);

        const user2: User = await new Promise(async (innerResolve, innerReject) => {
          this.getUser(user.id).subscribe(
            (respUser) => resolve(respUser)
          );
        });
        resolve(user2);

      } catch (error) {
        reject(null);
      }
    });
  }

  getRol(id: string): Observable<Rol> {
    try {
      const rolDoc: AngularFirestoreDocument<Rol> = this.firestore.doc<Rol>(`Rol/${id}`);
      return rolDoc.snapshotChanges().pipe(
        map(
          action => {
            if(action.payload.exists === false){
              return null;
            } else {
              const data = action.payload.data() as Rol;
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

  getUser(id: string): Observable<User> {
    try {
      const userDoc: AngularFirestoreDocument<User> = this.firestore.doc<User>(`Users/${id}`);
      return userDoc.snapshotChanges().pipe(
        map(
          action => {
            if(action.payload.exists === false){
              return null;
            } else {
              const data = action.payload.data() as User;
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

  getAllRoles(): Observable<Rol[]> {
    try {
      const rolesCollection: AngularFirestoreCollection<Rol> = this.firestore.collection('Roles', ref => ref);

      return rolesCollection.snapshotChanges().pipe(
        map(changes => changes.map(
          action => {
            const data = action.payload.doc.data() as Rol;
            data.id = action.payload.doc.id;
            return data;
          }
        ))
      );
    } catch (error) {
      return error;
    }
  }

  getAllUsers(): Observable<User[]> {
    try {
      const usersCollection: AngularFirestoreCollection<User> = this.firestore.collection('Users', ref => ref);

      return usersCollection.snapshotChanges().pipe(
        map(changes => changes.map(
          action => {
            const data = action.payload.doc.data() as User;
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
