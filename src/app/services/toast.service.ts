import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  title?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _counter = 0;
  toasts = signal<Toast[]>([]);

  show(type: ToastType, message: string, title?: string, duration = 3000) {
    const id = ++this._counter;
    const toast: Toast = { id, type, message, title };

    this.toasts.update(list => [...list, toast]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string, title = 'Success') {
    this.show('success', message, title);
  }

  error(message: string, title = 'Error') {
    this.show('error', message, title);
  }

  info(message: string, title = 'Info') {
    this.show('info', message, title);
  }

  dismiss(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  clearAll() {
    this.toasts.set([]);
  }
}

