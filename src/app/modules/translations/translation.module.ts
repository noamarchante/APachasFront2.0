import {APP_INITIALIZER, LOCALE_ID, ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';
import { TranslationService } from './translation.service';
import { TranslationServiceConfig } from '@modules/translations/translations-config.service';

@NgModule({
	declarations: [],
	imports: [CommonModule, HttpClientModule, TranslateModule.forChild()],
	exports: [TranslateModule]
})
export class TranslationModule {
	public static forRoot(config: any): ModuleWithProviders<TranslationModule> {
		return {
			ngModule: TranslationModule,
			providers: [
			{
				provide: APP_INITIALIZER,
				useFactory: initTranslationService,
				deps: [TranslationService],
				multi: true
			},
			TranslationService,
			{
				provide: LOCALE_ID,
				deps: [TranslationService],
				useFactory: (translationService: TranslationService) => translationService.getCurrentLocaleId()
			},
			{
				provide: TranslationServiceConfig,
				useValue: config
			}]
		};
	}
}

export function initTranslationService(service: TranslationService) {
	return () => service.initService();
}