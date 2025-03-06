import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { Iwishlist } from '../../shared/interfaces/iwishlist';

@Component({
  selector: 'app-products',
  imports: [FormsModule, SearchPipe, CurrencyPipe, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService);
  wishlistDetails = signal<IProduct[]>([]);
  wishlistIds = signal<string[]>([]);

  products: IProduct[] = [];
  searchText: string = '';
  ngOnInit(): void {
    this.getProductsData();
    this.getWishlistData();
  }
  addTocart(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        this.toastrService.success(res.message, 'FreshCart');
        this.cartService.cartNumber.set(res.numOfCartItems);
        console.log(this.cartService.cartNumber());
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProductsData(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data;
      },
    });
  }

  getWishlistData(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishlistDetails.set(res.data);
        this.wishlistIds.set(res.data.map((item: IProduct) => item._id));
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  addToWishlist(productId: string): void {
    this.wishlistService.addProductToWishlist(productId).subscribe({
      next: (res) => {
        this.wishlistDetails.set(res.data);
      },
      error: (err) => {
        console.error('Error adding to wishlist:', err);
      },
    });
  }
  toggleWishlist(productId: string): void {
    if (this.wishlistIds().includes(productId)) {
      this.wishlistService
        .removeSpecifcWishlistItem(productId)
        .subscribe(() => {
          this.wishlistDetails.update((items) =>
            items.filter((item) => item._id !== productId)
          );
          this.wishlistIds.update((ids) =>
            ids.filter((id) => id !== productId)
          );
        });
    } else {
      this.wishlistService.addProductToWishlist(productId).subscribe((res) => {
        this.wishlistDetails.update((items) => [...items, res.data]);
        this.wishlistIds.update((ids) => [...ids, productId]);
      });
    }
  }

  removeFromWishlist(productId: string): void {
    this.wishlistService.removeSpecifcWishlistItem(productId).subscribe({
      next: (res) => {
        this.wishlistDetails.set(res.data);
      },
      error: (err) => {
        console.error('Error removing from wishlist:', err);
      },
    });
  }

  isProductInWishlist(productId: string): boolean {
    return this.wishlistDetails().some(
      (item: IProduct) => item._id === productId
    );
  }
}
