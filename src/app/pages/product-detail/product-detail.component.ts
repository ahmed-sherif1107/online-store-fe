import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable } from 'rxjs';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatTabsModule
  ],
  template: `
    <div class="container" *ngIf="product$ | async as product">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <a routerLink="/products">Products</a>
        <mat-icon>chevron_right</mat-icon>
        <a [routerLink]="['/products']" [queryParams]="{category: product.category}">{{ product.category }}</a>
        <mat-icon>chevron_right</mat-icon>
        <span>{{ product.name }}</span>
      </nav>

      <div class="product-detail">
        <!-- Product Images -->
        <div class="product-images">
          <div class="main-image">
            <img [src]="selectedImage || product.image" [alt]="product.name" class="main-product-image">
          </div>
          
          <div class="thumbnail-images" *ngIf="product.images && product.images.length > 1">
            <img 
              *ngFor="let image of product.images" 
              [src]="image" 
              [alt]="product.name"
              class="thumbnail"
              [class.active]="selectedImage === image"
              (click)="selectedImage = image"
            >
          </div>
        </div>

        <!-- Product Info -->
        <div class="product-info">
          <h1 class="product-title">{{ product.name }}</h1>
          
          <div class="rating-section">
            <div class="rating">
              <div class="stars">
                <mat-icon *ngFor="let star of getStars(product.rating)" class="star filled">star</mat-icon>
                <mat-icon *ngFor="let star of getEmptyStars(product.rating)" class="star empty">star_border</mat-icon>
              </div>
              <span class="rating-text">{{ product.rating }} ({{ product.reviewCount }} reviews)</span>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="price-section">
            <div class="price-container">
              <span class="current-price">\${{ product.price }}</span>
              <span *ngIf="product.originalPrice" class="original-price">\${{ product.originalPrice }}</span>
              <span *ngIf="product.originalPrice" class="discount">
                Save {{ getDiscountPercentage(product.price, product.originalPrice) }}%
              </span>
            </div>
          </div>

          <div class="availability-section">
            <div class="stock-status" [class.out-of-stock]="!product.inStock">
              <mat-icon>{{ product.inStock ? 'check_circle' : 'cancel' }}</mat-icon>
              <span>{{ product.inStock ? 'In Stock' : 'Out of Stock' }}</span>
              <span *ngIf="product.inStock && product.stockQuantity <= 10" class="low-stock">
                (Only {{ product.stockQuantity }} left!)
              </span>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="quantity-section">
            <label class="quantity-label">Quantity:</label>
            <div class="quantity-controls">
              <button mat-icon-button (click)="decreaseQuantity()" [disabled]="quantity <= 1">
                <mat-icon>remove</mat-icon>
              </button>
              <span class="quantity-display">{{ quantity }}</span>
              <button mat-icon-button (click)="increaseQuantity()" [disabled]="quantity >= product.stockQuantity">
                <mat-icon>add</mat-icon>
              </button>
            </div>
          </div>

          <div class="action-buttons">
            <button 
              mat-raised-button 
              color="primary" 
              class="add-to-cart-btn"
              [disabled]="!product.inStock"
              (click)="addToCart()"
            >
              <mat-icon>add_shopping_cart</mat-icon>
              Add to Cart (\${{ (product.price * quantity).toFixed(2) }})
            </button>
            
            <button mat-stroked-button color="accent" class="wishlist-btn">
              <mat-icon>favorite_border</mat-icon>
              Add to Wishlist
            </button>
          </div>

          <!-- Product Features -->
          <div class="features-section" *ngIf="product.features && product.features.length > 0">
            <h3>Key Features</h3>
            <mat-chip-listbox>
              <mat-chip-option *ngFor="let feature of product.features" disabled>
                {{ feature }}
              </mat-chip-option>
            </mat-chip-listbox>
          </div>
        </div>
      </div>

      <!-- Product Tabs -->
      <mat-tab-group class="product-tabs">
        <mat-tab label="Description">
          <div class="tab-content">
            <h3>Product Description</h3>
            <p>{{ product.description }}</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
        </mat-tab>
        
        <mat-tab label="Specifications">
          <div class="tab-content">
            <h3>Technical Specifications</h3>
            <div class="specifications">
              <div class="spec-row">
                <span class="spec-label">Category:</span>
                <span class="spec-value">{{ product.category }}</span>
              </div>
              <div class="spec-row">
                <span class="spec-label">Product ID:</span>
                <span class="spec-value">#{{ product.id.toString().padStart(6, '0') }}</span>
              </div>
              <div class="spec-row">
                <span class="spec-label">Availability:</span>
                <span class="spec-value">{{ product.inStock ? 'In Stock' : 'Out of Stock' }}</span>
              </div>
              <div class="spec-row" *ngIf="product.features">
                <span class="spec-label">Features:</span>
                <span class="spec-value">{{ product.features.join(', ') }}</span>
              </div>
            </div>
          </div>
        </mat-tab>
        
        <mat-tab label="Reviews ({{ product.reviewCount }})">
          <div class="tab-content">
            <h3>Customer Reviews</h3>
            <div class="reviews-summary">
              <div class="average-rating">
                <span class="rating-number">{{ product.rating }}</span>
                <div class="stars">
                  <mat-icon *ngFor="let star of getStars(product.rating)" class="star filled">star</mat-icon>
                  <mat-icon *ngFor="let star of getEmptyStars(product.rating)" class="star empty">star_border</mat-icon>
                </div>
                <span class="total-reviews">Based on {{ product.reviewCount }} reviews</span>
              </div>
            </div>
            <p class="reviews-placeholder">
              Customer reviews would be displayed here. This is a demo application with mock data.
            </p>
          </div>
        </mat-tab>
      </mat-tab-group>

      <!-- Related Products -->
      <div class="related-products" *ngIf="relatedProducts$ | async as relatedProducts">
        <h2>Related Products</h2>
        <div class="related-grid">
          <mat-card *ngFor="let relatedProduct of relatedProducts | slice:0:4" class="related-card" [routerLink]="['/product', relatedProduct.id]">
            <img [src]="relatedProduct.image" [alt]="relatedProduct.name" class="related-image">
            <mat-card-content>
              <h4>{{ relatedProduct.name }}</h4>
              <p class="related-price">\${{ relatedProduct.price }}</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div class="loading-container" *ngIf="!(product$ | async)">
      <mat-icon class="loading-icon">hourglass_empty</mat-icon>
      <p>Loading product details...</p>
    </div>
  `,
  styles: [`
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 20px 0;
      font-size: 14px;
    }

    .breadcrumb a {
      color: #1976d2;
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .breadcrumb span {
      color: #666;
    }

    .product-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin: 20px 0;
    }

    .product-images {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .main-image {
      width: 100%;
      aspect-ratio: 1;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .main-product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumbnail-images {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 4px 0;
    }

    .thumbnail {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.3s ease;
      border: 2px solid transparent;
    }

    .thumbnail:hover,
    .thumbnail.active {
      opacity: 1;
      border-color: #1976d2;
    }

    .product-info {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .product-title {
      font-size: 2rem;
      font-weight: 500;
      color: #333;
      margin: 0;
      line-height: 1.2;
    }

    .rating-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stars {
      display: flex;
      gap: 2px;
    }

    .star {
      font-size: 20px;
    }

    .star.filled {
      color: #ffa726;
    }

    .star.empty {
      color: #e0e0e0;
    }

    .rating-text {
      color: #666;
      font-size: 14px;
    }

    .price-section {
      padding: 16px 0;
    }

    .price-container {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .current-price {
      font-size: 2rem;
      font-weight: 600;
      color: #B12704;
    }

    .original-price {
      font-size: 1.2rem;
      color: #666;
      text-decoration: line-through;
    }

    .discount {
      background: #ff4444;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .availability-section {
      display: flex;
      align-items: center;
    }

    .stock-status {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #4caf50;
      font-weight: 500;
    }

    .stock-status.out-of-stock {
      color: #f44336;
    }

    .low-stock {
      color: #ff9800;
      font-size: 14px;
    }

    .quantity-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .quantity-label {
      font-weight: 500;
      color: #333;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 4px;
    }

    .quantity-display {
      min-width: 40px;
      text-align: center;
      font-weight: 500;
      font-size: 16px;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .add-to-cart-btn {
      flex: 1;
      min-width: 200px;
      height: 48px;
      font-size: 16px;
      font-weight: 500;
    }

    .wishlist-btn {
      height: 48px;
      min-width: 160px;
    }

    .features-section h3 {
      margin: 0 0 12px 0;
      color: #333;
    }

    .product-tabs {
      margin: 40px 0;
    }

    .tab-content {
      padding: 24px;
    }

    .tab-content h3 {
      margin: 0 0 16px 0;
      color: #333;
    }

    .tab-content p {
      line-height: 1.6;
      color: #666;
      margin-bottom: 16px;
    }

    .specifications {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .spec-row {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 16px;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .spec-label {
      font-weight: 500;
      color: #333;
    }

    .spec-value {
      color: #666;
    }

    .reviews-summary {
      margin-bottom: 24px;
    }

    .average-rating {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .rating-number {
      font-size: 2rem;
      font-weight: 600;
      color: #333;
    }

    .total-reviews {
      color: #666;
      font-size: 14px;
    }

    .reviews-placeholder {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      color: #666;
      font-style: italic;
    }

    .related-products {
      margin: 40px 0;
    }

    .related-products h2 {
      margin-bottom: 24px;
      color: #333;
    }

    .related-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .related-card {
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .related-card:hover {
      transform: translateY(-2px);
    }

    .related-image {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }

    .related-card h4 {
      margin: 8px 0 4px 0;
      font-size: 14px;
      color: #333;
    }

    .related-price {
      color: #B12704;
      font-weight: 500;
      margin: 0;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      color: #666;
    }

    .loading-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .product-detail {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      
      .breadcrumb {
        font-size: 12px;
      }
      
      .product-title {
        font-size: 1.5rem;
      }
      
      .current-price {
        font-size: 1.5rem;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .add-to-cart-btn,
      .wishlist-btn {
        width: 100%;
      }
      
      .spec-row {
        grid-template-columns: 1fr;
        gap: 4px;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product$: Observable<Product | undefined>;
  relatedProducts$: Observable<Product[]>;
  selectedImage = '';
  quantity = 1;
  productId: number;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.product$ = this.productService.getProductById(this.productId);
    this.relatedProducts$ = new Observable<Product[]>();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
      this.product$ = this.productService.getProductById(this.productId);
      this.quantity = 1;
      
      // Load related products (same category)
      this.product$.subscribe(product => {
        if (product) {
          this.selectedImage = product.image;
          this.relatedProducts$ = this.productService.getProductsByCategory(product.category);
        }
      });
    });
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    this.product$.subscribe(product => {
      if (product && product.inStock) {
        this.cartService.addToCart(product, this.quantity);
        // TODO: Show success notification
        console.log(`Added ${this.quantity} ${product.name}(s) to cart`);
      }
    });
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

  getDiscountPercentage(currentPrice: number, originalPrice: number): number {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }
}
