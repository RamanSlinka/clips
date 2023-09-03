import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {v4 as uuid} from 'uuid'
import {last, switchMap} from "rxjs";
import firebase from "firebase/compat/app";
import {AngularFireAuth} from "@angular/fire/compat/auth";

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
  public showPercentage = false

  public user: firebase.User | null = null


  title = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])

  uploadForm = new FormGroup({
    title: this.title
  })

  constructor(private storage: AngularFireStorage,
              private auth: AngularFireAuth
  ) {
    auth.user.subscribe(user => this.user = user)
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
    this.showPercentage = true

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    const task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath)

    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100
    })

    task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: (url) => {

        const clip = {
          uid: this.user?.uid,
          displayName: this.user?.displayName,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url
        }
        console.log(clip)

        this.alertColor = 'green';
        this.alertMessage = 'Success! You clip is now ready to share with the world.';
        this.showPercentage = false;
      },
      error: (error) => {
        this.alertColor = 'red';
        this.alertMessage = 'Upload failed ! Please try again later (*and remember max size - 25mb) !';
        this.inSubmission = true;
        this.showPercentage = false;
        console.error(error)
      }
    })
  }
}
