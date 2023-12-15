import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from "@services/user.service";
import {MUser} from "@models/MUser";
import {NotificationService} from "@modules/notification/services/notification.service";
import { TranslationService } from '@app/modules/translations/translation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  private mUser: MUser = new MUser();
  name = "";
  surname = "";
  login = "";
  password = "";
  passwordConfirm = "";
  email = "";
  available: boolean = true;
  private return = 'login';

  constructor(private router: Router,
              private userService: UserService,
              private notificationService: NotificationService,
              private translationService: TranslationService) {
  }
  ngOnInit() {}
  onCreate(){
    this.mUser.userLogin = this.login;
    this.mUser.userPassword = this.password;
    this.mUser.userName = this.name;
    this.mUser.userEmail = this.email;
    this.mUser.userSurname = this.surname;
    if(this.password == this.passwordConfirm) {
      this.userService.createUser(this.mUser).subscribe(()=>{
        this.notificationService.info(
          this.translationService.translate('register.create.message'),
          this.translationService.translate('register.create.title')
        );
      });
    }
  }

  loginAvailable(){
    this.userService.loginAvailable(this.login).subscribe((response) => {
      if (!response) {
        this.available = false;
      }else{
        this.available = true;
      }
    });
  }
}
