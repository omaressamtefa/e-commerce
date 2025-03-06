import { Iorder } from './../../shared/interfaces/iorder';
import { Component, OnInit, inject } from '@angular/core';
import { OrderService } from '../../core/services/order/order.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { ICart } from '../../shared/interfaces/icart';
import { CartService } from '../../core/services/cart/cart.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.scss'],
})
export class AllordersComponent implements OnInit {
  userId: ICart = {} as ICart;
  userData: any;
  orders: Iorder[] = [];
  private readonly orderService = inject(OrderService);
  token = localStorage.getItem('userToken');
  decoded = this.token ? jwtDecode<{ id: string }>(this.token) : null;
  loading = true;
  errorMessage = '';
  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    if (!this.token) {
      this.errorMessage = 'Authentication required. Please login.';
      this.loading = false;
      return;
    }
    try {
      this.userData = this.decoded;

      this.orderService.getUserOrder(this.userData.id).subscribe({
        next: (res) => {
          this.orders = res;
          console.log((this.orders = res));
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching orders:', err);
          this.errorMessage = 'Failed to load orders. Please try again later.';
          this.loading = false;
        },
      });
    } catch (error) {
      console.error('❌ Failed to decode JWT:', error);
      this.errorMessage = 'Invalid authentication token.';
      this.loading = false;
    }
  }
}
