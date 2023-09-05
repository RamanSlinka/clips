import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ModalService} from "../../srevices/modal.service";
import IClip from "../../models/clip.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ClipService} from "../../srevices/clip.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter()

  public inSubmission = false;
  public showAlert = false;
  public alertColor = 'blue';
  public alertMessage = 'Please wait! Updating clip.';

  clipID = new FormControl<any>('')
  title = new FormControl<any>('', [
    Validators.required,
    Validators.minLength(3)
  ])
  editForm = new FormGroup({
    title: this.title,
    id: this.clipID
  })


  constructor(private modal: ModalService,
              private clipService: ClipService
  ) {
  }

  ngOnInit(): void {
    this.modal.register('editClip')
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip')
  }

  ngOnChanges() {
    if (!this.activeClip) {
      return
    }
    this.inSubmission = false
    this.showAlert = false
    this.clipID.setValue(this.activeClip.docID)
    this.title.setValue(this.activeClip.title)
  }

  public async submit() {
    if(!this.activeClip) {
      return
    }

    this.inSubmission = true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMessage = 'Please wait! Updating clip.'

    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value)
    } catch (e) {
      this.inSubmission = false
      this.alertColor = 'red'
      this.alertMessage = 'Something went wrong. Try again later.'
      return
    }

    this.activeClip.title = this.title.value
    this.update.emit(this.activeClip)

    this.inSubmission = false
    this.alertColor = 'green'
    this.alertMessage = 'Success!.'
  }

}
