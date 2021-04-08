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
    AOS.init({ duration: 750 })
    if (document.readyState == 'complete') {
    AOS.refresh();
}
//     setTimeout(() => AOS.init({ duration: 750 }), 700);
    AOS.refreshHard()
  }
}
