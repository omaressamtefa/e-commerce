import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../core/services/order/order.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  cartId: string = '';

  checkoutForm: FormGroup = new FormGroup({
    details: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^01[0-9]{9}$'),
    ]),
    city: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.cartId = param.get('id')!;
    });
  }

  submitForm(): void {
    if (this.checkoutForm.invalid) return;

    console.log(this.checkoutForm.value);
    this.orderService
      .checkOutSession(this.cartId, this.checkoutForm.value)
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res.status === 'success') {
            open(res.session.url, '_self');
            setTimeout(() => {
              window.location.href = '/';
            }, 5000);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
