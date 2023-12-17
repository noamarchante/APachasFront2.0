import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "@environments/environment";
import {APachasError} from "@modules/notification/entities";
import {MGroup} from "@models/MGroup";
import { TranslationService } from '@app/modules/translations/translation.service';

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    constructor(private http: HttpClient, private translationService: TranslationService) { }

    createGroup(mGroup: MGroup): Observable<number> {
        return this.http.post<number>(`${environment.restApi}/groups`,{
            "groupId":mGroup.groupId,
            "groupName": mGroup.groupName,
            "groupDescription": mGroup.groupDescription,
            "groupPhoto": mGroup.groupPhoto,
            "groupCreation":"",
            "groupRemoval": "",
            "groupOwner": mGroup.groupOwner,
            "groupActive": true
        })
            .pipe(
                APachasError.throwOnError(this.translationService.translate("create.fail"), this.translationService.translate("create.fail.message"))
            );
    }

    editGroup(mGroup: MGroup): Observable<void> {
        return this.http.put<void>(`${environment.restApi}/groups`,{
            "groupId":mGroup.groupId,
            "groupName": mGroup.groupName,
            "groupDescription": mGroup.groupDescription,
            "groupPhoto": mGroup.groupPhoto,
            "groupCreation":"",
            "groupRemoval": "",
            "groupOwner": mGroup.groupOwner,
            "groupActive": null
        })
            .pipe(
                APachasError.throwOnError(this.translationService.translate("edit.fail"), this.translationService.translate("edit.fail.message"))
            );
    }

    deleteGroup(groupId: number): Observable<void> {
        return this.http.delete<void>(`${environment.restApi}/groups/${groupId}`).pipe(
            APachasError.throwOnError(this.translationService.translate("delete.fail"), this.translationService.translate("close.fail.message"))
        );
    }
}
