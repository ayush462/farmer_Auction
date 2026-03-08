import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <nav class="navbar">
        <div class="nav-logo">
          <h1>🌾 Farm-Scheme Admin</h1>
        </div>
        <button (click)="logout()" class="logout-btn">Logout</button>
      </nav>

      <div class="content">
        <div class="header">
          <h1>Admin Dashboard</h1>
          <p>Manage users, crops, and insurance claims</p>
        </div>

        <div class="tabs">
        <button
  [class.active]="activeTab() === 'dashboard'"
  (click)="loadDashboard()"
  class="tab-btn"
>
  Dashboard
</button>
          <button
            [class.active]="activeTab() === 'users'"
            (click)="loadUsers()"
            class="tab-btn"
          >
            Users
          </button>
          <button
            [class.active]="activeTab() === 'crops'"
            (click)="loadCrops()"
            class="tab-btn"
          >
            Crop Approvals
          </button>
          <button
            [class.active]="activeTab() === 'bids'"
            (click)="loadBids()"
            class="tab-btn"
          >
            Bidding Management
          </button>
          <button
  [class.active]="activeTab() === 'insurance'"
  (click)="loadInsurance()"
  class="tab-btn"
>
  Pending Insurance Approvals
</button>
<button
  [class.active]="activeTab() === 'claims'"
  (click)="loadClaims()"
  class="tab-btn"
>
  Pending Claim Approvals
