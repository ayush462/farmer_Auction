import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'bidder' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  async login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    let result = null;

    try {
      result = await response.json();
    } catch {}

    if (!response.ok) {
      return {
        success: false,
        message: result?.message || 'Invalid email or password'
      };
    }

    const user: User = {
      id: result.id,
      email: result.email,
      name: result.name,
      role: result.role
    };

    this.currentUser.set(user);
    this.isAuthenticated.set(true);

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', result.token);

    this.router.navigate([`/${user.role}`]);

    return { success: true };

  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Network error. Please try again.' };
  }
}
 async register(data: any): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    let result = null;

    try {
      result = await response.json();
    } catch {}

    if (!response.ok) {
      return { success: false, message: result?.message || 'Registration failed' };
    }

    return { success: true, message: result?.message || 'Registration successful!' };

  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Network error' };
  }
}

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
