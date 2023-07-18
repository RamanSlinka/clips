import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private  visible = false;
  constructor() { }

  public isModalOpen() {
    return this.visible
  }

  public toggleModal() {
this.visible = !this.visible
  }

}
