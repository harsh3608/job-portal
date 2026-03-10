import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { AppAuthLayout } from '@/layout/components/app.authlayout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: '',
        data: { breadcrumb: 'Dashboard' },
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'jobs',
        data: { breadcrumb: 'Jobs' },
        loadChildren: () => import('./pages/jobs/jobs.routes').then(m => m.routes)
      },
      {
        path: 'applications',
        data: { breadcrumb: 'Applications' },
        loadChildren: () => import('./pages/applications/applications.routes').then(m => m.routes)
      },
      {
        path: 'candidates',
        data: { breadcrumb: 'Candidates' },
        loadChildren: () => import('./pages/candidates/candidates.routes').then(m => m.routes)
      },
      {
        path: 'employers',
        data: { breadcrumb: 'Employers' },
        loadChildren: () => import('./pages/employers/employers.routes').then(m => m.routes)
      },
      {
        path: 'profile',
        data: { breadcrumb: 'Profile' },
        loadComponent: () => import('./pages/profile/profile').then(m => m.Profile)
      }
    ]
  },
  {
    path: 'auth',
    component: AppAuthLayout,
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.routes)
  },
  {
    path: 'notfound',
    loadComponent: () => import('./pages/notfound/notfound').then(m => m.NotFound)
  },
  { path: '**', redirectTo: 'notfound' }
];
