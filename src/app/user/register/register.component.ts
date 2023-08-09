import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {

    constructor(private auth: AngularFireAuth,
                private db: AngularFirestore) {
    }

    inSubmission = false

    name = new FormControl('', [
        Validators.required, Validators.minLength(3)
    ])
    email = new FormControl('', [
        Validators.email,
        Validators.required]
    )
    age = new FormControl('', [
        Validators.required,
        Validators.min(18),
        Validators.max(120)
    ])
    password = new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
    ])
    confirm_password = new FormControl('', [
        Validators.required
    ])
    phone = new FormControl('', [
        Validators.required,
        Validators.min(13),
        Validators.max(13)
    ])

    alertColor: string = 'blue';
    showAlert: boolean = false;
    alertMsg: string = 'Please wait your account is being created';

    registerForm = new FormGroup({
        name: this.name,
        email: this.email,
        age: this.age,
        password: this.password,
        confirm_password: this.confirm_password,
        phone: this.phone
    })


    async register() {
        this.showAlert = true;
        this.alertMsg = 'Please wait! Your account is being created';
        this.alertColor = 'blue'
        this.inSubmission = true

        const {email, password} = this.registerForm.value
        try {

            if (email && password != null) {
                const userCred = await this.auth.createUserWithEmailAndPassword(
                    email, password)
                console.log(userCred)
            }

          await this.db.collection(`users`).add({
                name: this.name.value,
                email: this.email.value,
                age: this.age.value,
                phoneNumber: this.phone.value
            })
        } catch (e) {
            console.error(e)

            this.alertMsg = 'An unexpected error occurred. Please try again later'
            this.alertColor = 'red'
            this.inSubmission = false
            return
        }
        this.alertMsg = 'Success! Your account has been created.'
        this.alertColor = 'green'
    }
}
