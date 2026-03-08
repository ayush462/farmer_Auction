import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-layout page-fade">
      <aside class="sidebar" [class.open]="sidebarOpen()">
        <div class="sidebar-header">
          <div class="brand">
            <span class="app-icon">admin_panel_settings</span>
            <span class="brand-name">Admin Portal</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-group">
            <span class="nav-label">General</span>
            <button class="nav-item" [class.active]="activeTab() === 'dashboard'" (click)="loadDashboard();closeSidebar()">
              <span class="app-icon">dashboard</span>
              <span>Overview</span>
            </button>
            <button class="nav-item" [class.active]="activeTab() === 'users'" (click)="loadUsers();closeSidebar();">
              <span class="app-icon">group</span>
              <span>User Directory</span>
            </button>
          </div>

          <div class="nav-group">
            <span class="nav-label">Marketplace</span>
            <button class="nav-item" [class.active]="activeTab() === 'crops'" (click)="loadCrops();closeSidebar()">
              <span class="app-icon">inventory</span>
              <span>Crop Approvals</span>
            </button>
            <button class="nav-item" [class.active]="activeTab() === 'bids'" (click)="loadBids();closeSidebar()">
              <span class="app-icon">gavel</span>
              <span>Auctions</span>
            </button>
          </div>

          <div class="nav-group">
            <span class="nav-label">Insurance</span>
            <button class="nav-item" [class.active]="activeTab() === 'insurance'" (click)="loadInsurance();closeSidebar()">
              <span class="app-icon">shield</span>
              <span>Policies</span>
            </button>
            <button class="nav-item" [class.active]="activeTab() === 'claims'" (click)="loadClaims();closeSidebar()">
              <span class="app-icon">assignment</span>
              <span>Claims</span>
            </button>
          </div>
        </nav>

        <div class="sidebar-footer">
          <div class="user-profile">
            <div class="user-avatar">AD</div>
            <div class="user-info">
              <span class="user-name">System Admin</span>
              <span class="user-role">Administrator</span>
            </div>
          </div>
          <button (click)="logout()" class="btn btn-ghost btn-icon-only">
            <span class="app-icon">logout</span>
          </button>
        </div>
      </aside>
      <div
  class="sidebar-overlay"
  *ngIf="sidebarOpen()"
  (click)="closeSidebar()">
</div>

      <main class="main-content">
      <header class="mobile-header">
  <button class="hamburger" (click)="toggleSidebar()">
    <span class="app-icon">menu</span>
  </button>
  <span class="mobile-title">Admin Portal</span>
