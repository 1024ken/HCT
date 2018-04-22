import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { EntryService } from '../../providers/entry.service';

@IonicPage()
@Component({
  selector: 'page-mail',
  templateUrl: 'mail.html'
})
export class MailPage {

  status:string = 'progress';

  constructor(
    private entryService: EntryService
  ) {
    if (!location.search) {
      this.status = 'failed';
      return;
    }

    let params:any = location.search.substring(1).split('&').reduce((value, param) => {
      let kv = param.split('=');
      value[kv[0]] = kv[1];
      return value;
    }, {});
    let entryId = params.id;
    if (!entryId) {
      this.status = 'failed';
      return;
    }

    this.entryService.confirm(entryId).subscribe((item) => {
      console.log('confirm ', item);
      this.status = 'succeed';
    }, (errorResponse) => {
      console.log("error : ", errorResponse);
      this.status = 'failed';
    });
  }
}
