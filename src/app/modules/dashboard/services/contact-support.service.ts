import { Injectable } from '@angular/core';
import { ContactSupportStore, ContactSupportUpdate } from '../models/contact-support';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ContactSupportService {

    constructor(
        private _httpClient: HttpClient
    ) { }

    list(page: number = 1, size: number = 10) {
        const params = new HttpParams()
            .set("page", page)
            .set("size", size)

        return this._httpClient.get(
            `${environment.baseUrl}/contacts-support`,
            { params }
        )
    }

    store(contactSupportStore: ContactSupportStore) {
        return this._httpClient.post<ContactSupportStore>(
            `${environment.baseUrl}/contacts-support`,
            contactSupportStore
        )
    }

    show(id: number) {
        return this._httpClient.get(
            `${environment.baseUrl}/contacts-support/${id}`,
        )
    }

    update(id: number, contactSupportUpdate: ContactSupportUpdate) {
        return this._httpClient.put<ContactSupportUpdate>(
            `${environment.baseUrl}/contacts-support/${id}`,
            contactSupportUpdate
        )
    }

    delete(id: number) {
        return this._httpClient.delete<number>(
            `${environment.baseUrl}/contacts-support/${id}`
        )
    }
}
