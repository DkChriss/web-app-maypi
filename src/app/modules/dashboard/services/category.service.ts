import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { CategoryStore, CategoryUpdate } from '../models/category';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

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
            `${environment.baseUrl}/categories`,
            { params }
        )
    }

    store(categoryStore: CategoryStore) {
        return this._httpClient.post<CategoryStore>(
            `${environment.baseUrl}/categories`,
            categoryStore
        )
    }

    show(id: number) {
        return this._httpClient.get(
            `${environment.baseUrl}/categories/${id}`
        )
    }

    update(id: number, categoryUpdate: CategoryUpdate) {
        return this._httpClient.put<CategoryUpdate>(
            `${environment.baseUrl}/categories/${id}`,
            categoryUpdate
        )
    }

    delete(id: number) {
        return this._httpClient.delete<number>(
            `${environment.baseUrl}/categories/${id}`
        )
    }

}
