import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Sigv4Http } from './sigv4.service';

declare var AWS: any;
declare var aws_cloud_logic_custom;

let entryServiceFactory = (sigv4: Sigv4Http) => { return new EntryService(sigv4) }

@Injectable()
export class EntryService {

  private endpoint: string;

  private item: any;
  private isRegistered: boolean = false;
  private isConfirmed: boolean = false;

  constructor (private sigv4: Sigv4Http) {
    this.endpoint = aws_cloud_logic_custom.find(item => item.name == 'HctEntryAPI').endpoint;
  }

  get Item() {
    return this.item;
  }

  get IsRegistered() {
    return this.isRegistered;
  }

  get IsConfirmed() {
    return this.isConfirmed;
  }

  register(item:any): Observable<any> {
    this.item = item;
    return Observable.from(this.getCredentials()).map(creds => {
      return this.sigv4.post(this.endpoint, 'items', item, creds);
    }).concatAll().map(response => {
      this.isRegistered = true;
      return response.json().entry;
    });
  }

  confirm(id:string): Observable<any> {
    id = encodeURIComponent(id);
    return Observable.from(this.getCredentials()).map(creds => {
      return this.sigv4.put(this.endpoint, `items/${id}`, {}, creds);
    }).concatAll().map(response => {
      this.isConfirmed = true;
      return response.json().entry;
    });
  }

  private getCredentials(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        AWS.config.credentials.get((err) => {
          if (err) { return reject(err) }
          resolve(AWS.config.credentials)
        })
      } catch (e) { reject(e) }
    })
  }
}

export let EntryServiceProvider = {
  provide: EntryService,
  useFactory: entryServiceFactory,
  deps: [Sigv4Http]
}
