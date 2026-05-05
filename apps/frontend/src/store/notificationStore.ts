import { create } from 'zustand';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  read: boolean;
  createdAt: string;
  linkTo?: string; // e.g., '/dashboard/booking/negotiations?id=123'
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  // This would typically be populated by an API call on mount or via WebSockets
  setNotifications: (notifications: AppNotification[]) => void;
}

// Dummy initial state for UI scaffolding
const DUMMY_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Counter-Offer Received',
    message: 'Zakir Khan Mgmt countered your offer with ₹8,50,000.',
    type: 'WARNING',
    priority: 'HIGH',
    read: false,
    createdAt: new Date().toISOString(),
    linkTo: '/dashboard/booking/negotiations'
  },
  {
    id: 'n2',
    title: 'Profile Approved',
    message: 'Your Booking Company KYC has been verified by an admin.',
    type: 'SUCCESS',
    priority: 'MEDIUM',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  }
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: DUMMY_NOTIFICATIONS,
  unreadCount: DUMMY_NOTIFICATIONS.filter(n => !n.read).length,
  
  addNotification: (notif) => set((state) => {
    const newNotif: AppNotification = {
      ...notif,
      id: Math.random().toString(36).substring(7),
      read: false,
      createdAt: new Date().toISOString()
    };
    const newList = [newNotif, ...state.notifications];
    return { notifications: newList, unreadCount: newList.filter(n => !n.read).length };
  }),

  markAsRead: (id) => set((state) => {
    const newList = state.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    return { notifications: newList, unreadCount: newList.filter(n => !n.read).length };
  }),

  markAllAsRead: () => set((state) => {
    const newList = state.notifications.map(n => ({ ...n, read: true }));
    return { notifications: newList, unreadCount: 0 };
  }),

  setNotifications: (notifications) => set({ 
    notifications, 
    unreadCount: notifications.filter(n => !n.read).length 
  })
}));
