import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: { breadcrumb: 'List' },
        loadComponent: () => import('./employer-list').then(m => m.EmployerList)
    }
];
