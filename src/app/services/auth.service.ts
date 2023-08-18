import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { Observable } from 'rxjs';
import {delay, map} from "rxjs/operators"
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$:Observable<boolean>;
  public isAuthenticatedWithDelay$:Observable<boolean>;


  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.userCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(
      map(user=>!!user)
    )
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000))
  }

  public async createUser(userData: IUser) {
    if (!userData.password) {
      throw new Error('Password Not provided');
    }
    const userCredential = await this.auth.createUserWithEmailAndPassword(
      userData.email as string,
      userData.password as string
    );

    if (!userCredential.user) {
      throw new Error('User Not provided');

    }
    await this.userCollection.doc(userCredential.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });
    await userCredential.user.updateProfile({
      displayName:userData.name
    })
  }
}
