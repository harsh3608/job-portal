import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: { breadcrumb: 'Browse' },
        loadComponent: () => import('./job-list').then(m => m.JobList)
    },
    {
        path: 'post',
        data: { breadcrumb: 'Post Job' },
        loadComponent: () => import('./job-post').then(m => m.JobPost)
    }
];
