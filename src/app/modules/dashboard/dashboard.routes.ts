import { Routes } from "@angular/router";
import { CategoryPageComponent } from "./pages/category-page/category-page.component";
import { GuidePageComponent } from "./pages/guide-page/guide-page.component";
import { FaqsPageComponent } from "./pages/faqs-page/faqs-page.component";
import { ContactSupportPageComponent } from "./pages/contact-support-page/contact-support-page.component";

export default [
    {
        path: 'categories',
        component: CategoryPageComponent
    },
    {
        path: 'guides',
        component: GuidePageComponent
    },
    {
        path: 'faqs',
        component: FaqsPageComponent
    },
    {
        path: 'contacts-support',
        component: ContactSupportPageComponent
    }
] as Routes
