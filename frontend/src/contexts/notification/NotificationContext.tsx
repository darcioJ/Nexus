import { createContext } from 'react';

export type NotificationType = 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';

export interface NotificationOptions {
  message: string;
  title?: string;
  type?: NotificationType;
}

interface NotificationContextData {
  notify: (options: NotificationOptions) => void;
}

export const NotificationContext = createContext<NotificationContextData>(
  {} as NotificationContextData
);