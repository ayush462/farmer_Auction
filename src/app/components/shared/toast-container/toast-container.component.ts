import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast"
          [ngClass]="{
            'toast--success': toast.type === 'success',
            'toast--error': toast.type === 'error',
            'toast--info': toast.type === 'info'
          }"
        >
          <div class="toast-icon">
            <span class="app-icon">
              {{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}
            </span>
          </div>
          <div class="toast-content">
            @if (toast.title) {
              <div class="toast-title">{{ toast.title }}</div>
            }
            <div class="toast-description">
              {{ toast.message }}
            </div>
          </div>
          <button class="toast-close-btn" type="button" (click)="toastService.dismiss(toast.id)">
            <span class="app-icon">close</span>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
