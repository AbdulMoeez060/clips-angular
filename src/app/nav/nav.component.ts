import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  providers:[]})
export class NavComponent implements OnInit {

  ngOnInit(): void {
      
  }

  constructor(public modal:ModalService){}

  openModal($event:Event){
    $event.preventDefault;
    this.modal.toggleModal("auth")

  }

}
