import { Component } from '@angular/core';
import AOS from 'aos';
import io from "socket.io-client";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'TTS-Client';

  constructor() {
    AOS.init({ duration: 750 })
    let scrollRef = 0;

    window.addEventListener('scroll', function () {
      // increase value up to 10, then refresh AOS
      scrollRef <= 10 ? scrollRef++ : AOS.refresh();
    });
  }

  ngOnInit() {
    const socket = io(environment.httpEndpoints.URL);
    console.log("got socket", socket)
    socket.emit("message", Math.random())
    socket.on("message", console.log)
  }
}
