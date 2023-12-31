import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFireStorage, AngularFireUploadTask} from "@angular/fire/compat/storage";
import {v4 as uuid} from 'uuid'
import {combineLatest, forkJoin, last, switchMap} from "rxjs";
import firebase from "firebase/compat/app";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {ClipService} from "../../srevices/clip.service";
import {Router} from "@angular/router";
import {FfmpegService} from "../../srevices/ffmpeg.service";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {

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
  public task?: AngularFireUploadTask
  public screenshots: string[] = []
  public selectedScreenshot = ''
  public screenshotTask?: AngularFireUploadTask

  title = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])
  uploadForm = new FormGroup({
    title: this.title
  })

  constructor(private storage: AngularFireStorage,
              private auth: AngularFireAuth,
              private clipsService: ClipService,
              private router: Router,
              public ffmpegService: FfmpegService
  ) {
    auth.user.subscribe(user => this.user = user)
    this.ffmpegService.init()
  }

  ngOnDestroy(): void {
    this.task?.cancel()
  }

  async storeFile($event: Event) {

    if (this.ffmpegService.isRunning) {
      return
    }

    this.isDragover = false

    this.file = ($event as DragEvent).dataTransfer
      ? ($event as DragEvent).dataTransfer?.files.item(0) ?? null
      : ($event.target as HTMLInputElement).files?.item(0) ?? null
    if (!this.file || this.file.type !== 'video/mp4') {
      return
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file)

    this.selectedScreenshot = this.screenshots[0]

    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    )
    this.nextStep = true
  }

  public async uploadFile() {
    this.uploadForm.disable()

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait! Your clip is being uploaded.';
    this.inSubmission = true
    this.showPercentage = true

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    )
    const screenshotPath = `screenshot/${clipFileName}.png`

    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath)


    this.screenshotTask = this.storage.upload(
      screenshotPath, screenshotBlob
    )

    const screenshotRef = this.storage.ref(screenshotPath)

    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges()
    ]).subscribe((progress) => {
      const [clipProgress, screenshotProgress] = progress

      if (!clipProgress || !screenshotProgress) {
        return
      }
      const total = clipProgress + screenshotProgress

      this.percentage = total as number / 200
    })

    forkJoin([
      this.task.snapshotChanges(),
      this.screenshotTask.snapshotChanges()
    ]).pipe(
      switchMap(() => forkJoin([
        clipRef.getDownloadURL(),
        screenshotRef.getDownloadURL()
      ]))
    ).subscribe({
      next: async (urls) => {
        const [clipURL, screenshotURL] = urls

        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value as string,
          fileName: `${clipFileName}.mp4`,
          url: clipURL,
          screenshotURL,
          screenshotFileName: `${clipFileName}.png`,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }

        const clipDocRef = await this.clipsService.createClip(clip)
        console.log(clip)

        this.alertColor = 'green';
        this.alertMessage = 'Success! You clip is now ready to share with the world.';
        this.showPercentage = false;

        setTimeout(() => {
          this.router.navigate([
            'clip', clipDocRef.id
          ])
        }, 1000)

      },
      error: (error) => {
        this.uploadForm.enable()

        this.alertColor = 'red';
        this.alertMessage = 'Upload failed ! Please try again later (*and remember max size - 25mb) !';
        this.inSubmission = true;
        this.showPercentage = false;
        console.error(error)
      }
    })
  }
}
