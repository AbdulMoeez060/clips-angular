import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = new FormControl("",[Validators.required,Validators.email])
  password = new FormControl("",[Validators.required])

  showAlert = false
  alertColor = 'green'
  alertMsg = "Your login request is being processed!"

  loginForm = new FormGroup({
    email : this.email,
    password: this.password
  })

  login(){
    this.showAlert=true
    this.alertColor = 'green'
    this.alertMsg = "Your login request is being processed!"
  }
}
