import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PermissionService {
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

        return this._httpClient.get(`${environment.baseUrl}/permissions`, {
            params,
        });
    }
}
