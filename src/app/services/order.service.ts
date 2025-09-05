import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order, Customer, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly STORAGE_KEY = 'online-shop-orders';

  constructor() { }

  /**
   * Create a new order
   */
  createOrder(customer: Customer, items: CartItem[], total: number): Observable<Order> {
    const order: Order = {
      id: this.generateOrderId(),
      customer,
      items,
      total,
      orderDate: new Date(),
      status: 'pending'
    };

    this.saveOrder(order);
    return of(order);
  }

  /**
   * Get order by ID
   */
  getOrderById(orderId: string): Observable<Order | undefined> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const orders = JSON.parse(stored) as Order[];
        const order = orders.find(o => o.id === orderId);
        return of(order);
      }
    } catch (error) {
      console.error('Error retrieving order:', error);
    }
    return of(undefined);
  }

  /**
   * Get all orders for a customer
   */
  getOrdersByCustomer(email: string): Observable<Order[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const orders = JSON.parse(stored) as Order[];
        const customerOrders = orders.filter(o => o.customer.email === email);
        return of(customerOrders);
      }
    } catch (error) {
      console.error('Error retrieving orders:', error);
    }
    return of([]);
  }

  /**
   * Update order status
   */
  updateOrderStatus(orderId: string, status: Order['status']): Observable<boolean> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const orders = JSON.parse(stored) as Order[];
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex > -1) {
          orders[orderIndex].status = status;
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
          return of(true);
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
    return of(false);
  }

  /**
   * Process payment (mock implementation)
   */
  processPayment(paymentDetails: any): Observable<{ success: boolean, transactionId?: string }> {
    // Mock payment processing - always succeeds
    return of({
      success: true,
      transactionId: this.generateTransactionId()
    });
  }

  /**
   * Generate unique order ID
   */
  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Generate unique transaction ID
   */
  private generateTransactionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 8);
    return `TXN-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Save order to localStorage
   */
  private saveOrder(order: Order): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const orders = stored ? JSON.parse(stored) as Order[] : [];
      orders.push(order);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving order:', error);
    }
  }
}
