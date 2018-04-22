import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, ViewController, Slides } from 'ionic-angular';
import { AlertController, LoadingController } from 'ionic-angular';
import { Questionnaire } from '../../providers/questionnaire';
import { EntryService } from '../../providers/entry.service';

@IonicPage()
@Component({
  selector: 'page-entry',
  templateUrl: 'entry.html'
})

export class EntryPage {

  static readonly titles: Array<string> = [
    '<span class="app-name">レジトレ！</span>とは',
    '<span class="app-name">レジトレ！</span>とは',
    '<span class="app-name">レジトレ！</span>とは',
    '<span class="app-name">レジトレ！</span>とは',
    'アプリの目的',
    '利用するには？',
    '期間と謝金',
    '説明会のご案内',
    'アンケート',
    '参加希望の方へ',
    '連絡先の登録',
    '登録完了の確認',
    '',
  ];

  static readonly ASSESSMENT_SLIDE_NO = 8;
  static readonly CONFIRMATION_SLIDE_NO = 9;
  static readonly REGISTRATION_SLIDE_NO = 10;
  static readonly MAIL_CHECK_SLIDE_NO = 11;
  static readonly FINISH_SLIDE_NO = 12;

  status: string;
  confirmationChecks: boolean[] = [false, false, false];

  email: string = '';
  phoneNumber: string = '';

  @ViewChild('slides') slides: Slides;

  constructor(
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public questionnaire: Questionnaire,
    public entryService: EntryService
  ) {
    if (this.entryService.IsRegistered) {
      this.status = "finish";
      let item = this.entryService.Item;
      this.email = item.email;
      this.phoneNumber = item.phoneNumber;
    } else if (this.questionnaire.IsFinished) {
      this.status = "confirmation";
    } else {
      this.status = "guide";
    }
  }

  get title(): string {
    let index = this.slides.getActiveIndex();
    if (EntryPage.titles.length <= index) {
      index = EntryPage.titles.length - 1;
    }
    return EntryPage.titles[index];
  }

  get isApproval(): boolean {
    if (!this.confirmationChecks) {
      return false;
    }
    return this.confirmationChecks.findIndex(check => check == false) == -1;
  }

  get isMailCheck(): boolean {
    return this.status == 'mailCheck';
  }

  get isFinished(): boolean {
    return this.status == 'finish';
  }

  onSlideDidChange(slides: Slides) {
    if (this.status == "guide") {
      if (this.slides.getActiveIndex() < EntryPage.ASSESSMENT_SLIDE_NO) {
        this.slides.lockSwipeToNext(false);
      } else {
        this.slides.lockSwipeToNext(true);
      }
    } else if (this.status == "confirmation") {
      if (this.slides.getActiveIndex() < EntryPage.CONFIRMATION_SLIDE_NO) {
        this.slides.lockSwipeToNext(false);
      } else {
        this.slides.lockSwipeToNext(true);
      }
    } else if (this.status == "register") {
      if (this.slides.getActiveIndex() < EntryPage.REGISTRATION_SLIDE_NO) {
        this.slides.lockSwipeToNext(false);
      } else {
        this.slides.lockSwipeToNext(true);
      }
    } else if (this.status == "mailCheck") {
      if (this.slides.getActiveIndex() < EntryPage.MAIL_CHECK_SLIDE_NO) {
        this.slides.lockSwipeToNext(false);
      } else {
        this.slides.lockSwipeToNext(true);
      }
    }
  }

  ionViewWillEnter() {
  }

  ionViewDidEnter() {
    let bullets: HTMLElement[] = this.slides._bullets;
    bullets.forEach(bullet => {
      let index: number = parseInt(bullet.getAttribute('data-slide-index'), 10);
      if (index > EntryPage.ASSESSMENT_SLIDE_NO) {
        bullet.onclick = (event: Event)=>{
          event.stopPropagation();
          return false;
        };
      }
    });
  }

  ionViewDidLeave() {
  }

  doAssessment() {
    let modal = this.modalCtrl.create('AssessmentPage');
    modal.onDidDismiss(data => {
      if (this.status == "guide") {
        this._nextPage('confirmation');
      }
    });
    modal.present();
  }

  confirm() {
    let modal = this.modalCtrl.create('ConfirmationPage', { 'checks' : this.confirmationChecks });
    modal.onDidDismiss((data, role) => {
      this.confirmationChecks = data;
      if (role == 'next' && this.isApproval) {
        this._nextPage('register');
      } else if (!this.isApproval) {
        this._lockPage('confirmation');
      }
    });
    modal.present();
  }

  register() {
    if (!this.email.match(/^[A-Za-z0-9]+[\w-]+@[\w\.-]+\.\w{2,}$/)) {
      return this._alert('メールアドレスが不正です');
    }

    if (this.phoneNumber) {
      let phoneNumber = this.phoneNumber.replace(/[━.*‐.*―.*－.*\-.*ー.*\-]/gi,'');
      if (!phoneNumber.match(/^(0[5-9]0[0-9]{8}|0[1-9][1-9][0-9]{7})$/)) {
        return this._alert('固定電話10桁〜携帯電話11桁の数値を入力してください');
      }
    }

    let questionnaireResult;
    try {
      questionnaireResult = this.questionnaire.ResultJson;
    } catch(err) {
      console.log(err);
      return this._alert('回答が不正です');
    }

    let loading = this.loadingCtrl.create({
      content: '処理中...'
    });
    loading.present();

    let item = {
      email: this.email,
      phoneNumber: this.phoneNumber
    };
    item = Object.assign(item, questionnaireResult);
    this.entryService.register(item).subscribe((item) => {
      loading.dismiss();
      this._nextPage('mailCheck');
    }, (errorResponse) => {
      let error = errorResponse.json().error;
      console.log("error : ", error);
      
      loading.dismiss();

      this._alert('登録に失敗しました');
    });
  }

  finish() {
    this._nextPage('finish');
  }

  _alert(message:string) {
    let alert = this.alertCtrl.create({
      message: message,
      buttons: [ 'OK' ]
    });
    alert.present();
  }

  _nextPage(status) {
    this.status = status;
    this.slides.lockSwipeToNext(false);
    this.slides.slideNext();
  }

  _lockPage(status) {
    this.status = status;
    this.slides.lockSwipeToNext(true);
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
