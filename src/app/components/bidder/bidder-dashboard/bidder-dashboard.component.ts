import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-bidder-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <nav class="navbar">
        <div class="nav-logo">
          <h1>🌾 Farm-Scheme</h1>
        </div>
        <div class="nav-user">
          <span>{{ authService.currentUser()?.name }}</span>
          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </nav>

      <div class="content">
        <div class="header">
          <h1>Crop Marketplace</h1>
          <p>Browse and bid on available crops</p>
        </div>

        @if (successMessage()) {
          <div class="alert alert-success">{{ successMessage() }}</div>
        }

        @if (errorMessage()) {
          <div class="alert alert-error">{{ errorMessage() }}</div>
        }
          <div class="stats-grid">

  <div class="stat-card">
    <h3>{{ dashboardStats().activeBids }}</h3>
    <p>Active Bids</p>
  </div>

  <div class="stat-card">
    <h3>{{ dashboardStats().totalBids }}</h3>
    <p>Total Bids</p>
  </div>

  <div class="stat-card">
    <h3>{{ dashboardStats().auctionsWon }}</h3>
    <p>Auctions Won</p>
  </div>

  <div class="stat-card">
    <h3>₹{{ dashboardStats().totalSpent }}</h3>
    <p>Total Spent</p>
  </div>

