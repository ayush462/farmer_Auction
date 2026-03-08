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
    <div class="auth-page page-fade">
      <div class="auth-card card">
        <div class="auth-header text-center">
          <div class="brand-icon app-icon">agriculture</div>
          <h1>Welcome back</h1>
          <p class="text-muted">Enter your credentials to access your account</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="field">
            <label>Email</label>
            <input
              class="input"
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="name&#64;example.com"
              required
            />
          </div>

          <div class="field">
            <div class="flex justify-between items-center">
              <label>Password</label>
              <a href="#" class="text-xs text-muted hover:text-foreground">Forgot password?</a>
            </div>
            <input
              class="input"
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary w-full" [disabled]="loading()">
            @if (loading()) {
              Signing in...
            } @else {
              Sign in
            }
          </button>
        </form>

        <div class="auth-footer text-center">
          <p class="text-muted text-sm">
            Don't have an account?
            <a routerLink="/register" class="font-medium text-foreground hover:underline">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--muted);
      padding: 1.5rem;
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      background-color: var(--background);
    }

    .auth-header {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
    }

    .brand-icon {
      font-size: 32px;
      margin-bottom: 0.5rem;
    }

    .auth-header h1 {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.025em;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field label {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .text-center { text-align: center; }
    .text-muted { color: var(--muted-foreground); }
    .text-sm { font-size: 0.875rem; }
    .text-xs { font-size: 0.75rem; }
    .font-medium { font-weight: 500; }
    .text-foreground { color: var(--foreground); }
    .hover\:text-foreground:hover { color: var(--foreground); }
    .hover\:underline:hover { text-decoration: underline; }
    .w-full { width: 100%; }
    .flex { display: flex; }
    .justify-between { justify-content: space-between; }
    .items-center { align-items: center; }
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
