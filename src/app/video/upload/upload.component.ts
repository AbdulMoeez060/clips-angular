import { Component } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { last, switchMap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { ClipService } from 'src/app/services/clip.service';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
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

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService
  ) {
    auth.user.subscribe((user) => (this.user = user));
  }

  uploadForm = new FormGroup({
    title: this.title,
  });

  storeFile($event: Event) {
    this.isDragOver = false;
    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

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

    const task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);
    task.percentageChanges().subscribe((progress) => {
      this.percentage = (progress as number) / 100;
    });

    task
      .snapshotChanges()
      .pipe(
        last(),
        switchMap(() => clipRef.getDownloadURL())
      )
      .subscribe({
        next: (url) => {
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value as string,
            fileName: `${clipFileName}.mp4`,
            url,
          };

          this.clipsService.createClip(clip);
          console.log(clip);

          this.alertColor = 'green';
          this.alertMsg = 'Success! Your clip is now ready to be shared!';
          this.showPerentage = false;
        },
        error: (err) => {
          this.uploadForm.enable();
          this.alertColor = 'red';
          this.alertMsg = 'Upload Failed! please try again later!';
          this.inSubmission = true;
          this.showPerentage = false;
          console.error(err);
        },
      });
  }
}
