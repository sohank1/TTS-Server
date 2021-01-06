import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { User } from 'src/app/http/user/user.type';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public user: User;
  public files: { url: string; path: string; }[] = [];
  public showText = false;

  constructor(private _http: HttpService) {
    this._http.user.getMe().then(u => this.user = u);
    this.fetchData().then(() => console.log(this.files))
  }


  public async handleSubmit(e: HTMLElementEventMap["submit"]) {
    e.preventDefault();
    fetch(environment.httpEndpoints.CDN, {
      method: "POST",
      //@ts-ignore
      body: new FormData(e.target)
    }).then(r => r.json().then(() => this.fetchData()))

    e.preventDefault();
  }

  public handleClick() {
    (<HTMLFormElement>document.querySelector("form")).submit();
  }

  public dragOver(): void {
    this.showText = true;
  }

  public dragLeave(): void {
    this.showText = false;
  }

  public drop(e: HTMLElementEventMap["drop"]): void {
    this.showText = false;
    console.log(e)
    e.preventDefault();
    // https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
    const arr = Array.from(e.dataTransfer.files);
    for (const el of arr) {
      const img = document.createElement("img")
      img.src = URL.createObjectURL(el);
      document.querySelector("div").appendChild(img);
    }



  }

  public async fetchData(): Promise<void> {
    const r = await fetch(environment.httpEndpoints.CDN)
    const d = await r.json();

    this.files = [];

    for (const i of d) {
      i.url = environment.httpEndpoints.CDN + i.path
      this.files.push(i);
    }

    this.files = this.files.reverse();
  }

  public getFileType(url: string): string {
    const imgExtensions = ["png", "jpg", "jpeg"];
    const vidExtensions = ["mp4", "avi", "mov"];
    const audioExtensions = ["mp3", "wav"];

    if (imgExtensions.some(e => url.endsWith(e))) return "img";
    if (vidExtensions.some(e => url.endsWith(e))) return "vid";
    if (audioExtensions.some(e => url.endsWith(e))) return "audio";
  }

}
