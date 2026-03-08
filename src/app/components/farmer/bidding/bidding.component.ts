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
    <div class="page-fade">
      <header class="content-header">
        <h1 class="page-title">Crop Bidding</h1>
        <p class="text-muted">Manage your sell requests and monitor the marketplace.</p>
      </header>

      <div class="tab-group card">
        <button [class.active]="activeTab() === 'sell'" (click)="activeTab.set('sell')">
          New Request
        </button>
        <button [class.active]="activeTab() === 'history'" (click)="loadSoldHistory()">
          My Portfolio
        </button>
        <button [class.active]="activeTab() === 'marketplace'" (click)="loadMarketplace()">
          Market Overview
        </button>
      </div>

      @if (successMessage()) {
        <div class="alert alert-success">{{ successMessage() }}</div>
      }

      @if (activeTab() === 'sell') {
        <div class="card p-8">
          <form #sellForm="ngForm" (ngSubmit)="placeSellRequest(sellForm)" class="form-grid">
            <div class="grid-2">
              <div class="field">
                <label>Crop Type</label>
                <input class="input" type="text" [(ngModel)]="sellData.cropType" name="cropType" placeholder="e.g. Grain" required />
              </div>
              <div class="field">
                <label>Crop Name</label>
                <input class="input" type="text" [(ngModel)]="sellData.cropName" name="cropName" placeholder="e.g. Wheat" required />
              </div>
            </div>

            <div class="grid-2">
              <div class="field">
                <label>Fertilizer Type</label>
                <input class="input" type="text" [(ngModel)]="sellData.fertilizerType" name="fertilizerType" placeholder="Organic / Chemical" required />
              </div>
              <div class="field">
                <label>Quantity (Quintals)</label>
                <input class="input" type="number" [(ngModel)]="sellData.quantity" name="quantity" required />
              </div>
            </div>

            <div class="field">
              <label>Base Price (₹ per Quintal)</label>
              <input class="input" type="number" [(ngModel)]="sellData.basePrice" name="basePrice" required />
            </div>

            <div class="form-actions pt-4">
              <button type="submit" class="btn btn-primary" [disabled]="loading() || sellForm.invalid">
                @if (loading()) { Submitting... } @else { Place Sell Request }
              </button>
            </div>
          </form>
        </div>
      }

      @if (activeTab() === 'history') {
        <div class="history-view">
          <div class="stats-row">
            <div class="stat-card card">
              <span class="label">Total Listed</span>
              <span class="value">{{ dashboard()?.totalCrops }}</span>
            </div>
            <div class="stat-card card">
              <span class="label">Approved</span>
              <span class="value">{{ dashboard()?.approvedCrops }}</span>
            </div>
            
          </div>

          <div class="card mt-8 overflow-hidden">
            <header class="card-header border-b">
              <h3 class="text-sm font-bold uppercase tracking-wider">Insurance Policies</h3>
            </header>
            <table class="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Value</th>
                  <th>Premium</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                @for (policy of dashboard()?.insurancePolicies; track policy.id) {
                  <tr>
                    <td>#{{ policy.id }}</td>
                    <td>₹{{ policy.cropValue }}</td>
                    <td>₹{{ policy.premiumAmount }}</td>
                    <td><span class="badge-soft">{{ policy.status }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      @if (activeTab() === 'marketplace') {

<div class="marketplace-grid">

@for (crop of marketplace(); track crop.id) {

<div class="crop-item card">

<div class="crop-header">

<div>
<h3 class="crop-name">{{ crop.cropName }}</h3>
<span class="crop-type-badge">{{ crop.cropType }}</span>
</div>

<div class="auction-status" [ngClass]="crop.auctionStatus?.toLowerCase()">

@if (crop.auctionStatus === 'LIVE') {

<span class="dot pulse"></span>
Live: {{ crop.timeLeft }}

}

@else if (crop.auctionStatus === 'COMPLETED') {

<span class="app-icon text-xs">check_circle</span>
Ended

}

@else {

<span class="app-icon text-xs">schedule</span>
Upcoming

}

</div>

</div>

<div class="crop-body">

<div class="price-section">

<div class="price-box">
<span class="price-label">Current Bid</span>
<span class="price-value">₹{{ crop.currentBid }}</span>
</div>

<div class="price-box">
<span class="price-label">Base Price</span>
<span class="price-value">₹{{ crop.basePrice }}</span>
</div>

</div>

<div class="detail-row">
<span>Quantity</span>
<strong>{{ crop.quantity }} Quintals</strong>
</div>

@if (crop.auctionStatus === 'COMPLETED' && crop.winnerName) {

<div class="winner-announcement">
<span class="app-icon">emoji_events</span>
Winner: <strong>{{ crop.winnerName }}</strong>
</div>

}

</div>

</div>

}

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

    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .stat-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
    .stat-card.highlight { background-color: var(--primary); color: var(--primary-foreground); }
    .stat-card .label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; opacity: 0.8; }
    .stat-card .value { font-size: 1.5rem; font-weight: 700; }

    .admin-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    .admin-table th { text-align: left; padding: 0.75rem 1rem; background-color: var(--muted); border-bottom: 1px solid var(--border); font-weight: 600; }
    .admin-table td { padding: 1rem; border-bottom: 1px solid var(--border); }

    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .crop-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .crop-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .crop-header h3 { font-size: 1.125rem; font-weight: 700; }

    .price-box { display: flex; flex-direction: column; gap: 0.125rem; }
    .price-label { font-size: 0.7rem; font-weight: 600; color: var(--muted-foreground); text-transform: uppercase; }
    .price-value { font-size: 1.5rem; font-weight: 700; }

    .auction-live-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.75rem;
      background-color: #f0fdf4;
      color: #16a34a;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .dot { width: 6px; height: 6px; border-radius: 999px; background-color: currentColor; }
    .pulse { animation: pulse 2s infinite; }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

    .alert { padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; font-size: 0.875rem; font-weight: 500; }
    .alert-success { background-color: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

    .p-8 { padding: 2rem; }
    .pt-4 { padding-top: 1rem; }
    .mt-8 { margin-top: 2rem; }
    .border-b { border-bottom: 1px solid var(--border); }
    .card-header { padding: 1rem; }
    .overflow-hidden { overflow: hidden; }
    .detail-row { display: flex; justify-content: space-between; }

    @media (max-width: 768px) {
      .grid-2, .grid-3, .stats-row { grid-template-columns: 1fr; }
    }
      .marketplace-grid{
display:grid;
grid-template-columns:repeat(auto-fill,minmax(350px,1fr));
gap:1.5rem;
}

.crop-item{
display:flex;
flex-direction:column;
overflow:hidden;
}

.crop-header{
padding:1.25rem;
border-bottom:1px solid var(--border);
display:flex;
justify-content:space-between;
align-items:flex-start;
}

.crop-name{
font-size:1.125rem;
font-weight:700;
}

.crop-type-badge{
font-size:0.7rem;
font-weight:600;
color:var(--muted-foreground);
text-transform:uppercase;
}

.crop-body{
padding:1.5rem;
display:flex;
flex-direction:column;
gap:1rem;
}

.price-section{
display:grid;
grid-template-columns:1fr 1fr;
gap:1rem;
}

.price-box{
display:flex;
flex-direction:column;
}

.price-label{
font-size:0.7rem;
font-weight:600;
color:var(--muted-foreground);
text-transform:uppercase;
}

.price-value{
font-size:1.3rem;
font-weight:700;
}

.auction-status{
display:flex;
align-items:center;
gap:0.4rem;
font-size:0.75rem;
font-weight:600;
padding:0.25rem 0.5rem;
border-radius:999px;
background:var(--muted);
}

.auction-status.live{
background:#f0fdf4;
color:#16a34a;
}

.dot{
width:6px;
height:6px;
border-radius:999px;
background:currentColor;
}

.pulse{
animation:pulse 2s infinite;
}

@keyframes pulse{
0%{opacity:1}
50%{opacity:.4}
100%{opacity:1}
}

.winner-announcement{
background:#fff9db;
padding:.75rem;
border-radius:var(--radius-md);
display:flex;
gap:.5rem;
align-items:center;
font-size:.875rem;
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
  farmerEarnings = 0;

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
  console.log("FARMER DASHBOARD:", data);

  this.dashboard.set(data);

}

  async loadMarketplace(){

  this.activeTab.set('marketplace');
   this.farmerEarnings = 0;  

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

   const start = new Date(auction.startTime + "Z").getTime();
const end = new Date(auction.endTime + "Z").getTime();

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

    // ADD THIS
    this.farmerEarnings += Number(winner?.bidAmount || 0);

  }



    }

  }
  this.dashboard.update((d:any)=>({
  ...d,
  totalEarnings: this.farmerEarnings
}));

  this.marketplace.set(data);

}
}
