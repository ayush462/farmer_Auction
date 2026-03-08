import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-bidding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bidding-container">
      <div class="header">
        <h1>Crop Bidding</h1>
        <p>Sell your crops at the best market price</p>
      </div>

      <div class="tabs">
        <button
          [class.active]="activeTab() === 'sell'"
          (click)="activeTab.set('sell')"
          class="tab-btn"
        >
          Place Sell Request
        </button>
        <button
          [class.active]="activeTab() === 'history'"
          (click)="loadSoldHistory()"
          class="tab-btn"
        >
          History
        </button>
        <button
          [class.active]="activeTab() === 'marketplace'"
          (click)="loadMarketplace()"
          class="tab-btn"
        >
          View Marketplace
        </button>
      </div>

      @if (successMessage()) {
        <div class="alert alert-success">{{ successMessage() }}</div>
      }

      @if (errorMessage()) {
        <div class="alert alert-error">{{ errorMessage() }}</div>
      }

     @if (activeTab() === 'sell') {
<div class="content-card">
 <form #sellForm="ngForm" (ngSubmit)="placeSellRequest(sellForm)" class="sell-form">

    <div class="form-row">
      <div class="form-group">
        <label>Crop Type *</label>
        <input
          type="text"
          [(ngModel)]="sellData.cropType"
          name="cropType"
          placeholder="e.g. Grain"
          required
        />
      </div>

      <div class="form-group">
        <label>Crop Name *</label>
        <input
          type="text"
          [(ngModel)]="sellData.cropName"
          name="cropName"
          placeholder="e.g. Wheat"
          required
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Fertilizer Type *</label>
        <input
          type="text"
          [(ngModel)]="sellData.fertilizerType"
          name="fertilizerType"
          placeholder="Organic / Chemical"
          required
        />
      </div>

      <div class="form-group">
        <label>Quantity (Quintals) *</label>
        <input
          type="number"
          [(ngModel)]="sellData.quantity"
          name="quantity"
          required
        />
      </div>
    </div>

    <div class="form-group">
      <label>Base Price (₹ per Quintal) *</label>
      <input
        type="number"
        [(ngModel)]="sellData.basePrice"
        name="basePrice"
        required
      />
    </div>

   <button type="submit" class="btn btn-primary" [disabled]="loading() || sellForm.invalid">

      @if (loading()) {
        <span class="spinner"></span> Submitting...
      } @else {
        Place Request
      }

    </button>

  </form>
</div>
}

     @if (activeTab() === 'history') {

<div class="history-dashboard">

<div class="stats-grid">

<div class="stat-card">
<h3>Total Crops</h3>
<span>{{ dashboard()?.totalCrops }}</span>
</div>

<div class="stat-card">
<h3>Approved Crops</h3>
<span>{{ dashboard()?.approvedCrops }}</span>
</div>

<div class="stat-card">
<h3>Sold Crops</h3>
<span>{{ dashboard()?.soldCrops }}</span>
</div>

<div class="stat-card">
<h3>Pending Crops</h3>
<span>{{ dashboard()?.pendingCrops }}</span>
</div>

<div class="stat-card earnings">
<h3>Total Earnings</h3>
<span>₹{{ dashboard()?.totalEarnings }}</span>
</div>

</div>

<div class="insurance-section">

<h3 id="insurance-policies">Insurance Policies</h3>

@if (dashboard()?.insurancePolicies?.length > 0) {

<table class="data-table">

<thead>
<tr>
<th>Policy ID</th>
<th>Crop ID</th>
<th>Crop Value</th>
<th>Premium</th>
<th>Status</th>
</tr>
</thead>

<tbody>

@for (policy of dashboard()?.insurancePolicies; track policy.id) {

<tr>
<td>#{{ policy.id }}</td>
<td>{{ policy.cropId }}</td>
<td>₹{{ policy.cropValue }}</td>
<td>₹{{ policy.premiumAmount }}</td>
<td>
<span class="policy-status">
{{ policy.status }}
</span>
</td>
</tr>

}

</tbody>

</table>

} @else {

<div class="empty-state">
<h4>No Insurance Policies</h4>
</div>

}

</div>

</div>

}

      @if (activeTab() === 'marketplace') {
        <div class="marketplace-grid">
          @if (marketplace().length > 0) {
            @for (item of marketplace(); track item.id) {
              <div class="marketplace-card">
                <div class="card-header">
                  <h3>{{ item.cropName }}</h3>
                  <span class="badge">{{ item.cropType }}</span>
                </div>
                <div class="card-body">
                  <div class="info-row">
                    <span class="label">Base Price:</span>
                    <span class="value">₹{{ item.basePrice }}</span>
                  </div>
                  <div class="info-row highlight">
                    <span class="label">Current Bid:</span>
                    <span class="value price">₹{{ item.currentBid }}</span>
                  </div>
                  @if (item.auctionStatus === 'LIVE') {

<div class="auction-live">
🟢 Auction Live
</div>

<div class="auction-timer">
⏳ {{ item.timeLeft }}
</div>

}

@if (item.auctionStatus === 'NOT_STARTED') {

<div class="auction-pending">
⏳ Waiting for admin to start auction
</div>

}

@if (item.auctionStatus === 'COMPLETED' && item.winnerName) {

<div class="winner">
🏆 Winner: {{ item.winnerName }}
</div>

}
                  <div class="info-row">
                    <span class="label">Quantity:</span>
                    <span class="value">{{ item.quantity }} Q</span>
                  </div>

                  @if (item.previousBids && item.previousBids.length > 0) {
                    <div class="previous-bids">
                      <h4>Previous Bids:</h4>
                      @for (bid of item.previousBids; track $index) {
                        <div class="bid-item">
                          <span>{{ bid.bidderName }}</span>
                          <span>₹{{ bid.amount }}</span>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            }
          } @else {
            <div class="empty-state">
              <span class="empty-icon">🌾</span>
              <h3>No active auctions</h3>
              <p>Your approved crops will appear in the marketplace</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .bidding-container {
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
      .auction-live{
 color:#22c55e;
 font-weight:700;
 margin-top:6px;
}

.auction-timer{
 color:#10b981;
 font-weight:700;
 margin-top:6px;
}

.auction-pending{
 color:#facc15;
 font-weight:700;
 margin-top:6px;
}
 #insurance-policies{
 color:#10b981;}

.winner{
 margin-top:10px;
 padding:10px;
 background:linear-gradient(135deg,#22c55e,#16a34a);
 border-radius:10px;
 color:white;
 font-weight:700;
 text-align:center;
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
      .history-dashboard{
display:flex;
flex-direction:column;
gap:30px;
}

.stats-grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
gap:20px;
}

.stat-card{
background:linear-gradient(135deg,#10b981,#059669);
padding:20px;
border-radius:14px;
text-align:center;
color:white;
box-shadow:0 6px 20px rgba(16,185,129,.4);
}

.stat-card span{
font-size:28px;
font-weight:700;
display:block;
margin-top:6px;
}

.earnings{
background:linear-gradient(135deg,#22c55e,#16a34a);
}

.insurance-section{
background:rgba(16,185,129,.08);
border:1px solid rgba(16,185,129,.3);
padding:20px;
border-radius:16px;
}

.policy-status{
padding:4px 10px;
background:#22c55e;
color:white;
border-radius:6px;
font-size:12px;
font-weight:600;
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
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 30px rgba(16, 185, 129, 0.6);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
    }

    .data-table td {
      color: #cbd5e1;
      padding: 1rem;
      border-bottom: 1px solid rgba(16, 185, 129, 0.1);
    }

    .data-table tr:hover {
      background: rgba(16, 185, 129, 0.05);
    }

    .total-price {
      color: #10b981;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .marketplace-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .marketplace-card {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.05));
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 20px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      animation: fadeInUp 0.5s ease-out;
    }

    .marketplace-card:hover {
      transform: translateY(-5px);
      border-color: #10b981;
      box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(16, 185, 129, 0.2);
    }

    .card-header h3 {
      color: #fff;
      font-size: 1.25rem;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
    }

    .info-row.highlight {
      background: rgba(16, 185, 129, 0.1);
      padding: 1rem;
      border-radius: 12px;
      margin: 0.5rem 0;
    }

    .info-row .label {
      color: #94a3b8;
      font-weight: 500;
    }

    .info-row .value {
      color: #cbd5e1;
      font-weight: 600;
    }

    .info-row .value.price {
      color: #10b981;
      font-size: 1.25rem;
    }

    .previous-bids {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(16, 185, 129, 0.2);
    }

    .previous-bids h4 {
      color: #10b981;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .bid-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;
      font-size: 0.875rem;
      color: #94a3b8;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: #cbd5e1;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: #94a3b8;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
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
export class BiddingComponent implements OnInit {
  activeTab = signal<'sell' | 'history' | 'marketplace'>('sell');
  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  soldHistory = signal<any[]>([]);
  marketplace = signal<any[]>([]);
  auctionTimers:any = {};
  dashboard = signal<any>(null);

 sellData: any = {
  cropType: '',
  cropName: '',
  fertilizerType: '',
  quantity: null,
  basePrice: null
};

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadMarketplace();
  }

  

 async placeSellRequest(form: any) {

  if (form.invalid) {
    this.errorMessage.set('Please fill all required fields');
    return;
  }

  this.successMessage.set('');
  this.errorMessage.set('');
  this.loading.set(true);

  const payload = {
    farmerId: this.authService.currentUser()?.id,
    cropType: this.sellData.cropType,
    cropName: this.sellData.cropName,
    fertilizerType: this.sellData.fertilizerType,
    quantity: Number(this.sellData.quantity),
    basePrice: Number(this.sellData.basePrice)
  };

  const result = await this.apiService.placeSellRequest(payload);

  this.loading.set(false);

  if (result.success) {

    this.successMessage.set(result.message || 'Sell request submitted successfully!');

    form.resetForm();

  } else {

    this.errorMessage.set(result.message || 'Failed to submit request');

  }
}
startTimer(crop:any,endTime:number){

 if(this.auctionTimers[crop.id]) return;

 this.auctionTimers[crop.id] = setInterval(()=>{

  const diff = endTime - Date.now();

  if(diff <= 0){

    clearInterval(this.auctionTimers[crop.id]);

    crop.timeLeft = "Auction Completed";
    crop.auctionStatus = "COMPLETED";

    this.marketplace.set([...this.marketplace()]);

    return;

  }

  const minutes = Math.floor(diff/60000);
  const seconds = Math.floor((diff%60000)/1000);

  crop.timeLeft = `${minutes}:${seconds.toString().padStart(2,'0')}`;

  this.marketplace.set([...this.marketplace()]);

 },1000);

}
  async loadSoldHistory(){

  this.activeTab.set('history');

  const farmerId = Number(this.authService.currentUser()?.id);

  if(!farmerId) return;

  const data = await this.apiService.getFarmerDashboard(farmerId);

  this.dashboard.set(data);

}

  async loadMarketplace(){

  this.activeTab.set('marketplace');

  const data = await this.apiService.getMarketplace();

  const now = Date.now();

  for(const crop of data){

    const bid = await this.apiService.getHighestBid(crop.id);

    crop.currentBid = bid?.bidAmount ?? crop.basePrice;

    const auction = await this.apiService.getAuction(crop.id);

    //--------------------------------
    // NO AUCTION CREATED
    //--------------------------------

    if(!auction){

      crop.auctionStatus = "NOT_STARTED";
      crop.timeLeft = "Waiting for admin";

      continue;

    }

    const start = new Date(auction.startTime).getTime();
    const end = new Date(auction.endTime).getTime();

    //--------------------------------
    // AUCTION NOT STARTED
    //--------------------------------

    if(now < start){

      crop.auctionStatus = "NOT_STARTED";
      crop.timeLeft = "Waiting for admin";

    }

    //--------------------------------
    // AUCTION LIVE
    //--------------------------------

    else if(now >= start && now < end){

      crop.auctionStatus = "LIVE";

      this.startTimer(crop,end);

    }

    //--------------------------------
    // AUCTION COMPLETED
    //--------------------------------

    else{

      crop.auctionStatus = "COMPLETED";
      crop.timeLeft = "Auction Completed";

      const winner = await this.apiService.getAuctionWinner(crop.id);

      if(winner){

        crop.winnerName =
          await this.apiService.getUserById(winner.bidderId);

      }

    }

  }

  this.marketplace.set(data);

}
}
