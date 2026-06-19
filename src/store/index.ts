import { create } from 'zustand';
import type {
  BondProject,
  DurationBond,
  FundRecord,
  FinancialIndicator,
  SentimentNews,
  AlertItem,
  ComplianceReport
} from '../types';
import {
  mockBondProjects,
  mockDurationBonds,
  mockFundRecords,
  mockFinancialIndicators,
  mockSentimentNews,
  mockAlerts,
  mockReports
} from '../data/mockData';

// 应用状态接口定义
interface AppState {
  // 数据状态
  bondProjects: BondProject[];
  durationBonds: DurationBond[];
  fundRecords: FundRecord[];
  financialIndicators: FinancialIndicator[];
  sentimentNews: SentimentNews[];
  alerts: AlertItem[];
  reports: ComplianceReport[];
  
  // UI状态
  sidebarCollapsed: boolean;
  selectedBondId: string | null;
  
  // 操作方法
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedBondId: (id: string | null) => void;
  handleAlert: (alertId: string, handlerName: string) => void;
  markNewsAsHandled: (newsId: string) => void;
}

// 创建全局状态管理
export const useAppStore = create<AppState>((set) => ({
  // 初始化模拟数据
  bondProjects: mockBondProjects,
  durationBonds: mockDurationBonds,
  fundRecords: mockFundRecords,
  financialIndicators: mockFinancialIndicators,
  sentimentNews: mockSentimentNews,
  alerts: mockAlerts,
  reports: mockReports,
  
  // UI状态初始值
  sidebarCollapsed: false,
  selectedBondId: null,
  
  // 设置侧边栏折叠状态
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  // 设置选中的债券ID
  setSelectedBondId: (id) => set({ selectedBondId: id }),
  
  // 处理预警
  handleAlert: (alertId, handlerName) => set((state) => ({
    alerts: state.alerts.map((alert) =>
      alert.id === alertId
        ? { ...alert, isHandled: true, handler: handlerName }
        : alert
    )
  })),
  
  // 标记舆情已处理
  markNewsAsHandled: (newsId) => set((state) => ({
    sentimentNews: state.sentimentNews.map((news) =>
      news.id === newsId
        ? { ...news, isHandled: true }
        : news
    )
  }))
}));

// 选择器：获取未处理的预警数量
export const selectUnhandledAlertsCount = (state: AppState) =>
  state.alerts.filter((a) => !a.isHandled).length;

// 选择器：按风险等级获取预警
export const selectAlertsByLevel = (level: 'high' | 'medium' | 'low') =>
  (state: AppState) =>
    state.alerts.filter((a) => a.level === level && !a.isHandled);
