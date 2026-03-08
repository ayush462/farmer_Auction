import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://192.168.1.5:8080/api';

  constructor(private authService: AuthService) {}

 private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = this.authService.getToken();

  const headers: any = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`${this.baseUrl}${url}`, {
    ...options,
    headers,
  });
}
private async parseResponse(response: Response) {
  try {
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

  async getCrops(): Promise<any[]> {
    try {
      const response = await this.fetchWithAuth('/admin/crops/pending');
      return await response.json();
    } catch (error) {
      console.error('Error fetching crops:', error);
      return [];
    }
  }

  async placeSellRequest(cropData: any): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.fetchWithAuth('/crops/request-sell', {
        method: 'POST',
        body: JSON.stringify(cropData)
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Sell request placed successfully!' };
    } catch (error) {
      console.error('Error placing sell request:', error);
      return { success: false, message: 'Network error' };
    }
  }

  async getSoldHistory(farmerId: string): Promise<any[]> {
    try {
      const response = await this.fetchWithAuth(`/farmer/${farmerId}/sold-history`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching sold history:', error);
      return [];
    }
  }

  async getMarketplace(): Promise<any[]> {
    try {
      const response = await this.fetchWithAuth('/crops/marketplace');
      return await response.json();
    } catch (error) {
      console.error('Error fetching marketplace:', error);
      return [];
    }
  }

 async placeBid(bidData: any): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await this.fetchWithAuth('/bids/place', {
      method: 'POST',
      body: JSON.stringify(bidData)
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      return { success: false, message: data.message || 'Bid failed' };
    }

    return { success: true, message: data.message || 'Bid placed successfully!' };

  } catch (error) {
    console.error('Error placing bid:', error);
    return { success: false, message: 'Network error' };
  }
}
async createAuction(data: any): Promise<any> {

  try {

    const response = await this.fetchWithAuth('/auction/create', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    const text = await response.text();

    const json = text ? JSON.parse(text) : null;

    if (!response.ok) {
      return {
        success: false,
        message: json?.message || 'Auction failed'
      };
    }

    return {
      success: true,
      auction: json
    };

  } catch (error) {

    console.error('Error creating auction:', error);

    return {
      success: false,
      message: 'Network error'
    };

  }

}
async getFarmerDashboard(farmerId:number):Promise<any>{

  try{

    const response = await this.fetchWithAuth(`/farmer/dashboard/${farmerId}`);

    const text = await response.text();

    if(!text) return null;

    return JSON.parse(text);

  }catch(err){

    console.error("dashboard fetch error",err);
    return null;

  }

}
async getAdminDashboard(): Promise<any> {
  try {

    const response = await this.fetchWithAuth('/admin/dashboard');

    const text = await response.text();

    console.log("Admin dashboard raw:", text);

    if(!text) return null;

    return JSON.parse(text);

  } catch (error) {

    console.error('Error fetching admin dashboard:', error);

    return null;

  }
}
async getBidderDashboard(bidderId:number):Promise<any>{

  try{

    const response = await this.fetchWithAuth(`/bidder/dashboard/${bidderId}`);

    const text = await response.text();

    if(!text) return null;

    return JSON.parse(text);

  }catch(err){

    console.error("bidder dashboard fetch error",err);
    return null;

  }

}
async rejectInsurance(policyId:number):Promise<any>{

 try{

   const response = await this.fetchWithAuth(`/insurance/admin/reject-policy/${policyId}`,{
     method:"PUT"
   });

   return await response.json();

 }catch(err){

   console.error("insurance reject error",err);

   return {success:false};

 }

}

async getAuction(cropId:number):Promise<any>{

  try{

    const response = await this.fetchWithAuth(`/auction/crop/${cropId}`);

    const text = await response.text();

    if(!text) return null;

    return JSON.parse(text);

  }catch(err){

    console.error("auction fetch error",err);
    return null;

  }

}
async getAuctionWinner(cropId: number): Promise<any> {

  try {

    const response = await this.fetchWithAuth(`/bids/winner/${cropId}`);

    const text = await response.text();

    if (!text) return null;

    return JSON.parse(text);

  } catch (error) {

    console.error("Error fetching winner", error);

    return null;

  }

}
async getClaimRequests(): Promise<any[]> {

  try {

    const response = await this.fetchWithAuth('/insurance/admin/claim-requests');

    return await response.json();

  } catch (error) {

    console.error("Error fetching claims", error);

    return [];

  }

}

  async applyInsurance(insuranceData: any): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.fetchWithAuth('/insurance/apply', {
        method: 'POST',
        body: JSON.stringify(insuranceData)
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Insurance application submitted successfully!' };
    } catch (error) {
      console.error('Error applying insurance:', error);
      return { success: false, message: 'Network error' };
    }
  }


  async claimInsurance(claimData: any): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.fetchWithAuth('/insurance/claim', {
        method: 'POST',
        body: JSON.stringify(claimData)
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Insurance claim submitted successfully!' };
    } catch (error) {
      console.error('Error claiming insurance:', error);
      return { success: false, message: 'Network error' };
    }
  }
  async getFarmerPolicies(farmerId: number): Promise<any[]> {

  try {

    const response = await this.fetchWithAuth(`/insurance/farmer/${farmerId}`);

    return await response.json();

  } catch (error) {

    console.error("Error fetching policies:", error);

    return [];

  }

}
async approveClaim(policyId:number):Promise<any>{

 try{

   const response = await this.fetchWithAuth(`/insurance/admin/approve-claim/${policyId}`,{
     method:"PUT"
   });

   return await response.json();

 }catch(err){

   console.error("approve claim error",err);
   return {success:false};

 }

}
async rejectClaim(policyId:number):Promise<any>{

 try{

   const response = await this.fetchWithAuth(`/insurance/admin/reject-claim/${policyId}`,{
     method:"PUT"
   });

   return await response.json();

 }catch(err){

   console.error("reject claim error",err);
   return {success:false};

 }

}
async getInsuranceRequests():Promise<any[]>{

 try{

   const response = await this.fetchWithAuth('/insurance/admin/applied-policies');

   return await response.json();

 }catch(err){

   console.error("insurance fetch error",err);

   return [];

 }

}
async approveInsurance(policyId:number):Promise<any>{

 try{

   const response = await this.fetchWithAuth(`/insurance/admin/approve-policy/${policyId}`,{
     method:"PUT"
   });

   return await response.json();

 }catch(err){

   console.error("insurance approve error",err);

   return {success:false};

 }

}

 async getFarmers(): Promise<any[]> {
  try {
    const response = await this.fetchWithAuth('/admin/farmers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching farmers:', error);
    return [];
  }
}

async getBidders(): Promise<any[]> {
  try {
    const response = await this.fetchWithAuth('/admin/bidders');
    return await response.json();
  } catch (error) {
    console.error('Error fetching bidders:', error);
    return [];
  }
}
 async getHighestBid(cropId: number): Promise<any> {
  try {
    const response = await this.fetchWithAuth(`/bids/highest/${cropId}`);

    const text = await response.text();

    if (!text) {
      return null;
    }

    return JSON.parse(text);

  } catch (error) {
    console.error('Error fetching highest bid:', error);
    return null;
  }
}

async getUserById(userId: number): Promise<string | null> {
  try {

    const response = await this.fetchWithAuth(`/auth/users/${userId}`);

    const text = await response.text();

    return text || null;

  } catch (error) {

    console.error('Error fetching user:', error);

    return null;

  }
}

  async approveUser(userId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.fetchWithAuth(`/admin/users/${userId}/approve`, {
        method: 'PUT'
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, message: error.message };
      }

      return { success: true, message: 'User approved successfully!' };
    } catch (error) {
      console.error('Error approving user:', error);
      return { success: false, message: 'Network error' };
    }
  }

  async approveCrop(cropId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.fetchWithAuth(`/admin/crops/${cropId}/approve`, {
        method: 'PUT'
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Crop approved successfully!' };
    } catch (error) {
      console.error('Error approving crop:', error);
      return { success: false, message: 'Network error' };
    }
  }
}
