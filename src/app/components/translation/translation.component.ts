import {Component, OnInit} from '@angular/core';
import { TranslationService } from '@app/modules/translations/translation.service';
import { AuthenticationService } from '@app/services/authentication.service';
import { DarkModeService } from '@app/services/darkMode.service';


@Component({
    selector: 'app-translation',
    templateUrl: './translation.component.html',
    styleUrls: ['./translation.component.css']
})

export class TranslationComponent implements OnInit {
    darkMode = false;
    constructor(private authenticationService: AuthenticationService,
        public translationService: TranslationService,
        private darkModeService: DarkModeService) { }

        ngOnInit(): void {
            this.darkModeService.darkMode$.subscribe((mode) => {
                this.darkMode = mode;
              });
        }

        public switchLang(lang: string) {
            this.translationService.useLanguage(lang);
            localStorage.setItem('language', lang);
            window.location.reload()
        }
}
