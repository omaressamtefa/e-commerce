import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { log } from 'console';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { environment } from '../../enviroments/environment';
import { CartService } from '../cart/cart.service';
import { WishlistService } from '../wishlist/wishlist.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  constructor(private httpClient: HttpClient) {}

  userData: any;
  sendRegisterForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signup`,
      data
    );
  }
  sendLoginForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signin`,
      data
    );
  }
  sendUserData() {
    const token = localStorage.getItem('userToken');
    console.log('🔍 Token from LocalStorage:', token);

    if (!token) {
      console.error('❌ No token found in localStorage');
      return;
    }

    try {
      const decoded = jwtDecode<{ id: string; iat: number; exp: number }>(
        token
      );
      console.log('✅ Decoded Token:', decoded);

      this.userData = decoded;
    } catch (error) {
      console.error('❌ Failed to decode JWT:', error);
      this.userData = null;
    }
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('userToken');
    this.cartService.cartNumber.set(0);
    this.userData = null;
    this.router.navigate(['/login']);
  }
  setEmailVerify(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/forgotPasswords`,
      data
    );
  }

  setCodeVerify(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/verifyResetCode`,
      data
    );
  }

  setResetPass(data: object): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/api/v1/auth/resetPassword`,
      data
    );
  }
}
