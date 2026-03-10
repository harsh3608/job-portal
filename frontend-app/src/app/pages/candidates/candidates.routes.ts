import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: { breadcrumb: 'Browse' },
        loadComponent: () => import('./candidate-list').then(m => m.CandidateList)
    },
    {
        path: 'resume-search',
        data: { breadcrumb: 'Resume Search' },
        loadComponent: () => import('./resume-search').then(m => m.ResumeSearch)
    }
];
