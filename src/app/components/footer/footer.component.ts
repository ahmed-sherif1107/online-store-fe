import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Online Shop</h3>
            <p>Your one-stop destination for quality products at great prices.</p>
            <div class="social-links">
              <button mat-icon-button>
                <mat-icon>facebook</mat-icon>
              </button>
              <button mat-icon-button>
                <mat-icon>twitter</mat-icon>
              </button>
              <button mat-icon-button>
                <mat-icon>instagram</mat-icon>
              </button>
            </div>
          </div>
          
          <div class="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Returns & Exchanges</a></li>
              <li><a href="#">Shipping Info</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>About</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Sustainability</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">Accessibility</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2024 Online Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #2c3e50;
      color: white;
      padding: 40px 0 20px;
      margin-top: 40px;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
      margin-bottom: 30px;
    }

    .footer-section h3 {
      color: #3f51b5;
      margin-bottom: 16px;
      font-size: 24px;
    }

    .footer-section h4 {
      color: #ffffff;
      margin-bottom: 16px;
      font-size: 18px;
    }

    .footer-section p {
      color: #bdc3c7;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
    }

    .footer-section ul li {
      margin-bottom: 8px;
    }

    .footer-section ul li a {
      color: #bdc3c7;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-section ul li a:hover {
      color: #3f51b5;
    }

    .social-links {
      display: flex;
      gap: 8px;
    }

    .social-links button {
      color: #bdc3c7;
    }

    .social-links button:hover {
      color: #3f51b5;
    }

    .footer-bottom {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #34495e;
      color: #bdc3c7;
    }

    @media (max-width: 768px) {
      .footer {
        padding: 30px 0 20px;
      }
      
      .footer-content {
        grid-template-columns: 1fr;
        gap: 30px;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
}
