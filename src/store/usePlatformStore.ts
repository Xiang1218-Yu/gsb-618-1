// 全局状态管理 - 使用 Zustand 集中存放各模块的领域数据
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
}));
