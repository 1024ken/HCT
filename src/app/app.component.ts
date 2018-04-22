import { Component } from '@angular/core';
// ブラウザーサービスなので、スプラッシュは不要
//import { Platform } from 'ionic-angular';
//import { StatusBar } from '@ionic-native/status-bar';
//import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor() {
    if (location.hash == '#mail') {
      this.rootPage = 'MailPage';
    } else {
      this.rootPage = 'HomePage';
    }
    console.log('set page :', this.rootPage);
  }
  /*
  ブラウザーサービスなので、スプラッシュは不要
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }*/
}

