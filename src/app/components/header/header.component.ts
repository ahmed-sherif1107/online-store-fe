import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <div class="container header-content">
        <!-- Logo -->
        <div class="logo">
          <a routerLink="/" class="logo-link">
            <mat-icon>shopping_bag</mat-icon>
            <span>Online Shop</span>
          </a>
        </div>

        <!-- Search Bar -->
        <div class="search-container">
          <mat-form-field appearance="outline" class="search-field">
            <mat-icon matPrefix>search</mat-icon>
            <input 
              matInput 
              placeholder="Search products..." 
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
            >
          </mat-form-field>
          <button mat-raised-button color="accent" (click)="onSearch()" class="search-btn">
            Search
          </button>
        </div>

        <!-- Navigation Links -->
        <div class="nav-links">
          <a mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            Home
          </a>
          <a mat-button routerLink="/products" routerLinkActive="active">
            Products
          </a>
          
          <!-- Cart Button -->
          <a mat-button routerLink="/cart" routerLinkActive="active" class="cart-button">
            <mat-icon [matBadge]="cartCount$ | async" matBadgeColor="warn" [matBadgeHidden]="(cartCount$ | async) === 0">
              shopping_cart
            </mat-icon>
            <span class="cart-text">Cart</span>
          </a>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 64px;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 16px;
    }

    .logo {
      display: flex;
      align-items: center;
      min-width: 150px;
    }

    .logo-link {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: white;
      font-size: 20px;
      font-weight: 500;
    }

    .search-container {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: 600px;
    }

    .search-field {
      flex: 1;
    }

    .search-field ::ng-deep .mat-mdc-form-field-wrapper {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }

    .search-field ::ng-deep .mat-mdc-text-field-wrapper {
      background: transparent;
    }

    .search-field ::ng-deep .mat-mdc-form-field-outline {
      color: rgba(255, 255, 255, 0.3);
    }

    .search-field ::ng-deep input {
      color: white;
    }

    .search-field ::ng-deep .mat-mdc-input-element::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .search-btn {
      height: 40px;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 200px;
      justify-content: flex-end;
    }

    .cart-button {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .cart-text {
      display: none;
    }

    .active {
      background: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 768px) {
      .header-content {
        gap: 8px;
      }
      
      .logo {
        min-width: auto;
      }
      
      .logo-link span {
        display: none;
      }
      
      .search-container {
        max-width: none;
      }
      
      .search-btn {
        display: none;
      }
      
      .nav-links a span:not(.cart-text) {
        display: none;
      }
      
      .cart-text {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  searchQuery = '';
  cartCount$: Observable<number>;

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {
    this.cartCount$ = this.cartService.getCartCount();
  }

  ngOnInit(): void {
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Search query:', this.searchQuery);
    }
  }
}
