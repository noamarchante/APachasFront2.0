import {Component, OnInit} from '@angular/core';
import {UserService} from "@services/user.service";
import {MUser} from "@models/MUser";
import {NotificationService} from "@modules/notification/services/notification.service";
import { TranslationService } from '@app/modules/translations/translation.service';


@Component({
    selector: 'app-retrievePasswordEmail',
    templateUrl: './retrievePasswordEmail.component.html',
    styleUrls: ['./retrievePasswordEmail.component.css']
})
export class RetrievePasswordEmailComponent implements OnInit {

    mUser: MUser= new MUser();
    title: string = this.translationService.translate('email.password.title');
    email: string = "";


    constructor(private userService: UserService,
                private notificationService: NotificationService,
                private translationService: TranslationService) {
    }

    ngOnInit() {
    }

    onSubmit(){
        this.mUser.userEmail = this.email;
        this.userService.sendRetrievePassword(this.mUser).subscribe(()=>{
            document.getElementById("closeButton").click();
            this.notificationService.info(this.translationService.translate('email.password.change.message'), 
            this.translationService.translate('email.password.change.title'));
            this.closeModal();
        });
    }

    closeModal(){
        this.email = "";
        this.mUser = new MUser();
    }
}