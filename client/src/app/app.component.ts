import { Component } from '@angular/core';
import AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'TTS-Client';

  constructor() {
    setInterval(() => AOS.init({ duration: 750 }), 1);
  }
}
