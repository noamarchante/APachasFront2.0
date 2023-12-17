import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "@environments/environment";
import {APachasError} from "@modules/notification/entities";
import {MUser} from "@models/MUser";
import {User} from "@services/entities/User";
import {map} from "rxjs/operators";
import {MGroup} from "@models/MGroup";
import {Group} from "@services/entities/Group";
import { TranslationService } from '@app/modules/translations/translation.service';

@Injectable({
    providedIn: 'root'
})
export class GroupUserService {

    constructor(private http: HttpClient, private translationService: TranslationService) { }

    getPageableMembers(groupId: number, page:number, size: number): Observable<MUser[]>{
        return this.http.get<User[]>(`${environment.restApi}/groupsUsers/pageable/members/${groupId}?page=${page}&size=${size}`).pipe(
            map(users => users.map(this.mapUser.bind(this)))
        );
    }

    getMembers(groupId: number): Observable<MUser[]>{
        return this.http.get<User[]>(`${environment.restApi}/groupsUsers/${groupId}`).pipe(
            map(users => users.map(this.mapUser.bind(this)))
        );
    }

    countMembers(groupId: number): Observable<number>{
        return this.http.get<number>(`${environment.restApi}/groupsUsers/count/members/${groupId}`).pipe(
            APachasError.throwOnError(this.translationService.translate("fail"), this.translationService.translate("close.fail.message"))
        );
    }

    createGroupUser(groupId: any, userId: number): Observable<void> {
        return this.http.post<void>(`${environment.restApi}/groupsUsers`,{
            "groupId":groupId,
            "userId": userId,
            "groupUserCreation": "",
            "groupUserRemoval": "",
            "groupUserActive": true
        })
            .pipe(
                APachasError.throwOnError(this.translationService.translate("fail.members"), this.translationService.translate("close.fail.message"))
            );
    }

    editGroupUser(groupId: number, userIds: number[]): Observable<void> {
        return this.http.put<void>(`${environment.restApi}/groupsUsers/${groupId}`,userIds)
            .pipe(
                APachasError.throwOnError(this.translationService.translate("edit.fail"), this.translationService.translate("edit.fail.message"))
            );
    }

    deleteGroupUser(groupId: number, userId: number): Observable<void> {
        return this.http.delete<void>(`${environment.restApi}/groupsUsers/${groupId}/${userId}`).pipe(
            APachasError.throwOnError(this.translationService.translate("delete.fail"), this.translationService.translate("close.fail.message"))
        );
    }

    getPageableSearchGroups(groupName: string, authId: number, page: number, size: number): Observable<MGroup[]>{
        return this.http.get<Group[]>(`${environment.restApi}/groupsUsers/pageable/${groupName}/${authId}?page=${page}&size=${size}`).pipe(
            map(groups => groups.map(this.mapGroup.bind(this)))
        );
    }

    countSearchGroups(groupName: string, authId: number): Observable<number> {
        return this.http.get<number>(`${environment.restApi}/groupsUsers/count/${authId}/${groupName}`);
    }

    countGroups(authId: number): Observable<number>{
        return this.http.get<number>(`${environment.restApi}/groupsUsers/count/${authId}`);
    }

    getPageableGroups(groupId: number, page: number, size: number): Observable<MGroup[]> {
        return this.http.get<Group[]>(`${environment.restApi}/groupsUsers/pageable/${groupId}?page=${page}&size=${size}`).pipe(
            map(groups => groups.map(this.mapGroup.bind(this)))
        );
    }

    countMutualGroups(userId: number, authId: number): Observable<number>{
        return this.http.get<number>(`${environment.restApi}/groupsUsers/count/mutual/${userId}/${authId}`);
    }

    getPageableMutualGroups(userId: number, authId: number, page: number, size: number): Observable<MGroup[]>{
        return this.http.get<Group[]>(`${environment.restApi}/groupsUsers/pageable/mutual/${userId}/${authId}?page=${page}&size=${size}`).pipe(
            map(groups => groups.map(this.mapGroup.bind(this)))
        );
    }

    getGroups(authId: number): Observable<MGroup[]>{
        return this.http.get<Group[]>(`${environment.restApi}/groupsUsers/groups/${authId}`).pipe(
            map(groups => groups.map(this.mapGroup.bind(this)))
        );
    }

    private mapUser(user: User) : MUser {
        return {
            userId: user.userId,
            userName: user.userName,
            userSurname: user.userSurname,
            userLogin: user.userLogin,
            userPassword: user.userPassword,
            userEmail: user.userEmail,
            userBirthday: user.userBirthday,
            userPhoto: user.userPhoto,
            roles: user.roles,
            permissions: user.permissions,
            userCreation: user.userCreation,
            userRemoval: user.userRemoval,
            userActive: user.userActive,
            userNotify: user.userNotify
        }
    }

    private mapGroup(group: Group) : MGroup {
        return {
            groupId: group.groupId,
            groupName: group.groupName,
            groupDescription: group.groupDescription,
            groupPhoto: group.groupPhoto,
            groupCreation: group.groupCreation,
            groupRemoval: group.groupRemoval,
            groupOwner: group.groupOwner,
            groupActive: group.groupActive
        }
    }
}
