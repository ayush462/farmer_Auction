import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-bidder-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-page page-fade">
      <header class="dashboard-nav">
        <div class="container nav-content">
          <div class="brand" routerLink="/">
            <span class="app-icon">agriculture</span>
            <span class="brand-name">Farm-Scheme</span>
          </div>

          <div class="nav-actions">
            <div class="user-meta">
              <span class="user-name">{{ authService.currentUser()?.name }}</span>
              <span class="user-badge">Bidder</span>
            </div>
            <button (click)="logout()" class="btn btn-ghost btn-icon">
              <span class="app-icon">logout</span>
            </button>
          </div>
        </div>
      </header>

      <main class="dashboard-content container">
        <header class="content-header">
          <div>
            <h1 class="page-title">Marketplace</h1>
            <p class="text-muted">Discover and bid on the finest crop inventory.</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-secondary" (click)="loadCrops()">
              <span class="app-icon">refresh</span>
              Refresh
            </button>
          </div>
        </header>

        <section class="stats-overview">
          <div class="stat-card card">
            <span class="stat-label">Active Bids</span>
            <span class="stat-value">{{ dashboardStats().activeBids }}</span>
          </div>
          <div class="stat-card card">
            <span class="stat-label">Auctions Won</span>
            <span class="stat-value">{{ dashboardStats().auctionsWon }}</span>
          </div>
          <div class="stat-card card">
            <span class="stat-label">Total Spent</span>
            <span class="stat-value">₹{{ dashboardStats().totalSpent }}</span>
          </div>
          <div class="stat-card card">
            <span class="stat-label">Total Bids</span>
            <span class="stat-value">{{ dashboardStats().totalBids }}</span>
          </div>
        </section>

        <div class="marketplace-grid">
          @if (crops().length > 0) {
            @for (crop of crops(); track crop.id) {
              <div class="crop-item card">
                <div class="crop-header">
                  <div class="crop-title-group">
                    <h3 class="crop-name">{{ crop.cropName }}</h3>
                    <span class="crop-type-badge">{{ crop.cropType }}</span>
                  </div>
                  <div class="auction-status" [ngClass]="crop.auctionStatus?.toLowerCase()">
                    @if (crop.auctionStatus === 'LIVE') {
                      <span class="status-dot pulse"></span>
                      Live: {{ crop.timeLeft }}
                    } @else if (crop.auctionStatus === 'COMPLETED') {
                      <span class="app-icon text-xs">check_circle</span>
                      Ended
                    } @else {
                      <span class="app-icon text-xs">schedule</span>
                      Upcoming
                    }
                  </div>
                </div>

                <div class="crop-body">
                  <div class="price-section">
                    <div class="price-box">
                      <span class="price-label">Current Bid</span>
                      <span class="price-value">₹{{ crop.currentBid }} <small>/Q</small></span>
                    </div>
                    <div class="price-box muted">
                      <span class="price-label">Base Price</span>
                      <span class="price-value">₹{{ crop.basePrice }}</span>
                    </div>
                  </div>

                  <div class="details-list">
                    <div class="detail-item">
                      <span class="app-icon text-muted">inventory_2</span>
                      <span>{{ crop.quantity }} Quintals available</span>
                    </div>
                    <div class="detail-item">
                      <span class="app-icon text-muted">person</span>
                      <span>Farmer: {{ crop.farmerName }}</span>
                    </div>
                  </div>

                  @if (crop.auctionStatus === 'COMPLETED' && crop.winnerName) {
                    <div class="winner-announcement">
                      <span class="app-icon">emoji_events</span>
                      <span>Winner: <strong>{{ crop.winnerName }}</strong></span>
                    </div>
                  }

                  @if (selectedCrop() === crop.id && !crop.closed) {
                    <div class="bid-action-area">
                      <div class="field">
                        <label class="text-xs font-semibold uppercase">Your Bid Amount</label>
                        <div class="input-with-button">
                          <input
                            type="number"
                            class="input"
                            [(ngModel)]="bidAmount"
                            placeholder="Enter amount..."
                            [min]="crop.currentBid + 1"
                          />
                          <button (click)="confirmBid(crop)" class="btn btn-primary" [disabled]="loading()">
                            Bid
                          </button>
                        </div>
                      </div>
                      <button (click)="selectedCrop.set(null)" class="btn btn-ghost btn-sm w-full mt-2">Cancel</button>
                    </div>
                  } @else {
                    <div class="action-footer">
                      @if (crop.auctionStatus === 'LIVE') {
                        <button (click)="selectedCrop.set(crop.id)" class="btn btn-primary w-full">
                          Place a Bid
                        </button>
                      } @else if (crop.auctionStatus === 'COMPLETED') {
                        <button class="btn btn-secondary w-full" disabled>
                          Auction Finished
                        </button>
                      } @else {
                        <button class="btn btn-secondary w-full" disabled>
                          Coming Soon
                        </button>
                      }
                    </div>
                  }
                </div>
              </div>
            }
          } @else {
            <div class="empty-state text-center py-12">
              <span class="app-icon text-4xl text-muted mb-4">agriculture</span>
              <h3 class="text-lg font-semibold">No crops available</h3>
              <p class="text-muted">There are currently no active auctions in the marketplace.</p>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-page {
      min-height: 100vh;
      background-color: #fafafa;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .dashboard-nav {
      height: 64px;
      background-color: var(--background);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .nav-content {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
    }

    .brand-name {
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: -0.025em;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      text-align: right;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
    }

    .user-badge {
      font-size: 0.75rem;
      color: var(--muted-foreground);
    }

    .dashboard-content {
      padding-top: 2.5rem;
      padding-bottom: 4rem;
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2.5rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -0.05em;
    }

    .stats-overview {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .stat-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--muted-foreground);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
    }

    .marketplace-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .crop-item {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .crop-header {
      padding: 1.25rem;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .crop-title-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .crop-name {
      font-size: 1.125rem;
      font-weight: 700;
    }

    .crop-type-badge {
      display: inline-flex;
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--muted-foreground);
      text-transform: uppercase;
    }

    .auction-status {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 999px;
      background-color: var(--muted);
    }

    .auction-status.live {
      background-color: #f0fdf4;
      color: #16a34a;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background-color: currentColor;
    }

    .pulse {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.4; }
      100% { opacity: 1; }
    }

    .crop-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .price-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .price-box {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .price-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--muted-foreground);
      text-transform: uppercase;
    }

    .price-value {
      font-size: 1.25rem;
      font-weight: 700;
    }

    .price-value small {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--muted-foreground);
    }

    .details-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--foreground);
    }

    .winner-announcement {
      background-color: #fff9db;
      padding: 0.75rem;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .input-with-button {
      display: flex;
      gap: 0.5rem;
    }

    .input-with-button .input {
      flex: 1;
    }

    .text-muted { color: var(--muted-foreground); }
    .text-xs { font-size: 0.75rem; }
    .text-lg { font-size: 1.125rem; }
    .text-4xl { font-size: 2.25rem; }
    .font-semibold { font-weight: 600; }
    .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mt-2 { margin-top: 0.5rem; }
    .w-full { width: 100%; }

    @media (max-width: 768px) {
      .stats-overview { grid-template-columns: 1fr 1fr; }
      .marketplace-grid { grid-template-columns: 1fr; }
      .content-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
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
    ,private toast: ToastService
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

  const confirmLogout = confirm("Are you sure you want to logout?");

  if(!confirmLogout) return;

  this.authService.logout();

  this.toast.success(
    "You have been logged out successfully",
    "Logged out"
  );

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