</div>

        <div class="crops-grid">
          @if (crops().length > 0) {
            @for (crop of crops(); track crop.id) {
              <div class="crop-card">
                <div class="card-header">
                  <h3>{{ crop.cropName }}</h3>
                  <span class="badge">{{ crop.cropType }}</span>
                </div>

                <div class="card-body">
                  <div class="info-row">
                    <span class="label">Base Price:</span>
                    <span class="value">₹{{ crop.basePrice }} / Q</span>
                  </div>
                  <div class="info-row highlight">
                    <span class="label">Current Bid:</span>
                    <span class="value price">₹{{ crop.currentBid }} / Q</span>
                  </div>
                 @if (crop.auctionStatus === 'LIVE') {

<div class="auction-live">
🟢 Auction Live
</div>

}
@if (crop.auctionStatus === 'NOT_STARTED') {

<div class="auction-pending">
⏳ {{ crop.timeLeft || 'Auction not started yet' }}
</div>

}

@if (crop.auctionStatus === 'LIVE') {

<div class="auction-timer">
⏳ {{ crop.timeLeft }}
</div>

}
@if (crop.auctionStatus === 'COMPLETED' && crop.winnerName) {

<div class="winner">
🏆 Winner: {{ crop.winnerName }}
</div>

}
                  <div class="info-row">
                    <span class="label">Quantity:</span>
                    <span class="value">{{ crop.quantity }} Quintals</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Farmer:</span>
                    <span class="value">{{ crop.farmerName }}</span>
                  </div>

                 @if (selectedCrop() === crop.id && !crop.closed) {
                    <div class="bid-input-section">
                      <div class="form-group">
                        <label>Your Bid Amount (per Quintal)</label>
                        <input
                          type="number"
                          [(ngModel)]="bidAmount"
                          placeholder="Enter amount"
                          [min]="crop.currentBid + 1"
                        />
                      </div>
                      <div class="bid-actions">
                        <button (click)="selectedCrop.set(null)" class="btn btn-secondary">Cancel</button>
                        <button (click)="confirmBid(crop)" class="btn btn-primary" [disabled]="loading()">
                          @if (loading()) {
                            <span class="spinner"></span>
                          } @else {
                            Confirm Bid
                          }
                        </button>
                      </div>
                    </div>
                  } @else {
                  @if (crop.auctionStatus === 'LIVE') {

<button
 (click)="selectedCrop.set(crop.id)"
 class="btn btn-bid">
Place Bid
</button>

}

@if (crop.auctionStatus === 'COMPLETED') {

<button class="btn btn-completed">
Auction Completed
</button>

}

@if (crop.auctionStatus === 'NOT_STARTED') {

<button class="btn btn-pending">
Waiting for Auction
</button>

}
                  }
                </div>

                @if (crop.previousBids && crop.previousBids.length > 0) {
                  <div class="previous-bids">
                    <h4>Bid History</h4>
                    @for (bid of crop.previousBids; track $index) {
                      <div class="bid-item">
                        <span>{{ bid.bidderName }}</span>
                        <span>₹{{ bid.amount }}</span>
                        <span class="time">{{ bid.time }}</span>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          } @else {
            <div class="empty-state">
              <span class="empty-icon">🌾</span>
              <h3>No crops available</h3>
              <p>Check back later for new crops to bid on</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 3rem;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(16, 185, 129, 0.2);
      position: sticky;
      top: 0;
      z-index: 100;
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

    .nav-logo h1 {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #10b981, #34d399);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: #cbd5e1;
      font-weight: 500;
    }

    .logout-btn {
      padding: 0.75rem 1.5rem;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      color: #fca5a5;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      transform: translateY(-2px);
    }

    .content {
      padding: 2rem 3rem;
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

    .crops-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 2rem;
    }
      .stats-grid{
 display:grid;
 grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
 gap:20px;
 margin-bottom:30px;
}

.stat-card{
 background:linear-gradient(135deg,#10b981,#059669);
 padding:20px;
 border-radius:16px;
 text-align:center;
 color:white;
 box-shadow:0 8px 25px rgba(16,185,129,.4);
 transition:.3s;
}

.stat-card:hover{
 transform:translateY(-4px);
}

.stat-card h3{
 font-size:28px;
 margin-bottom:5px;
 font-weight:700;
}

.stat-card p{
 opacity:.9;
 font-weight:500;
}

    .crop-card {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.05));
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 20px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      animation: fadeInUp 0.5s ease-out;
    }

    .crop-card:hover {
      transform: translateY(-5px);
      border-color: #10b981;
      box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(16, 185, 129, 0.2);
    }

    .card-header h3 {
      color: #fff;
      font-size: 1.5rem;
    }

    .badge {
      padding: 0.35rem 0.85rem;
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
      font-size: 1.5rem;
    }

    .bid-input-section {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(16, 185, 129, 0.2);
      animation: slideDown 0.3s ease-out;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      color: #10b981;
      font-weight: 600;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .form-group input {
      width: 100%;
      padding: 1rem;
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 12px;
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-group input:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
    }

    .bid-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn {
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-primary {
      flex: 1;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 30px rgba(16, 185, 129, 0.6);
    }

    .btn-secondary {
      flex: 1;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 2px solid #10b981;
    }

    .btn-secondary:hover {
      background: rgba(16, 185, 129, 0.2);
    }

    .btn-bid {
      width: 100%;
      margin-top: 1rem;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
    }

    .btn-bid:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 30px rgba(16, 185, 129, 0.6);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .previous-bids {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(16, 185, 129, 0.2);
    }

    .previous-bids h4 {
      color: #10b981;
      font-size: 0.875rem;
      margin-bottom: 0.75rem;
    }

    .bid-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      font-size: 0.875rem;
      color: #94a3b8;
    }

    .bid-item .time {
      color: #64748b;
      font-size: 0.75rem;
    }

    .empty-state {
      grid-column: 1 / -1;
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

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
      .winner{

margin-top:12px;

padding:12px;

border-radius:12px;

background:linear-gradient(135deg,#22c55e,#16a34a);

color:white;

font-weight:700;

text-align:center;

box-shadow:0 6px 20px rgba(34,197,94,.5);

animation:winnerGlow 2s infinite;

}

@keyframes winnerGlow{

0%{box-shadow:0 0 0 0 rgba(34,197,94,.7)}

70%{box-shadow:0 0 0 14px rgba(34,197,94,0)}

100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}

}
.btn-completed{

width:100%;

margin-top:10px;

background:linear-gradient(135deg,#64748b,#475569);

color:white;

font-weight:700;

padding:12px;

border-radius:12px;

}

.btn-pending{

width:100%;

margin-top:10px;

background:linear-gradient(135deg,#facc15,#eab308);

color:black;

font-weight:700;

padding:12px;

border-radius:12px;

}

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class BidderDashboardComponent implements OnInit {
  crops = signal<any[]>([]);
  selectedCrop = signal<string | null>(null);
  bidAmount: number = 0;
  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  dashboardStats = signal<any>({
  activeBids: 0,
  totalSpent: 0,
  totalBids: 0,
  auctionsWon: 0
});

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

 ngOnInit() {
  this.loadDashboard();
  this.loadCrops();
}

auctionTimers:any = {};

async loadDashboard(){

 const bidderId = Number(this.authService.currentUser()?.id);

 if(!bidderId) return;

 const stats = await this.apiService.getBidderDashboard(bidderId);

 if(stats){
   this.dashboardStats.set(stats);
 }

}

startTimer(crop:any,endTime:number){

 if(this.auctionTimers[crop.id]) return;

 this.auctionTimers[crop.id] = setInterval(()=>{

  const diff = endTime - Date.now();

  if(diff <= 0){

    clearInterval(this.auctionTimers[crop.id]);

    crop.timeLeft = "Auction Completed";
    crop.closed = true;
    crop.auctionStatus = "COMPLETED";

    this.crops.set([...this.crops()]);

    return;

  }

  const minutes = Math.floor(diff/60000);
  const seconds = Math.floor((diff%60000)/1000);

  crop.timeLeft = `${minutes}:${seconds.toString().padStart(2,'0')}`;

  this.crops.set([...this.crops()]);

 },1000);

}
async loadCrops(){

 const crops = await this.apiService.getMarketplace();

 const now = Date.now();

 for(const crop of crops){

   const highest = await this.apiService.getHighestBid(crop.id);

   crop.currentBid = highest?.bidAmount ?? crop.basePrice;
    if(crop.farmerId){

    crop.farmerName =
      await this.apiService.getUserById(crop.farmerId) || "Unknown Farmer";

  }

   const auction = await this.apiService.getAuction(crop.id);

   //--------------------------------
   // NO AUCTION CREATED YET
   //--------------------------------

   if(!auction){

     crop.auctionStatus = "NOT_STARTED";
     crop.timeLeft = "Waiting for admin";
     crop.closed = false;

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
     crop.closed = false;

   }

   //--------------------------------
   // AUCTION LIVE
   //--------------------------------

   else if(now >= start && now < end){

     crop.auctionStatus = "LIVE";
     crop.closed = false;

     this.startTimer(crop,end);

   }

   //--------------------------------
   // AUCTION COMPLETED
   //--------------------------------

   else{

     crop.auctionStatus = "COMPLETED";
     crop.closed = true;
     crop.timeLeft = "Auction Completed";

     const winner = await this.apiService.getAuctionWinner(crop.id);

     if(winner){

       crop.winnerName =
         await this.apiService.getUserById(winner.bidderId);

     }

   }

 }

 this.crops.set(crops);

}
  logout() {
    this.authService.logout();
  }

 async confirmBid(crop: any) {

  this.successMessage.set('');
  this.errorMessage.set('');

  if (!this.bidAmount || this.bidAmount <= Number(crop.currentBid)) {
    this.errorMessage.set('Bid amount must be higher than current bid');
    return;
  }

  this.loading.set(true);

  const result = await this.apiService.placeBid({
    cropId: crop.id,
    bidderId: this.authService.currentUser()?.id,
    bidAmount: this.bidAmount
  });

  this.loading.set(false);

  if (result.success) {

    this.successMessage.set(result.message || 'Bid placed successfully!');

    // update UI without reloading crops
    crop.currentBid = this.bidAmount;

    this.selectedCrop.set(null);
    this.bidAmount = 0;

    this.crops.set([...this.crops()]);

  } else {

    this.errorMessage.set(result.message || 'Failed to place bid');

  }

 }}