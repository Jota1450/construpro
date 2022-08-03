import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore) { }

  async create(collection: string, dato: any) {
    try {
      return await this.firestore.collection(collection).add(dato);
    } catch (error) {
      console.log(error);
    }
  }

  async getAll(collection: string){
    try {
      return await this.firestore.collection(collection).snapshotChanges();
    } catch (error) {
      console.log(error);
    }
  }

  async getbyId(collection: string, id){
    try {
      return await this.firestore.collection(collection).doc(id).get();
    } catch (error) {
      console.log(error);
    }
  }

  async delete(collection: string, id){
    try {
      return await this.firestore.collection(collection).doc(id).delete();
    } catch (error) {
      console.log(error);
    }
  }

  async update(collection: string, id, dato){
    try {
      return await this.firestore.collection(collection).doc(id).set(dato);
    } catch (error) {
      console.log(error);
    }
  }
}
