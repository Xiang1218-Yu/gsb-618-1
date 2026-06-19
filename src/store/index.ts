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
import type {
  Bond,
  RiskAlert,
  TodoItem,
  FundFlow,
  FundReceived,
  Payment,
  Disclosure,
  ComplianceCheck,
  FinancialIndex,
  Sentiment,
  Issuer,
  BondType,
} from '@/types';
import { RiskLevel, BondStatus } from '@/types';

/**
 * 搜索结果项接口
 */
export interface SearchResultItem {
  /** 结果ID */
  id: string;
  /** 结果类型 */
  type: 'bond' | 'issuer' | 'risk' | 'todo';
  /** 标题 */
  title: string;
  /** 副标题 */
  subtitle?: string;
  /** 路由路径 */
  path: string;
}

/**
 * 新增债券表单数据接口
 */
export interface BondFormData {
  /** 债券名称 */
  bondName: string;
  /** 债券代码 */
  bondCode: string;
  /** 发行人ID */
  issuerId: string;
  /** 债券类型 */
  bondType: BondType;
  /** 发行规模（亿元） */
  issueAmount: number;
  /** 票面利率（%） */
  issueRate: number;
  /** 发行日期 */
  issueDate: string;
  /** 到期日期 */
  maturityDate: string;
  /** 期限（年） */
  termYears: number;
  /** 受托管理人 */
  trustee?: string;
}

/**
 * 应用全局状态接口
 */
interface AppState {
  /** 债券列表 */
  bonds: Bond[];
  /** 发行人列表 */
  issuers: Issuer[];
  /** 资金到账记录 */
  fundReceivedList: FundReceived[];
  /** 资金流水数据 */
  fundFlows: FundFlow[];
  /** 财务指标数据 */
  financialIndices: FinancialIndex[];
  /** 舆情数据 */
  sentiments: Sentiment[];
  /** 付息兑付数据 */
  payments: Payment[];
  /** 信息披露数据 */
  disclosures: Disclosure[];
  /** 合规检查数据 */
  complianceChecks: ComplianceCheck[];
  /** 风险预警列表 */
  riskAlerts: RiskAlert[];
  /** 待办事项列表 */
  todoItems: TodoItem[];
  /** 工作台统计数据 */
  dashboardStats: typeof mockDashboardStats;
  /** 资金使用趋势 */
  fundUsageTrend: typeof fundUsageTrend;
  /** 舆情情感分布 */
  sentimentDistribution: typeof sentimentDistribution;
  /** 舆情来源分布 */
  sentimentSourceDistribution: typeof sentimentSourceDistribution;
  /** 债券类型分布 */
  bondTypeDistribution: typeof bondTypeDistribution;
  /** 资产负债率趋势 */
  debtRatioTrend: typeof debtRatioTrend;
  /** 当前选中的债券ID */
  selectedBondId: string | null;
  /** 全局搜索关键词 */
  globalSearchKeyword: string;
  /** 设置全局搜索关键词 */
  setGlobalSearchKeyword: (keyword: string) => void;
  /** 全局搜索 */
  globalSearch: (keyword: string) => SearchResultItem[];
  /** 新增债券 */
  addBond: (data: BondFormData) => Bond;
  /** 设置当前选中债券 */
  setSelectedBondId: (id: string | null) => void;
  /** 处理预警事项 */
  handleAlert: (alertId: string, status: RiskAlert['handleStatus'], remark?: string) => void;
  /** 完成待办事项 */
  completeTodo: (todoId: string) => void;
  /** 根据ID获取债券详情 */
  getBondById: (id: string) => Bond | undefined;
  /** 根据发行人ID获取发行人 */
  getIssuerById: (id: string) => Issuer | undefined;
  /** 根据债券ID获取资金到账记录 */
  getFundReceivedByBondId: (bondId: string) => FundReceived[];
  /** 根据债券ID获取资金流水 */
  getFundFlowsByBondId: (bondId: string) => FundFlow[];
  /** 根据债券ID获取财务指标 */
  getFinancialIndicesByBondId: (bondId: string) => FinancialIndex[];
  /** 根据债券ID获取舆情 */
  getSentimentsByBondId: (bondId: string) => Sentiment[];
  /** 根据债券ID获取付息兑付事项 */
  getPaymentsByBondId: (bondId: string) => Payment[];
  /** 根据债券ID获取信息披露事项 */
  getDisclosuresByBondId: (bondId: string) => Disclosure[];
  /** 根据债券ID获取合规检查项 */
  getComplianceChecksByBondId: (bondId: string) => ComplianceCheck[];
  /** 根据债券ID获取风险预警 */
  getRiskAlertsByBondId: (bondId: string) => RiskAlert[];
}

/**
 * 生成唯一ID
 */
const generateId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;

/**
 * 全局状态管理Store
 */
