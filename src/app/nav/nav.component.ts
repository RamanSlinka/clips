import {Component} from '@angular/core';
import {ModalService} from "../srevices/modal.service";
import {AuthService} from "../srevices/auth.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {


  constructor(public modal: ModalService,
              public auth: AuthService) {
  }

  public openModal($event: Event) {
    $event.preventDefault()
    this.modal.toggleModal('auth')
  }
}
