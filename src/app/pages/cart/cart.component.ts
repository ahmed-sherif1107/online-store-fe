import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Observable } from 'rxjs';

import { CartItem } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
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
      <div class="page-header">
        <h1>Shopping Cart</h1>
        <p *ngIf="(cartItems$ | async)?.length === 0">Your cart is empty</p>
        <p *ngIf="(cartItems$ | async)?.length! > 0">
          {{ (cartCount$ | async) }} item{{ (cartCount$ | async)! > 1 ? 's' : '' }} in your cart
        </p>
      </div>

      <!-- Cart Items -->
      <div class="cart-content" *ngIf="(cartItems$ | async)?.length! > 0">
        <div class="cart-items">
          <mat-card class="cart-item-card" *ngFor="let item of cartItems$ | async">
            <div class="cart-item">
              <div class="item-image">
                <img [src]="item.product.image" [alt]="item.product.name" class="cart-item-image">
              </div>
              
              <div class="item-details">
                <h3 class="item-name">
                  <a [routerLink]="['/product', item.product.id]">{{ item.product.name }}</a>
                </h3>
                <p class="item-description">{{ item.product.description | slice:0:100 }}...</p>
                <div class="item-category">Category: {{ item.product.category }}</div>
                
                <div class="item-availability" [class.out-of-stock]="!item.product.inStock">
                  <mat-icon>{{ item.product.inStock ? 'check_circle' : 'cancel' }}</mat-icon>
                  {{ item.product.inStock ? 'In Stock' : 'Out of Stock' }}
                </div>
              </div>
              
              <div class="item-actions">
                <div class="quantity-controls">
                  <button 
                    mat-icon-button 
                    (click)="decreaseQuantity(item.product.id)"
                    [disabled]="item.quantity <= 1"
                    class="quantity-btn"
                  >
                    <mat-icon>remove</mat-icon>
                  </button>
                  <span class="quantity-display">{{ item.quantity }}</span>
                  <button 
                    mat-icon-button 
                    (click)="increaseQuantity(item.product.id)"
                    [disabled]="item.quantity >= item.product.stockQuantity"
                    class="quantity-btn"
                  >
                    <mat-icon>add</mat-icon>
                  </button>
                </div>
                
                <div class="item-price">
                  <div class="unit-price">
                    \${{ item.product.price }} each
                  </div>
                  <div class="total-price">
                    \${{ (item.product.price * item.quantity).toFixed(2) }}
                  </div>
                </div>
                
                <button 
                  mat-icon-button 
                  color="warn" 
                  (click)="removeItem(item.product.id)"
                  class="remove-btn"
                  matTooltip="Remove from cart"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary">
          <mat-card class="summary-card">
            <mat-card-header>
              <mat-card-title>Order Summary</mat-card-title>
            </mat-card-header>
            
            <mat-card-content>
              <div class="summary-row">
                <span>Items ({{ cartCount$ | async }}):</span>
                <span>\${{ (cartTotal$ | async)?.toFixed(2) }}</span>
              </div>
              
              <div class="summary-row">
                <span>Shipping:</span>
                <span>{{ getShippingCost() === 0 ? 'FREE' : '$' + getShippingCost().toFixed(2) }}</span>
              </div>
              
              <div class="summary-row">
                <span>Tax (estimated):</span>
                <span>\${{ getTaxAmount().toFixed(2) }}</span>
              </div>
              
              <mat-divider></mat-divider>
              
              <div class="summary-row total-row">
                <span>Order Total:</span>
                <span class="total-amount">\${{ getOrderTotal().toFixed(2) }}</span>
              </div>
            </mat-card-content>
            
            <mat-card-actions>
              <button 
                mat-raised-button 
                color="primary" 
                class="checkout-btn"
                routerLink="/checkout"
                [disabled]="(cartItems$ | async)?.length === 0"
              >
                <mat-icon>payment</mat-icon>
                Proceed to Checkout
              </button>
              
              <button 
                mat-stroked-button 
                routerLink="/products"
                class="continue-shopping-btn"
              >
                <mat-icon>arrow_back</mat-icon>
                Continue Shopping
              </button>
            </mat-card-actions>
          </mat-card>
          
          <!-- Shipping Info -->
          <mat-card class="shipping-info">
            <mat-card-content>
              <div class="shipping-benefit">
                <mat-icon color="primary">local_shipping</mat-icon>
                <div>
                  <strong>Free Shipping</strong>
                  <p>On orders over $50</p>
                </div>
              </div>
              
              <div class="shipping-benefit">
                <mat-icon color="primary">assignment_return</mat-icon>
                <div>
                  <strong>Easy Returns</strong>
                  <p>30-day return policy</p>
                </div>
              </div>
              
              <div class="shipping-benefit">
                <mat-icon color="primary">security</mat-icon>
                <div>
                  <strong>Secure Checkout</strong>
                  <p>SSL encrypted</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Empty Cart -->
      <div class="empty-cart" *ngIf="(cartItems$ | async)?.length === 0">
        <mat-icon class="empty-cart-icon">shopping_cart</mat-icon>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <button mat-raised-button color="primary" routerLink="/products" class="start-shopping-btn">
          <mat-icon>store</mat-icon>
          Start Shopping
        </button>
      </div>

      <!-- Recently Viewed -->
      <div class="recently-viewed" *ngIf="(cartItems$ | async)?.length! > 0">
        <h2>You might also like</h2>
        <p>Continue shopping to discover more great products</p>
        <button mat-stroked-button routerLink="/products">
          <mat-icon>explore</mat-icon>
          Browse All Products
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

    .cart-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 32px;
      margin: 20px 0;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cart-item-card {
      padding: 0;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 120px 1fr auto;
      gap: 20px;
      padding: 20px;
      align-items: center;
    }

    .item-image {
      display: flex;
      justify-content: center;
    }

    .cart-item-image {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
    }

    .item-details {
      flex: 1;
    }

    .item-name {
      margin: 0 0 8px 0;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .item-name a {
      color: #333;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .item-name a:hover {
      color: #1976d2;
    }

    .item-description {
      color: #666;
      font-size: 0.9rem;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }

    .item-category {
      color: #888;
      font-size: 0.8rem;
      margin-bottom: 8px;
    }

    .item-availability {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.9rem;
      color: #4caf50;
    }

    .item-availability.out-of-stock {
      color: #f44336;
    }

    .item-actions {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: flex-end;
      min-width: 150px;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 4px;
    }

    .quantity-btn {
      width: 32px;
      height: 32px;
      line-height: 1;
    }

    .quantity-display {
      min-width: 40px;
      text-align: center;
      font-weight: 500;
      font-size: 16px;
    }

    .item-price {
      text-align: right;
    }

    .unit-price {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 4px;
    }

    .total-price {
      font-size: 1.2rem;
      font-weight: 600;
      color: #B12704;
    }

    .remove-btn {
      color: #f44336;
    }

    .cart-summary {
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: fit-content;
      position: sticky;
      top: 80px;
    }

    .summary-card {
      padding: 0;
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
      padding: 16px 0 8px 0;
    }

    .total-amount {
      color: #B12704;
      font-size: 1.4rem;
    }

    .checkout-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .continue-shopping-btn {
      width: 100%;
      height: 40px;
    }

    .shipping-info {
      padding: 0;
    }

    .shipping-benefit {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .shipping-benefit:last-child {
      border-bottom: none;
    }

    .shipping-benefit div {
      flex: 1;
    }

    .shipping-benefit strong {
      display: block;
      color: #333;
      margin-bottom: 4px;
    }

    .shipping-benefit p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
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

    .start-shopping-btn {
      height: 48px;
      padding: 0 32px;
      font-size: 16px;
    }

    .recently-viewed {
      text-align: center;
      margin: 60px 0 40px 0;
      padding: 40px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .recently-viewed h2 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .recently-viewed p {
      color: #666;
      margin: 0 0 24px 0;
    }

    @media (max-width: 768px) {
      .cart-content {
        grid-template-columns: 1fr;
      }
      
      .cart-item {
        grid-template-columns: 80px 1fr;
        grid-template-rows: auto auto;
        gap: 16px;
      }
      
      .item-actions {
        grid-column: 1 / -1;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        min-width: auto;
      }
      
      .item-price {
        text-align: left;
      }
      
      .cart-summary {
        position: static;
      }
      
      .page-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  cartCount$: Observable<number>;
  cartTotal$: Observable<number>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.getCartItems();
    this.cartCount$ = this.cartService.getCartCount();
    this.cartTotal$ = this.cartService.getCartTotal();
  }

  ngOnInit(): void {
  }

  increaseQuantity(productId: number): void {
    const currentQuantity = this.cartService.getProductQuantity(productId);
    this.cartService.updateQuantity(productId, currentQuantity + 1);
  }

  decreaseQuantity(productId: number): void {
    const currentQuantity = this.cartService.getProductQuantity(productId);
    if (currentQuantity > 1) {
      this.cartService.updateQuantity(productId, currentQuantity - 1);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  getShippingCost(): number {
    // Free shipping on orders over $50
    const total = this.cartService.getCartSummary().total;
    return total >= 50 ? 0 : 5.99;
  }

  getTaxAmount(): number {
    // 8.5% tax rate
    const total = this.cartService.getCartSummary().total;
    return total * 0.085;
  }

  getOrderTotal(): number {
    const subtotal = this.cartService.getCartSummary().total;
    const shipping = this.getShippingCost();
    const tax = this.getTaxAmount();
    return subtotal + shipping + tax;
  }
}
