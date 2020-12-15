import { Component } from '@angular/core';
import { NavService } from 'src/app/components/nav/nav.service';
import { navLinks } from 'src/app/components/nav/nav-links';
import { User } from 'src/app/http/user/user.type';
import { HttpService } from 'src/app/http/http.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', './animation.scss']
})
export class HomeComponent {
  public user: User
  public links = navLinks;

  constructor(private navBarService: NavService, private _http: HttpService) {
    this._http.user.getMe().then(u => this.user = u);
  }

  public toggleDrawer(): void {
    this.navBarService.drawer.toggle();
  }

}


