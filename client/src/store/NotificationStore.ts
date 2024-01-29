import { create } from "zustand";
import { TNotification } from "../types/Notification";

interface NotificationState {
  notifLength: number;
  setNotifLength: (data: number) => void;
  listNotifLength: TNotification[] | [];
  setListNotifLength: (data: TNotification[]) => void;
}

const NotificationStore = create<NotificationState>()((set) => ({
  notifLength: 0,
  listNotifLength: [],
  setNotifLength: (data: number) => set({ notifLength: data }),
  setListNotifLength: (data: TNotification[]) => set({ listNotifLength: data }),
}));

export default NotificationStore;
