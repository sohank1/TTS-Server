import { Injectable } from '@angular/core';
import { ContentService } from './content/content.service';
import { UserService } from './user/user.service';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(
    public user: UserService,
    public content: ContentService
  ) { }
}
