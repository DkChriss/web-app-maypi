import { Injectable } from '@angular/core';
import { FaqStore, FaqUpdate } from '../models/faq';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FaqService {

    constructor(
        private _httpClient: HttpClient
    ) { }

    list(page: number = 1, size: number = 10) {
        const params = new HttpParams()
            .set("page", page)
            .set("size", size)

        return this._httpClient.get(
            `${environment.baseUrl}/faqs`,
            { params }
        )
    }

    store(faqStore: FaqStore) {
        return this._httpClient.post<FaqStore>(
            `${environment.baseUrl}/faqs`,
            faqStore
        )
    }

    show(id: number) {
        return this._httpClient.get(
            `${environment.baseUrl}/faqs/${id}`,
        )
    }

    update(id: number, faqUpdate: FaqUpdate) {
        return this._httpClient.put<FaqUpdate>(
            `${environment.baseUrl}/faqs/${id}`,
            faqUpdate
        )
    }

    delete(id: number) {
        return this._httpClient.delete<number>(
            `${environment.baseUrl}/faqs/${id}`
        )
    }
}
