/*
COMPONENT -> Bloque de código re-utilizable: CSS + HTML + TypeScript
 */
import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {AuthenticationService} from '@services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from "@modules/notification/services/notification.service";
import {UserService} from "@services/user.service";
import { TranslationService } from '@app/modules/translations/translation.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, AfterViewChecked {

  login: string;
  password: string;
  private return = '';

	constructor(private authenticationService: AuthenticationService,
				private userService: UserService,
				private route: ActivatedRoute,
				private router: Router,
				private notificationService: NotificationService,
				private translationService: TranslationService) {
	}

	ngOnInit() {
		this.route.queryParams
		  .subscribe(params => this.return = params['return'] || 'home');

	}

	logIn() {
		this.authenticationService.checkCredentials(this.login, this.password).subscribe(( s:any) =>{
			this.authenticationService.logIn(this.login, this.password, s.headers.get("Authorization"));
			this.router.navigate(['home']);
		});
	}


	ngAfterViewChecked(): void {
		if (localStorage.getItem("profile") != undefined){
			this.notificationService.success(this.translationService.translate('user.edit.success.title'), this.translationService.translate('user.edit.success.message'));
			localStorage.removeItem("profile");
		}
	}
}