import { error } from 'console';
import { ProductsService } from './../../core/services/products/products.service';
import {
  Component,
  computed,
  inject,
  Inject,
  OnInit,
  Signal,
} from '@angular/core';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ICategory } from '../../shared/interfaces/icategory';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { Iwishlist } from '../../shared/interfaces/iwishlist';
import { signal } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [
    CarouselModule,
    FormsModule,
    SearchPipe,
    CurrencyPipe,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService);

  searchText: string = '';
  products: IProduct[] = [];
  categories: ICategory[] = [];
  wishlistDetails = signal<IProduct[]>([]);
  wishlistIds = signal<string[]>([]);

  ngOnInit(): void {
    this.getProductsData();
    this.getCategoriesData();
    this.getWishlistData();
  }
  getCategoriesData(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
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
        console.log(res);
        this.toastrService.success(res.message, 'FreshCart');
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
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    rtl: true,
    pullDrag: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 6,
      },
    },
    nav: true,
  };
  sliderImages = [
    '/images/img1.avif',
    '/images/img2.avif',
    '/images/img3.avif',
    '/images/img4.avif',
    '/images/img5.avif',
    '/images/img6.avif',
  ];

  customMainSlider = {
    loop: true,
    margin: 10,
    rtl: true,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    items: 1,
  };
}
