import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private auth:AuthService) {}
  inSubmission = false;
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [Validators.required,Validators.minLength(2), Validators.email]);
  age = new FormControl(18, [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirm_password = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(11),
  ]);

  showAlert = false;
  alertMsg = 'Please wait! Your account is being Creeated';
  alertColor = 'blue';

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber,
  });

  async register() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being Creeated';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.createUser(this.registerForm.value as IUser)

    } catch (error) {
      console.error(error);
      this.showAlert = true;
      this.alertMsg = 'An Unexpected Error Occurred';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }
    this.showAlert = true;
    this.alertMsg = 'Success! Your account has been Creeated';
    this.alertColor = 'green';
  }
}
