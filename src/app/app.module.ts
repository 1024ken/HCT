import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Questionnaire } from '../providers/questionnaire';
import { EntryService, EntryServiceProvider } from '../providers/entry.service';
import { Sigv4Http, Sigv4HttpProvider } from '../providers/sigv4.service';

// ブラウザーサービスなので、スプラッシュは不要
//import { SplashScreen } from '@ionic-native/splash-screen';
//import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp, {
      backButtonIcon: "ios-arrow-back",
      backButtonText: " ",
      swipeBackEnabled: false,
      scrollAssist: false
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    //StatusBar,
    //SplashScreen,
    Questionnaire,
    EntryService, EntryServiceProvider,
    Sigv4Http, Sigv4HttpProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
