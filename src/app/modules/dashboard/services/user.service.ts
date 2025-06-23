import { Injectable } from '@angular/core';
import {
    UserPermission,
    UserRole,
    UserStore,
    UserUpdate,
} from '../models/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private _httpClient: HttpClient) {}

    list(page: number = 1, size: number = 10, search: string = '') {
        let params: any;

        if (search !== '') {
            params = new HttpParams()
                .set('page', page)
                .set('size', size)
                .set('search', search);
        } else {
            params = new HttpParams().set('page', page).set('size', size);
        }

        return this._httpClient.get(`${environment.baseUrl}/users`, { params });
    }

    store(userStore: FormData) {
        return this._httpClient.post<FormData>(
            `${environment.baseUrl}/users`,
            userStore
        );
    }

    show(id: number) {
        return this._httpClient.get(`${environment.baseUrl}/users/${id}`);
    }

    update(id: number, userUpdate: FormData) {
        return this._httpClient.put<FormData>(
            `${environment.baseUrl}/users/${id}`,
            userUpdate
        );
    }

    delete(id: number) {
        return this._httpClient.delete<number>(
            `${environment.baseUrl}/users/${id}`
        );
    }

    assignRoles(userRoles: UserRole) {
        return this._httpClient.post<UserRole>(
            `${environment.baseUrl}/users/assign-roles`,
            userRoles
        );
    }

    assignPermissions(userPermissions: UserPermission) {
        return this._httpClient.post<UserRole>(
            `${environment.baseUrl}/users/assign-permissions`,
            userPermissions
        );
    }
}
