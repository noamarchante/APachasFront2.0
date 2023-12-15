import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "@services/user.service";
import {MVerifyEmail} from "@models/MVerifyEmail";
import { TranslationService } from "@app/modules/translations/translation.service";
@Component({
    selector: 'app-verifyEmail',
    templateUrl: './verifyEmail.component.html',
    styleUrls: ['./verifyEmail.component.css']
})
export class VerifyEmailComponent implements OnInit{

    mVerifyEmail: MVerifyEmail = new MVerifyEmail();

    message = this.translationService.translate('email.error');
    messageColor = "messageColor";

    constructor(private router: Router,
                private userService: UserService,
                private activatedRoute: ActivatedRoute,
                private translationService: TranslationService) {
    }

    ngOnInit() {
        this.mVerifyEmail.userEmail = this.activatedRoute.snapshot.queryParams["email"];
        this.mVerifyEmail.tokenPassword = this.activatedRoute.snapshot.queryParams["token"];
        this.userService.getToken(this.mVerifyEmail.userEmail).subscribe((response) =>{
            if (response){
                this.verifyEmail();
            }else{
                this.getMessage(false);
            }
        });
    }

    verifyEmail(){
        this.userService.verifyUser(this.mVerifyEmail).subscribe(()=>{
            this.getMessage(true);
        });
    }

    private getMessage(goodRequest: boolean){
        if (goodRequest){
            this.message = this.translationService.translate('email.success');
            this.messageColor = "";
        }else{
            this.message = this.translationService.translate('email.error');
            this.messageColor = "messageColor";
        }
    }

}