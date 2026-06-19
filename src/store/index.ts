import { create } from 'zustand';
import {
  mockBonds,
  mockIssuers,
  mockFundFlows,
  mockFundReceived,
  mockFinancialIndices,
  mockSentiments,
  mockPayments,
  mockDisclosures,
  mockComplianceChecks,
  mockRiskAlerts,
  mockTodoItems,
  mockDashboardStats,
  fundUsageTrend,
  sentimentDistribution,
  sentimentSourceDistribution,
  bondTypeDistribution,
  debtRatioTrend,
} from '@/mock';
import type { Bond, RiskAlert, TodoItem, FundFlow } from '@/types';
import { RiskLevel } from '@/types';

/**
 * 应用全局状态接口
 */
interface AppState {
  /** 债券列表 */
  bonds: Bond[];
  /** 当前选中的债券ID */
  selectedBondId: string | null;
  /** 风险预警列表 */
  riskAlerts: RiskAlert[];
  /** 待办事项列表 */
  todoItems: TodoItem[];
  /** 工作台统计数据 */
  dashboardStats: typeof mockDashboardStats;
  /** 资金流水数据 */
  fundFlows: FundFlow[];
  /** 设置当前选中债券 */
  setSelectedBondId: (id: string | null) => void;
  /** 处理预警事项 */
  handleAlert: (alertId: string, status: RiskAlert['handleStatus'], remark?: string) => void;
  /** 完成待办事项 */
  completeTodo: (todoId: string) => void;
  /** 根据ID获取债券详情 */
  getBondById: (id: string) => Bond | undefined;
  /** 根据债券ID获取资金流水 */
  getFundFlowsByBondId: (bondId: string) => FundFlow[];
  /** 根据债券ID获取财务指标 */
  getFinancialIndicesByBondId: (bondId: string) => typeof mockFinancialIndices;
  /** 根据债券ID获取舆情 */
  getSentimentsByBondId: (bondId: string) => typeof mockSentiments;
}

/**
 * 全局状态管理Store
 */
export const useAppStore = create<AppState>((set, get) => ({
  bonds: mockBonds,
  selectedBondId: null,
  riskAlerts: mockRiskAlerts,
  todoItems: mockTodoItems,
  dashboardStats: mockDashboardStats,
  fundFlows: mockFundFlows,

  /**
   * 设置当前选中的债券
   * @param id 债券ID
   */
  setSelectedBondId: (id: string | null) => set({ selectedBondId: id }),

  /**
   * 处理预警事项
   * @param alertId 预警ID
   * @param status 处理状态
   * @param remark 处理意见
   */
  handleAlert: (alertId: string, status: RiskAlert['handleStatus'], remark?: string) => {
    set((state) => ({
      riskAlerts: state.riskAlerts.map((alert) =>
        alert.id === alertId
          ? { ...alert, handleStatus: status, handleRemark: remark, handler: '当前用户' }
          : alert
      ),
    }));
  },

  /**
   * 完成待办事项
   * @param todoId 待办ID
   */
  completeTodo: (todoId: string) => {
    set((state) => ({
      todoItems: state.todoItems.map((todo) =>
        todo.id === todoId ? { ...todo, status: 'done' as const } : todo
      ),
      dashboardStats: {
        ...state.dashboardStats,
        todoCount: state.dashboardStats.todoCount - 1,
      },
    }));
  },

  /**
   * 根据ID获取债券详情
   * @param id 债券ID
   * @returns 债券信息
   */
  getBondById: (id: string) => {
    return get().bonds.find((bond) => bond.id === id);
  },

  /**
   * 根据债券ID获取资金流水
   * @param bondId 债券ID
   * @returns 资金流水列表
   */
  getFundFlowsByBondId: (bondId: string) => {
    return get().fundFlows.filter((flow) => flow.bondId === bondId);
  },

  /**
   * 根据债券ID获取财务指标
   * @param bondId 债券ID
   * @returns 财务指标列表
   */
  getFinancialIndicesByBondId: (bondId: string) => {
    return mockFinancialIndices.filter((index) => index.bondId === bondId);
  },

  /**
   * 根据债券ID获取舆情信息
   * @param bondId 债券ID
   * @returns 舆情列表
   */
  getSentimentsByBondId: (bondId: string) => {
    return mockSentiments.filter((sentiment) => sentiment.bondId === bondId);
  },
}));

export { mockIssuers, mockFundReceived, mockPayments, mockDisclosures, mockComplianceChecks };
export { fundUsageTrend, sentimentDistribution, sentimentSourceDistribution, bondTypeDistribution, debtRatioTrend };
