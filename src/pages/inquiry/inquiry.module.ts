import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { InquiryPage } from './inquiry';

@NgModule({
  declarations: [
    InquiryPage,
  ],
  imports: [
    IonicPageModule.forChild(InquiryPage)
  ],
  exports: [
    InquiryPage
  ]
})
export class InquiryPageModule {}
