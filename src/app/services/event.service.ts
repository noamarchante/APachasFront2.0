import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";
import {environment} from "@environments/environment";
import {MEvent} from "@models/MEvent";
import {APachasError} from "@modules/notification/entities";
import {Event} from "@services/entities/Event";
import {map} from "rxjs/operators";
import { TranslationService } from '@app/modules/translations/translation.service';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    constructor(private http: HttpClient, private translationService: TranslationService) { }

    createEvent(mEvent: MEvent): Observable<number> {
        return this.http.post<number>(`${environment.restApi}/events`,{
            "eventId": mEvent.eventId,
            "eventName":mEvent.eventName,
            "eventDescription":mEvent.eventDescription,
            "eventStart": mEvent.eventStart,
            "eventEnd": mEvent.eventEnd,
            "eventLocation":mEvent.eventLocation,
            "eventPhoto":mEvent.eventPhoto,
            "eventOpen": "",
            "eventOwner":mEvent.eventOwner,
            "eventActive": "",
            "eventCreation": "",
            "eventRemoval": ""
        })
            .pipe(
                APachasError.throwOnError(this.translationService.translate("create.fail"), this.translationService.translate("create.fail.message"))
            );
    }

    editEvent(mEvent: MEvent): Observable<void> {
        return this.http.put<void>(`${environment.restApi}/events`,{
            "eventId": mEvent.eventId,
            "eventName":mEvent.eventName,
            "eventDescription":mEvent.eventDescription,
            "eventStart": mEvent.eventStart,
            "eventEnd": mEvent.eventEnd,
            "eventLocation":mEvent.eventLocation,
            "eventPhoto":mEvent.eventPhoto,
            "eventOpen":mEvent.eventOpen,
            "eventOwner":mEvent.eventOwner,
            "eventActive": mEvent.eventActive,
            "eventCreation": "",
            "eventRemoval": ""
        })
            .pipe(
                APachasError.throwOnError(this.translationService.translate("edit.fail"), this.translationService.translate("edit.fail.message"))
            );
    }

    editOpen(eventId: number, open: boolean): Observable<void>{
        return this.http.put<void>(`${environment.restApi}/events/open/${eventId}`, open)
            .pipe(
                APachasError.throwOnError(this.translationService.translate("close.fail"), this.translationService.translate("close.fail.message"))
            );
    }

    deleteEvent(eventId: number): Observable<void> {
        return this.http.delete<void>(`${environment.restApi}/events/${eventId}`).pipe(
            APachasError.throwOnError(this.translationService.translate("delete.fail"), this.translationService.translate("close.fail.message"))
        );
    }

    getEvent(eventId: number):Observable<MEvent>{
        return this.http.get<Event>(`${environment.restApi}/events/${eventId}`).pipe(
            map(this.mapEvent.bind(this))
        );
    }

    private mapEvent(event: Event) : MEvent {
        return {
            eventId: event.eventId,
            eventName:event.eventName,
            eventDescription:event.eventDescription,
            eventStart: event.eventStart,
            eventEnd: event.eventEnd,
            eventLocation:event.eventLocation,
            eventPhoto:event.eventPhoto,
            eventOpen:event.eventOpen,
            eventOwner:event.eventOwner,
            eventActive: event.eventActive,
            eventCreation: event.eventCreation,
            eventRemoval: event.eventRemoval
        }
    }
}