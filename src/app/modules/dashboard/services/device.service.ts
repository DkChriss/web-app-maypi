import { Injectable } from '@angular/core';
import { DeviceStore, DeviceUpdate } from '../models/device';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {

    constructor(
        private _httpClient: HttpClient
    ) { }

    list(page: number = 1, size: number = 10) {
        const params = new HttpParams()
            .set("page", page)
            .set("size", size)

        return this._httpClient.get(
            `${environment.baseUrl}/devices`,
            { params }
        )
    }

    store(deviceStore: DeviceStore) {
        return this._httpClient.post<DeviceStore>(
            `${environment.baseUrl}/devices`,
            deviceStore
        )
    }

    show(id: number) {
        return this._httpClient.get(
            `${environment.baseUrl}/devices/${id}`
        )
    }

    update(id: number, deviceUpdate: DeviceUpdate) {
        return this._httpClient.put<DeviceUpdate>(
            `${environment.baseUrl}/devices/${id}`,
            deviceUpdate
        )
    }

    delete(id: number) {
        return this._httpClient.delete<number>(
            `${environment.baseUrl}/devices/${id}`
        )
    }
}
