import { Component } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { User } from 'src/app/http/user/user.type';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public user: User;

  constructor(private _http: HttpService) {
    this._http.user.getMe().then(u => this.user = u);
  }
}
