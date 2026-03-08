import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home page-fade">
      <header class="navbar">
        <div class="nav-left">
          <div class="brand-mark">
            <span class="app-icon app-icon--lg">spa</span>
          </div>
          <div class="brand-text">
            <span class="brand-title">Farm-Scheme</span>
            <span class="brand-subtitle">Digital agriculture platform</span>
          </div>
        </div>
        <nav class="nav-links">
          <a href="#home" class="nav-link">Home</a>
          <a href="#about" class="nav-link">About</a>
          <a href="#features" class="nav-link">Features</a>
          <a href="#contact" class="nav-link">Contact</a>
        </nav>
        <div class="nav-cta">
          <button class="btn btn-secondary" routerLink="/login">Sign in</button>
          <button class="btn btn-primary" routerLink="/register">Get started</button>
        </div>
      </header>

      <main>
        <section id="home" class="hero-section">
          <div class="hero-content">
            <p class="eyebrow">Built for modern agriculture</p>
            <h1 class="hero-title">
              Empowering farmers with transparent bidding and insurance.
            </h1>
            <p class="hero-subtitle">
              Connect directly with buyers, secure fair prices, and protect
              every harvest with government-backed crop insurance.
            </p>
            <div class="hero-actions">
              <button class="btn btn-primary" routerLink="/register">
                <span class="app-icon">person_add</span>
                Create account
              </button>
              <button class="btn btn-ghost" routerLink="/login">
                <span class="app-icon app-icon--muted">login</span>
                I already have an account
              </button>
            </div>
            <div class="hero-metrics">
              <div class="metric">
                <span class="metric-value">24/7</span>
                <span class="metric-label">Digital marketplace access</span>
              </div>
              <div class="metric">
                <span class="metric-value">100%</span>
                <span class="metric-label">Transparent bidding</span>
              </div>
              <div class="metric">
                <span class="metric-value">3x</span>
                <span class="metric-label">Faster policy approvals</span>
              </div>
            </div>
          </div>

          <div class="hero-visual">
            <div class="hero-card-row">
              <article class="hero-card card-primary card-bidding">
                <div class="hero-card-header">
                  <span class="hero-card-icon app-icon app-icon--lg">payments</span>
                  <span class="hero-card-label">Real-time bidding</span>
                </div>
                <h3>Live crop auctions</h3>
                <p>List your crops once and receive bids from verified buyers across regions.</p>
                <div class="hero-card-stat">
                  <span class="stat-label">Active auctions</span>
                  <span class="stat-value">18</span>
                </div>
              </article>

              <article class="hero-card">
                <div class="hero-card-header">
                  <span class="hero-card-icon app-icon app-icon--lg">shield</span>
                  <span class="hero-card-label">Crop insurance</span>
                </div>
                <h3>Fasal Bima Yojna</h3>
                <p>Premiums as low as 2% for Kharif and 1.5% for Rabi crops.</p>
                <div class="hero-card-footer">
                  <span class="badge-soft">Instant premium calculator</span>
                </div>
              </article>
            </div>

            <article class="hero-card card-secondary">
              <div class="hero-card-header">
                <span class="hero-card-icon app-icon app-icon--lg">query_stats</span>
                <span class="hero-card-label">Market overview</span>
              </div>
              <h3>Market insights in one view</h3>
              <p>
                Track prices, bids, and claim status in a single, consistent dashboard for farmers,
                bidders, and admins.
              </p>
              <div class="hero-pill-row">
                <span class="pill">
                  <span class="app-icon">trending_up</span>
                  Price trends
                </span>
                <span class="pill">
                  <span class="app-icon">history</span>
                  Transaction history
                </span>
                <span class="pill">
                  <span class="app-icon">verified_user</span>
                  Admin approvals
                </span>
              </div>
            </article>
          </div>
        </section>

        <section id="about" class="section">
          <div class="section-inner">
            <header class="section-header">
              <p class="eyebrow">Who we serve</p>
              <h2>Designed for every role in the agri value chain.</h2>
            </header>
            <div class="three-column">
              <article class="info-card">
                <div class="info-icon">
                  <span class="app-icon app-icon--lg">grass</span>
                </div>
                <h3>For farmers</h3>
                <p>
                  Publish crops with quantity and quality details, receive competitive bids, and
                  access government crop insurance in a few clicks.
                </p>
              </article>
              <article class="info-card">
                <div class="info-icon">
                  <span class="app-icon app-icon--lg">group</span>
                </div>
                <h3>For bidders</h3>
                <p>
                  Discover verified crops across regions, participate in secure auctions, and win
                  inventory at market-aligned prices.
                </p>
              </article>
              <article class="info-card">
                <div class="info-icon">
                  <span class="app-icon app-icon--lg">lock</span>
                </div>
                <h3>For admins</h3>
                <p>
                  Approve users, manage auctions and insurance workflows, and keep every
                  transaction auditable end-to-end.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="features" class="section muted">
          <div class="section-inner">
            <header class="section-header">
              <p class="eyebrow">Platform capabilities</p>
              <h2>Everything you need to run digital agriculture operations.</h2>
            </header>
            <div class="features-grid">
              <article class="feature">
                <span class="feature-index">01</span>
                <h3>Crop bidding workspace</h3>
                <p>
                  Manage sell requests, approvals, and live auctions from one clean, responsive
                  interface.
                </p>
              </article>
              <article class="feature">
                <span class="feature-index">02</span>
                <h3>Integrated Fasal Bima Yojna</h3>
                <p>
                  Calculate premiums, generate policies, and track insurance status without leaving
                  the app.
                </p>
              </article>
              <article class="feature">
                <span class="feature-index">03</span>
                <h3>Claims and payouts</h3>
                <p>
                  File and review claims with clear timelines, required details, and approval
                  history.
                </p>
              </article>
              <article class="feature">
                <span class="feature-index">04</span>
                <h3>Audit-ready records</h3>
                <p>
                  Every bid, policy, and claim is stored with a complete history for transparent
                  reporting.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="contact" class="section">
          <div class="section-inner">
            <header class="section-header">
              <p class="eyebrow">Need help?</p>
              <h2>Tell us about your use case.</h2>
            </header>
            <div class="contact-grid">
              <form class="card contact-form">
                <div class="field">
                  <label>Your name</label>
                  <input class="input" type="text" placeholder="Enter your name" />
                </div>
                <div class="field">
                  <label>Email address</label>
                  <input class="input" type="email" placeholder="you@example.com" />
                </div>
                <div class="field">
                  <label>Message</label>
                  <textarea class="textarea" rows="4" placeholder="How can we help?"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">
                  <span class="app-icon">send</span>
                  Send message
                </button>
              </form>
              <div class="contact-aside">
                <div class="contact-block">
                  <h3>Support</h3>
                  <p>Have questions about onboarding farmers, bidders, or admins?</p>
                  <p class="contact-detail">support@farm-scheme.in</p>
                </div>
                <div class="contact-block">
                  <h3>Implementation</h3>
                  <p>Need help aligning the platform with an existing scheme or policy?</p>
                  <p class="contact-detail">implementation@farm-scheme.in</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <div class="footer-inner">
          <span>&copy; 2025 Farm-Scheme.</span>
          <span>Built for farmers, bidders, and policymakers.</span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .home {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .navbar {
      position: sticky;
      top: 0;
      z-index: 40;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      padding: 1rem 3rem;
      background-color: rgba(249, 250, 251, 0.9);
      backdrop-filter: blur(18px);
      border-bottom: 1px solid var(--border-subtle);
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .brand-mark {
      width: 36px;
      height: 36px;
      border-radius: 999px;
      background: radial-gradient(circle at 20% 0, #bbf7d0 0, #22c55e 45%, #15803d 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 8px 25px rgba(22, 163, 74, 0.45);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .brand-title {
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    .brand-subtitle {
      font-size: 0.78rem;
      color: var(--text-soft);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      font-size: 0.92rem;
    }

    .nav-link {
      position: relative;
      color: var(--text-muted);
      text-decoration: none;
      padding-block: 0.25rem;
      transition: color var(--transition-fast);
    }

    .nav-link::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -0.35rem;
      width: 0;
      height: 2px;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--primary), var(--primary-strong));
      transition: width var(--transition-fast);
    }

    .nav-link:hover {
      color: var(--text-main);
    }

    .nav-link:hover::after {
      width: 100%;
    }

    .nav-cta {
      display: flex;
      gap: 0.75rem;
    }

    main {
      flex: 1;
      padding: 3rem clamp(1.5rem, 3vw, 3rem) 4rem;
    }

    .hero-section {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
      gap: 3.5rem;
      align-items: center;
      margin-bottom: 4rem;
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .eyebrow {
      font-size: 0.85rem;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-soft);
    }

    .hero-title {
      font-size: clamp(2.35rem, 3vw, 2.9rem);
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.12;
      color: var(--text-main);
    }

    .hero-subtitle {
      font-size: 1rem;
      color: var(--text-muted);
      max-width: 32rem;
      line-height: 1.6;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
    }

    .hero-metrics {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .metric {
      padding: 0.85rem 1rem;
      border-radius: 0.9rem;
      background-color: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
    }

    .metric-value {
      display: block;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .metric-label {
      font-size: 0.8rem;
      color: var(--text-soft);
    }

    .hero-visual {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .hero-card-row {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
      gap: 1rem;
    }

    .hero-card {
      padding: 1.4rem 1.5rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle);
      background: var(--bg-elevated);
      box-shadow: var(--shadow-soft);
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .card-primary {
      border-color: rgba(22, 163, 74, 0.28);
      background: radial-gradient(circle at top left, #dcfce7 0, #f9fafb 45%, #ffffff 100%);
    }

    .card-secondary {
      background: radial-gradient(circle at top right, #eff6ff 0, #f9fafb 45%, #ffffff 100%);
    }

    .hero-card-header {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 0.3rem;
    }

    .hero-card-icon {
      width: 36px;
      height: 36px;
      border-radius: 999px;
      background-color: var(--bg-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-main);
    }

    .card-primary .hero-card-icon {
      background-color: var(--primary-soft);
      color: var(--primary-strong);
    }

    .hero-card-label {
      font-size: 0.78rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--text-soft);
    }

    .hero-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .hero-card p {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .hero-card-stat {
      margin-top: 0.4rem;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--text-soft);
    }

    .stat-value {
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--primary-strong);
    }

    .hero-card-footer {
      margin-top: 0.6rem;
    }

    .hero-pill-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin-top: 0.8rem;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.7rem;
      border-radius: 999px;
      background-color: var(--bg-muted);
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    .section {
      margin-top: 3.25rem;
    }

    .section.muted {
      background-color: var(--bg-muted);
      border-radius: 1.5rem;
      padding: 2.5rem clamp(1.5rem, 3vw, 2.5rem);
    }

    .section-inner {
      max-width: 1120px;
      margin: 0 auto;
    }

    .section-header {
      margin-bottom: 2rem;
      max-width: 40rem;
    }

    .section-header h2 {
      font-size: 1.6rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--text-main);
    }

    .three-column {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.5rem;
    }

    .info-card {
      padding: 1.4rem 1.5rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle);
      background-color: var(--bg-elevated);
      box-shadow: var(--shadow-soft);
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .info-icon {
      width: 36px;
      height: 36px;
      border-radius: 999px;
      background-color: var(--primary-soft);
      color: var(--primary-strong);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.25rem;
    }

    .info-card h3 {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .info-card p {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1.5rem;
    }

    .feature {
      padding: 1.3rem 1.35rem;
      border-radius: 1rem;
      border: 1px solid var(--border-subtle);
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .feature-index {
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--text-soft);
    }

    .feature h3 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .feature p {
      font-size: 0.88rem;
      color: var(--text-muted);
    }

    .contact-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
      gap: 1.75rem;
      align-items: flex-start;
    }

    .contact-form {
      padding: 1.8rem 1.9rem;
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .field label {
      font-size: 0.86rem;
      font-weight: 500;
      color: var(--text-muted);
    }

    .contact-aside {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .contact-block {
      padding: 1.1rem 1.25rem;
      border-radius: 1rem;
      border: 1px dashed var(--border-subtle);
      background-color: var(--bg-muted);
    }

    .contact-block h3 {
      font-size: 0.98rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
      color: var(--text-main);
    }

    .contact-block p {
      font-size: 0.86rem;
      color: var(--text-muted);
    }

    .contact-detail {
      margin-top: 0.4rem;
      font-weight: 500;
      color: var(--text-main);
    }

    .footer {
      border-top: 1px solid var(--border-subtle);
      padding: 1.25rem 3rem;
      background-color: #ffffff;
    }

    .footer-inner {
      max-width: 1120px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      font-size: 0.85rem;
      color: var(--text-soft);
    }

    @media (max-width: 1024px) {
      .navbar {
        padding-inline: 1.5rem;
        flex-wrap: wrap;
      }

      .nav-links {
        display: none;
      }

      main {
        padding-inline: 1.5rem;
      }

      .hero-section {
        grid-template-columns: minmax(0, 1fr);
      }

      .hero-visual {
        order: -1;
      }

      .features-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .three-column {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 768px) {
      .nav-cta {
        flex: 1;
        justify-content: flex-end;
      }

      .hero-metrics {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .hero-card-row {
        grid-template-columns: minmax(0, 1fr);
      }

      .three-column {
        grid-template-columns: minmax(0, 1fr);
      }

      .features-grid {
        grid-template-columns: minmax(0, 1fr);
      }

      .contact-grid {
        grid-template-columns: minmax(0, 1fr);
      }

      .footer {
        padding-inline: 1.5rem;
      }

      .footer-inner {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    @media (max-width: 480px) {
      .navbar {
        padding-inline: 1rem;
      }

      main {
        padding-inline: 1rem;
      }

      .hero-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class HomeComponent {}
