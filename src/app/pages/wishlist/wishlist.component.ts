// wishlist.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  isRemoving = false;

  ngOnInit(): void {
    this.initializeWishlist();
  }

  private initializeWishlist(): void {
    if (!this.wishlistService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    this.wishlistService.refreshWishlist();
  }

  removeFromWishlist(productId?: string): void {
    if (!productId || this.isRemoving) return;

    this.isRemoving = true;
    this.wishlistService.removeSpecifcWishlistItem(productId).subscribe({
      next: () => {
        this.wishlistService.wishlistDetails.update((items) =>
          items.filter((item) => item.id !== productId)
        );
        this.toastrService.success('Item removed from wishlist');
      },
      error: (err) => {
        this.toastrService.error('Failed to remove item', 'Error');
        console.error('Remove error:', err);
      },
      complete: () => (this.isRemoving = false),
    });
  }

  addTocartFromWishList(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        this.cartService.cartNumber.set(res.numOfCartItems);
        this.removeFromWishlist(id);
        this.toastrService.success(res.message, 'FreshCart');
      },
      error: (err) => {
        this.toastrService.error('Failed to add to cart', 'Error');
        console.error('Add to cart error:', err);
      },
    });
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  get wishlistItems() {
    return this.wishlistService.wishlistDetails();
  }
}
