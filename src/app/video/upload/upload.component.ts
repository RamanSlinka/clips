import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import { v4 as uuid} from 'uuid'

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {

  public isDragover = false
  public file: File | null = null
  public nextStep = false

  public showAlert = false
  public alertColor = 'blue'
  public alertMessage = 'Please wait! Your clip is being uploaded.'
  public inSubmission = false

  public percentage = 0


  title = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])

  uploadForm = new FormGroup({
    title: this.title
  })

  constructor(private storage: AngularFireStorage) {
  }

  storeFile($event: Event) {
    this.isDragover = false
    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null

    if (!this.file || this.file.type !== 'video/mp4') {
      return
    }
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    )
    this.nextStep = true
  }

  uploadFile() {
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait! Your clip is being uploaded.';
    this.inSubmission = true

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

   const task =  this.storage.upload(clipPath, this.file);
   task.percentageChanges().subscribe(progress => {
     this.percentage = progress as number / 100
   })

    console.log('file uploaded');
  }
}
