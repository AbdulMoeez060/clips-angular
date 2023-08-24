import { Component, OnDestroy } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { last, switchMap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { combineLatest, forkJoin } from 'rxjs';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  title = new FormControl('', [Validators.required, Validators.minLength(3)]);
  isDragOver = false;
  file: File | null = null;
  showAlert = false;
  nextStep = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Your Clip is being uploaded!';
  inSubmission = false;
  percentage = 0;
  showPerentage = false;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;
  screenshots: string[] = [];
  selectedScreenshot = '';
  screenshotTask?: AngularFireUploadTask;

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    auth.user.subscribe((user) => (this.user = user));
    this.ffmpegService.init();
  }

  uploadForm = new FormGroup({
    title: this.title,
  });

  async storeFile($event: Event) {
    if (this.ffmpegService.isRunning) {
      return;
    }
    this.isDragOver = false;
    this.file = ($event as DragEvent).dataTransfer
      ? ($event as DragEvent).dataTransfer?.files.item(0) ?? null
      : ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file);
    this.selectedScreenshot = this.screenshots[0];

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nextStep = true;

    console.log(this.file);
  }

  async uploadFile() {
    this.uploadForm.disable();
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your Clip is being uploaded!';
    this.inSubmission = true;
    this.showPerentage = true;
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    const screenshotBlob = await this.ffmpegService.blobFromUrl(
      this.selectedScreenshot
    );

    const screenshotPath = `screenshots/${clipFileName}.png`;

    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);
    const screenshotRef = this.storage.ref(screenshotPath);

    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob);
    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges(),
    ]).subscribe((progress) => {
      const [clipProgress, screenshotProgress] = progress;
      if (!clipProgress || !screenshotProgress) {
        return;
      }
      const total = screenshotProgress + clipProgress;
      this.percentage = (total as number) / 200;
    });

    forkJoin([
      this.task.snapshotChanges(),
      this.screenshotTask.snapshotChanges(),
    ])
      .pipe(
        switchMap(() =>
          forkJoin([clipRef.getDownloadURL(), screenshotRef.getDownloadURL()])
        )
      )
      .subscribe({
        next: async (url) => {
          const [clipUrl, screenshotUrl] = url;
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value as string,
            fileName: `${clipFileName}.mp4`,
            url: clipUrl,
            screenshotUrl,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            screenshotFileName: `${clipFileName}.png`,
          };

          const clipDocRef = await this.clipsService.createClip(clip);
          console.log(clip);

          this.alertColor = 'green';
          this.alertMsg = 'Success! Your clip is now ready to be shared!';
          this.showPerentage = false;

          setTimeout(() => {
            this.router.navigate(['clip', clipDocRef.id]);
          }, 1000);
        },
        error: (err) => {
          this.uploadForm.enable();
          this.alertColor = 'red';
          this.alertMsg = 'Upload Failed! please try again later!';
          this.inSubmission = false;
          this.showPerentage = false;
          setTimeout(() => {
            this.showAlert = false;
            this.nextStep = false;
          }, 1000);
          console.error(err);
        },
      });
  }
  ngOnDestroy(): void {
    this.task?.cancel();
  }
}
