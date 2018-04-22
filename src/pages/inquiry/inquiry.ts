import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-inquiry',
  templateUrl: 'inquiry.html'
})
export class InquiryPage {

  constructor(
    public viewCtrl: ViewController
  ) {

  }

  close() {
    this.viewCtrl.dismiss();
  }

}
