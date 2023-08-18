import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor(private auth: AngularFireAuth) {}

  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! You are being logged in!';

  inSubmission = false;

  loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  });

  async login() {
    try {
      this.showAlert = false;
      this.alertColor = 'blue';
      this.alertMsg = 'Please wait! You are being logged in!';

      this.inSubmission = true;
      await this.auth.signInWithEmailAndPassword(
        this.loginForm.value.email as string,
        this.loginForm.value.password as string
      );

    } catch (error) {
      console.error(error);
      this.showAlert = true;
      this.alertMsg = 'An Unexpected Error Occurred';
      this.alertColor = 'red';
      this.inSubmission = false;

      return;
    }

    this.showAlert = true;
      this.alertColor = 'green';
      this.alertMsg = 'Your are now logged in!';
  }
}
