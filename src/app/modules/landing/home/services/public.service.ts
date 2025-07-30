import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContactSupportStore } from 'app/modules/dashboard/models/contact-support';
import { environment } from 'environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class PublicService {
    constructor(private _httpClient: HttpClient) {}

    listMissing(page: number = 1, size: number = 10, search: string = '') {
        let params: any;
        if (search != '') {
            params = new HttpParams()
                .set('page', page)
                .set('size', size)
                .set('search', search);
        } else {
            params = new HttpParams().set('page', page).set('size', size);
        }

        return this._httpClient.get(`${environment.baseUrl}/public/missing`, {
            params,
        });
    }

    saveMissing(formData: FormData) {
        return this._httpClient.post<FormData>(
            `${environment.baseUrl}/public/missing`,
            formData
        );
    }

    listCategoryFaqs(page: number = 1, size: number = 10, search: string = '') {
        let params: any;
        if (search != '') {
            params = new HttpParams()
                .set('page', page)
                .set('size', size)
                .set('search', search);
        } else {
            params = new HttpParams().set('page', page).set('size', size);
        }

        return this._httpClient.get(
            `${environment.baseUrl}/public/list-category-faqs`,
            {
                params,
            }
        );
    }

    listCategoryGuides(
        page: number = 1,
        size: number = 10,
        search: string = ''
    ) {
        let params: any;
        if (search != '') {
            params = new HttpParams()
                .set('page', page)
                .set('size', size)
                .set('search', search);
        } else {
            params = new HttpParams().set('page', page).set('size', size);
        }

        return this._httpClient.get(
            `${environment.baseUrl}/public/list-category-guides`,
            {
                params,
            }
        );
    }

    listGuides(page: number = 1, size: number = 10, search: string = '') {
        let params: any;
        if (search != '') {
            params = new HttpParams()
                .set('page', page)
                .set('size', size)
                .set('search', search);
        } else {
            params = new HttpParams().set('page', page).set('size', size);
        }

        return this._httpClient.get(
            `${environment.baseUrl}/public/list-guides`,
            {
                params,
            }
        );
    }

    storeContactSupport(contactSupportStore: ContactSupportStore) {
        return this._httpClient.post<ContactSupportStore>(
            `${environment.baseUrl}/public/contact-support`,
            contactSupportStore
        );
    }

    showGuide(id: number) {
        return this._httpClient.get(
            `${environment.baseUrl}/public/guides/${id}`
        );
    }

    storeUser(newUser: any) {
        return this._httpClient.post(
            `${environment.baseUrl}/public/register-user`,
            newUser
        );
    }
}
