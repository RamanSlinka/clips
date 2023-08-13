import {Component, OnInit} from '@angular/core';
import {AuthService} from "./srevices/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {

  constructor(public auth: AuthService) {
  }
}
