import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-details',
  imports: [CurrencyPipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  isAddingToCart = false;
  selectedImageIndex = 0;
  productId: any;
  productDetails: IProduct = {} as IProduct;
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (res) => {
        this.productId = res.get('id');
        console.log(this.productId);
        this.productsService.getSpecificProducts(this.productId).subscribe({
          next: (res) => {
            this.productDetails = res.data;
          },
          error: (err) => {
            console.log(err);
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  addTocart(id: string): void {
    this.isAddingToCart = true;
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        this.cartService.cartNumber.set(res.numOfCartItems);
        this.toastrService.success(res.message, 'FreshCart');
        this.isAddingToCart = false;
      },
      error: (err) => {
        this.toastrService.error('Failed to add item to cart', 'Error');
        this.isAddingToCart = false;
      },
    });
  }
}
