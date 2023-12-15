import {Injectable, Optional, SkipSelf} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { TranslationServiceConfig } from '@modules/translations/translations-config.service';

/**
 * Class representing the translation service.
 */
@Injectable()
export class TranslationService {
	private _localeId: string = 'es';
	private _localeIds: string[];

	constructor(
		@Optional() @SkipSelf() private singleton: TranslationService,
		private config: TranslationServiceConfig,
		private translateService: TranslateService
	) {
		if (this.singleton) {
			throw new Error(
				'TranslationService is already provided by the root module'
			);
		}
		this._localeId = this.config.locale_id;
		this._localeIds = ["en", "es", "gl"];
	}

	public initService(): Promise<void> {
		this._localeId = localStorage.getItem('language') || 'es';
		return this.useLanguage(this._localeId);
	}

	public getCurrentLocaleId(): string {
		return this.translateService.getDefaultLang();
	}

	public getLocaleIds(): string[] {
		return this._localeIds;
	}

	public useLanguage(lang: string): Promise<void> {
		this.translateService.setDefaultLang(lang);
		return this.translateService
				.use(lang)
				.toPromise()
				.catch(() => {
					throw new Error('TranslationService.init failed');
				});
	}

	public translate(key: string | string[], interpolateParams?: object): string {
		return this.translateService.instant(key, interpolateParams) as string;
	}
}