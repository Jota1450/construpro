import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private firestore: AngularFirestore,
    public authService: AuthService
  ) { }

  async createUser(user: User) {

    // creamos el usuario en Firebase Athentication
    const resultUser = await this.authService.registerUser(user.email, user.password);

    // obtenemos el uid resultante de la creacion del registro
    // !!!! -- Pendiente Crear validacion de error
    // !!!! -- No guardar contraseña
    // !!!! -- Agregar mensajes de response
    //
    user.id = resultUser.uid;
    user.password = null;

    // guardamos el usuario en Firestore Database
    const result = await this.firestore.collection('Users').doc(user.id).set(user);
    return result;
  }
}
