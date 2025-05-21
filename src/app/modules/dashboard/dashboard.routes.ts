import { Routes } from "@angular/router";
import { CategoryPageComponent } from "./pages/category-page/category-page.component";
import { GuidePageComponent } from "./pages/guide-page/guide-page.component";

export default [
    {
        path: 'categories',
        component: CategoryPageComponent
    },
    {
        path: 'guides',
        component: GuidePageComponent
    }
] as Routes
