import { Component, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, provideRouter, Router, RouterOutlet } from '@angular/router';
import { routes } from './app/app.routes';
import { ToastContainerComponent } from './app/components/shared/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  template: `
    <div class="app-shell">
      @if (isNavigating()) {
        <div class="route-loader"></div>
      }
      <router-outlet class="page-fade"></router-outlet>
      <app-toast-container></app-toast-container>
    </div>
  `,
})
export class App {
  isNavigating = signal(false);

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigating.set(true);
      }

      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        setTimeout(() => this.isNavigating.set(false), 150);
      }
    });
  }
}

bootstrapApplication(App, {
  providers: [provideRouter(routes)]
});
