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

// 新建项目表单数据
interface NewProjectFormData {
  projectName: string;
  issuerName: string;
  bondType: string;
  issueScale: number;
  expectedIssueDate: string;
  teamMembers: string[];
}

// 新建报告表单数据
interface NewReportFormData {
  reportName: string;
  reportType: 'regular' | 'temporary' | 'special';
  bondName: string;
  reportPeriod: string;
}

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
  showNewProjectModal: boolean;
  showNewReportModal: boolean;
  
  // 操作方法
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedBondId: (id: string | null) => void;
  handleAlert: (alertId: string, handlerName: string) => void;
  markNewsAsHandled: (newsId: string) => void;
  setShowNewProjectModal: (show: boolean) => void;
  setShowNewReportModal: (show: boolean) => void;
  addBondProject: (data: NewProjectFormData) => void;
  addComplianceReport: (data: NewReportFormData) => void;
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
  showNewProjectModal: false,
  showNewReportModal: false,
  
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
  })),
  
  // 控制新建项目弹窗
  setShowNewProjectModal: (show) => set({ showNewProjectModal: show }),
  
  // 控制新建报告弹窗
  setShowNewReportModal: (show) => set({ showNewReportModal: show }),
  
  // 添加新债券项目
  addBondProject: (data) => set((state) => {
    const newProject: BondProject = {
      id: `proj-${Date.now()}`,
      projectName: data.projectName,
      issuerName: data.issuerName,
      bondType: data.bondType,
      issueScale: data.issueScale,
      status: 'pending',
      currentStage: '立项准备',
      progress: 5,
      startDate: new Date().toISOString().split('T')[0],
      expectedIssueDate: data.expectedIssueDate,
      teamMembers: data.teamMembers,
      riskLevel: 'low'
    };
    return {
      bondProjects: [newProject, ...state.bondProjects],
      showNewProjectModal: false
    };
  }),
  
  // 添加新合规报告
  addComplianceReport: (data) => set((state) => {
    const newReport: ComplianceReport = {
      id: `report-${Date.now()}`,
      reportName: data.reportName,
      reportType: data.reportType,
      bondName: data.bondName,
      reportPeriod: data.reportPeriod,
      createDate: new Date().toISOString().split('T')[0],
      status: 'draft'
    };
    return {
      reports: [newReport, ...state.reports],
      showNewReportModal: false
    };
  })
}));

// 选择器：获取未处理的预警数量
export const selectUnhandledAlertsCount = (state: AppState) =>
  state.alerts.filter((a) => !a.isHandled).length;

// 选择器：按风险等级获取预警
export const selectAlertsByLevel = (level: 'high' | 'medium' | 'low') =>
  (state: AppState) =>
    state.alerts.filter((a) => a.level === level && !a.isHandled);
