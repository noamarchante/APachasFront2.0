import {inject, TestBed} from '@angular/core/testing';

import {NotificationService} from '@modules/notification/services/notification.service';

describe('NotificationService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [NotificationService]
		});
	});

	it('should be created', inject([NotificationService], (service: NotificationService) => {
		expect(service).toBeTruthy();
	}));
});