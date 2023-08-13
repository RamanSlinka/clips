import {Component} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: any = {
    email: '',
    password: ''

  };
  showAlert = false;
  alertMessage = 'Please wait! We are login you in.'
  alertColor = 'blue'
  isSubmission = false

  constructor(private auth: AngularFireAuth) {
  }

  public async login() {
    this.showAlert = true;
    this.alertMessage = 'Please wait! We are logging you in.';
    this.alertColor = 'blue';
    this.isSubmission = true
    try {
    await  this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      )
    } catch (e) {
      this.isSubmission = false;
      this.alertMessage = 'An unexpected error occurred. Please try again later';
      this.alertColor = 'red';
      console.log(e)
      return
    }
    this.alertMessage = 'Success ! You are now logged in.'
    this.alertColor = 'green'
  }
}
