import { UsersService } from './users.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public afStore: AngularFirestoreModule,
    public fireAuth: AngularFireAuth,
  ) { }

  get isLoggedIn(): boolean {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user !== null && user.emailVerified !== false ? true : false;
    } catch (error) {
      return error;
    }
  }
  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user.emailVerified !== false ? true : false;
    } catch (error) {
      return error;
    }

  }

  async signIn(email, password){
    try {
      const dataS = await this.fireAuth.signInWithEmailAndPassword(
        email,
        password
      );

      //console.log('response', dataS.user.uid);

      return dataS;
    } catch (error) {
      return error;
    }
  }
  // Register user with email/password
  async registerUser(email, password) {
    try {
      const result = await this.fireAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (result != null) {
        // result.user.sendEmailVerification();
        return result.user;
      }
    } catch (error) {
      return error;
    }

  }

  async getUid() {
    try {
      const user = await this.fireAuth.currentUser;
      //user.sendEmailVerification();
      return user.uid;
    } catch (error) {
      return error;
    }

  }

  async stateUser() {
    try {
      return await this.fireAuth.authState;
    } catch (error) {
      return error;
    }
  }
  // Email verification when new user register
  // Recover password
  passwordRecover(passwordResetEmail) {
    try {
      return this.fireAuth.sendPasswordResetEmail(passwordResetEmail)
        .then(() => {
          window.alert(
            'Password reset email has been sent, please check your inbox.'
          );
        })
        .catch((error) => {
          window.alert(error);
        });
    } catch (error) {
      return error;
    }
  }
  // Returns true when user is looged in

  signOut() {
    try {
      return this.fireAuth.signOut().then(() => {
        localStorage.removeItem('user');
        localStorage.clear();
        //  this.router.navigate(['login']);
      });
    } catch (error) {
      return error;
    }
  }
}

