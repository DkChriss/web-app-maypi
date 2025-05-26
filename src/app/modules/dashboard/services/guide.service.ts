import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { GuideStore, GuideUpdate } from '../models/guide';

@Injectable({
    providedIn: 'root'
})
export class GuideService {

    constructor(
        private _httpClient: HttpClient
    ) { }

    list(page: number = 1, size: number = 10) {
        const params = new HttpParams()
            .set("page", page)
            .set("size", size)

        return this._httpClient.get(
            `${environment.baseUrl}/guides`,
            { params }
        )
    }

    store(guideStore: GuideStore) {
        return this._httpClient.post<GuideStore>(
            `${environment.baseUrl}/guides`,
            guideStore
        )
    }

    show(id: number) {
        return this._httpClient.get(
            `${environment.baseUrl}/guides/${id}`,
        )
    }

    update(id: number, guideUpdate: GuideUpdate) {
        return this._httpClient.put<GuideUpdate>(
            `${environment.baseUrl}/guides/${id}`,
            guideUpdate
        )
    }

    delete(id: number) {
        return this._httpClient.delete<number>(
            `${environment.baseUrl}/guides/${id}`
        )
    }
}
