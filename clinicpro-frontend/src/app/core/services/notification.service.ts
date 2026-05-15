import { Injectable, computed, inject, signal } from '@angular/core';
import { RendezVousService } from './rendez-vous.service';
import { AuthService } from './auth.service';
import { isTomorrow } from '../models/rendez-vous.model';
import {
  AppNotification,
  NotificationType,
  ToastMessage
} from '../models/notification.model';

const TOAST_DURATION_MS = 8000;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly rendezVousService = inject(RendezVousService);
  private readonly authService = inject(AuthService);

  private initialized = false;

  private readonly notificationsSignal = signal<AppNotification[]>([]);
  private readonly toastsSignal = signal<ToastMessage[]>([]);

  readonly notifications = this.notificationsSignal.asReadonly();
  readonly activeToasts = this.toastsSignal.asReadonly();

  readonly unreadCount = computed(
    () => this.notificationsSignal().filter(n => !n.read).length
  );

  init(): void {
    if (this.initialized || !this.authService.isLoggedIn()) {
      return;
    }

    this.initialized = true;

    this.rendezVousService.getByStatut('PLANIFIE').subscribe({
      next: appointments => {
        const tomorrowAppointments = appointments.filter(rdv => isTomorrow(rdv.date));

        for (const rdv of tomorrowAppointments) {
          const patient = rdv.patient?.nom ?? 'Patient';
          const medecin = rdv.medecin?.nom ?? 'médecin';
          const heure = rdv.heure ?? '';
          const message = `Rappel : rendez-vous demain à ${heure} — ${patient} avec Dr. ${medecin}`;

          this.addNotification(message, 'reminder');
          this.showToast(message, 'reminder');
        }
      }
    });
  }

  notifyCancellation(message: string): void {
    this.addNotification(message, 'cancellation');
    this.showToast(message, 'cancellation');
  }

  showToast(message: string, type: NotificationType): void {
    const toast: ToastMessage = {
      id: crypto.randomUUID(),
      message,
      type
    };

    this.toastsSignal.update(list => [...list, toast]);

    setTimeout(() => this.dismissToast(toast.id), TOAST_DURATION_MS);
  }

  dismissToast(id: string): void {
    this.toastsSignal.update(list => list.filter(t => t.id !== id));
  }

  markAsRead(id: string): void {
    this.notificationsSignal.update(list =>
      list.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }

  markAllRead(): void {
    this.notificationsSignal.update(list => list.map(n => ({ ...n, read: true })));
  }

  private addNotification(message: string, type: NotificationType): void {
    const notification: AppNotification = {
      id: crypto.randomUUID(),
      message,
      type,
      read: false,
      createdAt: Date.now()
    };

    this.notificationsSignal.update(list => [notification, ...list]);
  }
}
