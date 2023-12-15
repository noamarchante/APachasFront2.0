import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'lang'
})
export class LangPipe implements PipeTransform {

	private languages: Map<string, string> = new Map([
		["en", "english"],
		["es", "spanish"],
		["gl", "galician"]
	]);

	transform(lang: string): string {
		return this.languages.get(lang);
	}
}