</button>

        </div>

        @if (successMessage()) {
          <div class="alert alert-success">{{ successMessage() }}</div>
        }
        @if (activeTab() === 'dashboard') {

<div class="dashboard-grid">

<div class="stat-card farmers">
<div class="icon">👨‍🌾</div>
<div class="stat-info">
<h3>Total Farmers</h3>
<p>{{ adminDashboard()?.totalFarmers }}</p>
</div>
</div>

<div class="stat-card bidders">
<div class="icon">💰</div>
<div class="stat-info">
<h3>Total Bidders</h3>
<p>{{ adminDashboard()?.totalBidders }}</p>
</div>
</div>

<div class="stat-card crops">
<div class="icon">🌾</div>
<div class="stat-info">
<h3>Total Crops</h3>
<p>{{ adminDashboard()?.totalCrops }}</p>
</div>
</div>

<div class="stat-card pending">
<div class="icon">⏳</div>
<div class="stat-info">
<h3>Pending Crops</h3>
<p>{{ adminDashboard()?.pendingCrops }}</p>
</div>
</div>

<div class="stat-card auctions">
<div class="icon">⚡</div>
<div class="stat-info">
<h3>Active Auctions</h3>
<p>{{ adminDashboard()?.activeAuctions }}</p>
</div>
</div>

<div class="stat-card insurance">
<div class="icon">🛡</div>
<div class="stat-info">
<h3>Insurance Policies</h3>
<p>{{ adminDashboard()?.insurancePolicies }}</p>
</div>
</div>

<div class="stat-card claims">
<div class="icon">📄</div>
<div class="stat-info">
<h3>Pending Claims</h3>
<p>{{ adminDashboard()?.pendingClaims }}</p>
</div>
</div>

</div>

}
        @if (activeTab() === 'users') {
          <div class="content-card">
            <h2>
  {{ userType() === 'farmers' ? 'Registered Farmers' : 'Registered Bidders' }}
    <div style="margin-bottom: 1rem; display:flex; gap:10px; justify-content:flex-end;">

  <button
    (click)="loadUsers('farmers')"
    [class.active]="userType() === 'farmers'"
    class="tab-btn"
  >
    Farmers
  </button>

  <button
    (click)="loadUsers('bidders')"
    [class.active]="userType() === 'bidders'"
    class="tab-btn"
  >
    Bidders
  </button>

</div>
</h2>
           

            <div class="table-container">
            
              @if (users().length > 0) {
                <table class="data-table">
                  <thead>
                    <tr>
                       <th>id</th>
                      <th>Name</th>
                      <th>Email</th>
          
                      <th>Contact</th>
                      <th>Role</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    @for (user of users(); track user.id) {
                      <tr>
                        <td>{{ user.id }}</td>
                        <td>{{ user.fullName }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.contactNumber }}</td>
                        <td>
                          <span [class]="'status-' + user.role">{{ user.role }}</span>
                        </td>
                        
                      </tr>
                    }
                  </tbody>
                </table>
              } @else {
                <div class="empty-state">
                  <span class="empty-icon">👥</span>
                  <p>No users found</p>
                </div>
              }
            </div>
          </div>
        }

        @if (activeTab() === 'crops') {
          <div class="content-card">
            <h2>Crop Approval Requests</h2>
            <div class="crops-grid">
              @if (crops().length > 0) {
                @for (crop of crops(); track crop.id) {
                  <div class="crop-card">
  <div class="card-header">
    <h3>{{ crop.cropName }}</h3>
    <span class="status-pending">pending</span>
  </div>

  <div class="card-body">

    <div class="info-row">
      <span class="label">Farmer ID:</span>
      <span class="value">{{ crop.farmerId }}</span>
    </div>

    <div class="info-row">
      <span class="label">Crop Type:</span>
      <span class="value">{{ crop.cropType }}</span>
    </div>

    <div class="info-row">
      <span class="label">Quantity:</span>
      <span class="value">{{ crop.quantity }} Q</span>
    </div>

    <div class="info-row">
      <span class="label">Fertilizer:</span>
      <span class="value">{{ crop.fertilizerType }}</span>
    </div>

    <div class="info-row">
      <span class="label">Base Price:</span>
      <span class="value">₹{{ crop.basePrice }}</span>
    </div>

    <button
      (click)="approveCrop(crop.id)"
      class="btn btn-approve"
    >
      Approve for Bidding
    </button>

  </div>
</div>
                }
              } @else {
                <div class="empty-state">
                  <span class="empty-icon">🌾</span>
                  <p>No pending crop approvals</p>
                </div>
              }
            </div>
          </div>
        }

        @if (activeTab() === 'bids') {
          <div class="content-card">
            <h2>Active Bidding Management</h2>
            <div class="bids-grid">
              @if (bids().length > 0) {
                @for (bid of bids(); track bid.id) {
                  <div class="bid-card">
                    <div class="bid-header">
                      <h3>{{ bid.cropName }}</h3>
                      <span class="badge">{{ bid.status }}</span>
                    </div>
                    <div class="bid-body">
                      <div class="info-row">
                        <span class="label">Farmer:</span>
                        <span class="value">{{ bid.farmerName }}</span>
                      </div>
                      <div class="info-row">
                        <span class="label">Base Price:</span>
                        <span class="value">₹{{ bid.basePrice }}</span>
                      </div>
                      <div class="info-row highlight">
                        <span class="label">Highest Bid:</span>
                        <span class="value price">₹{{ bid.highestBid }}</span>
                      </div>
                     @if (bid.auctionLive) {
<div class="auction-timer">
  ⏳ {{ bid.timeLeft }}
</div>
}
                      <div class="info-row">
                        <span class="label">Highest Bidder:</span>
                        <span class="value">{{ bid.highestBidder }}</span>
                      </div>
                     
                                           @if (!bid.auctionLive && !bid.winnerName) {

<button
  (click)="startAuction(bid)"
  class="btn btn-auction">
   Start Auction
</button>

}

                      @if (bid.auctionLive) {

                      <button class="btn btn-live">
                        🟢 Auction Live
                      </button>

                      }

                      @if (bid.winnerName) {

<button class="btn btn-winner">
🏆 Winner: {{ bid.winnerName }}
</button>

}
                     
                    </div>
                  </div>
                }
              } @else {
                <div class="empty-state">
                  <span class="empty-icon">💰</span>
                  <p>No active bids to manage</p>
                </div>
              }
            </div>
          </div>
        }
          @if (activeTab() === 'insurance') {

<div class="content-card">

<h2>Insurance Applications</h2>

<div class="table-container">

@if (insuranceRequests().length > 0) {

<table class="data-table">

<thead>
<tr>
<th>Policy ID</th>
<th>Farmer ID</th>
<th>Crop ID</th>
<th>Season</th>
<th>Year</th>
<th>Area</th>
<th>Sum Insured</th>
<th>Action</th>
</tr>
</thead>

<tbody>

@for (policy of insuranceRequests(); track policy.id) {

<tr>

<td>{{ policy.id }}</td>
<td>{{ policy.farmerId }}</td>
<td>{{ policy.cropId }}</td>
<td>{{ policy.season }}</td>
<td>{{ policy.year }}</td>
<td>{{ policy.area }}</td>
<td>₹{{ policy.sumInsured }}</td>

<td>

@if (policy.status === 'APPROVED') {

<button class="btn btn-approved">
Approved
</button>

}

@else if (policy.status === 'REJECTED') {

<button class="btn btn-rejected">
Unapproved
</button>

}

@else {

<button
(click)="approveInsurance(policy.id)"
class="btn btn-approve">
Approve
</button>

<button
(click)="rejectInsurance(policy.id)"
class="btn btn-reject">
Reject
</button>

}

</td>

</tr>

}

</tbody>

</table>

} @else {

<div class="empty-state">
<span class="empty-icon">🛡</span>
<p>No insurance applications</p>
</div>

}

</div>

</div>

}
@if (activeTab() === 'claims') {

<div class="content-card">

<h2>Pending Claim Approvals</h2>

<div class="table-container">

@if (claims().length > 0) {

<table class="data-table">

<thead>
<tr>
<th>Claim ID</th>
<th>Policy ID</th>
<th>Farmer ID</th>
<th>Claim Amount</th>
<th>Cause</th>
<th>Date of Loss</th>
<th>Status</th>
</tr>
</thead>

<tbody>

@for (claim of claims(); track claim.id) {

<tr>

<td>{{ claim.id }}</td>
<td>{{ claim.id}}</td>
<td>{{ claim.farmerId }}</td>
<td>₹{{ claim.claimAmount }}</td>
<td>{{ claim.claimReason }}</td>
<td>{{ claim.dateOfLoss }}</td>

<td>

<button
(click)="approveClaim(claim.id)"
class="btn btn-approve">
Approve
</button>

<button
(click)="rejectClaim(claim.id)"
class="btn btn-reject">
Reject
</button>

</td>

</tr>

}

</tbody>

</table>

} @else {

<div class="empty-state">
<span class="empty-icon">📄</span>
<p>No claim requests</p>
</div>

}

</div>

</div>

}
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

    .nav-logo h1 {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #10b981, #34d399);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
      
      .btn-winner{

width:100%;

margin-top:10px;

background:linear-gradient(135deg,#22c55e,#16a34a);

color:white;

font-weight:700;

padding:12px;

border-radius:12px;

box-shadow:0 6px 20px rgba(34,197,94,.5);

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

    .dashboard-grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
gap:25px;
margin-top:25px;
}

.stat-card{
display:flex;
align-items:center;
gap:20px;
padding:25px;
border-radius:18px;
background:rgba(15,23,42,0.6);
border:1px solid rgba(148,163,184,0.15);
transition:all .3s ease;
backdrop-filter:blur(10px);
}

.stat-card:hover{
transform:translateY(-6px);
box-shadow:0 15px 40px rgba(0,0,0,.4);
}

.icon{
font-size:34px;
width:60px;
height:60px;
display:flex;
align-items:center;
justify-content:center;
border-radius:14px;
background:rgba(255,255,255,.05);
}

.stat-info h3{
color:#94a3b8;
font-size:14px;
font-weight:600;
margin-bottom:6px;
}

.stat-info p{
font-size:32px;
font-weight:700;
color:#fff;
}

/* color accents */

.farmers{border-left:4px solid #22c55e;}
.bidders{border-left:4px solid #3b82f6;}
.crops{border-left:4px solid #10b981;}
.pending{border-left:4px solid #f59e0b;}
.auctions{border-left:4px solid #6366f1;}
.insurance{border-left:4px solid #14b8a6;}
.claims{border-left:4px solid #ef4444;}

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
      .auction-timer{
       color:#10b981;
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
      .btn-completed{

width:100%;

background:linear-gradient(135deg,#64748b,#475569);

color:white;

font-weight:700;

padding:12px;

border-radius:12px;

margin-top:10px;

}


    .alert-success {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #6ee7b7;
    }

    .content-card {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.05));
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 20px;
      padding: 2rem;
    }

    .content-card h2 {
      color: #10b981;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
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

    .badge {
      padding: 0.35rem 0.85rem;
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-pending {
      color: #fbbf24;
    }

    .status-approved {
      color: #10b981;
    }

    .status-active {
      color: #3b82f6;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-approve {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
    }

    .btn-approve:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 30px rgba(16, 185, 129, 0.6);
    }

    .btn-finalize {
      width: 100%;
      margin-top: 1rem;
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
    }

    .btn-finalize:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 30px rgba(59, 130, 246, 0.6);
    }

    .crops-grid,
    .bids-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .crop-card,
    .bid-card {
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 20px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      animation: fadeInUp 0.5s ease-out;
    }

    .crop-card:hover,
    .bid-card:hover {
      transform: translateY(-5px);
      border-color: #10b981;
      box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
    }

    .card-header,
    .bid-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(16, 185, 129, 0.2);
    }

    .card-header h3,
    .bid-header h3 {
      color: #fff;
      font-size: 1.25rem;
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

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      grid-column: 1 / -1;
    }

    .empty-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
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
      .btn-completed{
width:100%;
background:linear-gradient(135deg,#64748b,#475569);
color:white;
font-weight:700;
padding:12px;
border-radius:12px;
margin-top:10px;
cursor:not-allowed;
}
      .btn-auction {

width:100%;

margin-top:10px;

background:linear-gradient(135deg,#10b981,#059669);

color:white;

font-weight:700;

padding:12px;

border-radius:12px;

box-shadow:0 6px 20px rgba(16,185,129,.4);

transition:.25s;

}

.btn-auction:hover{

transform:translateY(-3px);

box-shadow:0 10px 30px rgba(16,185,129,.6);

}
.btn-approved{
background:linear-gradient(135deg,#22c55e,#16a34a);
color:white;
font-weight:700;
padding:10px 14px;
border-radius:10px;
margin-right:8px;
}

.btn-rejected{
background:linear-gradient(135deg,#ef4444,#b91c1c);
color:white;
font-weight:700;
padding:10px 14px;
border-radius:10px;
}

.btn-reject{
background:linear-gradient(135deg,#ef4444,#dc2626);
color:white;
font-weight:600;
padding:10px 14px;
border-radius:10px;
margin-left:8px;
}

.btn-approve-outline{
background:transparent;
border:2px solid #22c55e;
color:#22c55e;
padding:10px 14px;
border-radius:10px;
margin-right:8px;
}

.btn-reject-outline{
background:transparent;
border:2px solid #ef4444;
color:#ef4444;
padding:10px 14px;
border-radius:10px;
}

.btn-live{

width:100%;

margin-top:10px;

background:linear-gradient(135deg,#22c55e,#16a34a);

color:white;

font-weight:700;

padding:12px;

border-radius:12px;

box-shadow:0 6px 20px rgba(34,197,94,.5);

animation:pulse 1.5s infinite;

}

@keyframes pulse{

0%{box-shadow:0 0 0 0 rgba(34,197,94,.6)}
70%{box-shadow:0 0 0 12px rgba(34,197,94,0)}
100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}

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

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
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

    this.insuranceRequests.update(list =>
      list.filter(p => p.id !== policyId)
    );

    this.successMessage.set("Insurance Approved");

    setTimeout(() => this.successMessage.set(""), 3000);
  }
}
async rejectInsurance(policyId: number) {

  const result = await this.apiService.rejectInsurance(policyId);

  if (result.success) {

    this.insuranceRequests.update(list =>
      list.filter(p => p.id !== policyId)
    );

    this.successMessage.set("Insurance Rejected");

    setTimeout(() => this.successMessage.set(""), 3000);
  }
}
async approveClaim(policyId:number){
  console.log("Approving claim for policy ID:", policyId); // debug log

 const result = await this.apiService.approveClaim(policyId);

 if(result.success){

   this.claims.update(list =>
     list.filter(c => c.id !== policyId)
   );

   this.successMessage.set("Claim Approved");

   setTimeout(()=>this.successMessage.set(""),3000);

 }

}
async rejectClaim(policyId:number){

 const result = await this.apiService.rejectClaim(policyId);

 if(result.success){

   this.claims.update(list =>
    list.filter(c => c.id !== policyId)
   );

   this.successMessage.set("Claim Rejected");

   setTimeout(()=>this.successMessage.set(""),3000);

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

 const result = await this.apiService.createAuction({
   cropId: bid.id
 });

 if(result.success){

   bid.startTime = result.auction.startTime;
   bid.endTime = result.auction.endTime;

   bid.auctionLive = true;

   const endTime = new Date(bid.endTime).getTime();

   this.startTimer(bid,endTime);

   this.bids.set([...this.bids()]);
 }

}
startTimer(bid:any,endTime:number){

 if(this.auctionIntervals[bid.id]) return;

 this.auctionIntervals[bid.id] = setInterval(()=>{

   const diff = endTime - Date.now();

   if(diff <= 0){

     clearInterval(this.auctionIntervals[bid.id]);

     bid.auctionLive = false;
    //  bid.timeLeft = "Auction Completed";

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
      this.successMessage.set(result.message || 'Crop approved for bidding!');
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
    this.authService.logout();
  }
}
