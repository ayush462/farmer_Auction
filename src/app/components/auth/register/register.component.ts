import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-page page-fade">
      <div class="register-card card">
        <div class="register-header text-center">
          <div class="brand-icon app-icon">agriculture</div>
          <h1>Create an account</h1>
          <p class="text-muted">Join the digital agriculture network</p>
        </div>

        @if (!userType()) {
          <div class="type-selection">
            <h2 class="text-sm font-semibold text-center mb-4">Select your role</h2>
            <div class="type-grid">
              <button type="button" (click)="selectUserType('farmer')" class="type-card">
                <span class="type-icon app-icon">spa</span>
                <div class="type-info">
                  <span class="type-title">Farmer</span>
                  <span class="type-desc">List crops and manage insurance</span>
                </div>
              </button>
              <button type="button" (click)="selectUserType('bidder')" class="type-card">
                <span class="type-icon app-icon">payments</span>
                <div class="type-info">
                  <span class="type-title">Bidder</span>
                  <span class="type-desc">Bid on verified crop inventory</span>
                </div>
              </button>
            </div>
          </div>
        } @else {
          <form (ngSubmit)="onSubmit()" class="register-form">
            <div class="form-grid">
              <!-- Personal Info -->
              <div class="form-section">
                <h3 class="section-title">Personal Information</h3>
                <div class="grid-2">
                  <div class="field">
                    <label>Full Name</label>
                    <input class="input" type="text" [(ngModel)]="formData.fullName" name="fullName" required />
                  </div>
                  <div class="field">
                    <label>Email</label>
                    <input class="input" type="email" [(ngModel)]="formData.email" name="email" required />
                  </div>
                </div>
                <div class="grid-2">
                  <div class="field">
                    <label>Contact Number</label>
                    <input class="input" type="tel" [(ngModel)]="formData.contactNo" name="contactNo" required />
                  </div>
                  <div class="field">
                    <label>Aadhaar Number</label>
                    <input class="input" type="text" [(ngModel)]="formData.aadhaarNo" name="aadhaarNo" required />
                  </div>
                </div>
              </div>

              <!-- Address -->
              <div class="form-section">
                <h3 class="section-title">Address Details</h3>
                <div class="field">
                  <label>Street Address</label>
                  <input class="input" type="text" [(ngModel)]="formData.addressLine1" name="addressLine1" required />
                </div>
                <div class="grid-3">
                  <div class="field">
                    <label>City</label>
                    <input class="input" type="text" [(ngModel)]="formData.city" name="city" required />
                  </div>
                  <div class="field">
                    <label>State</label>
                    <input class="input" type="text" [(ngModel)]="formData.state" name="state" required />
                  </div>
                  <div class="field">
                    <label>PIN Code</label>
                    <input class="input" type="text" [(ngModel)]="formData.pincode" name="pincode" required />
                  </div>
                </div>
              </div>

              <!-- Role Specific -->
              @if (userType() === 'farmer') {
                <div class="form-section highlight-section">
                  <h3 class="section-title">Land Information</h3>
                  <div class="grid-2">
                    <div class="field">
                      <label>Land Area (Hectares)</label>
                      <input class="input" type="number" [(ngModel)]="formData.landArea" name="landArea" required />
                    </div>
                    <div class="field">
                      <label>Plot Number</label>
                      <input class="input" type="text" [(ngModel)]="formData.plotNo" name="plotNo" required />
                    </div>
                  </div>
                </div>
              } @else {
                <div class="form-section highlight-section">
                  <h3 class="section-title">Business Information</h3>
                  <div class="field">
                    <label>Trading License Number</label>
                    <input class="input" type="text" [(ngModel)]="formData.tradingLicenseNo" name="tradingNo" required />
                  </div>
                </div>
              }

              <!-- Security -->
              <div class="form-section">
                <h3 class="section-title">Account Security</h3>
                <div class="grid-2">
                  <div class="field">
                    <label>Password</label>
                    <input class="input" type="password" [(ngModel)]="formData.password" name="password" required />
                  </div>
                  <div class="field">
                    <label>Confirm Password</label>
                    <input class="input" type="password" [(ngModel)]="formData.confirmPassword" name="confirmPassword" required />
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" (click)="resetForm()" class="btn btn-secondary">Back</button>
              <button type="submit" class="btn btn-primary px-8" [disabled]="loading()">
                @if (loading()) { Registering... } @else { Create Account }
              </button>
            </div>
          </form>
        }

        <div class="register-footer text-center">
          <p class="text-sm text-muted">
            Already have an account?
            <a routerLink="/login" class="font-medium text-foreground hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--muted);
      padding: 2rem 1.5rem;
    }

    .register-card {
      width: 100%;
      max-width: 800px;
      padding: 3rem;
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
      background-color: var(--background);
    }

    .register-header {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
    }

    .brand-icon {
      font-size: 32px;
      margin-bottom: 0.5rem;
    }

    .register-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.025em;
    }

    .type-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .type-card {
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      background-color: var(--background);
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all var(--transition-fast);
      text-align: left;
    }

    .type-card:hover {
      border-color: var(--foreground);
      background-color: var(--muted);
    }

    .type-icon {
      font-size: 28px;
      color: var(--muted-foreground);
    }

    .type-card:hover .type-icon {
      color: var(--foreground);
    }

    .type-info {
      display: flex;
      flex-direction: column;
    }

    .type-title {
      font-weight: 600;
      font-size: 1rem;
    }

    .type-desc {
      font-size: 0.75rem;
      color: var(--muted-foreground);
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-grid {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    .section-title {
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--foreground);
      margin-bottom: 1.25rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border);
    }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field label {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .highlight-section {
      background-color: var(--muted);
      padding: 1.5rem;
      border-radius: var(--radius-md);
      margin: 0 -1.5rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
    }

    .text-center { text-align: center; }
    .text-muted { color: var(--muted-foreground); }
    .text-sm { font-size: 0.875rem; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .text-foreground { color: var(--foreground); }
    .hover\:underline:hover { text-decoration: underline; }
    .px-8 { padding-left: 2rem; padding-right: 2rem; }
    .mb-4 { margin-bottom: 1rem; }

    @media (max-width: 640px) {
      .type-grid { grid-template-columns: 1fr; }
      .grid-2, .grid-3 { grid-template-columns: 1fr; }
      .register-card { padding: 1.5rem; }
      .highlight-section { margin: 0; padding: 1rem; }
    }
  `]
})
export class RegisterComponent {
  userType = signal<'farmer' | 'bidder' | null>(null);
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  formData: any = {
  fullName: '',
  contactNo: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',

  landArea: '',
  landAddress: '',
  landPincode: '',

  accountNo: '',
  ifscCode: '',

  aadhaarNo: '',
  panNo: '',
  plotNo: '',
  tradingLicenseNo: '',

  password: '',
  confirmPassword: ''
};
  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  selectUserType(type: 'farmer' | 'bidder') {
    this.userType.set(type);
  }

  onFileChange(event: any, documentType: string) {
    const file = event.target.files[0];
    if (file) {
      this.formData.documents[documentType] = file;
    }
  }

 async onSubmit() {
  this.errorMessage.set('');
  this.successMessage.set('');

  if (this.formData.password !== this.formData.confirmPassword) {
    this.errorMessage.set('Passwords do not match');
    this.toast.error('Passwords do not match');
    return;
  }

  this.loading.set(true);

  const payload = {
    ...this.formData,
    userType: this.userType()
  };

  const result = await this.authService.register(payload);

  this.loading.set(false);

  if (result.success) {
    this.successMessage.set(result.message || 'Registration successful!');
    this.toast.success(result.message || 'Registration successful!');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  } else {
    this.errorMessage.set(result.message || 'Registration failed');
    this.toast.error(result.message || 'Registration failed');
  }
}
  resetForm() {
  this.formData = {
    fullName: '',
    contactNo: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',

    landArea: '',
    landAddress: '',
    landPincode: '',

    accountNo: '',
    ifscCode: '',

    aadhaarNo: '',
    panNo: '',
    plotNo: '',
    tradingLicenseNo: '',

    password: '',
    confirmPassword: ''
  };
}
}
