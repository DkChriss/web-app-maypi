import { Routes } from '@angular/router';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { GuidePageComponent } from './pages/guide-page/guide-page.component';
import { FaqsPageComponent } from './pages/faqs-page/faqs-page.component';
import { ContactSupportPageComponent } from './pages/contact-support-page/contact-support-page.component';
import { DevicePageComponent } from './pages/device-page/device-page.component';
import { EmergencyContactPageComponent } from './pages/emergency-contact-page/emergency-contact-page.component';
import { MissingPageComponent } from './pages/missing-page/missing-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { ReportPageComponent } from './pages/report-page/report-page.component';

export default [
    {
        path: 'users',
        component: UserPageComponent,
        data: {
            action: 'view',
            subject: 'users',
        },
    },
    {
        path: 'categories',
        component: CategoryPageComponent,
        data: {
            action: 'view',
            subject: 'categories',
        },
    },
    {
        path: 'guides',
        component: GuidePageComponent,
        data: {
            action: 'view',
            subject: 'guides',
        },
    },
    {
        path: 'faqs',
        component: FaqsPageComponent,
        data: {
            action: 'view',
            subject: 'faqs',
        },
    },
    {
        path: 'contacts-support',
        component: ContactSupportPageComponent,
        data: {
            action: 'view',
            subject: 'contacts-support',
        },
    },
    {
        path: 'devices',
        component: DevicePageComponent,
        data: {
            action: 'view',
            subject: 'devices',
        },
    },
    {
        path: 'emergency-contacts',
        component: EmergencyContactPageComponent,
        data: {
            action: 'view',
            subject: 'emergency-contacts',
        },
    },
    {
        path: 'missing',
        component: MissingPageComponent,
        data: {
            action: 'view',
            subject: 'missing',
        },
    },
    {
        path: 'reports',
        component: ReportPageComponent,
        data: {
            action: 'view',
            subject: 'reports',
        },
    },
] as Routes;
