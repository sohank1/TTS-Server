import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {

  constructor(private _meta: Meta) {
    this._meta.updateTag({ property: 'og:description', content: 'Waiting for server...' });
    this._meta.addTag({ property: 'og:test', content: 'Meta Tag Test' });
  }
}
