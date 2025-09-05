import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'online-shop-cart';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  private cartTotalSubject = new BehaviorSubject<number>(0);
  public cartTotal$ = this.cartTotalSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  /**
   * Load cart items from localStorage
   */
  private loadCartFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const cartItems = JSON.parse(stored) as CartItem[];
        this.cartItemsSubject.next(cartItems);
        this.updateCartMetrics();
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  }

  /**
   * Save cart items to localStorage
   */
  private saveCartToStorage(): void {
    try {
      const cartItems = this.cartItemsSubject.value;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  /**
   * Update cart count and total
   */
  private updateCartMetrics(): void {
    const items = this.cartItemsSubject.value;
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    this.cartCountSubject.next(count);
    this.cartTotalSubject.next(total);
  }

  /**
   * Add product to cart
   */
  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex > -1) {
      // Update existing item quantity
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += quantity;
      this.cartItemsSubject.next(updatedItems);
    } else {
      // Add new item
      const newItem: CartItem = { product, quantity };
      this.cartItemsSubject.next([...currentItems, newItem]);
    }

    this.updateCartMetrics();
    this.saveCartToStorage();
  }

  /**
   * Remove product from cart completely
   */
  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.product.id !== productId);
    
    this.cartItemsSubject.next(updatedItems);
    this.updateCartMetrics();
    this.saveCartToStorage();
  }

  /**
   * Update item quantity in cart
   */
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);

    if (itemIndex > -1) {
      const updatedItems = [...currentItems];
      updatedItems[itemIndex].quantity = quantity;
      this.cartItemsSubject.next(updatedItems);
      this.updateCartMetrics();
      this.saveCartToStorage();
    }
  }

  /**
   * Get current cart items
   */
  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  /**
   * Get cart item count
   */
  getCartCount(): Observable<number> {
    return this.cartCount$;
  }

  /**
   * Get cart total
   */
  getCartTotal(): Observable<number> {
    return this.cartTotal$;
  }

  /**
   * Check if product is in cart
   */
  isInCart(productId: number): boolean {
    const currentItems = this.cartItemsSubject.value;
    return currentItems.some(item => item.product.id === productId);
  }

  /**
   * Get quantity of specific product in cart
   */
  getProductQuantity(productId: number): number {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  /**
   * Clear all items from cart
   */
  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.updateCartMetrics();
    this.saveCartToStorage();
  }

  /**
   * Get cart summary for checkout
   */
  getCartSummary(): { items: CartItem[], total: number, itemCount: number } {
    const items = this.cartItemsSubject.value;
    const total = this.cartTotalSubject.value;
    const itemCount = this.cartCountSubject.value;
    
    return { items, total, itemCount };
  }
}
