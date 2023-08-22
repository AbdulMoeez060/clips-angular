import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  inSubmission = false;
  showAlert = false;
  alertMsg = 'Please wait! Updating Clip';
  alertColor = 'blue';

  @Output() update = new EventEmitter();

  clipID = new FormControl('');

  title = new FormControl('', [Validators.required, Validators.minLength(3)]);

  editForm = new FormGroup({
    title: this.title,
    id: this.clipID,
  });

  constructor(private modal: ModalService, private clip: ClipService) {}

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.activeClip) {
      return;
    }
    this.inSubmission = false;
    this.showAlert = false;
    this.clipID.setValue(this.activeClip.docID as string);
    this.title.setValue(this.activeClip.title);
  }

  async submit() {
    if (!this.activeClip) {
      return;
    }
    this.inSubmission = true;
    this.showAlert = true;
    this.alertMsg = 'Please wait! Updating Clip';
    this.alertColor = 'blue';
    try {
      await this.clip.updateClip(
        this.clipID.value as string,
        this.title.value as string
      );
    } catch (error) {
      this.inSubmission = false;
      this.alertMsg = 'Something went wrong! Please try again later!';
      this.alertColor = 'red';
      return;
    }

    this.activeClip.title = this.title.value as string;

    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.showAlert = true;
    this.alertMsg = 'Success!';
    this.alertColor = 'green';
  }
}
