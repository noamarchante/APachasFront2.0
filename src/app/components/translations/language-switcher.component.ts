import { Component } from '@angular/core';
import { LanguageService } from '@app/services/language.service';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})

export class LanguageSwitcherComponent {
  constructor(private languageService: LanguageService) {}

  switchLanguage(language: string): void {
    this.languageService.setLanguage(language);
  }
}