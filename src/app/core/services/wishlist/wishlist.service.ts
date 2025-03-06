import { environment } from '../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  wishlistnumbrs = signal<number>(0);
  wishlistDetails = signal<any[]>([]);

  constructor(private httpClient: HttpClient) {}

  getToken(): string {
    return localStorage.getItem('userToken')!;
  }

  addProductToWishlist(id: string): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/wishlist`,
      { productId: id },
      { headers: { token: this.getToken() } }
    );
  }

  getLoggedUserWishlist(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/wishlist`, {
      headers: { token: this.getToken() },
    });
  }

  removeSpecifcWishlistItem(id: string): Observable<any> {
    return this.httpClient.delete(
      `${environment.baseUrl}/api/v1/wishlist/${id}`,
      { headers: { token: this.getToken() } }
    );
  }

  clearWishlist(): void {
    this.wishlistDetails.set([]);
    this.wishlistnumbrs.set(0);
  }

  refreshWishlist(): void {
    if (this.getToken()) {
      this.getLoggedUserWishlist().subscribe({
        next: (res) => this.wishlistDetails.set(res.data),
        error: (err) => console.error('Wishlist refresh failed:', err),
      });
    }
  }
}
