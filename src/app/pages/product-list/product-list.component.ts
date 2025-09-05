import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { Product, FilterOptions } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    FormsModule
  ],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Products</h1>
        <p>Discover our amazing collection of products</p>
      </div>

      <!-- Filters and Sorting -->
      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select [(value)]="selectedCategory" (selectionChange)="applyFilters()">
            <mat-option value="all">All Categories</mat-option>
            <mat-option *ngFor="let category of categories$ | async" [value]="category">
              {{ category }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Min Price</mat-label>
          <input matInput type="number" [(ngModel)]="minPrice" (input)="applyFilters()" placeholder="0">
          <span matPrefix>$</span>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Max Price</mat-label>
          <input matInput type="number" [(ngModel)]="maxPrice" (input)="applyFilters()" placeholder="1000">
          <span matPrefix>$</span>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Sort By</mat-label>
          <mat-select [(value)]="sortBy" (selectionChange)="applyFilters()">
            <mat-option value="">Relevance</mat-option>
            <mat-option value="price-asc">Price: Low to High</mat-option>
            <mat-option value="price-desc">Price: High to Low</mat-option>
            <mat-option value="rating">Rating</mat-option>
            <mat-option value="name">Name</mat-option>
          </mat-select>
        </mat-form-field>

        <button mat-raised-button color="primary" (click)="clearFilters()">
          <mat-icon>clear</mat-icon>
          Clear Filters
        </button>
      </div>

      <!-- Product Grid -->
      <div class="product-grid">
        <mat-card 
          *ngFor="let product of filteredProducts$ | async" 
          class="product-card"
          [routerLink]="['/product', product.id]"
        >
          <div class="product-image-container">
            <img [src]="product.image" [alt]="product.name" class="product-image">
            <div class="product-overlay">
              <button 
                mat-fab 
                color="accent" 
                class="quick-add-btn"
                (click)="addToCart($event, product)"
                [disabled]="!product.inStock"
              >
                <mat-icon>add_shopping_cart</mat-icon>
              </button>
            </div>
          </div>
          
          <mat-card-content>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-description">{{ product.description | slice:0:100 }}...</p>
              
              <div class="rating">
                <div class="stars">
                  <mat-icon *ngFor="let star of getStars(product.rating)" class="star filled">star</mat-icon>
                  <mat-icon *ngFor="let star of getEmptyStars(product.rating)" class="star empty">star_border</mat-icon>
                </div>
                <span class="rating-text">({{ product.reviewCount }})</span>
              </div>
              
              <div class="price-container">
                <span class="price">\${{ product.price }}</span>
                <span *ngIf="product.originalPrice" class="original-price">\${{ product.originalPrice }}</span>
              </div>
              
              <div class="stock-info" [class.out-of-stock]="!product.inStock">
                {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
              </div>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button 
              mat-raised-button 
              color="primary" 
              (click)="addToCart($event, product)"
              [disabled]="!product.inStock"
              class="add-to-cart-btn"
            >
              <mat-icon>add_shopping_cart</mat-icon>
              Add to Cart
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- No Products Found -->
      <div *ngIf="(filteredProducts$ | async)?.length === 0" class="no-products">
        <mat-icon class="no-products-icon">search_off</mat-icon>
        <h2>No products found</h2>
        <p>Try adjusting your filters or search criteria</p>
        <button mat-raised-button color="primary" (click)="clearFilters()">
          Clear All Filters
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

    .filters {
      display: flex;
      gap: 16px;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #eee;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      padding: 16px 0;
    }

    .product-card {
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .product-image-container {
      position: relative;
      overflow: hidden;
    }

    .product-image {
      width: 100%;
      height: 220px;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .product-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .product-card:hover .product-overlay {
      opacity: 1;
    }

    .quick-add-btn {
      transform: scale(0.8);
      transition: transform 0.3s ease;
    }

    .product-card:hover .quick-add-btn {
      transform: scale(1);
    }

    .product-info {
      padding: 16px 0;
    }

    .product-name {
      font-size: 1.2rem;
      font-weight: 500;
      margin: 0 0 8px 0;
      color: #333;
      line-height: 1.3;
    }

    .product-description {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
      margin: 0 0 12px 0;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .stars {
      display: flex;
      gap: 2px;
    }

    .star {
      font-size: 16px;
    }

    .star.filled {
      color: #ffa726;
    }

    .star.empty {
      color: #e0e0e0;
    }

    .rating-text {
      font-size: 0.9rem;
      color: #666;
    }

    .price-container {
      margin-bottom: 8px;
    }

    .price {
      font-size: 1.4rem;
      font-weight: 600;
      color: #B12704;
    }

    .original-price {
      font-size: 1rem;
      color: #666;
      text-decoration: line-through;
      margin-left: 8px;
    }

    .stock-info {
      font-size: 0.9rem;
      color: #4caf50;
      font-weight: 500;
    }

    .stock-info.out-of-stock {
      color: #f44336;
    }

    .add-to-cart-btn {
      width: 100%;
    }

    .no-products {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-products-icon {
      font-size: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .no-products h2 {
      margin: 16px 0;
      color: #333;
    }

    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
        align-items: stretch;
      }
      
      .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 16px;
      }
      
      .page-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  filteredProducts$: Observable<Product[]>;
  categories$: Observable<string[]>;
  
  selectedCategory = 'all';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.filteredProducts$ = this.productService.filteredProducts$;
    this.categories$ = this.productService.getCategories();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe();
  }

  applyFilters(): void {
    const filters: FilterOptions = {
      category: this.selectedCategory === 'all' ? undefined : this.selectedCategory,
      minPrice: this.minPrice || undefined,
      maxPrice: this.maxPrice || undefined,
      sortBy: this.sortBy as any || undefined
    };

    this.productService.filterProducts(filters);
  }

  clearFilters(): void {
    this.selectedCategory = 'all';
    this.minPrice = null;
    this.maxPrice = null;
    this.sortBy = '';
    this.applyFilters();
  }

  addToCart(event: Event, product: Product): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (product.inStock) {
      this.cartService.addToCart(product);
      // TODO: Show success notification
      console.log('Added to cart:', product.name);
    }
  }

  getStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    return Array(fullStars).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return Array(emptyStars).fill(0);
  }
}
