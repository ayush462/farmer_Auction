import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="toastService.toasts().length > 0">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="toast"
        [ngClass]="{
          'toast--success': toast.type === 'success',
          'toast--error': toast.type === 'error',
          'toast--info': toast.type === 'info'
        }"
      >
        <div class="toast-icon">
          <span class="app-icon app-icon--lg">
            {{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}
          </span>
        </div>
        <div class="toast-content">
          <div class="toast-title">
            {{ toast.title || (toast.type | titlecase) }}
          </div>
          <div class="toast-description">
            {{ toast.message }}
          </div>
        </div>
        <button class="toast-close-btn" type="button" (click)="toastService.dismiss(toast.id)">
          <span class="app-icon app-icon--muted">close</span>
        </button>
      </div>
    </div>
  `
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}

