import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import IUser from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private auth: AngularFireAuth,
                private db: AngularFirestore) {
    }

    public async createUser(userData: IUser) {
        if (userData.email && userData.password != null) {
            const userCred = await this.auth.createUserWithEmailAndPassword(
                userData.email, userData.password)
            console.log(userCred)
        }

        await this.db.collection(`users`).add({
            name: userData.name,
            email: userData.email,
            age: userData.age,
            phoneNumber: userData.phoneNumber
        })
    }
}
