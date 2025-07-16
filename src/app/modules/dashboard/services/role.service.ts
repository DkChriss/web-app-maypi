import { Injectable } from '@angular/core';
import { RoleStore, RoleUpdate } from '../models/role';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class RoleService {
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

        return this._httpClient.get(`${environment.baseUrl}/roles`, {
            params,
        });
    }

    store(roleStore: RoleStore) {
        return this._httpClient.post<RoleStore>(
            `${environment.baseUrl}/roles`,
            roleStore
        );
    }

    show(id: number) {
        return this._httpClient.get(`${environment.baseUrl}/roles/${id}`);
    }

    update(id: number, roleUpdate: RoleUpdate) {
        return this._httpClient.put<RoleUpdate>(
            `${environment.baseUrl}/roles/${id}`,
            roleUpdate
        );
    }

    delete(id: number) {
        return this._httpClient.delete<number>(
            `${environment.baseUrl}/roles/${id}`
        );
    }
}
