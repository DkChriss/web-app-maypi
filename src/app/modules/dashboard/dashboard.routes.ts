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
    },
    {
        path: 'categories',
        component: CategoryPageComponent,
    },
    {
        path: 'guides',
        component: GuidePageComponent,
    },
    {
        path: 'faqs',
        component: FaqsPageComponent,
    },
    {
        path: 'contacts-support',
        component: ContactSupportPageComponent,
    },
    {
        path: 'devices',
        component: DevicePageComponent,
    },
    {
        path: 'emergency-contacts',
        component: EmergencyContactPageComponent,
    },
    {
        path: 'missing',
        component: MissingPageComponent,
    },
    {
        path: 'reports',
        component: ReportPageComponent,
    },
] as Routes;
