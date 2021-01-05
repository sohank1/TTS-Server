import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { User } from 'src/app/http/user/user.type';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public user: User;
  public images = [];
  private isDoneFetching = false

  constructor(private _http: HttpService) {
    this._http.user.getMe().then(u => this.user = u);
  }

  public async ngOnInit() {
    await this.fetchData()
    document.getElementById('formId').addEventListener("submit", (e: HTMLElementEventMap["submit"]) => {

      fetch(environment.httpEndpoints.CDN, {
        method: "POST",
        //@ts-ignore
        body: new FormData(e.target)
      }).then(r => r.json().then((d) => {
        this.isDoneFetching = true;
        console.log(d)
      }))

      e.preventDefault();
    });

  }

  public async fetchData(shouldWait?: boolean): Promise<void> {
    const fetchData = async () => {
      const r = await fetch(environment.httpEndpoints.CDN)
      const d = await r.json();

      this.images = [];

      for (const i of d) {
        i.url = environment.httpEndpoints.CDN + i.path
        console.log(i)
        this.images.push(i);
      }

      this.images = this.images.reverse();
    }

    if (shouldWait) setInterval(() => {
      if (this.isDoneFetching) {
        fetchData();
        this.isDoneFetching = false;
      }
    }, 100)
    else fetchData()

  }

  // public async addImage(): Promise<void> {
  //   this.images.push()
  // }
}
