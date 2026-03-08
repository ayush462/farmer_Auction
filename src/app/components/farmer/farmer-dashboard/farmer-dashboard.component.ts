import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="dashboard-layout page-fade">
      <aside class="sidebar" [class.open]="sidebarOpen">
        <div class="sidebar-header">
          <div class="brand">
            <span class="app-icon">agriculture</span>
            <span class="brand-name">Farm-Scheme</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-group">
            <span class="nav-label">Dashboard</span>
            <a routerLink="/farmer/bidding" routerLinkActive="active" class="nav-item" (click)="closeSidebar()">
              <span class="app-icon">gavel</span>
              <span>Bidding</span>
            </a>
            <a routerLink="/farmer/insurance" routerLinkActive="active" class="nav-item" (click)="closeSidebar()">
              <span class="app-icon">shield</span>
              <span>Insurance</span>
            </a>
          </div>
        </nav>

        <div class="sidebar-footer">
          <div class="user-profile">
            <div class="user-avatar">
              {{ authService.currentUser()?.name?.charAt(0) }}
            </div>
            <div class="user-info">
              <span class="user-name">{{ authService.currentUser()?.name }}</span>
              <span class="user-role">Farmer</span>
            </div>
          </div>
          <button (click)="logout()" class="btn btn-ghost btn-icon-only" title="Logout">
            <span class="app-icon">logout</span>
          </button>
        </div>
      </aside>
      <div
  class="sidebar-overlay"
  *ngIf="sidebarOpen"
  (click)="closeSidebar()">
</div>

      <main class="main-content">
      <header class="mobile-header">
  <button class="hamburger" (click)="toggleSidebar()">
    <span class="app-icon">menu</span>
  </button>
  <span class="mobile-title">Farm-Scheme</span>
</header>
        <div class="content-container">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
    }

    .brand .app-icon {
      font-size: 24px;
    }

    .brand-name {
      font-weight: 700;
      font-size: 1.125rem;
      letter-spacing: -0.025em;
    }

    .sidebar-nav {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .nav-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted-foreground);
      padding: 0 0.75rem 0.5rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-md);
      color: var(--muted-foreground);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all var(--transition-fast);
    }

    .nav-item:hover {
      background-color: var(--muted);
      color: var(--foreground);
    }

    .nav-item.active {
      background-color: var(--primary);
      color: var(--primary-foreground);
    }

    .sidebar-footer {
      border-top: 1px solid var(--border);
      padding-top: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 999px;
      background-color: var(--muted);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 600;
      border: 1px solid var(--border);
    }
      .dashboard-layout{
  display:flex;
  min-height:100vh;
}

/* Sidebar */

.sidebar{
  width:250px;
  background:var(--background);
  border-right:1px solid var(--border);
  display:flex;
  flex-direction:column;
  padding:1rem;
  transition:transform .3s ease;
}

/* Main */

.main-content{
  flex:1;
  padding:2rem;
}

/* Mobile Header */

.mobile-header{
  display:none;
  align-items:center;
  gap:1rem;
  margin-bottom:1rem;
}

.hamburger{
  background:none;
  border:none;
  cursor:pointer;
}

.mobile-title{
  font-weight:700;
}

/* Overlay */

.sidebar-overlay{
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.35);
  z-index:900;
}

/* MOBILE */

@media (max-width:768px){

  .mobile-header{
    display:flex;
  }

  .sidebar{
    position:fixed;
    left:0;
    top:0;
    height:100%;
    transform:translateX(-100%);
    z-index:1000;
    background:white;
  }

  .sidebar.open{
    transform:translateX(0);
  }

  .main-content{
    padding:1rem;
  }

}

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1;
    }

    .user-role {
      font-size: 0.75rem;
      color: var(--muted-foreground);
    }

    .btn-icon-only {
      padding: 0.5rem;
      border-radius: var(--radius-md);
    }

    .content-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    
    
  `]
})
export class FarmerDashboardComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  sidebarOpen = false;

toggleSidebar() {
  this.sidebarOpen = !this.sidebarOpen;
}

closeSidebar() {
  this.sidebarOpen = false;
}

 logout() {

  const confirmLogout = confirm("Are you sure you want to logout?");

  if(!confirmLogout) return;

  this.authService.logout();

  this.toast.success(
    "You have been logged out successfully",
    "Logged out"
  );

}
}
