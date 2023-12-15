import {AfterViewChecked, Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {NotificationService} from "@modules/notification/services/notification.service";
import {AuthenticationService} from "@services/authentication.service";
import {AuthUser} from "@models/AuthUser";
import {UserService} from "@services/user.service";
import {Router} from "@angular/router";
import {TranslationService} from '@modules/translations/translation.service';
import { DarkModeService } from '@app/services/darkMode.service';


@Component({
    selector: 'app-editProfile',
    templateUrl: './editProfile.component.html',
    styleUrls: ['./editProfile.component.css']
})
export class EditProfileComponent implements OnInit, AfterViewChecked {
    defaultImage = "assets/user16.jpg";
    imageFormat: boolean;
    imageColor:string="";
    imageText: string;
    title: string = this.translationService.translate('user.edit.title');
    _authUser: AuthUser;
    birthday: Date;
    password = "";
    newPassword = "";
    passwordConfirm = "";
    login = "";
    available: boolean = true;

    darkMode = false;

    public options: any = {
        autoApply: false,
        alwaysShowCalendars: true,
        applyButtonClasses: "btn-primary applyDate",
        buttonClasses: "btn btn-sm",
        cancelClass: "btn-default cancelDate",
        drops: "up",
        locale: {
            format: 'DD/MM/yyyy',
            "firstDay": 1,
            daysOfWeek: [
                this.translationService.translate('calendar.week.sunday'),
                this.translationService.translate('calendar.week.monday'),
                this.translationService.translate('calendar.week.tuesday'),
                this.translationService.translate('calendar.week.wednesday'),
                this.translationService.translate('calendar.week.thursday'),
                this.translationService.translate('calendar.week.friday'),
                this.translationService.translate('calendar.week.saturday'),
            ],
            monthNames: [
                this.translationService.translate('calendar.month.january'),
                this.translationService.translate('calendar.month.february'),
                this.translationService.translate('calendar.month.march'),
                this.translationService.translate('calendar.month.april'),
                this.translationService.translate('calendar.month.may'),
                this.translationService.translate('calendar.month.june'),
                this.translationService.translate('calendar.month.july'),
                this.translationService.translate('calendar.month.august'),
                this.translationService.translate('calendar.month.september'),
                this.translationService.translate('calendar.month.october'),
                this.translationService.translate('calendar.month.november'),
                this.translationService.translate('calendar.month.december'),
            ]
        },
        minDate: undefined,
        maxDate: new Date(),
        opens: 'left',
        showDropdowns: true,
        timePicker: false,
        singleDatePicker: true
    };


    constructor(private sanitizer: DomSanitizer,
                private translationService: TranslationService,
                private authenticationService: AuthenticationService,
                private userService: UserService,
                private router: Router,
                private notificationService: NotificationService,
                private darkModeService: DarkModeService
    ) {
    }

    ngOnInit() {
        this.darkModeService.darkMode$.subscribe((mode) => {
            this.darkMode = mode;
        });
    }

    get authUser(){
        return this._authUser;
    }

    @Input() set authUser(authUser: AuthUser){
        if (authUser.id != undefined){
            this._authUser = authUser;
            if (this.authUser.birthday != null){
                this.birthday = new Date(this.authUser.birthday);
            }else{
                this.birthday = null;
            }
            this.login = authUser.login;
        }else{
            this._authUser = new AuthUser();
            this.birthday = null;
        }
    }

    setNotify(){
        this.authUser.notify = !this.authUser.notify;
    }

    ngAfterViewChecked() {
        document.getElementsByClassName("applyDate")[0].textContent = this.translationService.translate('save');
        document.getElementsByClassName("cancelDate")[0].textContent = this.translationService.translate('cancel');
    }

    public applyDate(): void {
        this.authUser.birthday= new Date(this.birthday.valueOf()).toJSON().replace("T", " ").replace("Z", "");
    }

    public selectedDate(value: any): void {
        this.birthday = new Date(value.start);
    }

    public cancelDate(): void {
        this.birthday = undefined;
    }

    onEdit(){
        if (this.correctPassword()){
            this.authUser.login = this.login;
            this.userService.editUser(this.authUser).subscribe(() => {
                this.closeModal();
                document.getElementById("closeButton").click();
                localStorage.setItem("profile", JSON.stringify(true));
                this.authenticationService.logOut();
                this.router.navigate(["login"]);
            });
        }
    }

    getImage(event): any {
        const file = event.target.files[0];
        if (this.imageFormatTest(file)){
            this.getBase64(file).then((image: any) => {
                this.authUser.photo = image.base;
            });
            this.imageFormat = true;
        }else{
            this.imageFormat = false;
        }
    }

    correctPassword(): boolean{
        if(this.password != "" && this.password != null) {
            if (this.password == this.authUser.password) {
                if (this.newPassword == this.passwordConfirm && this.newPassword != "" && this.newPassword != null && this.passwordConfirm != "" && this.passwordConfirm != null) {
                    this.authUser.password = this.newPassword;
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }else{
            return true;
        }
    }

    closeModal(){
        this.imageFormat = null;
        this.authUser = new AuthUser();
        this.cancelDate();
        this.password = "";
        this.newPassword = "";
        this.passwordConfirm = "";
    }

    changeStyle($event){
        if ($event.type == "mouseover"){
            this.imageColor = "imageColor";
            this.imageText = "imageText";
        }else{
            this.imageColor = "";
            this.imageText= "";
        }
    }

    private imageFormatTest(file:any): boolean{
        if(file.type.toString() == "image/jpeg" || file.type.toString() == "image/png"){
            return true;
        }
        return false;
    }

    private getBase64 = async ($event: any) => new Promise((resolve, reject) => {
        try {
            const unsafeImg = window.URL.createObjectURL($event);
            const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
            const reader = new FileReader();
            reader.readAsDataURL($event);

            reader.onload = () => {
                resolve({
                    blob: $event,
                    image,
                    base: reader.result
                });
            };
            reader.onerror = error => {
                resolve({
                    blob: $event.blob,
                    image,
                    base: null
                });
            };
        } catch (e) {
            return null;
        }
    });

}