import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/shell/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'lab-orders', pathMatch: 'full' },
      { path: 'lab-orders', loadComponent: () => import('./pages/lab-orders/lab-orders.component').then(m => m.LabOrdersComponent) },
      { path: 'radiology', loadComponent: () => import('./pages/radiology/radiology.component').then(m => m.RadiologyComponent) },
      { path: 'result-entry', loadComponent: () => import('./pages/result-entry/result-entry.component').then(m => m.ResultEntryComponent) },
      { path: 'review-authorize', loadComponent: () => import('./pages/review-authorize/review-authorize.component').then(m => m.ReviewAuthorizeComponent) },
      { path: 'dispatch', loadComponent: () => import('./pages/dispatch/dispatch.component').then(m => m.DispatchComponent) },
      { path: 'qc-analytics', loadComponent: () => import('./pages/qc-analytics/qc-analytics.component').then(m => m.QcAnalyticsComponent) },
      { path: 'external-lab', loadComponent: () => import('./pages/external-lab/external-lab.component').then(m => m.ExternalLabComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
