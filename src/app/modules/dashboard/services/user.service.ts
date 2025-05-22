import { Injectable } from '@angular/core';
import { UserStore, UserUpdate } from '../models/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(
        private _httpClient: HttpClient
    ) { }

    list(page: number = 1, size: number = 10) {
        const params = new HttpParams()
            .set("page", page)
            .set("size", size)

        return this._httpClient.get(
            `${environment.baseUrl}/users`,
            { params }
        )
    }

    store(userStore: UserStore) {
        return this._httpClient.post<UserStore>(
            `${environment.baseUrl}/users`,
            userStore
        )
    }

    show(id: number) {
        return this._httpClient.get(
            `${environment.baseUrl}/users/${id}`
        )
    }

    update(id: number, userUpdate: UserUpdate) {
        return this._httpClient.put<UserUpdate>(
            `${environment.baseUrl}/users/${id}`,
            userUpdate
        )
    }

    delete(id: number) {
        return this._httpClient.delete<number>(
            `${environment.baseUrl}/users/${id}`
        )
    }
}
