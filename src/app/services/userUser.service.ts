import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "@environments/environment";
import {APachasError} from "@modules/notification/entities";
import {User} from "@services/entities/User";
import {MUser} from "@models/MUser";
import {UserUser} from "@services/entities/UserUser";
import {MUserUser} from "@models/MUserUser";
import {map} from "rxjs/operators";
import { TranslationService } from '@app/modules/translations/translation.service';

@Injectable({
    providedIn: 'root'
})
export class UserUserService {

    constructor(private http: HttpClient, private translationService: TranslationService) { }

    getUserUser(friendId: number, userId: number): Observable<MUserUser> {
        return this.http.get<UserUser>(`${environment.restApi}/usersUsers/${friendId}/${userId}`).pipe(
            map(this.mapUserUser.bind(this))
        );
    }

    getNotifications(authId: number): Observable<string[]> {
        return this.http.get<string[]>(`${environment.restApi}/usersUsers/notifications/${authId}`);
    }

    getDeletedUserUser(friendId: number, userId: number): Observable<MUserUser> {
        return this.http.get<UserUser>(`${environment.restApi}/usersUsers/deleted/${friendId}/${userId}`).pipe(
            map(this.mapUserUser.bind(this))
        );
    }

    getFriends(userId: number): Observable<MUser[]> {
        return this.http.get<User[]>(`${environment.restApi}/usersUsers/${userId}`).pipe(
            map(users => users.map(this.mapUser.bind(this)))
        );
    }

    createUserUser(mUserUser: MUserUser): Observable<void> {
        return this.http.post<void>(`${environment.restApi}/usersUsers`,{
            "friendId":mUserUser.friendId,
            "userId": mUserUser.userId,
            "accept": false,
            "userUserCreation": "",
            "userUserRemoval": ""
        })
            .pipe(
                APachasError.throwOnError(this.translationService.translate("fail"), this.translationService.translate("close.fail.message"))
            );
    }

    editUserUser(mUserUser: MUserUser): Observable<void> {
        return this.http.put<void>(`${environment.restApi}/usersUsers`,{
            "friendId":mUserUser.friendId,
            "userId": mUserUser.userId,
            "accept": mUserUser.accept,
            "userUserActive": true,
            "userUserCreation": "",
            "userUserRemoval": ""
        })
            .pipe(
                APachasError.throwOnError(this.translationService.translate("fail"), this.translationService.translate("close.fail.message"))
            );
    }

    deleteUserUser(friendId: number, userId: number): Observable<void> {
        return this.http.delete<void>(`${environment.restApi}/usersUsers/${friendId}/${userId}`);
    }

    countMutualFriends(userId: number, authId: number): Observable<number>{
        return this.http.get<number>(`${environment.restApi}/usersUsers/count/mutual/${userId}/${authId}`);
    }

    getPageableMutualFriends(userId: number, authId: number, page: number, size: number): Observable<MUser[]>{
        return this.http.get<User[]>(`${environment.restApi}/usersUsers/pageable/mutual/${userId}/${authId}?page=${page}&size=${size}`).pipe(
            map(users => users.map(this.mapUser.bind(this)))
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

    private mapUserUser(userUser: UserUser) : MUserUser {
        if (userUser != null){
            return {
                userId: userUser.userId,
                friendId: userUser.friendId,
                userUserActive: userUser.userUserActive,
                userUserCreation: userUser.userUserCreation,
                userUserRemoval: userUser.userUserRemoval,
                accept: userUser.accept
            }
        }else{
            return null;
        }

    }
}