export const useAppStore = create<AppState>((set, get) => ({
  bonds: mockBonds,
  issuers: mockIssuers,
  fundReceivedList: mockFundReceived,
  fundFlows: mockFundFlows,
  financialIndices: mockFinancialIndices,
  sentiments: mockSentiments,
  payments: mockPayments,
  disclosures: mockDisclosures,
  complianceChecks: mockComplianceChecks,
  riskAlerts: mockRiskAlerts,
  todoItems: mockTodoItems,
  dashboardStats: mockDashboardStats,
  fundUsageTrend,
  sentimentDistribution,
  sentimentSourceDistribution,
  bondTypeDistribution,
  debtRatioTrend,
  selectedBondId: null,
  globalSearchKeyword: '',

  /**
   * 设置全局搜索关键词
   * @param keyword 关键词
   */
  setGlobalSearchKeyword: (keyword: string) => set({ globalSearchKeyword: keyword }),

  /**
   * 全局搜索
   * @param keyword 搜索关键词
   * @returns 搜索结果列表
   */
  globalSearch: (keyword: string) => {
    const { bonds, riskAlerts, todoItems } = get();
    const results: SearchResultItem[] = [];
    const lowerKeyword = keyword.toLowerCase();

    if (!keyword.trim()) return results;

    /** 搜索债券 */
    bonds.forEach((bond) => {
      if (
        bond.bondName.toLowerCase().includes(lowerKeyword) ||
        bond.bondCode.toLowerCase().includes(lowerKeyword) ||
        bond.issuer?.issuerName.toLowerCase().includes(lowerKeyword)
      ) {
        results.push({
          id: bond.id,
          type: 'bond',
          title: bond.bondName,
          subtitle: `${bond.bondCode} · ${bond.issuer?.issuerName || ''}`,
          path: `/bonds/${bond.id}`,
        });
      }
    });

    /** 搜索发行人 */
    get().issuers.forEach((issuer) => {
      if (issuer.issuerName.toLowerCase().includes(lowerKeyword)) {
        const issuerBonds = bonds.filter((b) => b.issuerId === issuer.id);
        if (issuerBonds.length > 0) {
          results.push({
            id: issuer.id,
            type: 'issuer',
            title: issuer.issuerName,
            subtitle: `${issuer.industry} · ${issuerBonds.length}只在管债券`,
            path: `/bonds`,
          });
        }
      }
    });

    /** 搜索风险预警 */
    riskAlerts.forEach((alert) => {
      if (
        alert.title.toLowerCase().includes(lowerKeyword) ||
        alert.description.toLowerCase().includes(lowerKeyword) ||
        alert.bondName?.toLowerCase().includes(lowerKeyword)
      ) {
        results.push({
          id: alert.id,
          type: 'risk',
          title: alert.title,
          subtitle: `${alert.bondName || ''} · ${alert.description}`,
          path: `/bonds/${alert.bondId}`,
        });
      }
    });

    /** 搜索待办事项 */
    todoItems.forEach((todo) => {
      if (
        todo.title.toLowerCase().includes(lowerKeyword) ||
        todo.bondName?.toLowerCase().includes(lowerKeyword)
      ) {
        results.push({
          id: todo.id,
          type: 'todo',
          title: todo.title,
          subtitle: todo.bondName ? `${todo.bondName} · 截止${todo.deadline}` : `截止${todo.deadline}`,
          path: todo.bondId ? `/bonds/${todo.bondId}` : '/',
        });
      }
    });

    return results;
  },

  /**
   * 新增债券
   * @param data 债券表单数据
   * @returns 新创建的债券
   */
  addBond: (data: BondFormData) => {
    const issuer = get().getIssuerById(data.issuerId);
    const newBond: Bond = {
      id: generateId('bond'),
      bondName: data.bondName,
      bondCode: data.bondCode,
      issuerId: data.issuerId,
      issuer,
      bondType: data.bondType,
      issueAmount: data.issueAmount,
      issueRate: data.issueRate,
      issueDate: data.issueDate,
      maturityDate: data.maturityDate,
      termYears: data.termYears,
      status: BondStatus.Underwriting,
      ratingOutlook: '稳定',
      trustee: data.trustee,
      createdAt: new Date().toISOString().split('T')[0],
    };

    set((state) => ({
      bonds: [newBond, ...state.bonds],
      dashboardStats: {
        ...state.dashboardStats,
        totalBonds: state.dashboardStats.totalBonds + 1,
      },
    }));

    return newBond;
  },

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
        todoCount: Math.max(0, state.dashboardStats.todoCount - 1),
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
   * 根据ID获取发行人
   * @param id 发行人ID
   * @returns 发行人信息
   */
  getIssuerById: (id: string) => {
    return get().issuers.find((issuer) => issuer.id === id);
  },

  /**
   * 根据债券ID获取资金到账记录
   * @param bondId 债券ID
   * @returns 资金到账记录列表
   */
  getFundReceivedByBondId: (bondId: string) => {
    return get().fundReceivedList.filter((item) => item.bondId === bondId);
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
    return get().financialIndices.filter((index) => index.bondId === bondId);
  },

  /**
   * 根据债券ID获取舆情信息
   * @param bondId 债券ID
   * @returns 舆情列表
   */
  getSentimentsByBondId: (bondId: string) => {
    return get().sentiments.filter((sentiment) => sentiment.bondId === bondId);
  },

  /**
   * 根据债券ID获取付息兑付事项
   * @param bondId 债券ID
   * @returns 付息兑付列表
   */
  getPaymentsByBondId: (bondId: string) => {
    return get().payments.filter((payment) => payment.bondId === bondId);
  },

  /**
   * 根据债券ID获取信息披露事项
   * @param bondId 债券ID
   * @returns 信息披露列表
   */
  getDisclosuresByBondId: (bondId: string) => {
    return get().disclosures.filter((disclosure) => disclosure.bondId === bondId);
  },

  /**
   * 根据债券ID获取合规检查项
   * @param bondId 债券ID
   * @returns 合规检查列表
   */
  getComplianceChecksByBondId: (bondId: string) => {
    return get().complianceChecks.filter((check) => check.bondId === bondId);
  },

  /**
   * 根据债券ID获取风险预警
   * @param bondId 债券ID
   * @returns 风险预警列表
   */
  getRiskAlertsByBondId: (bondId: string) => {
    return get().riskAlerts.filter((alert) => alert.bondId === bondId);
  },
}));
