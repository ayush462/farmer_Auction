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
    <div class="register-shell page-fade">
      <div class="register-card card">
        <div class="register-header">
          <div class="logo-row">
            <div class="logo-mark">
              <span class="app-icon app-icon--lg">spa</span>
            </div>
            <div class="logo-text">
              <span class="logo-title">Farm-Scheme</span>
              <span class="logo-subtitle">Create your account</span>
            </div>
          </div>
          <h1>Join the Farm-Scheme network</h1>
          <p>Choose your role and add the details once. You can always update your profile later.</p>
        </div>

        @if (!userType()) {
          <div class="user-type-selection">
            <p class="eyebrow">Step 1</p>
            <h2>Select account type</h2>
            <div class="type-grid">
              <button type="button" (click)="selectUserType('farmer')" class="type-card">
                <span class="type-icon app-icon app-icon--lg">grass</span>
                <span class="type-title">Farmer</span>
                <span class="type-description">List crops, manage auctions, and apply for insurance.</span>
              </button>
              <button type="button" (click)="selectUserType('bidder')" class="type-card">
                <span class="type-icon app-icon app-icon--lg">storefront</span>
                <span class="type-title">Bidder</span>
                <span class="type-description">Discover verified crops and participate in auctions.</span>
              </button>
            </div>
          </div>
        } @else {
          <form (ngSubmit)="onSubmit()" class="register-form">
            <div class="form-section">
              <h3>Personal details</h3>
              <div class="form-row">
                <div class="field">
                  <label>Full name *</label>
                  <input class="input" type="text" [(ngModel)]="formData.fullName" name="fullName" required />
                </div>
              </div>
              <div class="form-row">
                <div class="field">
                  <label>Contact number *</label>
                  <input class="input" type="tel" [(ngModel)]="formData.contactNo" name="contactNo" required />
                </div>
                <div class="field">
                  <label>Email address *</label>
                  <input class="input" type="email" [(ngModel)]="formData.email" name="email" required />
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Address details</h3>
              <div class="field">
                <label>Address line 1 *</label>
                <input class="input" type="text" [(ngModel)]="formData.addressLine1" name="addressLine1" required />
              </div>
              <div class="field">
                <label>Address line 2</label>
                <input class="input" type="text" [(ngModel)]="formData.addressLine2" name="addressLine2" />
              </div>
              <div class="form-row">
                <div class="field">
                  <label>City *</label>
                  <input class="input" type="text" [(ngModel)]="formData.city" name="city" required />
                </div>
                <div class="field">
                  <label>State *</label>
                  <input class="input" type="text" [(ngModel)]="formData.state" name="state" required />
                </div>
                <div class="field">
                  <label>PIN code *</label>
                  <input class="input" type="text" [(ngModel)]="formData.pincode" name="pincode" required />
                </div>
              </div>
            </div>

            @if (userType() === 'farmer') {
              <div class="form-section">
                <h3>Land details</h3>
                <div class="form-row">
                  <div class="field">
                    <label>Area (in hectares) *</label>
                    <input class="input" type="number" [(ngModel)]="formData.landArea" name="landArea" required />
                  </div>
                  <div class="field">
                    <label>Land PIN code *</label>
                    <input class="input" type="text" [(ngModel)]="formData.landPincode" name="landPincode" required />
                  </div>
                </div>
                <div class="field">
                  <label>Land address *</label>
                  <input class="input" type="text" [(ngModel)]="formData.landAddress" name="landAddress" required />
                </div>
              </div>
            }

            <div class="form-section">
              <h3>Bank details</h3>
              <div class="form-row">
                <div class="field">
                  <label>Account number *</label>
                  <input class="input" type="text" [(ngModel)]="formData.accountNo" name="accountNo" required />
                </div>
                <div class="field">
                  <label>IFSC code *</label>
                  <input class="input" type="text" [(ngModel)]="formData.ifscCode" name="ifscCode" required />
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Government details</h3>

  <div class="form-row">
    <div class="field">
      <label>Aadhaar number *</label>
      <input
        class="input"
        type="text"
        [(ngModel)]="formData.aadhaarNo"
        name="aadhaarNo"
        required
      />
    </div>

    <div class="field">
      <label>PAN number *</label>
      <input
        class="input"
        type="text"
        [(ngModel)]="formData.panNo"
        name="panNo"
        required
      />
    </div>
  </div>

  <!-- Farmer Field -->
  @if (userType() === 'farmer') {
    <div class="field">
      <label>Plot number *</label>
      <input
        class="input"
        type="text"
        [(ngModel)]="formData.plotNo"
        name="plotNo"
        required
      />
    </div>
  }

  <!-- Bidder Field -->
  @if (userType() === 'bidder') {
    <div class="field">
      <label>Trading license number *</label>
      <input
        class="input"
        type="text"
        [(ngModel)]="formData.tradingLicenseNo"
        name="tradingNo"
        required
      />
    </div>
  }

</div>

            <div class="form-section">
              <h3>Account security</h3>
              <div class="form-row">
                <div class="field">
                  <label>Password *</label>
                  <input class="input" type="password" [(ngModel)]="formData.password" name="password" required />
                </div>
                <div class="field">
                  <label>Confirm password *</label>
                  <input class="input" type="password" [(ngModel)]="formData.confirmPassword" name="confirmPassword" required />
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" (click)="resetForm()" class="btn btn-secondary">
                <span class="app-icon app-icon--muted">restart_alt</span>
                Reset
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="loading()">
                @if (loading()) {
                  <span class="btn-spinner"></span>
                } @else {
                  <span class="app-icon">person_add</span>
                  Register account
                }
              </button>
            </div>
          </form>
        }

        <div class="register-footer">
          <p>Already registered? <a routerLink="/login" class="link">Sign in instead</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-shell {
      min-height: calc(100vh - 3rem);
      padding: 2.5rem 1.5rem;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }

    .register-card {
      width: 100%;
      max-width: 920px;
      padding: 2.4rem 2.5rem 2.7rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .register-header {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .logo-row {
      display: flex;
      align-items: center;
      gap: 0.9rem;
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

    .register-header h1 {
      font-size: 1.7rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--text-main);
    }

    .register-header p {
      font-size: 0.9rem;
      color: var(--text-muted);
      max-width: 32rem;
    }

    .eyebrow {
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--text-soft);
    }

    .user-type-selection {
      padding: 1.4rem 1.6rem 0;
      border-radius: 1.2rem;
      background-color: var(--bg-muted);
      border: 1px dashed var(--border-subtle);
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      margin-bottom: 0.4rem;
    }

    .user-type-selection h2 {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .type-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      margin-top: 0.4rem;
    }

    .type-card {
      padding: 1.35rem 1.4rem;
      border-radius: 1rem;
      border: 1px solid var(--border-subtle);
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.55rem;
      cursor: pointer;
      transition:
        border-color var(--transition-fast),
        box-shadow var(--transition-fast),
        transform var(--transition-fast),
        background-color var(--transition-fast);
    }

    .type-card:hover {
      transform: translateY(-1px);
      border-color: rgba(22, 163, 74, 0.5);
      box-shadow: var(--shadow-soft);
      background-color: #f9fafb;
    }

    .type-icon {
      width: 32px;
      height: 32px;
      border-radius: 999px;
      background-color: var(--primary-soft);
      color: var(--primary-strong);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .type-title {
      font-size: 0.98rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .type-description {
      font-size: 0.84rem;
      color: var(--text-muted);
      text-align: left;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
      margin-top: 0.2rem;
    }

    .form-section {
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .form-section:last-of-type {
      border-bottom: none;
      padding-bottom: 0;
    }

    .form-section h3 {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 0.9rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 1rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .field label {
      font-size: 0.84rem;
      font-weight: 500;
      color: var(--text-muted);
    }

    .form-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 0.25rem;
    }

    .register-footer {
      margin-top: 0.25rem;
      font-size: 0.86rem;
      color: var(--text-soft);
      text-align: center;
    }

    .link {
      color: var(--primary-strong);
      font-weight: 500;
      text-decoration: none;
    }

    .link:hover {
      text-decoration: underline;
    }

    @media (max-width: 900px) {
      .register-card {
        padding-inline: 1.7rem;
      }

      .type-grid {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    @media (max-width: 600px) {
      .register-shell {
        padding-inline: 1.2rem;
      }

      .register-card {
        padding-inline: 1.4rem;
      }

      .form-row {
        grid-template-columns: minmax(0, 1fr);
      }
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
