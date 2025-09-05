import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { Observable } from 'rxjs';

import { CartItem, Customer } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatListModule
  ],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Checkout</h1>
        <p>Complete your order</p>
      </div>

      <div class="checkout-content" *ngIf="(cartItems$ | async)?.length! > 0">
        <mat-stepper [linear]="true" #stepper class="checkout-stepper">
          
          <!-- Step 1: Customer Information -->
          <mat-step [stepControl]="customerForm" label="Customer Information">
            <form [formGroup]="customerForm" class="step-form">
              <div class="form-section">
                <h3>Contact Information</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>First Name</mat-label>
                    <input matInput formControlName="firstName" required>
                    <mat-error *ngIf="customerForm.get('firstName')?.hasError('required')">
                      First name is required
                    </mat-error>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Last Name</mat-label>
                    <input matInput formControlName="lastName" required>
                    <mat-error *ngIf="customerForm.get('lastName')?.hasError('required')">
                      Last name is required
                    </mat-error>
                  </mat-form-field>
                </div>
                
                <div class="form-row">
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Email</mat-label>
                    <input matInput formControlName="email" type="email" required>
                    <mat-error *ngIf="customerForm.get('email')?.hasError('required')">
                      Email is required
                    </mat-error>
                    <mat-error *ngIf="customerForm.get('email')?.hasError('email')">
                      Please enter a valid email
                    </mat-error>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Phone</mat-label>
                    <input matInput formControlName="phone" type="tel" required>
                    <mat-error *ngIf="customerForm.get('phone')?.hasError('required')">
                      Phone number is required
                    </mat-error>
                  </mat-form-field>
                </div>
              </div>
              
              <div class="step-actions">
                <button mat-raised-button color="primary" matStepperNext [disabled]="!customerForm.valid">
                  Continue to Shipping
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </form>
          </mat-step>

          <!-- Step 2: Shipping Address -->
          <mat-step [stepControl]="shippingForm" label="Shipping Address">
            <form [formGroup]="shippingForm" class="step-form">
              <div class="form-section">
                <h3>Shipping Address</h3>
                
                <mat-form-field appearance="outline" class="form-field full-width">
                  <mat-label>Street Address</mat-label>
                  <input matInput formControlName="street" required>
                  <mat-error *ngIf="shippingForm.get('street')?.hasError('required')">
                    Street address is required
                  </mat-error>
                </mat-form-field>
                
                <div class="form-row">
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>City</mat-label>
                    <input matInput formControlName="city" required>
                    <mat-error *ngIf="shippingForm.get('city')?.hasError('required')">
                      City is required
                    </mat-error>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>State</mat-label>
                    <mat-select formControlName="state" required>
                      <mat-option *ngFor="let state of states" [value]="state.code">
                        {{ state.name }}
                      </mat-option>
                    </mat-select>
                    <mat-error *ngIf="shippingForm.get('state')?.hasError('required')">
                      State is required
                    </mat-error>
                  </mat-form-field>
                </div>
                
                <div class="form-row">
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>ZIP Code</mat-label>
                    <input matInput formControlName="zipCode" required>
                    <mat-error *ngIf="shippingForm.get('zipCode')?.hasError('required')">
                      ZIP code is required
                    </mat-error>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Country</mat-label>
                    <mat-select formControlName="country" required>
                      <mat-option value="US">United States</mat-option>
                      <mat-option value="CA">Canada</mat-option>
                    </mat-select>
                    <mat-error *ngIf="shippingForm.get('country')?.hasError('required')">
                      Country is required
                    </mat-error>
                  </mat-form-field>
                </div>
              </div>
              
              <div class="step-actions">
                <button mat-stroked-button matStepperPrevious>
                  <mat-icon>arrow_back</mat-icon>
                  Back
                </button>
                <button mat-raised-button color="primary" matStepperNext [disabled]="!shippingForm.valid">
                  Continue to Payment
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </form>
          </mat-step>

          <!-- Step 3: Payment Information -->
          <mat-step [stepControl]="paymentForm" label="Payment">
            <form [formGroup]="paymentForm" class="step-form">
              <div class="form-section">
                <h3>Payment Information</h3>
                <p class="payment-notice">
                  <mat-icon color="warn">info</mat-icon>
                  This is a demo application. No real payment will be processed.
                </p>
                
                <mat-form-field appearance="outline" class="form-field full-width">
                  <mat-label>Cardholder Name</mat-label>
                  <input matInput formControlName="cardholderName" required>
                  <mat-error *ngIf="paymentForm.get('cardholderName')?.hasError('required')">
                    Cardholder name is required
                  </mat-error>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="form-field full-width">
                  <mat-label>Card Number</mat-label>
                  <input matInput formControlName="cardNumber" placeholder="1234 5678 9012 3456" required>
                  <mat-icon matSuffix>credit_card</mat-icon>
                  <mat-error *ngIf="paymentForm.get('cardNumber')?.hasError('required')">
                    Card number is required
                  </mat-error>
                </mat-form-field>
                
                <div class="form-row">
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Expiry Date</mat-label>
                    <input matInput formControlName="expiryDate" placeholder="MM/YY" required>
                    <mat-error *ngIf="paymentForm.get('expiryDate')?.hasError('required')">
                      Expiry date is required
                    </mat-error>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>CVV</mat-label>
                    <input matInput formControlName="cvv" placeholder="123" type="password" required>
                    <mat-error *ngIf="paymentForm.get('cvv')?.hasError('required')">
                      CVV is required
                    </mat-error>
                  </mat-form-field>
                </div>
                
                <mat-checkbox formControlName="savePaymentMethod" class="save-payment-checkbox">
                  Save this payment method for future purchases
                </mat-checkbox>
              </div>
              
              <div class="step-actions">
                <button mat-stroked-button matStepperPrevious>
                  <mat-icon>arrow_back</mat-icon>
                  Back
                </button>
                <button mat-raised-button color="primary" matStepperNext [disabled]="!paymentForm.valid">
                  Review Order
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </form>
          </mat-step>

          <!-- Step 4: Order Review -->
          <mat-step label="Review & Place Order">
            <div class="step-form">
              <div class="order-review">
                <!-- Order Summary -->
                <div class="review-section">
                  <h3>Order Summary</h3>
                  <mat-card class="order-items">
                    <div class="order-item" *ngFor="let item of cartItems$ | async">
                      <img [src]="item.product.image" [alt]="item.product.name" class="item-image">
                      <div class="item-details">
                        <h4>{{ item.product.name }}</h4>
                        <p>Quantity: {{ item.quantity }}</p>
                      </div>
                      <div class="item-price">
                        \${{ (item.product.price * item.quantity).toFixed(2) }}
                      </div>
                    </div>
                  </mat-card>
                </div>

                <!-- Customer & Shipping Info -->
                <div class="review-section">
                  <h3>Shipping Information</h3>
                  <mat-card class="info-card">
                    <div class="info-row">
                      <strong>{{ customerForm.get('firstName')?.value }} {{ customerForm.get('lastName')?.value }}</strong>
                    </div>
                    <div class="info-row">{{ customerForm.get('email')?.value }}</div>
                    <div class="info-row">{{ customerForm.get('phone')?.value }}</div>
                    <mat-divider></mat-divider>
                    <div class="info-row">{{ shippingForm.get('street')?.value }}</div>
                    <div class="info-row">
                      {{ shippingForm.get('city')?.value }}, {{ shippingForm.get('state')?.value }} {{ shippingForm.get('zipCode')?.value }}
                    </div>
                    <div class="info-row">{{ getCountryName(shippingForm.get('country')?.value) }}</div>
                  </mat-card>
                </div>

                <!-- Payment Summary -->
                <div class="review-section">
                  <h3>Payment Summary</h3>
                  <mat-card class="payment-summary">
                    <div class="summary-row">
                      <span>Subtotal:</span>
                      <span>\${{ (cartTotal$ | async)?.toFixed(2) }}</span>
                    </div>
                    <div class="summary-row">
                      <span>Shipping:</span>
                      <span>{{ getShippingCost() === 0 ? 'FREE' : '$' + getShippingCost().toFixed(2) }}</span>
                    </div>
                    <div class="summary-row">
                      <span>Tax:</span>
                      <span>\${{ getTaxAmount().toFixed(2) }}</span>
                    </div>
                    <mat-divider></mat-divider>
                    <div class="summary-row total-row">
                      <span>Total:</span>
                      <span class="total-amount">\${{ getOrderTotal().toFixed(2) }}</span>
                    </div>
                  </mat-card>
                </div>
              </div>
              
              <div class="step-actions">
                <button mat-stroked-button matStepperPrevious>
                  <mat-icon>arrow_back</mat-icon>
                  Back
                </button>
                <button 
                  mat-raised-button 
                  color="primary" 
                  class="place-order-btn"
                  (click)="placeOrder()"
                  [disabled]="isProcessingOrder"
                >
                  <mat-icon *ngIf="!isProcessingOrder">shopping_cart</mat-icon>
                  <mat-icon *ngIf="isProcessingOrder" class="spinning">hourglass_empty</mat-icon>
                  {{ isProcessingOrder ? 'Processing...' : 'Place Order' }}
                </button>
              </div>
            </div>
          </mat-step>
        </mat-stepper>
      </div>

      <!-- Empty Cart -->
      <div class="empty-cart" *ngIf="(cartItems$ | async)?.length === 0">
        <mat-icon class="empty-cart-icon">shopping_cart</mat-icon>
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart before proceeding to checkout.</p>
        <button mat-raised-button color="primary" routerLink="/products">
          <mat-icon>store</mat-icon>
          Start Shopping
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      text-align: center;
      margin: 40px 0;
    }

    .page-header h1 {
      font-size: 2.5rem;
      margin-bottom: 8px;
      color: #333;
    }

    .page-header p {
      font-size: 1.2rem;
      color: #666;
    }

    .checkout-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .checkout-stepper {
      margin: 20px 0;
    }

    .step-form {
      padding: 24px 0;
    }

    .form-section {
      margin-bottom: 32px;
    }

    .form-section h3 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 1.3rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-field {
      width: 100%;
    }

    .form-field.full-width {
      grid-column: 1 / -1;
    }

    .payment-notice {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 4px;
      padding: 12px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #856404;
    }

    .save-payment-checkbox {
      margin-top: 16px;
    }

    .step-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      padding-top: 24px;
      border-top: 1px solid #eee;
    }

    .place-order-btn {
      height: 48px;
      padding: 0 32px;
      font-size: 16px;
      font-weight: 500;
    }

    .order-review {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .review-section h3 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 1.2rem;
    }

    .order-items {
      padding: 0;
    }

    .order-item {
      display: grid;
      grid-template-columns: 80px 1fr auto;
      gap: 16px;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      align-items: center;
    }

    .order-item:last-child {
      border-bottom: none;
    }

    .item-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
    }

    .item-details h4 {
      margin: 0 0 4px 0;
      font-size: 1rem;
      color: #333;
    }

    .item-details p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .item-price {
      font-weight: 600;
      color: #B12704;
      text-align: right;
    }

    .info-card {
      padding: 16px;
    }

    .info-row {
      padding: 4px 0;
      color: #666;
    }

    .info-row:first-child {
      color: #333;
      font-size: 1.1rem;
    }

    .payment-summary {
      padding: 16px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }

    .total-row {
      font-size: 1.2rem;
      font-weight: 600;
      padding-top: 16px;
    }

    .total-amount {
      color: #B12704;
      font-size: 1.4rem;
    }

    .empty-cart {
      text-align: center;
      padding: 80px 20px;
      color: #666;
    }

    .empty-cart-icon {
      font-size: 80px;
      margin-bottom: 24px;
      opacity: 0.3;
    }

    .empty-cart h2 {
      margin: 24px 0 16px 0;
      color: #333;
    }

    .empty-cart p {
      margin-bottom: 32px;
      font-size: 1.1rem;
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .order-item {
        grid-template-columns: 60px 1fr;
        grid-template-rows: auto auto;
      }
      
      .item-price {
        grid-column: 1 / -1;
        text-align: left;
        padding-top: 8px;
      }
      
      .step-actions {
        flex-direction: column;
      }
      
      .page-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  customerForm: FormGroup;
  shippingForm: FormGroup;
  paymentForm: FormGroup;
  
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  
  isProcessingOrder = false;

  states = [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    // Add more states as needed
  ];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.cartItems$ = this.cartService.getCartItems();
    this.cartTotal$ = this.cartService.getCartTotal();
    
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });

    this.shippingForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['US', Validators.required]
    });

    this.paymentForm = this.fb.group({
      cardholderName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expiryDate: ['', Validators.required],
      cvv: ['', Validators.required],
      savePaymentMethod: [false]
    });
  }

  ngOnInit(): void {
    // Redirect to cart if empty
    this.cartItems$.subscribe(items => {
      if (items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
  }

  getShippingCost(): number {
    const total = this.cartService.getCartSummary().total;
    return total >= 50 ? 0 : 5.99;
  }

  getTaxAmount(): number {
    const total = this.cartService.getCartSummary().total;
    return total * 0.085;
  }

  getOrderTotal(): number {
    const subtotal = this.cartService.getCartSummary().total;
    const shipping = this.getShippingCost();
    const tax = this.getTaxAmount();
    return subtotal + shipping + tax;
  }

  getCountryName(code: string): string {
    const countries: { [key: string]: string } = {
      'US': 'United States',
      'CA': 'Canada'
    };
    return countries[code] || code;
  }

  async placeOrder(): Promise<void> {
    if (this.customerForm.valid && this.shippingForm.valid && this.paymentForm.valid) {
      this.isProcessingOrder = true;

      try {
        // Create customer object
        const customer: Customer = {
          firstName: this.customerForm.get('firstName')?.value,
          lastName: this.customerForm.get('lastName')?.value,
          email: this.customerForm.get('email')?.value,
          phone: this.customerForm.get('phone')?.value,
          address: {
            street: this.shippingForm.get('street')?.value,
            city: this.shippingForm.get('city')?.value,
            state: this.shippingForm.get('state')?.value,
            zipCode: this.shippingForm.get('zipCode')?.value,
            country: this.shippingForm.get('country')?.value
          }
        };

        // Process payment (mock)
        const paymentResult = await this.orderService.processPayment({
          cardholderName: this.paymentForm.get('cardholderName')?.value,
          cardNumber: this.paymentForm.get('cardNumber')?.value,
          expiryDate: this.paymentForm.get('expiryDate')?.value,
          cvv: this.paymentForm.get('cvv')?.value
        }).toPromise();

        if (paymentResult?.success) {
          // Create order
          const cartSummary = this.cartService.getCartSummary();
          const order = await this.orderService.createOrder(
            customer,
            cartSummary.items,
            this.getOrderTotal()
          ).toPromise();

          if (order) {
            // Clear cart
            this.cartService.clearCart();
            
            // Navigate to confirmation
            this.router.navigate(['/confirmation', order.id]);
          }
        }
      } catch (error) {
        console.error('Error placing order:', error);
        // TODO: Show error notification
      } finally {
        this.isProcessingOrder = false;
      }
    }
  }
}
