import { CartService } from './../../core/services/cart/cart.service';
import { Component, inject, OnInit } from '@angular/core';
import { ICart } from '../../shared/interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { nextTick } from 'process';
import { log } from 'console';
import { RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cardDetails: ICart = {} as ICart;

  ngOnInit(): void {
    this.getCartData();
  }
  private readonly cartService = inject(CartService);
  getCartData(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res.data);
        this.cardDetails = res.data;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  removeItem(id: string): void {
    this.cartService.removeSpecifcCartItem(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cardDetails = res.data;
        this.cartService.cartNumber.set(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  updateItem(id: string, newCount: number): void {
    this.cartService.updateCartProduct(id, newCount).subscribe({
      next: (res) => {
        console.log(res);
        this.cardDetails = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: (res) => {
        console.log(res);
        if (res.message === 'success') {
          this.cardDetails = {} as ICart;
          this.cartService.cartNumber.set(0);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
