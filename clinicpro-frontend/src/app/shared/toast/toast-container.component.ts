import { Component, inject } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationType } from '../../core/models/notification.model';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      @for (toast of notificationService.activeToasts(); track toast.id) {
        <div
          class="toast"
          [class.toast--reminder]="toast.type === 'reminder'"
          [class.toast--cancellation]="toast.type === 'cancellation'"
          role="alert"
        >
          <i class="ti toast__icon" [class]="iconClass(toast.type)" aria-hidden="true"></i>
          <p class="toast__message">{{ toast.message }}</p>
          <button
            type="button"
            class="toast__close"
            aria-label="Fermer"
            (click)="dismiss(toast.id)"
          >
            <i class="ti ti-x" aria-hidden="true"></i>
          </button>
        </div>
      }
    </div>
    `,
  styles: `
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 22rem;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: 0.5rem;
      background: #fff;
      box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
      border-left: 4px solid #0d7377;
      pointer-events: auto;
      animation: toast-in 0.25s ease-out;
    }

    .toast--reminder {
      border-left-color: #0d7377;
    }

    .toast--cancellation {
      border-left-color: #dc2626;
    }

    .toast__icon {
      flex-shrink: 0;
      font-size: 1.25rem;
      margin-top: 0.125rem;
      color: #0d7377;
    }

    .toast--cancellation .toast__icon {
      color: #dc2626;
    }

    .toast__message {
      flex: 1;
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.4;
      color: #1e293b;
    }

    .toast__close {
      flex-shrink: 0;
      border: none;
      background: transparent;
      padding: 0;
      cursor: pointer;
      color: #64748b;
      line-height: 1;

      &:hover {
        color: #1e293b;
      }
    }

    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translateX(1rem);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `
})
export class ToastContainerComponent {
  readonly notificationService = inject(NotificationService);

  iconClass(type: NotificationType): string {
    return type === 'cancellation' ? 'ti ti-alert-circle' : 'ti ti-calendar-event';
  }

  dismiss(id: string): void {
    this.notificationService.dismissToast(id);
  }
}
