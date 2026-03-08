import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="dashboard-layout page-fade">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="brand">
            <span class="app-icon">agriculture</span>
            <span class="brand-name">Farm-Scheme</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-group">
            <span class="nav-label">Dashboard</span>
            <a routerLink="/farmer/bidding" routerLinkActive="active" class="nav-item">
              <span class="app-icon">gavel</span>
              <span>Bidding</span>
            </a>
            <a routerLink="/farmer/insurance" routerLinkActive="active" class="nav-item">
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

      <main class="main-content">
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

    @media (max-width: 768px) {
      .sidebar {
        display: none;
      }
      .main-content {
        padding: 1rem;
      }
    }
  `]
})
export class FarmerDashboardComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
  }
}
