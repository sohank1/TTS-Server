import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
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
  public progress;
  public showText = false;

  constructor(private _http: HttpService, private _httpClient: HttpClient) {
    this._http.user.getMe().then(u => this.user = u);
    this.fetchData().then(() => console.log(this.files))

    // setInterval(() => { this.progress++; console.log(this.progress) }, 40)
  }


  public async submitData() {
    const form = <HTMLFormElement>document.querySelector("form");

    this._httpClient.post(environment.httpEndpoints.CDN, new FormData(form), {
      reportProgress: true,
      observe: 'events'
    }).subscribe(r => {
      if (r.type === HttpEventType.Response) {
        console.log('Upload complete');
        this.fetchData();
        console.log(r);
      }

      if (r.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round(100 * r.loaded / r.total);
        this.progress = percentDone;
        console.log('Progress ' + percentDone + '%');
      }

    });
  }

  public handleClick(e: HTMLElementEventMap["click"]) {
    e.preventDefault();
    e.stopPropagation();
    this.submitData();
  }

  public dragOver(): void {
    this.showText = true;
  }

  public dragLeave(): void {
    this.showText = false;
  }

  public drop(e: HTMLElementEventMap["drop"]): void {
    e.preventDefault();
    this.showText = false;
    console.log(e)

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
