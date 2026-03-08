import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-shell page-fade">
      <div class="auth-card card">
        <div class="auth-header">
          <div class="auth-logo">
            <div class="logo-mark">
              <span class="app-icon app-icon--lg">spa</span>
            </div>
            <div class="logo-text">
              <span class="logo-title">Farm-Scheme</span>
              <span class="logo-subtitle">Secure sign in</span>
            </div>
          </div>
          <div>
            <h1>Welcome back</h1>
            <p>Sign in to access your farmer, bidder, or admin workspace.</p>
          </div>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="field">
            <label>Email address</label>
            <input
              class="input"
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div class="field">
            <label>Password</label>
            <input
              class="input"
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <div class="form-meta">
            <a href="#" class="link subtle">Forgot password?</a>
          </div>

          <button type="submit" class="btn btn-primary full-width" [disabled]="loading()">
            @if (loading()) {
              <span class="btn-spinner"></span>
              Signing in...
            } @else {
              <span class="app-icon">login</span>
              Sign in
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>
            New to the platform?
            <a routerLink="/register" class="link">Create an account</a>
          </p>
          <p class="hint">Use the same credentials across web and mobile dashboards.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-shell {
      min-height: calc(100vh - 3rem);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2.5rem 1.5rem;
    }

    .auth-card {
      width: 100%;
      max-width: 440px;
      padding: 2.25rem 2.4rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .auth-header {
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
    }

    .auth-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-mark {
      width: 38px;
      height: 38px;
      border-radius: 999px;
      background: radial-gradient(circle at 15% 0, #bbf7d0 0, #22c55e 40%, #15803d 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      box-shadow: 0 10px 30px rgba(22, 163, 74, 0.4);
    }

    .logo-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .logo-title {
      font-size: 1.02rem;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: var(--text-main);
    }

    .logo-subtitle {
      font-size: 0.8rem;
      color: var(--text-soft);
    }

    .auth-header h1 {
      font-size: 1.6rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--text-main);
    }

    .auth-header p {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .field label {
      font-size: 0.86rem;
      font-weight: 500;
      color: var(--text-muted);
    }

    .form-meta {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0.25rem;
    }

    .link {
      font-size: 0.86rem;
      color: var(--primary-strong);
      text-decoration: none;
      font-weight: 500;
    }

    .link.subtle {
      color: var(--text-soft);
    }

    .link:hover {
      text-decoration: underline;
    }

    .full-width {
      width: 100%;
      margin-top: 0.25rem;
    }

    .auth-footer {
      margin-top: 0.75rem;
      font-size: 0.86rem;
      color: var(--text-soft);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      text-align: center;
    }

    .auth-footer .hint {
      font-size: 0.8rem;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding-inline: 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  async onSubmit() {
    this.errorMessage.set('');

    if (!this.email || !this.password) {
      this.errorMessage.set('Please fill in all fields');
      this.toast.error('Please fill in all fields');
      return;
    }

    this.loading.set(true);

    const result = await this.authService.login(this.email, this.password);

    this.loading.set(false);

    if (!result.success) {
      this.errorMessage.set(result.message || 'Login failed');
      this.toast.error(result.message || 'Login failed');
    } else {
      this.toast.success('Signed in successfully');
    }
  }
}
