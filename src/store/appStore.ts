import { create } from 'zustand';

/**
 * 通知类型定义
 */
interface Notification {
  id: string;
  title: string;
  content: string;
  time: string;
  read: boolean;
}

/**
 * 应用全局状态接口
 */
interface AppState {
  // 侧边栏折叠状态
  sidebarCollapsed: boolean;
  // 通知列表
  notifications: Notification[];
  // 未读通知数量
  unreadCount: number;

  // Actions
  // 切换侧边栏折叠状态
  toggleSidebar: () => void;
  // 设置侧边栏折叠状态
  setSidebarCollapsed: (collapsed: boolean) => void;
  // 添加通知
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  // 标记通知为已读
  markNotificationAsRead: (id: string) => void;
  // 标记所有通知为已读
  markAllNotificationsAsRead: () => void;
  // 清除所有通知
  clearNotifications: () => void;
}

/**
 * 应用全局状态管理
 */
export const useAppStore = create<AppState>((set, get) => ({
  sidebarCollapsed: false,
  notifications: [
    {
      id: '1',
      title: '系统消息',
      content: '您有3只债券待审核，请及时处理',
      time: '10分钟前',
      read: false,
    },
    {
      id: '2',
      title: '预警提醒',
      content: '债券"21国债01"舆情监测出现负面信息',
      time: '30分钟前',
      read: false,
    },
    {
      id: '3',
      title: '审批通知',
      content: '承销申请已通过审批',
      time: '1小时前',
      read: true,
    },
  ],

  get unreadCount() {
    return get().notifications.filter((n) => !n.read).length;
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  setSidebarCollapsed: (collapsed: boolean) => {
    set({ sidebarCollapsed: collapsed });
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));
  },

  markNotificationAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  markAllNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
