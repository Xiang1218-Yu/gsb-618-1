// 全局状态管理 - 使用 Zustand 集中存放各模块的领域数据，并提供 CRUD 操作
import { create } from 'zustand';
import { bondList } from '@/mock/bondList';
import { underwritingProjects } from '@/mock/underwritingProjects';
import { bookbuildingRecords } from '@/mock/bookbuilding';
import { fundAccounts, fundFlowLinks } from '@/mock/fundFlows';
import { financialMetrics } from '@/mock/financialMetrics';
import { sentimentEvents } from '@/mock/sentimentEvents';
import { couponEvents, alertList, kpiCards } from '@/mock/couponSchedules';
import type {
  BondInfo,
  UnderwritingProject,
  BookbuildingRecord,
  FundAccount,
  FundFlowLink,
  FinancialMetric,
  SentimentEvent,
  CouponEvent,
} from '@/types';

// 平台 Store 状态接口
interface PlatformState {
  bonds: BondInfo[];
  projects: UnderwritingProject[];
  bookbuilding: BookbuildingRecord[];
  accounts: FundAccount[];
  fundFlows: FundFlowLink[];
  financials: FinancialMetric[];
  sentiments: SentimentEvent[];
  coupons: CouponEvent[];
  alerts: typeof alertList;
  kpis: typeof kpiCards;
  selectedBondCode: string | null;
  setSelectedBond: (bondCode: string | null) => void;

  // 承销项目 CRUD
  addProject: (project: UnderwritingProject) => void;
  updateProject: (projectId: string, patch: Partial<UnderwritingProject>) => void;
  removeProject: (projectId: string) => void;

  // 债券台账 CRUD
  addBond: (bond: BondInfo) => void;
  updateBond: (bondCode: string, patch: Partial<BondInfo>) => void;
  removeBond: (bondCode: string) => void;

  // 舆情事件 CRUD
  addSentiment: (event: SentimentEvent) => void;
  updateSentiment: (eventId: string, patch: Partial<SentimentEvent>) => void;
  removeSentiment: (eventId: string) => void;

  // 财务指标 CRUD
  addFinancial: (metric: FinancialMetric) => void;
  updateFinancial: (metricId: string, patch: Partial<FinancialMetric>) => void;
  removeFinancial: (metricId: string) => void;
}

// 创建全局状态 Store
export const usePlatformStore = create<PlatformState>((set) => ({
  bonds: bondList,
  projects: underwritingProjects,
  bookbuilding: bookbuildingRecords,
  accounts: fundAccounts,
  fundFlows: fundFlowLinks,
  financials: financialMetrics,
  sentiments: sentimentEvents,
  coupons: couponEvents,
  alerts: alertList,
  kpis: kpiCards,
  selectedBondCode: null,
  setSelectedBond: (bondCode) => set({ selectedBondCode: bondCode }),

  // 承销项目 CRUD 实现
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
  updateProject: (projectId, patch) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.projectId === projectId ? { ...p, ...patch } : p)),
    })),
  removeProject: (projectId) =>
    set((state) => ({ projects: state.projects.filter((p) => p.projectId !== projectId) })),

  // 债券 CRUD 实现
  addBond: (bond) => set((state) => ({ bonds: [bond, ...state.bonds] })),
  updateBond: (bondCode, patch) =>
    set((state) => ({
      bonds: state.bonds.map((b) => (b.bondCode === bondCode ? { ...b, ...patch } : b)),
    })),
  removeBond: (bondCode) =>
    set((state) => ({ bonds: state.bonds.filter((b) => b.bondCode !== bondCode) })),

  // 舆情 CRUD 实现
  addSentiment: (event) => set((state) => ({ sentiments: [event, ...state.sentiments] })),
  updateSentiment: (eventId, patch) =>
    set((state) => ({
      sentiments: state.sentiments.map((s) => (s.eventId === eventId ? { ...s, ...patch } : s)),
    })),
  removeSentiment: (eventId) =>
    set((state) => ({ sentiments: state.sentiments.filter((s) => s.eventId !== eventId) })),

  // 财务指标 CRUD 实现
  addFinancial: (metric) => set((state) => ({ financials: [metric, ...state.financials] })),
  updateFinancial: (metricId, patch) =>
    set((state) => ({
      financials: state.financials.map((m) => (m.metricId === metricId ? { ...m, ...patch } : m)),
    })),
  removeFinancial: (metricId) =>
    set((state) => ({ financials: state.financials.filter((m) => m.metricId !== metricId) })),
}));
