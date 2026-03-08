import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-page page-fade">
      <header class="navbar">
        <div class="nav-container">
          <div class="brand">
            <span class="brand-icon app-icon">agriculture</span>
            <span class="brand-name">Farm-Scheme</span>
          </div>
          <nav class="nav-menu">
            <a href="#features" class="nav-link">Features</a>
            <a href="#about" class="nav-link">About</a>
            <a href="#contact" class="nav-link">Contact</a>
          </nav>
          <div class="nav-actions">
            <button class="btn btn-ghost" routerLink="/login">Log in</button>
            <button class="btn btn-primary" routerLink="/register">Get Started</button>
          </div>
        </div>
      </header>

      <main class="content">
        <section class="hero">
          <div class="hero-container">
            <div class="hero-content">
              <span class="badge">New: Digital Auction Platform</span>
              <h1 class="hero-title">Empowering farmers through transparency.</h1>
              <p class="hero-subtitle">
                Access fair markets, participate in live bidding, and secure your future with government-backed crop insurance.
              </p>
              <div class="hero-actions">
                <button class="btn btn-primary btn-lg" routerLink="/register">
                  Start Bidding
                  <span class="app-icon">arrow_forward</span>
                </button>
                <button class="btn btn-secondary btn-lg" routerLink="/login">
                  Partner Portal
                </button>
              </div>
            </div>

            <div class="hero-cards">
              <div class="card stat-card">
                <div class="card-header">
                  <span class="app-icon icon-muted">trending_up</span>
                  <span class="card-label">Market Value</span>
                </div>
                <div class="card-body">
                  <span class="stat-value">₹ 1.2Cr+</span>
                  <span class="stat-desc">Bids processed this month</span>
                </div>
              </div>
              <div class="card stat-card highlight">
                <div class="card-header">
                  <span class="app-icon icon-primary">verified_user</span>
                  <span class="card-label">Insurance</span>
                </div>
                <div class="card-body">
                  <span class="stat-value">98.5%</span>
                  <span class="stat-desc">Claim settlement ratio</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" class="features-section">
          <div class="container">
            <div class="section-header text-center">
              <h2 class="section-title">Designed for every stakeholder.</h2>
              <p class="section-subtitle">
                A unified platform for farmers, bidders, and administrators to streamline agriculture operations.
              </p>
            </div>

            <div class="features-grid">
              <div class="feature-card card">
                <div class="feature-icon app-icon">spa</div>
                <h3>For Farmers</h3>
                <p>List crops, receive competitive bids, and access instant crop insurance schemes.</p>
              </div>
              <div class="feature-card card">
                <div class="feature-icon app-icon">payments</div>
                <h3>For Bidders</h3>
                <p>Discover verified inventory, track auctions in real-time, and win crops securely.</p>
              </div>
              <div class="feature-card card">
                <div class="feature-icon app-icon">shield</div>
                <h3>Admin Control</h3>
                <p>Manage verification workflows, oversee insurance policies, and ensure fair play.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" class="contact-section">
          <div class="container">
            <div class="contact-card card">
              <div class="contact-info">
                <h2>Have questions?</h2>
                <p>Our team is here to help you get started with the digital marketplace.</p>
                <div class="contact-details">
                  <div class="contact-item">
                    <span class="app-icon">mail</span>
                    support&#64;farm-scheme.in
                  </div>
                  <div class="contact-item">
                    <span class="app-icon">call</span>
                    +91 800 123 4567
                  </div>
                </div>
              </div>
              <div class="contact-form">
                <div class="form-grid">
                  <div class="field">
                    <label>Email</label>
                    <input type="email" class="input" placeholder="you&#64;example.com" />
                  </div>
                  <div class="field">
                    <label>Message</label>
                    <textarea class="textarea" rows="3" placeholder="How can we help?"></textarea>
                  </div>
                </div>
                <button class="btn btn-primary w-full mt-4">Send Message</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <div class="container footer-content">
          <div class="footer-brand">
            <span class="app-icon">agriculture</span>
            <span>© 2025 Farm-Scheme. All rights reserved.</span>
          </div>
          <div class="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .navbar {
      height: 64px;
      border-bottom: 1px solid var(--border);
      background-color: var(--background);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .nav-container {
      height: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .brand-icon {
      color: var(--foreground);
      font-size: 24px;
    }

    .brand-name {
      font-weight: 700;
      font-size: 1.125rem;
      letter-spacing: -0.025em;
    }

    .nav-menu {
      display: flex;
      gap: 1.5rem;
    }

    .nav-link {
      color: var(--muted-foreground);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: color var(--transition-fast);
    }

    .nav-link:hover {
      color: var(--foreground);
    }

    .nav-actions {
      display: flex;
      gap: 0.75rem;
    }

    .hero {
      padding: 6rem 0;
      background: radial-gradient(circle at top right, var(--muted) 0%, transparent 40%);
    }

    .hero-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .badge {
      display: inline-flex;
      background-color: var(--muted);
      color: var(--muted-foreground);
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.05em;
      margin-bottom: 1.5rem;
      color: var(--foreground);
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: var(--muted-foreground);
      line-height: 1.6;
      margin-bottom: 2.5rem;
      max-width: 500px;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-lg {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
    }

    .hero-cards {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .stat-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .stat-card.highlight {
      background-color: var(--primary);
      color: var(--primary-foreground);
      border-color: var(--primary);
    }

    .stat-card.highlight .card-label,
    .stat-card.highlight .stat-desc {
      color: rgba(255, 255, 255, 0.7);
    }

    .stat-card.highlight .icon-primary {
      color: #ffffff;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .card-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted-foreground);
    }

    .stat-value {
      display: block;
      font-size: 1.75rem;
      font-weight: 700;
    }

    .stat-desc {
      font-size: 0.875rem;
      color: var(--muted-foreground);
    }

    .features-section {
      padding: 6rem 0;
      border-top: 1px solid var(--border);
    }

    .text-center { text-align: center; }

    .section-header {
      margin-bottom: 4rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .section-title {
      font-size: 2.25rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      margin-bottom: 1rem;
    }

    .section-subtitle {
      font-size: 1.125rem;
      color: var(--muted-foreground);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .feature-card {
      padding: 2rem;
      text-align: left;
    }

    .feature-icon {
      font-size: 32px;
      margin-bottom: 1.5rem;
      color: var(--primary);
    }

    .feature-card h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }

    .feature-card p {
      color: var(--muted-foreground);
      line-height: 1.6;
    }

    .contact-section {
      padding: 6rem 0;
      background-color: var(--muted);
    }

    .contact-card {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      padding: 3rem;
      gap: 4rem;
    }

    .contact-info h2 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .contact-info p {
      color: var(--muted-foreground);
      margin-bottom: 2rem;
    }

    .contact-details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field label {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .form-grid {
      display: grid;
      gap: 1.5rem;
    }

    .footer {
      padding: 3rem 0;
      border-top: 1px solid var(--border);
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--muted-foreground);
      font-size: 0.875rem;
    }

    .footer-links {
      display: flex;
      gap: 1.5rem;
    }

    .footer-links a {
      color: var(--muted-foreground);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color var(--transition-fast);
    }

    .footer-links a:hover {
      color: var(--foreground);
    }

    .w-full { width: 100%; }
    .mt-4 { margin-top: 1rem; }

    @media (max-width: 1024px) {
      .hero-container {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
      }
      .hero-content {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .hero-title { font-size: 2.75rem; }
      .contact-card {
        grid-template-columns: 1fr;
        padding: 2rem;
        gap: 2rem;
      }
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .nav-menu { display: none; }
      .features-grid { grid-template-columns: 1fr; }
      .hero-title { font-size: 2.25rem; }
      .hero-actions { flex-direction: column; width: 100%; }
      .hero-actions .btn { width: 100%; }
      .footer-content { flex-direction: column; gap: 1.5rem; text-align: center; }
    }
  `]
})
export class HomeComponent {}
