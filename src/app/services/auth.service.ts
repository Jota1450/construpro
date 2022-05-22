import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public afStore: AngularFirestoreModule,
    public fireAuth: AngularFireAuth
  ) { }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null && user.emailVerified !== false ? true : false;
  }
  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.emailVerified !== false ? true : false;
  }

  async signIn(email, password) {
    const dataS = await this.fireAuth.signInWithEmailAndPassword(
      email,
      password
    );
    return dataS;
  }
  // Register user with email/password
  async registerUser(email, password) {
    const result = await this.fireAuth.createUserWithEmailAndPassword(
      email,
      password
    );

    if (result != null) {
      // result.user.sendEmailVerification();
      return result.user;
    }
  }

  async getUid(){
    const user =  await this.fireAuth.currentUser;
    //user.sendEmailVerification();
    return user.uid;
  }

  async stateUser() {
    return await this.fireAuth.authState;
  }
  // Email verification when new user register
  // Recover password
  passwordRecover(passwordResetEmail) {
    return this.fireAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert(
          'Password reset email has been sent, please check your inbox.'
        );
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in


  signOut() {
    return this.fireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.clear();
      //  this.router.navigate(['login']);
    });
  }
}