</header>
        @if (successMessage()) {
          <div class="alert-toast">
            <span class="app-icon">check_circle</span>
            {{ successMessage() }}
          </div>
        }

        @if (activeTab() === 'dashboard') {
          <header class="content-header">
            <h1 class="page-title">Overview</h1>
            <p class="text-muted">Summary of system activity and key metrics.</p>
          </header>

         <div class="stats-grid">

  <div class="stat-card card">
    <span class="stat-label">Total Farmers</span>
    <span class="stat-value">{{ adminDashboard()?.totalFarmers }}</span>
  </div>

  <div class="stat-card card">
    <span class="stat-label">Total Bidders</span>
    <span class="stat-value">{{ adminDashboard()?.totalBidders }}</span>
  </div>

  <div class="stat-card card">
    <span class="stat-label">Total Crops</span>
    <span class="stat-value">{{ adminDashboard()?.totalCrops }}</span>
  </div>

  <div class="stat-card card">
    <span class="stat-label">Pending Crops</span>
    <span class="stat-value">{{ adminDashboard()?.pendingCrops }}</span>
  </div>

  <div class="stat-card card">
    <span class="stat-label">Active Auctions</span>
    <span class="stat-value">{{ adminDashboard()?.activeAuctions }}</span>
  </div>

  <div class="stat-card card highlight">
    <span class="stat-label">Insurance Policies</span>
    <span class="stat-value">{{ adminDashboard()?.insurancePolicies }}</span>
  </div>

  <div class="stat-card card highlight">
    <span class="stat-label">Pending Claims</span>
    <span class="stat-value">{{ adminDashboard()?.pendingClaims }}</span>
  </div>

</div>
        }

        @if (activeTab() === 'users') {
          <header class="content-header flex-between">
            <div>
              <h1 class="page-title">User Directory</h1>
              <p class="text-muted">Manage registered farmers and bidders.</p>
            </div>
            <div class="toggle-group">
              <button class="btn btn-sm" [class.btn-primary]="userType() === 'farmers'" (click)="loadUsers('farmers')">Farmers</button>
              <button class="btn btn-sm" [class.btn-primary]="userType() === 'bidders'" (click)="loadUsers('bidders')">Bidders</button>
            </div>
          </header>

          <div class="card overflow-hidden">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                @for (user of users(); track user.id) {
                  <tr>
                    <td><strong>{{ user.fullName }}</strong></td>
                    <td class="text-muted">{{ user.email }}</td>
                    <td class="text-muted">{{ user.contactNumber }}</td>
                    <td><span class="badge-soft">Verified</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        @if (activeTab() === 'crops') {
          <header class="content-header">
            <h1 class="page-title">Crop Approvals</h1>
            <p class="text-muted">Review and approve crops for the bidding marketplace.</p>
          </header>

          <div class="grid-3">
            @for (crop of crops(); track crop.id) {
              <div class="card crop-card">
                <div class="crop-header">
                  <h3>{{ crop.cropName }}</h3>
                  <span class="badge-soft">Pending</span>
                </div>
                <div class="crop-details">
                  <div class="detail-row"><span>Type</span><strong>{{ crop.cropType }}</strong></div>
                  <div class="detail-row"><span>Qty</span><strong>{{ crop.quantity }} Q</strong></div>
                  <div class="detail-row"><span>Base</span><strong>₹{{ crop.basePrice }}</strong></div>
                </div>
                <button (click)="approveCrop(crop.id)" class="btn btn-primary w-full mt-4">Approve for Bidding</button>
              </div>
            } @empty {
              <div class="empty-state">No pending crop approvals.</div>
            }
          </div>
        }

        @if (activeTab() === 'bids') {
          <header class="content-header">
            <h1 class="page-title">Auctions</h1>
            <p class="text-muted">Monitor and manage live bidding sessions.</p>
          </header>

          <div class="grid-3">
            @for (bid of bids(); track bid.id) {
              <div class="card bid-card">
                <div class="bid-header">
                  <h3>{{ bid.cropName }}</h3>
                  @if (bid.auctionLive) {
                    <span class="status-badge live">Live</span>
                  }
                </div>
                <div class="bid-stats">
                  <div class="price-main">
                    <span class="label">Highest Bid</span>
                    <span class="value">₹{{ bid.highestBid }}</span>
                  </div>
                  <div class="timer" *ngIf="bid.auctionLive">
                    <span class="app-icon">schedule</span>
                    {{ bid.timeLeft }}
                  </div>
                </div>
                <div class="bid-footer">
                  @if (!bid.auctionLive && !bid.winnerName) {
                    <button (click)="startAuction(bid)" class="btn btn-primary w-full">Start Auction</button>
                  } @else if (bid.winnerName) {
                    <div class="winner-tag">
                      <span class="app-icon">emoji_events</span>
                      Won by {{ bid.winnerName }}
                    </div>
                  } @else {
                    <button class="btn btn-secondary w-full" disabled>Running...</button>
                  }
                </div>
              </div>
            }
          </div>
        }

        @if (activeTab() === 'insurance') {
          <header class="content-header">
            <h1 class="page-title">Insurance Policies</h1>
            <p class="text-muted">Review applications for Fasal Bima Yojna.</p>
          </header>

          <div class="card overflow-hidden">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Season</th>
                  <th>Area</th>
                  <th>Sum Insured</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                @for (policy of insuranceRequests(); track policy.id) {
                  <tr>
                    <td>{{ policy.season }} {{ policy.year }}</td>
                    <td>{{ policy.area }} Ha</td>
                    <td>₹{{ policy.sumInsured }}</td>
                    <td><span class="badge-soft">{{ policy.status }}</span></td>
                    <td>
                      <div class="flex gap-2">
                        <button (click)="approveInsurance(policy.id)" class="btn btn-sm">Approve</button>
                        <button (click)="rejectInsurance(policy.id)" class="btn btn-sm btn-ghost">Reject</button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        @if (activeTab() === 'claims') {
          <header class="content-header">
            <h1 class="page-title">Pending Claims</h1>
            <p class="text-muted">Review crop loss claims for settlement.</p>
          </header>

          <div class="card overflow-hidden">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Cause of Loss</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                @for (claim of claims(); track claim.id) {
                  <tr>
                    <td><strong>₹{{ claim.claimAmount }}</strong></td>
                    <td>{{ claim.claimReason }}</td>
                    <td>{{ claim.dateOfLoss }}</td>
                    <td>
                      <div class="flex gap-2">
                        <button (click)="approveClaim(claim.id)" class="btn btn-sm btn-primary">Approve</button>
                        <button (click)="rejectClaim(claim.id)" class="btn btn-sm btn-ghost">Reject</button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
    }

    .brand-name {
      font-weight: 700;
      font-size: 1.125rem;
      letter-spacing: -0.025em;
    }

    .sidebar-nav {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .nav-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted-foreground);
      padding: 0 0.75rem 0.5rem;
    }

    .nav-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-md);
      color: var(--muted-foreground);
      background: transparent;
      border: none;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
      transition: all var(--transition-fast);
    }

    .nav-item:hover {
      background-color: var(--muted);
      color: var(--foreground);
    }

    .nav-item.active {
      background-color: var(--primary);
      color: var(--primary-foreground);
    }

    .sidebar-footer {
      border-top: 1px solid var(--border);
      padding-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 999px;
      background-color: var(--primary);
      color: var(--primary-foreground);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
    }
      .sidebar-overlay{
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.35);
  z-index:900;
}

@media (min-width:900px){
  .sidebar-overlay{
    display:none;
  }
}

    .user-name { font-size: 0.875rem; font-weight: 600; }
    .user-role { font-size: 0.75rem; color: var(--muted-foreground); }

    .content-header { margin-bottom: 2.5rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.025em; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
    }

    .stat-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-card.highlight {
      border-color: var(--foreground);
      background-color: var(--muted);
    }

    .stat-label { font-size: 0.75rem; font-weight: 600; color: var(--muted-foreground); text-transform: uppercase; }
    .stat-value { font-size: 2rem; font-weight: 700; }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    .admin-table th {
      text-align: left;
      padding: 0.75rem 1rem;
      background-color: var(--muted);
      border-bottom: 1px solid var(--border);
      font-weight: 600;
    }

    .admin-table td {
      padding: 1rem;
      border-bottom: 1px solid var(--border);
    }

    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }

    .crop-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .crop-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .detail-row { display: flex; justify-content: space-between; font-size: 0.875rem; padding: 0.25rem 0; }
    .detail-row span { color: var(--muted-foreground); }

    .bid-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
    .bid-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .status-badge.live { color: #16a34a; font-weight: 700; font-size: 0.75rem; }
    .price-main { display: flex; flex-direction: column; }
    .price-main .label { font-size: 0.75rem; font-weight: 600; color: var(--muted-foreground); }
    .price-main .value { font-size: 1.5rem; font-weight: 700; }
    .timer { display: flex; align-items: center; gap: 0.375rem; font-size: 0.875rem; font-weight: 600; color: var(--foreground); }
    .winner-tag { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background-color: #fff9db; border-radius: var(--radius-sm); font-size: 0.875rem; font-weight: 600; }

    .alert-toast {
      position: fixed;
      top: 1rem;
      right: 1rem;
      background-color: var(--foreground);
      color: var(--background);
      padding: 0.75rem 1.25rem;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      box-shadow: var(--shadow-elevated);
      z-index: 100;
      animation: slideDown 0.3s ease;
    }
      /* Layout */

.dashboard-layout{
  display:flex;
  min-height:100vh;
}

/* Sidebar */

.sidebar{
  width:260px;
  background:var(--background);
  border-right:1px solid var(--border);
  display:flex;
  flex-direction:column;
  padding:1rem;
  transition:transform .3s ease;
}

.main-content{
  flex:1;
  padding:2rem;
}

/* Hamburger */

.mobile-header{
  display:none;
  align-items:center;
  gap:1rem;
  margin-bottom:1.5rem;
}

.hamburger{
  background:none;
  border:none;
  cursor:pointer;
  padding:6px;
}

.mobile-title{
  font-weight:700;
  font-size:1.1rem;
}

/* MOBILE */

@media (max-width: 900px){

  .mobile-header{
    display:flex;
  }

  .sidebar{
    position:fixed;
    left:0;
    top:0;
    height:100%;
    transform:translateX(-100%);
    z-index:1000;
    background:white;
  }

  .sidebar.open{
    transform:translateX(0);
  }

  .main-content{
    padding:1.5rem;
  }

  .stats-grid{
    grid-template-columns: repeat(2,1fr);
  }

  .grid-3{
    grid-template-columns:1fr;
  }

}

/* SMALL MOBILE */

@media (max-width:500px){

  .stats-grid{
    grid-template-columns:1fr;
  }

}

    @keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .flex-between { display: flex; justify-content: space-between; align-items: flex-end; }
    .toggle-group { display: flex; border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; }
    .toggle-group .btn { border: none; border-radius: 0; }
    .btn-sm { padding: 0.25rem 0.75rem; font-size: 0.75rem; }
    .overflow-hidden { overflow: hidden; }
    .w-full { width: 100%; }
    .mt-4 { margin-top: 1rem; }
    .gap-2 { gap: 0.5rem; }
    .text-xs { font-size: 0.75rem; }
  `]
})
export class AdminDashboardComponent implements OnInit {
activeTab = signal<'dashboard' | 'users' | 'crops' | 'bids' | 'insurance' | 'claims'>('dashboard');
  userType = signal<'farmers' | 'bidders'>('farmers');
  users = signal<any[]>([]);
  crops = signal<any[]>([]);
  bids = signal<any[]>([]);
  successMessage = signal('');
  auctionStart: any = {};
  auctionEnd: any = {};
  auctionIntervals: any = {};
  adminDashboard = signal<any>(null);
  insuranceRequests = signal<any[]>([]);
  claims = signal<any[]>([]);
  sidebarOpen = signal(false);



toggleSidebar() {
  this.sidebarOpen.set(!this.sidebarOpen());
}

closeSidebar() {
  this.sidebarOpen.set(false);
}

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    
    this.loadDashboard();
    
  }

  async loadInsurance() {

  this.activeTab.set('insurance');

  const data = await this.apiService.getInsuranceRequests();

  this.insuranceRequests.set(data || []);

}
async approveInsurance(policyId: number) {

  const result = await this.apiService.approveInsurance(policyId);

  if (result.success) {

    this.successMessage.set("Insurance Approved");

    await this.loadInsurance();   // reload list
    this.toast.success(
  "Insurance approved for the policy",
  "Insurance Approved"
);

    setTimeout(() => this.successMessage.set(""), 3000);
  }

}

async rejectInsurance(policyId: number) {

  const result = await this.apiService.rejectInsurance(policyId);

  if (result.success) {

    this.successMessage.set("Insurance Rejected");

    await this.loadInsurance();   // reload list
    this.toast.success(
  "Insurance rejected for the policy",
  "Insurance Rejected"
);

    setTimeout(() => this.successMessage.set(""), 3000);
  }

}
async approveClaim(policyId: number) {

  const result = await this.apiService.approveClaim(policyId);

  if (result.success) {

    this.successMessage.set("Claim Approved");

    await this.loadClaims();   // reload list
    this.toast.success(
  "Claim approved for processing",
  "Claim Approved"
);

    setTimeout(() => this.successMessage.set(""), 3000);

  }

}

async rejectClaim(policyId: number) {

  const result = await this.apiService.rejectClaim(policyId);

  if (result.success) {

    this.successMessage.set("Claim Rejected");

    await this.loadClaims();   // reload list
    this.toast.success(
  "Claim rejected for processing",
  "Claim Rejected"
);

    setTimeout(() => this.successMessage.set(""), 3000);

  }

}
async loadClaims() {

  this.activeTab.set('claims');

  const data = await this.apiService.getClaimRequests();

  this.claims.set(data || []);

}
 async loadUsers(type: 'farmers' | 'bidders' = 'farmers') {
  this.activeTab.set('users');
  this.userType.set(type);

  let data;

  if (type === 'farmers') {
    data = await this.apiService.getFarmers();
  } else {
    data = await this.apiService.getBidders();
  }

  this.users.set(data || []);
}
  async loadCrops() {
  this.activeTab.set('crops');

  try {
    const data = await this.apiService.getCrops();

    console.log("Pending crops:", data); // debug

    this.crops.set(data || []);
  } catch (err) {
    console.error("Error loading crops", err);
    this.crops.set([]);
  }
}
async loadDashboard() {

  this.activeTab.set('dashboard');

  const data = await this.apiService.getAdminDashboard();

  this.adminDashboard.set(data);

}

async startAuction(bid:any){

 console.log("START AUCTION CLICKED:", bid);

 const result = await this.apiService.createAuction({
   cropId: bid.id
 });

 console.log("AUCTION RESPONSE:", result);

 if(result.success){

   console.log("START TIME:", result.auction.startTime);
   console.log("END TIME:", result.auction.endTime);
   console.log("CURRENT TIME:", new Date());

   bid.startTime = result.auction.startTime;
   bid.endTime = result.auction.endTime;

   bid.auctionLive = true;
   bid.timeLeft = "Starting...";

   const endTime = new Date(result.auction.endTime).getTime();

   console.log("END TIME PARSED:", endTime);
   console.log("NOW:", Date.now());
   console.log("DIFF:", endTime - Date.now());

   setTimeout(() => {
     this.startTimer(bid, endTime);
   }, 500);

   this.bids.set([...this.bids()]);
 }
}
startTimer(bid:any,endTime:number){

 console.log("START TIMER FOR:", bid.id);
 console.log("END TIME:", endTime);

 if(this.auctionIntervals[bid.id]) return;

 this.auctionIntervals[bid.id] = setInterval(()=>{

   const diff = endTime - Date.now();

   console.log("TIME DIFF:", diff);

   if(diff <= 0){

     console.log("AUCTION ENDED");

     clearInterval(this.auctionIntervals[bid.id]);

     bid.auctionLive = false;
     bid.timeLeft = "Auction Completed";

     this.fetchWinner(bid);

     this.bids.set([...this.bids()]);

     return;
   }

   const m = Math.floor(diff/60000);
   const s = Math.floor((diff%60000)/1000);

   bid.timeLeft = `${m}:${s.toString().padStart(2,'0')}`;

   this.bids.set([...this.bids()]);

 },1000);
}
async fetchWinner(bid:any){

  const result = await this.apiService.getAuctionWinner(bid.id);

  if(!result) return;

  const user = await this.apiService.getUserById(result.bidderId);

  bid.winnerName = user || "Unknown";

  this.bids.set([...this.bids()]);

}
async loadBids(){

  this.activeTab.set('bids');

  const data = await this.apiService.getMarketplace();

  const now = Date.now();

  for(const crop of data){

    // highest bid
    const highest = await this.apiService.getHighestBid(crop.id);

    crop.highestBid = highest?.bidAmount ?? crop.basePrice;

    if(highest?.bidderId){
      crop.highestBidder =
        await this.apiService.getUserById(highest.bidderId) ?? "Unknown";
    }
    else{
      crop.highestBidder = "No bids yet";
    }

    // farmer
    if(crop.farmerId){
      crop.farmerName =
        await this.apiService.getUserById(crop.farmerId) ?? "Unknown Farmer";
    }

    //---------------------------------
    // AUCTION STATE
    //---------------------------------

    const auction = await this.apiService.getAuction(crop.id);

    // ❗ NO AUCTION CREATED YET
    if(!auction){

  crop.auctionLive = false;
  crop.timeLeft = null;   // important
  crop.winnerName = null;

  continue;
}

    const start = new Date(auction.startTime).getTime();
    const end = new Date(auction.endTime).getTime();

    if(now < start){

      crop.auctionLive = false;
      crop.timeLeft = "Auction Not Started";

    }
    else if(now >= start && now < end){

      crop.auctionLive = true;

      this.startTimer(crop,end);

    }
    else{

      crop.auctionLive = false;
      crop.timeLeft = "Auction Completed";

      const winner = await this.apiService.getAuctionWinner(crop.id);

      if(winner){
        crop.winnerName =
          await this.apiService.getUserById(winner.bidderId);
      }

    }

  }

  this.bids.set(data);

}
  async approveUser(userId: string) {
    const result = await this.apiService.approveUser(userId);
    if (result.success) {
      this.successMessage.set(result.message || 'User approved!');
      await this.loadUsers();
      setTimeout(() => this.successMessage.set(''), 3000);
    }
  }

  async approveCrop(cropId: string) {
    const result = await this.apiService.approveCrop(cropId);
    if (result.success) {
      this.toast.success(
  "Crop approved for bidding",
  "Crop Approved"
);

      await this.loadCrops();
      setTimeout(() => this.successMessage.set(''), 3000);
    }
  }

  async finalizeBid(bidId: string) {

  const bid = this.bids().find(b => b.id === bidId);

  if (!bid) return;

  bid.auctionLive = false;
  bid.timeLeft = "Auction Completed";

  clearInterval(this.auctionIntervals[bidId]);

  localStorage.removeItem(`auction_${bidId}`);

  this.bids.set([...this.bids()]);

  this.successMessage.set('Auction finalized successfully!');

  setTimeout(() => this.successMessage.set(''), 3000);

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
}
