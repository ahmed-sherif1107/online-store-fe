# Online Shop - Angular E-commerce Application

A modern, fully-featured e-commerce web application built with Angular 17, featuring server-side rendering (SSR), Angular Material design components, and a comprehensive shopping experience.

## 🚀 Features

### Core Functionality
- **Product Catalog**: Browse through a diverse collection of products across multiple categories
- **Product Details**: Detailed product pages with images, descriptions, ratings, and specifications
- **Shopping Cart**: Add, remove, and modify items with persistent local storage
- **Checkout Process**: Complete order placement with customer information collection
- **Order Confirmation**: Order tracking and confirmation system
- **Responsive Design**: Mobile-first responsive design using Angular Material

### Product Categories
- **Electronics**: Smartphones, laptops, headphones, and tech gadgets
- **Shoes**: Athletic and casual footwear from popular brands
- **Clothing**: Fashion items and outdoor apparel
- **Home & Kitchen**: Kitchen appliances, home improvement tools
- **Books**: Literature and educational materials

### Advanced Features
- **Product Filtering**: Filter by category, price range, and sort by various criteria
- **Product Search**: Search functionality across product names, descriptions, and categories
- **Stock Management**: Real-time stock tracking and availability display
- **Rating System**: Customer ratings and review counts
- **Price Comparison**: Original vs. sale price display
- **Cart Persistence**: Shopping cart data persists across browser sessions

## 🛠️ Technology Stack

- **Framework**: Angular 17 with standalone components
- **UI Library**: Angular Material 17
- **Styling**: SCSS with modern CSS practices
- **State Management**: RxJS with BehaviorSubjects for reactive data flow
- **Routing**: Angular Router with lazy loading
- **Server-Side Rendering**: Angular Universal (SSR)
- **Build Tool**: Angular CLI
- **HTTP Client**: Angular HttpClient (ready for API integration)

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # Shared components
│   │   ├── header/         # Navigation header with cart
│   │   └── footer/         # Site footer
│   ├── pages/              # Route components
│   │   ├── product-list/   # Product catalog page
│   │   ├── product-detail/ # Individual product page
│   │   ├── cart/          # Shopping cart page
│   │   ├── checkout/      # Checkout process
│   │   └── order-confirmation/ # Order success page
│   ├── services/          # Business logic services
│   │   ├── product.service.ts  # Product data management
│   │   ├── cart.service.ts     # Shopping cart operations
│   │   └── order.service.ts    # Order processing
│   ├── models/            # TypeScript interfaces
│   │   └── product.model.ts    # Data models
│   └── app.routes.ts      # Application routing
└── assets/                # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm (comes with Node.js)
- Angular CLI (optional, but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online-shop-fixed
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/`

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build in watch mode for development
- `npm test` - Run unit tests
- `npm run serve:ssr:online-shop-fixed` - Serve SSR build

## 🏗️ Build and Deployment

### Development Build
```bash
ng build --configuration development
```

### Production Build
```bash
ng build --configuration production
```

### Server-Side Rendering
This application supports SSR for improved SEO and initial load performance:
```bash
npm run build:ssr
npm run serve:ssr:online-shop-fixed
```

## 🔧 Configuration

### Environment Configuration
The application is configured to work with mock data by default. To integrate with a real API:

1. Update the `ProductService` to use HTTP calls instead of mock data
2. Configure API endpoints in environment files
3. Add proper error handling and loading states

### Styling Customization
- Global styles are defined in `src/styles.scss`
- Component-specific styles use SCSS
- Angular Material theme can be customized in the styles file

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with grid layouts
- **Tablet**: Adapted layouts with touch-friendly interactions
- **Mobile**: Mobile-first design with optimized navigation

## 🔒 Data Management

- **Local Storage**: Cart data persists across browser sessions
- **Reactive State**: Uses RxJS for reactive data flow
- **Type Safety**: Full TypeScript implementation with strict typing
- **Data Models**: Well-defined interfaces for all data structures

## 🚦 Testing

The project includes:
- Unit test setup with Jasmine and Karma
- Component testing structure
- Service testing capabilities

Run tests:
```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support and questions:
- Check the [Angular Documentation](https://angular.io/docs)
- Review [Angular Material Components](https://material.angular.io/components)
- Open an issue in this repository

---

**Built with ❤️ using Angular 17 and Angular Material**
