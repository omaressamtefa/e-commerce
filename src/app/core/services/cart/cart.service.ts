import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { environment } from '../../enviroments/environment';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartNumber: WritableSignal<number> = signal(0);
  constructor(private httpClient: HttpClient) {}
  getToken(): string {
    return localStorage.getItem('userToken')!;
  }

  addProductToCart(id: string): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/cart`,
      { productId: id },
      { headers: { token: this.getToken() } }
    );
  }
  getLoggedUserCart(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/cart`, {
      headers: {
        token: this.getToken(),
      },
    });
  }
  removeSpecifcCartItem(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart/${id}`, {
      headers: { token: this.getToken() },
    });
  }
  updateCartProduct(id: string, newcount: number): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/api/v1/cart/${id}`,
      {
        count: newcount,
      },
      { headers: { token: this.getToken() } }
    );
  }

  clearCart(): Observable<any> {
    return this.httpClient
      .delete(`${environment.baseUrl}/api/v1/cart`, {
        headers: { token: this.getToken() },
      })
      .pipe(
        tap(() => this.cartNumber.set(0)),
        catchError((err) => {
          console.error('Clear cart error:', err);
          throw err;
        })
      );
  }
}
