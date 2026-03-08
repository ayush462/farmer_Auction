import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="farmer-dashboard page-fade">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="brand-mark">
            <span class="app-icon app-icon--lg">spa</span>
          </div>
          <div class="brand-copy">
            <span class="brand-title">Farm-Scheme</span>
            <span class="brand-subtitle">{{ authService.currentUser()?.name }}</span>
          </div>
        </div>
        <nav class="sidebar-menu">
          <a routerLink="/farmer/bidding" routerLinkActive="active" class="menu-item">
            <span class="app-icon app-icon--muted">gavel</span>
            <span>Bidding</span>
          </a>
          <a routerLink="/farmer/insurance" routerLinkActive="active" class="menu-item">
            <span class="app-icon app-icon--muted">shield</span>
            <span>Insurance</span>
          </a>
        </nav>
        <button (click)="logout()" class="logout-btn">
          <span class="app-icon app-icon--muted">logout</span>
          <span>Logout</span>
        </button>
      </aside>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .farmer-dashboard {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
      gap: 0;
    }

    .sidebar {
      border-right: 1px solid var(--border-subtle);
      background-color: #f3f4f6;
      padding: 1.75rem 1.4rem 1.4rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .brand-mark {
      width: 34px;
      height: 34px;
      border-radius: 999px;
      background: radial-gradient(circle at 15% 0, #bbf7d0 0, #22c55e 40%, #15803d 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
    }

    .brand-copy {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .brand-title {
      font-size: 0.98rem;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: var(--text-main);
    }

    .brand-subtitle {
      font-size: 0.8rem;
      color: var(--text-soft);
    }

    .sidebar-menu {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 0.75rem;
      flex: 1;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.6rem 0.75rem;
      border-radius: 0.75rem;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.9rem;
      transition:
        background-color var(--transition-fast),
        color var(--transition-fast),
        transform var(--transition-fast);
    }

    .menu-item:hover {
      background-color: #e5e7eb;
      color: var(--text-main);
      transform: translateX(1px);
    }

    .menu-item.active {
      background: linear-gradient(135deg, var(--primary-soft), #ffffff);
      color: var(--primary-strong);
      font-weight: 600;
    }

    .logout-btn {
      margin-top: 0.5rem;
      padding: 0.65rem 0.85rem;
      border-radius: 0.75rem;
      border: 1px solid #fecaca;
      background-color: #fef2f2;
      color: #b91c1c;
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      cursor: pointer;
      transition:
        background-color var(--transition-fast),
        border-color var(--transition-fast),
        transform var(--transition-fast);
    }

    .logout-btn:hover {
      background-color: #fee2e2;
      border-color: #fca5a5;
      transform: translateY(-1px);
    }

    .main-content {
      padding: 1.75rem 2rem;
      overflow-y: auto;
    }

    @media (max-width: 900px) {
      .farmer-dashboard {
        grid-template-columns: minmax(0, 1fr);
      }

      .sidebar {
        display: none;
      }

      .main-content {
        padding-inline: 1.25rem;
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
