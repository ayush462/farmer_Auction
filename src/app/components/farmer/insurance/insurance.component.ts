import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-fade">
      <header class="content-header">
        <h1 class="page-title">Fasal Bima Yojna</h1>
        <p class="text-muted">Government-backed insurance to secure your agricultural future.</p>
      </header>

      <div class="tab-group card">
        <button [class.active]="activeTab() === 'apply'" (click)="activeTab.set('apply')">
          New Application
        </button>
        <button [class.active]="activeTab() === 'claim'" (click)="activeTab.set('claim')">
          Submit Claim
        </button>
      </div>

      @if (successMessage()) {
        <div class="alert alert-success">{{ successMessage() }}</div>
      }

      @if (activeTab() === 'apply') {
        <div class="form-container">
          <div class="card p-8">
            <form (ngSubmit)="calculateInsurance()" class="form-grid">
              <h3 class="text-lg font-bold mb-4">Premium Calculator</h3>

              <div class="grid-2">
                <div class="field">
                  <label>Season</label>
                  <select class="select" [(ngModel)]="insuranceData.season" name="season" required>
                    <option value="">Select Season</option>
                    <option value="kharif">Kharif</option>
                    <option value="rabi">Rabi</option>
                    <option value="annual">Annual/Horticultural</option>
                  </select>
                </div>
                <div class="field">
                  <label>Year</label>
                  <input class="input" type="number" [(ngModel)]="insuranceData.year" name="year" placeholder="2024" required />
                </div>
              </div>

              <div class="grid-2">
                <div class="field">
                  <label>Select Crop</label>
                  <select class="select" [ngModel]="selectedCropId()" (ngModelChange)="selectedCropId.set($event)" name="cropId" required>
                    <option value="">Select Crop</option>
                    @for (crop of crops(); track crop.id) {
                      <option [value]="crop.id">{{ crop.cropName }}</option>
                    }
                  </select>
                </div>
                <div class="field">
                  <label>Area (Hectares)</label>
                  <input class="input" type="number" [(ngModel)]="insuranceData.area" name="area" placeholder="Enter area" required />
                </div>
              </div>

              <div class="field">
                <label>Sum Insured (per Hectare)</label>
                <input class="input" type="number" [(ngModel)]="insuranceData.sumInsured" name="sumInsured" placeholder="Enter sum insured" required />
              </div>

              <div class="form-actions pt-4">
                <button type="button" (click)="resetCalculator()" class="btn btn-secondary">Reset</button>
                <button type="submit" class="btn btn-primary" [disabled]="loading()">
                  @if (loading()) { Calculating... } @else { Calculate Premium }
                </button>
              </div>
            </form>
          </div>

          @if (calculatedPremium()) {
            <div class="card p-8 mt-6 highlight-card">
              <h3 class="text-lg font-bold mb-6">Application Summary</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="label">Total Sum Insured</span>
                  <span class="value">₹{{ calculatedPremium().totalSumInsured }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">Your Share ({{ calculatedPremium().sharePremium }}%)</span>
                  <span class="value text-primary">₹{{ calculatedPremium().premiumAmount }}</span>
                </div>
              </div>

              <div class="info-box mt-6">
                <p class="text-sm italic">The balance premium will be covered by the Government schemes.</p>
              </div>

              <button (click)="applyInsurance()" class="btn btn-primary w-full mt-8 btn-lg">
                Apply for Policy
              </button>
            </div>
          }
        </div>
      }

      @if (activeTab() === 'claim') {
        <div class="card p-8">
          <form (ngSubmit)="submitClaim()" class="form-grid">
            <h3 class="text-lg font-bold mb-4">Submit New Claim</h3>

            <div class="grid-2">
              <div class="field">
                <label>Select Policy</label>
                <select class="select" [ngModel]="selectedPolicyId()" (ngModelChange)="selectedPolicyId.set($event)" name="policyId" required>
                  <option value="">Select Policy</option>
                  @for (policy of policies(); track policy.id) {
                    <option [value]="policy.id">Policy #{{ policy.id }} - Crop {{ policy.cropId }}</option>
                  }
                </select>
              </div>
              <div class="field">
                <label>Insurance Company</label>
                <input class="input" type="text" [(ngModel)]="claimData.insuranceCompany" name="insuranceCompany" required />
              </div>
            </div>

            <div class="grid-2">
              <div class="field">
                <label>Claim Amount</label>
                <input class="input" type="number" [(ngModel)]="claimData.claimAmount" name="claimAmount" required />
              </div>
              <div class="field">
                <label>Cause of Loss</label>
                <select class="select" [(ngModel)]="claimData.causeOfLoss" name="causeOfLoss" required>
                  <option value="">Select Cause</option>
                  <option value="Flood">Flood</option>
                  <option value="Drought">Drought</option>
                  <option value="Pest">Pest Attack</option>
                  <option value="Disease">Disease</option>
                  <option value="Cyclone">Cyclone</option>
                </select>
              </div>
            </div>

            <div class="field">
              <label>Date of Loss</label>
              <input class="input" type="date" [(ngModel)]="claimData.dateOfLoss" name="dateOfLoss" required />
            </div>

            <div class="form-actions pt-4">
              <button type="submit" class="btn btn-primary" [disabled]="loading()">
                @if (loading()) { Submitting... } @else { Submit Claim Request }
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
  styles: [`
    .content-header { margin-bottom: 2rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.025em; }
    .text-muted { color: var(--muted-foreground); }

    .tab-group {
      display: flex;
      padding: 0.25rem;
      gap: 0.25rem;
      margin-bottom: 2.5rem;
      background-color: var(--muted);
      border-radius: var(--radius-md);
    }

    .tab-group button {
      flex: 1;
      padding: 0.5rem;
      border: none;
      background: transparent;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--muted-foreground);
      cursor: pointer;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }

    .tab-group button.active {
      background-color: var(--background);
      color: var(--foreground);
      box-shadow: var(--shadow-sm);
    }

    .form-grid { display: flex; flex-direction: column; gap: 1.5rem; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .field { display: flex; flex-direction: column; gap: 0.5rem; }
    .field label { font-size: 0.875rem; font-weight: 500; }

    .highlight-card { border-color: var(--foreground); background-color: var(--muted); }
    .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .summary-item { display: flex; flex-direction: column; gap: 0.5rem; }
    .summary-item .label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--muted-foreground); }
    .summary-item .value { font-size: 1.5rem; font-weight: 700; }

    .alert { padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; font-size: 0.875rem; font-weight: 500; }
    .alert-success { background-color: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

    .p-8 { padding: 2rem; }
    .pt-4 { padding-top: 1rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .w-full { width: 100%; }
    .text-sm { font-size: 0.875rem; }
    .text-lg { font-size: 1.125rem; }
    .font-bold { font-weight: 700; }
    .italic { font-style: italic; }
    .btn-lg { padding: 0.75rem 1.5rem; font-size: 1rem; }

    .info-box { padding: 1rem; background-color: var(--background); border-radius: var(--radius-sm); border-left: 4px solid var(--primary); }

    @media (max-width: 768px) {
      .grid-2, .summary-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class InsuranceComponent {
  activeTab = signal<'apply' | 'claim'>('apply');
  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  calculatedPremium = signal<any>(null);
  crops = signal<any[]>([]);
selectedCropId = signal<number | null>(null);
policies = signal<any[]>([]);
selectedPolicyId = signal<number | null>(null);

  insuranceData = {
    season: '',
    year: new Date().getFullYear(),
    crop: '',
    area: '',
    sumInsured: ''
  };

 claimData = {
  insuranceCompany: '',
  causeOfLoss: '',
  dateOfLoss: '',
  claimAmount: ''
};
  constructor(private apiService: ApiService, private authService: AuthService) {}
  ngOnInit() {
  this.loadCrops();
  this.loadPolicies();
}
async loadCrops() {

  const allCrops = await this.apiService.getMarketplace();

  const farmerId = Number(this.authService.currentUser()?.id);

  const farmerCrops = allCrops.filter(c => c.farmerId === farmerId);

  this.crops.set(farmerCrops);

}
async loadPolicies() {

  const farmerId = Number(this.authService.currentUser()?.id);

  const policies = await this.apiService.getFarmerPolicies(farmerId);

  this.policies.set(policies);

}

  async calculateInsurance() {
    this.successMessage.set('');
    this.errorMessage.set('');
    this.loading.set(true);

    let sharePremium = 0;
    if (this.insuranceData.season === 'kharif') sharePremium = 2;
    else if (this.insuranceData.season === 'rabi') sharePremium = 1.5;
    else if (this.insuranceData.season === 'annual') sharePremium = 5;

    const totalSumInsured = Number(this.insuranceData.sumInsured) * Number(this.insuranceData.area);
    const premiumAmount = (totalSumInsured * sharePremium) / 100;

    this.calculatedPremium.set({
      company: 'National Agricultural Insurance Scheme',
      totalSumInsured,
      sharePremium,
      premiumAmount: premiumAmount.toFixed(2)
    });

    this.loading.set(false);
  }

  resetCalculator() {
    this.insuranceData = {
      season: '',
      year: new Date().getFullYear(),
      crop: '',
      area: '',
      sumInsured: ''
    };
    this.calculatedPremium.set(null);
  }

 async applyInsurance() {

  this.successMessage.set('');
  this.errorMessage.set('');
  this.loading.set(true);

  const farmerId = Number(this.authService.currentUser()?.id);

  const cropId = this.selectedCropId();

  if(!cropId){
    this.errorMessage.set("Please select a crop");
    this.loading.set(false);
    return;
  }

  const body = {

    farmerId: farmerId,
    cropId: cropId,
    season: this.insuranceData.season.toUpperCase(),
    year: Number(this.insuranceData.year),
    area: Number(this.insuranceData.area),
    sumInsured: Number(this.insuranceData.sumInsured),
    cropValue: Number(this.calculatedPremium()?.totalSumInsured)

  };

  const result = await this.apiService.applyInsurance(body);

  this.loading.set(false);

  if (result.success) {

    this.successMessage.set(result.message || "Insurance applied successfully");

    this.resetCalculator();

  } else {

    this.errorMessage.set(result.message || "Application failed");

  }

}
 

  async submitClaim() {

  this.successMessage.set('');
  this.errorMessage.set('');
  this.loading.set(true);

  const farmerId = Number(this.authService.currentUser()?.id);

  const policyId = this.selectedPolicyId();

  if (!policyId) {

    this.errorMessage.set("Please select a policy");

    this.loading.set(false);

    return;

  }

  const body = {

    policyId: policyId,
    farmerId: farmerId,
    insuranceCompany: this.claimData.insuranceCompany,
    causeOfLoss: this.claimData.causeOfLoss,
    dateOfLoss: this.claimData.dateOfLoss,
    claimAmount: Number(this.claimData.claimAmount)

  };

  const result = await this.apiService.claimInsurance(body);

  this.loading.set(false);

  if (result.success) {

    this.successMessage.set("Claim submitted successfully");

  } else {

    this.errorMessage.set(result.message || "Claim failed");

  }

}
}
