import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Observable, of } from 'rxjs';

import { Order } from '../../models/product.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule
  ],
  template: `
    <div class="container">
      <!-- Success Header -->
      <div class="success-header">
        <div class="success-icon-container">
          <mat-icon class="success-icon">check_circle</mat-icon>
        </div>
        <h1>Order Confirmed!</h1>
        <p class="success-message">Thank you for your purchase. Your order has been successfully placed.</p>
      </div>

      <!-- Order Details -->
      <div class="order-details" *ngIf="order$ | async as order">
        <mat-card class="order-info-card">
          <mat-card-header>
            <mat-card-title>Order Information</mat-card-title>
            <mat-card-subtitle>Order #{{ order.id }}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="order-meta">
              <div class="meta-row">
                <span class="meta-label">Order Date:</span>
                <span class="meta-value">{{ order.orderDate | date:'fullDate' }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Status:</span>
                <span class="meta-value status" [class]="'status-' + order.status">
                  <mat-icon>{{ getStatusIcon(order.status) }}</mat-icon>
                  {{ getStatusText(order.status) }}
                </span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Total Amount:</span>
                <span class="meta-value total-amount">\${{ order.total.toFixed(2) }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Customer Information -->
        <mat-card class="customer-info-card">
          <mat-card-header>
            <mat-card-title>Customer & Shipping Information</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <div class="customer-details">
              <div class="detail-section">
                <h4>Contact Information</h4>
                <p><strong>{{ order.customer.firstName }} {{ order.customer.lastName }}</strong></p>
                <p>{{ order.customer.email }}</p>
                <p>{{ order.customer.phone }}</p>
              </div>
              
              <div class="detail-section">
                <h4>Shipping Address</h4>
                <p>{{ order.customer.address.street }}</p>
                <p>{{ order.customer.address.city }}, {{ order.customer.address.state }} {{ order.customer.address.zipCode }}</p>
                <p>{{ getCountryName(order.customer.address.country) }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Order Items -->
        <mat-card class="order-items-card">
          <mat-card-header>
            <mat-card-title>Items Ordered ({{ order.items.length }})</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <div class="order-items">
              <div class="order-item" *ngFor="let item of order.items">
                <img [src]="item.product.image" [alt]="item.product.name" class="item-image">
                
                <div class="item-details">
                  <h4 class="item-name">{{ item.product.name }}</h4>
                  <p class="item-description">{{ item.product.description | slice:0:100 }}...</p>
                  <div class="item-meta">
                    <span class="item-category">{{ item.product.category }}</span>
                    <span class="item-quantity">Qty: {{ item.quantity }}</span>
                  </div>
                </div>
                
                <div class="item-pricing">
                  <div class="unit-price">\${{ item.product.price }} each</div>
                  <div class="total-price">\${{ (item.product.price * item.quantity).toFixed(2) }}</div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Next Steps -->
        <mat-card class="next-steps-card">
          <mat-card-header>
            <mat-card-title>What's Next?</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <div class="next-steps">
              <div class="step">
                <mat-icon color="primary">email</mat-icon>
                <div class="step-content">
                  <h4>Confirmation Email</h4>
                  <p>We've sent a confirmation email to {{ order.customer.email }} with your order details.</p>
                </div>
              </div>
              
              <div class="step">
                <mat-icon color="primary">inventory</mat-icon>
                <div class="step-content">
                  <h4>Processing</h4>
                  <p>Your order is being processed and will be prepared for shipping within 1-2 business days.</p>
                </div>
              </div>
              
              <div class="step">
                <mat-icon color="primary">local_shipping</mat-icon>
                <div class="step-content">
                  <h4>Shipping</h4>
                  <p>You'll receive tracking information once your order ships. Estimated delivery: 3-5 business days.</p>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button mat-raised-button color="primary" routerLink="/products" class="continue-shopping-btn">
            <mat-icon>store</mat-icon>
            Continue Shopping
          </button>
          
          <button mat-stroked-button (click)="printOrder()" class="print-btn">
            <mat-icon>print</mat-icon>
            Print Order
          </button>
          
          <button mat-stroked-button class="help-btn">
            <mat-icon>help</mat-icon>
            Need Help?
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="!(order$ | async) && !orderNotFound">
        <mat-icon class="loading-icon">hourglass_empty</mat-icon>
        <p>Loading order details...</p>
      </div>

      <!-- Order Not Found -->
      <div class="error-container" *ngIf="orderNotFound">
        <mat-icon class="error-icon">error</mat-icon>
        <h2>Order Not Found</h2>
        <p>We couldn't find the order you're looking for. Please check your order number and try again.</p>
        <button mat-raised-button color="primary" routerLink="/products">
          <mat-icon>store</mat-icon>
          Continue Shopping
        </button>
      </div>
    </div>
  `,
  styles: [`
    .success-header {
      text-align: center;
      margin: 40px 0 60px 0;
      padding: 40px 20px;
      background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
      border-radius: 12px;
    }

    .success-icon-container {
      margin-bottom: 24px;
    }

    .success-icon {
      font-size: 80px;
      color: #4caf50;
      animation: successPulse 2s ease-in-out;
    }

    @keyframes successPulse {
      0% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }

    .success-header h1 {
      font-size: 2.5rem;
      color: #2e7d32;
      margin: 0 0 16px 0;
      font-weight: 500;
    }

    .success-message {
      font-size: 1.2rem;
      color: #4caf50;
      margin: 0;
    }

    .order-details {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .order-info-card,
    .customer-info-card,
    .order-items-card,
    .next-steps-card {
      overflow: visible;
    }

    .order-meta {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .meta-row:last-child {
      border-bottom: none;
    }

    .meta-label {
      font-weight: 500;
      color: #666;
    }

    .meta-value {
      color: #333;
    }

    .meta-value.status {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-confirmed {
      background: #d4edda;
      color: #155724;
    }

    .status-shipped {
      background: #cce7ff;
      color: #004085;
    }

    .status-delivered {
      background: #d1ecf1;
      color: #0c5460;
    }

    .total-amount {
      font-size: 1.2rem;
      font-weight: 600;
      color: #B12704;
    }

    .customer-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }

    .detail-section h4 {
      margin: 0 0 12px 0;
      color: #333;
      font-size: 1.1rem;
    }

    .detail-section p {
      margin: 4px 0;
      color: #666;
      line-height: 1.5;
    }

    .detail-section p:first-of-type {
      color: #333;
      font-weight: 500;
    }

    .order-items {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .order-item {
      display: grid;
      grid-template-columns: 100px 1fr auto;
      gap: 20px;
      padding: 16px;
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      align-items: center;
    }

    .item-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 6px;
    }

    .item-details {
      flex: 1;
    }

    .item-name {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .item-description {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .item-meta {
      display: flex;
      gap: 16px;
      font-size: 0.8rem;
      color: #888;
    }

    .item-pricing {
      text-align: right;
    }

    .unit-price {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 4px;
    }

    .total-price {
      font-size: 1.1rem;
      font-weight: 600;
      color: #B12704;
    }

    .next-steps {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .step {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .step-content {
      flex: 1;
    }

    .step-content h4 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 1rem;
    }

    .step-content p {
      margin: 0;
      color: #666;
      line-height: 1.5;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 40px 0;
    }

    .continue-shopping-btn {
      height: 48px;
      padding: 0 32px;
      font-size: 16px;
      font-weight: 500;
    }

    .print-btn,
    .help-btn {
      height: 48px;
      padding: 0 24px;
    }

    .loading-container,
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      color: #666;
      text-align: center;
    }

    .loading-icon,
    .error-icon {
      font-size: 64px;
      margin-bottom: 24px;
      opacity: 0.5;
    }

    .loading-icon {
      animation: spin 2s linear infinite;
    }

    .error-icon {
      color: #f44336;
    }

    .error-container h2 {
      margin: 16px 0;
      color: #333;
    }

    .error-container p {
      margin-bottom: 32px;
      font-size: 1.1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .success-header {
        margin: 20px 0 40px 0;
        padding: 30px 16px;
      }
      
      .success-header h1 {
        font-size: 2rem;
      }
      
      .success-icon {
        font-size: 60px;
      }
      
      .customer-details {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      
      .order-item {
        grid-template-columns: 80px 1fr;
        grid-template-rows: auto auto;
      }
      
      .item-pricing {
        grid-column: 1 / -1;
        text-align: left;
        padding-top: 8px;
      }
      
      .action-buttons {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class OrderConfirmationComponent implements OnInit {
  order$: Observable<Order | undefined> = of(undefined);
  orderNotFound = false;
  orderId: string;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {
    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';
  }

  ngOnInit(): void {
    if (this.orderId) {
      this.order$ = this.orderService.getOrderById(this.orderId);
      
      // Check if order exists
      this.order$.subscribe(order => {
        if (!order) {
          this.orderNotFound = true;
        }
      });
    } else {
      this.orderNotFound = true;
    }
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'pending': 'hourglass_empty',
      'confirmed': 'check_circle',
      'shipped': 'local_shipping',
      'delivered': 'done_all'
    };
    return icons[status] || 'help';
  }

  getStatusText(status: string): string {
    const texts: { [key: string]: string } = {
      'pending': 'Processing',
      'confirmed': 'Confirmed',
      'shipped': 'Shipped',
      'delivered': 'Delivered'
    };
    return texts[status] || status;
  }

  getCountryName(code: string): string {
    const countries: { [key: string]: string } = {
      'US': 'United States',
      'CA': 'Canada'
    };
    return countries[code] || code;
  }

  printOrder(): void {
    window.print();
  }
}
