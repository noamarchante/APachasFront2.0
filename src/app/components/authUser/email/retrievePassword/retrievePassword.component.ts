import {Component, OnInit} from "@angular/core";
import {MRetrievePassword} from "@models/MRetrievePassword";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "@services/user.service";
import { TranslationService } from "@app/modules/translations/translation.service";

@Component({
    selector: 'app-retrievePassword',
    templateUrl: './retrievePassword.component.html',
    styleUrls: ['./retrievePassword.component.css']
})
export class RetrievePasswordComponent implements OnInit{
    mRetrievePassword: MRetrievePassword = new MRetrievePassword();
    password = "";
    passwordConfirm = "";
    message = this.translationService.translate('email.password.error');
    messageColor = "messageColor";
    hidden: boolean = false;
    token: boolean = false;

    constructor(private router: Router,
                private userService: UserService,
                private activatedRoute: ActivatedRoute,
                private translationService: TranslationService) {
    }

    ngOnInit() {
        this.mRetrievePassword.userEmail = this.activatedRoute.snapshot.queryParams["email"];
        this.mRetrievePassword.tokenPassword = this.activatedRoute.snapshot.queryParams["token"];
        this.userService.getToken(this.mRetrievePassword.userEmail).subscribe((response) =>{
            if (!response){
                    this.token = false;
                    this.getMessage(false);
            }else{
                this.token = true;
            }
        });
    }

    retrievePassword(){
        if (this.token){
            if (this.password == this.passwordConfirm){
                this.mRetrievePassword.newPassword = this.password;
                this.userService.retrievePassword(this.mRetrievePassword).subscribe(() => {
                    this.getMessage(true);
                });
            }
        }else{
            this.getMessage(false);
        }
    }

    getMessage(goodRequest: boolean){
        this.hidden = true;
        if (goodRequest){
            this.messageColor = "";
            this.message = this.translationService.translate('email.passwors.success');
        }else{
            this.messageColor = "messageColor";
            this.message = this.translationService.translate('email.password.error');
        }
    }
}