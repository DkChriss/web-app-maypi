import { Injectable } from '@angular/core';
import { ReportStore, ReportUpdate } from '../models/report';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ReportService {
    constructor(private _httpClient: HttpClient) {}

    list(page: number = 1, size: number = 10, search: string = '') {
        let params: any;
        if (search != '') {
            params = new HttpParams()
                .set('page', page)
                .set('size', size)
                .set('search', search);
        } else {
            params = new HttpParams().set('page', page).set('size', size);
        }

        return this._httpClient.get(`${environment.baseUrl}/reports`, {
            params,
        });
    }

    store(reportStore: ReportStore) {
        return this._httpClient.post<ReportStore>(
            `${environment.baseUrl}/reports`,
            reportStore
        );
    }

    show(id: number) {
        return this._httpClient.get(`${environment.baseUrl}/reports/${id}`);
    }

    update(id: number, reportUpdate: ReportUpdate) {
        return this._httpClient.put<ReportUpdate>(
            `${environment.baseUrl}/reports/${id}`,
            reportUpdate
        );
    }

    delete(id: number) {
        return this._httpClient.delete<number>(
            `${environment.baseUrl}/reports/${id}`
        );
    }
}
