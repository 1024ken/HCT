import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-confirmation',
  templateUrl: 'confirmation.html'
})

export class ConfirmationPage {
  checks: boolean[];

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams
  ) {
    this.checks = params.get('checks');
  }

  get isApproval(): boolean {
    if (!this.checks) {
      return false;
    }
    return this.checks.findIndex(check => check == false) == -1;
  }

  next() {
    this.viewCtrl.dismiss(this.checks, 'next');
  }

  close() {
    this.viewCtrl.dismiss(this.checks, 'close');
  }
}
