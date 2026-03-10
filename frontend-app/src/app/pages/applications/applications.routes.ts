import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: { breadcrumb: 'List' },
        loadComponent: () => import('./application-list').then(m => m.ApplicationList)
    }
];
