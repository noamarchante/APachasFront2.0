import {Severity} from '@modules/notification/entities/severity.model';

export interface ErrorMessage {
	severity: Severity;
	summary: string;
	detail: string;
}