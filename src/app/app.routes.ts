import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'farmer',
    loadComponent: () => import('./components/farmer/farmer-dashboard/farmer-dashboard.component').then(m => m.FarmerDashboardComponent),
    children: [
      {
        path: 'bidding',
        loadComponent: () => import('./components/farmer/bidding/bidding.component').then(m => m.BiddingComponent)
      },
      {
        path: 'insurance',
        loadComponent: () => import('./components/farmer/insurance/insurance.component').then(m => m.InsuranceComponent)
      },
      {
        path: '',
        redirectTo: 'bidding',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'bidder',
    loadComponent: () => import('./components/bidder/bidder-dashboard/bidder-dashboard.component').then(m => m.BidderDashboardComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
