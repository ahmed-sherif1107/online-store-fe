import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Product, FilterOptions } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Apple iPhone 15 Pro',
      description: 'The most advanced iPhone yet with A17 Pro chip, titanium design, and advanced camera system.',
      price: 999,
      originalPrice: 1099,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
      ],
      category: 'Electronics',
      rating: 4.8,
      reviewCount: 2847,
      inStock: true,
      stockQuantity: 25,
      features: ['A17 Pro chip', '6.1-inch display', 'Triple camera system', '128GB storage']
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Premium Android smartphone with S Pen, advanced AI features, and exceptional camera capabilities.',
      price: 1199,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
      category: 'Electronics',
      rating: 4.7,
      reviewCount: 1923,
      inStock: true,
      stockQuantity: 18,
      features: ['S Pen included', '6.8-inch display', '200MP camera', '256GB storage']
    },
    {
      id: 3,
      name: 'Sony WH-1000XM5 Headphones',
      description: 'Industry-leading noise canceling wireless headphones with exceptional sound quality.',
      price: 399,
      originalPrice: 449,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      category: 'Electronics',
      rating: 4.9,
      reviewCount: 5621,
      inStock: true,
      stockQuantity: 42,
      features: ['30-hour battery', 'Active noise canceling', 'Touch controls', 'Quick charge']
    },
    {
      id: 4,
      name: 'MacBook Air M2',
      description: 'Supercharged by M2 chip. Incredibly portable design with all-day battery life.',
      price: 1199,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
      category: 'Electronics',
      rating: 4.8,
      reviewCount: 3456,
      inStock: true,
      stockQuantity: 12,
      features: ['M2 chip', '13.6-inch display', '8GB RAM', '256GB SSD']
    },
    {
      id: 5,
      name: 'Nike Air Max 270',
      description: 'Comfortable running shoes with Max Air cushioning and breathable mesh upper.',
      price: 150,
      originalPrice: 180,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      category: 'Shoes',
      rating: 4.6,
      reviewCount: 892,
      inStock: true,
      stockQuantity: 67,
      features: ['Max Air cushioning', 'Breathable mesh', 'Durable rubber sole', 'Multiple colors']
    },
    {
      id: 6,
      name: 'Adidas Ultraboost 22',
      description: 'Premium running shoes with responsive Boost midsole and Primeknit upper.',
      price: 190,
      originalPrice: 220,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
      category: 'Shoes',
      rating: 4.7,
      reviewCount: 1245,
      inStock: true,
      stockQuantity: 34,
      features: ['Boost midsole', 'Primeknit upper', 'Continental rubber outsole', 'Energy return']
    },
    {
      id: 7,
      name: 'Levi\'s 501 Original Jeans',
      description: 'Classic straight-leg jeans made with premium denim. Timeless style that never goes out of fashion.',
      price: 89,
      originalPrice: 120,
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
      category: 'Clothing',
      rating: 4.5,
      reviewCount: 2341,
      inStock: true,
      stockQuantity: 89,
      features: ['100% cotton denim', 'Straight fit', 'Button fly', 'Classic 5-pocket design']
    },
    {
      id: 8,
      name: 'Patagonia Better Sweater',
      description: 'Cozy fleece jacket made from recycled polyester. Perfect for outdoor adventures.',
      price: 129,
      originalPrice: 149,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
      category: 'Clothing',
      rating: 4.8,
      reviewCount: 756,
      inStock: true,
      stockQuantity: 23,
      features: ['Recycled polyester', 'Full-zip design', 'Two hand pockets', 'Machine washable']
    },
    {
      id: 9,
      name: 'KitchenAid Stand Mixer',
      description: 'Professional-grade stand mixer with 10 speeds and multiple attachments included.',
      price: 379,
      originalPrice: 429,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      category: 'Home & Kitchen',
      rating: 4.9,
      reviewCount: 4521,
      inStock: true,
      stockQuantity: 15,
      features: ['5-quart bowl', '10 speeds', 'Tilt-head design', 'Multiple attachments']
    },
    {
      id: 10,
      name: 'Instant Pot Duo 7-in-1',
      description: 'Multi-use pressure cooker that replaces 7 kitchen appliances in one.',
      price: 99,
      originalPrice: 129,
      image: 'https://images.unsplash.com/photo-1574781330855-d0db90d9d4f4?w=400',
      category: 'Home & Kitchen',
      rating: 4.7,
      reviewCount: 8934,
      inStock: true,
      stockQuantity: 45,
      features: ['7-in-1 functionality', '6-quart capacity', '14 smart programs', 'Stainless steel pot']
    },
    {
      id: 11,
      name: 'Dyson V15 Detect',
      description: 'Cordless vacuum with laser dust detection and intelligent suction adjustment.',
      price: 749,
      originalPrice: 849,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
      category: 'Home & Kitchen',
      rating: 4.8,
      reviewCount: 1876,
      inStock: true,
      stockQuantity: 8,
      features: ['Laser dust detection', '60-minute runtime', 'LCD screen', 'HEPA filtration']
    },
    {
      id: 12,
      name: 'The Great Gatsby',
      description: 'Classic American novel by F. Scott Fitzgerald. A timeless story of love and the American Dream.',
      price: 12.99,
      originalPrice: 16.99,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      category: 'Books',
      rating: 4.3,
      reviewCount: 12456,
      inStock: true,
      stockQuantity: 156,
      features: ['Paperback edition', '180 pages', 'English language', 'Classic literature']
    }
  ];

  private filteredProductsSubject = new BehaviorSubject<Product[]>(this.products);
  public filteredProducts$ = this.filteredProductsSubject.asObservable();

  constructor() { }

  /**
   * Get all products
   */
  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  /**
   * Get a single product by ID
   */
  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    const filtered = this.products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    return of(filtered);
  }

  /**
   * Get all available categories
   */
  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.products.map(p => p.category))];
    return of(categories);
  }

  /**
   * Filter and sort products based on criteria
   */
  filterProducts(filters: FilterOptions): void {
    let filtered = [...this.products];

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
    }

    // Filter by price range
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    }

    // Sort products
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
    }

    this.filteredProductsSubject.next(filtered);
  }

  /**
   * Search products by name or description
   */
  searchProducts(query: string): Observable<Product[]> {
    const searchTerm = query.toLowerCase();
    const filtered = this.products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) || 
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
    return of(filtered);
  }
}
