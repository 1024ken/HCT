import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { EntryService } from '../../providers/entry.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public entryService: EntryService
  ) {

  }

  get isFinished(): boolean {
    return this.entryService.IsRegistered;
  }

  entry() {
    let modal = this.modalCtrl.create('EntryPage');
    modal.present();
  }

  inquiry() {
    this.navCtrl.push('InquiryPage');
  }
}
