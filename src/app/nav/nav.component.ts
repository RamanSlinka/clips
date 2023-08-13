import {Component} from '@angular/core';
import {ModalService} from "../srevices/modal.service";
import {AuthService} from "../srevices/auth.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {


  constructor(public modal: ModalService,
              public auth: AuthService,
              private afAuth: AngularFireAuth) {
  }

  public openModal($event: Event) {
    $event.preventDefault()
    this.modal.toggleModal('auth')
  }

  async logout($event: Event) {
    $event.preventDefault()
    await this.afAuth.signOut()
  }
}
