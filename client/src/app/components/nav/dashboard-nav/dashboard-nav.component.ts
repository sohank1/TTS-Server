import { Component, Input } from '@angular/core';
import { User } from 'src/app/http/user/user.type';
import { NavService } from '../nav.service';

@Component({
  selector: 'app-dashboard-nav',
  templateUrl: './dashboard-nav.component.html',
  styleUrls: ['./dashboard-nav.component.scss',]
})
export class DashboardNavComponent {
  @Input()
  public user: User;

  constructor(public navBarService: NavService) { }

  public toggleDrawer(): void {
    this.navBarService.drawer.toggle();
  }

}
