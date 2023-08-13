import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalService} from "../../srevices/modal.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() modalID = '';

  constructor(public modal: ModalService, public el: ElementRef) {

  }

  ngOnDestroy(): void {
       document.body.removeChild(this.el.nativeElement)
    }

  ngOnInit() {
    document.body.appendChild(this.el.nativeElement)
  }

  public closeModal() {
    this.modal.toggleModal(this.modalID)
  }
}
