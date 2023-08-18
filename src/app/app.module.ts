import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { NavComponent } from './nav/nav.component';
import {AngularFireModule} from '@angular/fire/compat'
import {AngularFireAuthModule} from '@angular/fire/compat/auth'
import {AngularFirestoreModule} from '@angular/fire/compat/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyAJDY4cRHZQCm2jMk8ngMbK5aun3trOIRU",
  authDomain: "clips-7d7f4.firebaseapp.com",
  projectId: "clips-7d7f4",
  storageBucket: "clips-7d7f4.appspot.com",
  messagingSenderId: "177933045398",
  appId: "1:177933045398:web:3b8f8d6577a8d674fafcb7",
  measurementId: "G-XXG6RQ9270"
};

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
