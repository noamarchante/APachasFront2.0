import {Component, OnInit} from '@angular/core';
import { DarkModeService } from '@app/services/darkMode.service';
import {AuthenticationService} from '@services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loggedUser: string;
  darkMode= false;

  constructor(private authenticationService: AuthenticationService, private darkModeService: DarkModeService) {
  }

  ngOnInit() {

    this.darkModeService.darkMode$.subscribe((mode) => {
      this.darkMode = mode;
  });
    if (this.authenticationService.getUser().authenticated) {
      this.loggedUser = this.authenticationService.getUser().login;
    }
  }
}
