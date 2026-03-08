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
    <div class="insurance-container">
      <div class="header">
        <h1>Fasal Bima Yojna</h1>
        <p>Protect your crops with government-backed insurance</p>
      </div>

      <div class="tabs">
        <button
          [class.active]="activeTab() === 'apply'"
          (click)="activeTab.set('apply')"
          class="tab-btn"
        >
          Apply for Insurance
        </button>
        <button
          [class.active]="activeTab() === 'claim'"
          (click)="activeTab.set('claim')"
          class="tab-btn"
        >
          Claim Insurance
        </button>
      </div>

      @if (successMessage()) {
        <div class="alert alert-success">{{ successMessage() }}</div>
      }

      @if (errorMessage()) {
        <div class="alert alert-error">{{ errorMessage() }}</div>
      }

      @if (activeTab() === 'apply') {
        <div class="content-card">
          <form (ngSubmit)="calculateInsurance()" class="insurance-form">
            <h3>Calculate Insurance Premium</h3>

            <div class="form-row">
              <div class="form-group">
                <label>Season *</label>
                <select [(ngModel)]="insuranceData.season" name="season" required>
                  <option value="">Select Season</option>
                  <option value="kharif">Kharif</option>
                  <option value="rabi">Rabi</option>
                  <option value="annual">Annual/Horticultural</option>
                </select>
              </div>
              <div class="form-group">
                <label>Year *</label>
                <input type="number" [(ngModel)]="insuranceData.year" name="year" placeholder="2024" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Crop *</label>
                <select
  [ngModel]="selectedCropId()"
  (ngModelChange)="selectedCropId.set($event)"
  name="cropId"
  required
>
  <option value="">Select Crop</option>

  @for (crop of crops(); track crop.id) {
    <option [value]="crop.id">
      {{ crop.cropName }}
    </option>
  }
</select>
              </div>
              <div class="form-group">
                <label>Area (in Hectares) *</label>
                <input type="number" [(ngModel)]="insuranceData.area" name="area" placeholder="Enter area" required />
              </div>
            </div>

            <div class="form-group">
              <label>Sum Insured (per Hectare) *</label>
              <input type="number" [(ngModel)]="insuranceData.sumInsured" name="sumInsured" placeholder="Enter sum insured" required />
            </div>

            <div class="form-actions">
              <button type="button" (click)="resetCalculator()" class="btn btn-secondary">Reset</button>
              <button type="submit" class="btn btn-primary" [disabled]="loading()">
                @if (loading()) {
                  <span class="spinner"></span> Calculating...
                } @else {
                  Calculate
                }
              </button>
            </div>
          </form>

          @if (calculatedPremium()) {
            <div class="premium-result">
              <h3>Insurance Details</h3>
              <div class="result-grid">
                <div class="result-item">
                  <span class="label">Insurance Company:</span>
                  <span class="value">{{ calculatedPremium().company }}</span>
                </div>
                <div class="result-item">
                  <span class="label">Sum Insured per Hectare:</span>
                  <span class="value">₹{{ insuranceData.sumInsured }}</span>
                </div>
                <div class="result-item">
                  <span class="label">Total Area:</span>
                  <span class="value">{{ insuranceData.area }} Hectares</span>
                </div>
                <div class="result-item">
                  <span class="label">Total Sum Insured:</span>
                  <span class="value">₹{{ calculatedPremium().totalSumInsured }}</span>
                </div>
                <div class="result-item">
                  <span class="label">Share Premium:</span>
                  <span class="value">{{ calculatedPremium().sharePremium }}%</span>
                </div>
                <div class="result-item highlight">
                  <span class="label">Premium Amount (You Pay):</span>
                  <span class="value price">₹{{ calculatedPremium().premiumAmount }}</span>
                </div>
              </div>

              <div class="premium-info">
                <h4>Premium Rates:</h4>
                <ul>
                  <li>Kharif Crops: 2% of sum insured</li>
                  <li>Rabi Crops: 1.5% of sum insured</li>
                  <li>Annual/Horticultural Crops: 5% of sum insured</li>
                </ul>
                <p>The balance premium will be paid by the Government</p>
              </div>

              <button (click)="applyInsurance()" class="btn btn-primary btn-apply">
                Apply for This Policy
              </button>
            </div>
          }
        </div>
      }

     @if (activeTab() === 'claim') {
  <div class="content-card">
    <form (ngSubmit)="submitClaim()" class="claim-form">
      <h3>Claim Insurance</h3>

      <div class="form-row">

        <div class="form-group">
          <label>Policy ID *</label>
          <select
  [ngModel]="selectedPolicyId()"
  (ngModelChange)="selectedPolicyId.set($event)"
  name="policyId"
  required
>

  <option value="">Select Policy</option>

  @for (policy of policies(); track policy.id) {

    <option [value]="policy.id">
      Policy {{ policy.id }} - Crop {{ policy.cropId }}
    </option>

  }

</select>
        </div>

        <div class="form-group">
          <label>Insurance Company *</label>
          <input type="text"
                 [(ngModel)]="claimData.insuranceCompany"
                 name="insuranceCompany"
                 required />
        </div>

      </div>

      <div class="form-row">

        <div class="form-group">
          <label>Claim Amount *</label>
          <input type="number"
                 [(ngModel)]="claimData.claimAmount"
                 name="claimAmount"
                 required />
        </div>

        <div class="form-group">
          <label>Cause of Loss *</label>
          <select [(ngModel)]="claimData.causeOfLoss" name="causeOfLoss" required>
            <option value="">Select Cause</option>
            <option value="Flood">Flood</option>
            <option value="Drought">Drought</option>
            <option value="Pest">Pest Attack</option>
            <option value="Disease">Disease</option>
            <option value="Cyclone">Cyclone</option>
          </select>
        </div>

      </div>

      <div class="form-group">
        <label>Date of Loss *</label>
        <input type="date"
               [(ngModel)]="claimData.dateOfLoss"
               name="dateOfLoss"
               required />
      </div>

      <button type="submit" class="btn btn-primary" [disabled]="loading()">
        @if (loading()) {
          <span class="spinner"></span> Submitting...
        } @else {
          Submit Claim
        }
      </button>

    </form>
  </div>
}
  `,
  styles: [`
    .insurance-container {
      animation: fadeIn 0.5s ease-out;
    }

    .header {
      margin-bottom: 2rem;
    }

    .header h1 {
      color: #fff;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .header p {
      color: #94a3b8;
    }

    .tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .tab-btn {
      padding: 1rem 2rem;
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 12px;
      color: #cbd5e1;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .tab-btn:hover {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border-color: #10b981;
    }

    .tab-btn.active {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border-color: transparent;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
    }

    .alert {
      padding: 1rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      animation: slideIn 0.3s ease-out;
    }

    .alert-success {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #6ee7b7;
    }

    .alert-error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
    }

    .content-card {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.05));
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 20px;
      padding: 2rem;
    }

    h3 {
      color: #10b981;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    h4 {
      color: #34d399;
      font-size: 1.125rem;
      margin-bottom: 1rem;
    }

    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid rgba(16, 185, 129, 0.2);
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      color: #10b981;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 1rem;
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 12px;
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
    }

    .helper-text {
      color: #94a3b8;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
      flex: 1;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 30px rgba(16, 185, 129, 0.6);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 2px solid #10b981;
      flex: 1;
    }

    .btn-secondary:hover {
      background: rgba(16, 185, 129, 0.2);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-apply {
      width: 100%;
      margin-top: 1.5rem;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .premium-result {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid rgba(16, 185, 129, 0.3);
    }

    .result-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .result-item {
      padding: 1rem;
      background: rgba(15, 23, 42, 0.5);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .result-item.highlight {
      background: rgba(16, 185, 129, 0.2);
      border: 2px solid #10b981;
    }

    .result-item .label {
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .result-item .value {
      color: #fff;
      font-weight: 600;
      font-size: 1.125rem;
    }

    .result-item .value.price {
      color: #10b981;
      font-size: 1.5rem;
    }

    .premium-info {
      background: rgba(52, 211, 153, 0.1);
      border-left: 3px solid #10b981;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
    }

    .premium-info h4 {
      color: #10b981;
      font-size: 1rem;
      margin-bottom: 0.75rem;
    }

    .premium-info ul {
      list-style: none;
      padding: 0;
      margin-bottom: 1rem;
    }

    .premium-info li {
      color: #cbd5e1;
      padding: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
    }

    .premium-info li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #10b981;
      font-weight: bold;
    }

    .premium-info p {
      color: #94a3b8;
      font-style: italic;
      margin: 0;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
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
