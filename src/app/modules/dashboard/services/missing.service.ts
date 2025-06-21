import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { MissingStore, MissingUpdate } from '../models/missing';

@Injectable({
    providedIn: 'root',
})
export class MissingService {
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

        return this._httpClient.get(`${environment.baseUrl}/missing`, {
            params,
        });
    }

    store(missingStore: FormData) {
        return this._httpClient.post<FormData>(
            `${environment.baseUrl}/missing`,
            missingStore
        );
    }

    show(id: number) {
        return this._httpClient.get(`${environment.baseUrl}/missing/${id}`);
    }

    update(id: number, missingUpdate: FormData) {
        return this._httpClient.put<FormData>(
            `${environment.baseUrl}/missing/${id}`,
            missingUpdate
        );
    }

    delete(id: number) {
        return this._httpClient.delete<number>(
            `${environment.baseUrl}/missing/${id}`
        );
    }

    change(id: number, status_missing: any) {
        return this._httpClient.put<any>(
            `${environment.baseUrl}/missing/${id}/update-status`,
            status_missing
        );
    }

    showImages(id: number) {
        return this._httpClient.get(
            `${environment.baseUrl}/missing/${id}/images`
        );
    }
}
