export type NotificationType = 'reminder' | 'cancellation';

export interface AppNotification {
  id: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: NotificationType;
}
