import { Injectable } from '@angular/core';
import { EmergencyContactStore, EmergencyContactUpdate } from '../models/emergency-contact';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EmergencyContactService {
    constructor(
        private _httpClient: HttpClient
    ) { }

    list(page: number = 1, size: number = 10, search: string = "") {
        let params: any;
        if (search != "") {
            params = new HttpParams()
                .set("page", page)
                .set("size", size)
                .set("search", search)
        } else {
            params = new HttpParams()
                .set("page", page)
                .set("size", size)
        }

        return this._httpClient.get(
            `${environment.baseUrl}/emergency-contacts`,
            { params }
        )
    }

    store(emergencyContactStore: EmergencyContactStore) {
        return this._httpClient.post<EmergencyContactStore>(
            `${environment.baseUrl}/emergency-contacts`,
            emergencyContactStore
        )
    }

    show(id: number) {
        return this._httpClient.get(
            `${environment.baseUrl}/emergency-contacts/${id}`
        )
    }

    update(id: number, emergencyContactUpdate: EmergencyContactUpdate) {
        return this._httpClient.put<EmergencyContactUpdate>(
            `${environment.baseUrl}/emergency-contacts/${id}`,
            emergencyContactUpdate
        )
    }

    delete(id: number) {
        return this._httpClient.delete<number>(
            `${environment.baseUrl}/emergency-contacts/${id}`
        )
    }
}
