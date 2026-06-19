// 发行人财务指标 Mock 数据
import type { FinancialMetric } from '@/types';

// 构造历史趋势点的工具
const buildHistory = (base: number, drift: number) => {
  const periods = ['2024Q1', '2024Q2', '2024Q3', '2024Q4', '2025Q1', '2025Q2', '2025Q3'];
  return periods.map((period, idx) => ({
    period,
    value: Number((base + drift * idx + (Math.sin(idx) * drift) / 2).toFixed(2)),
  }));
};

export const financialMetrics: FinancialMetric[] = [
  {
    metricId: 'FM001',
    issuer: '晨曦能源集团股份有限公司',
    metricName: '资产负债率',
    unit: '%',
    current: 58.4,
    threshold: 70,
    trend: 'up',
    status: 'safe',
    history: buildHistory(54, 0.7),
  },
  {
    metricId: 'FM002',
    issuer: '远洋地产控股有限公司',
    metricName: '资产负债率',
    unit: '%',
    current: 82.6,
    threshold: 70,
    trend: 'up',
    status: 'danger',
    history: buildHistory(76, 1.0),
  },
  {
    metricId: 'FM003',
    issuer: '中铁建基础设施投资有限公司',
    metricName: '流动比率',
    unit: '',
    current: 1.45,
    threshold: 1.2,
    trend: 'stable',
    status: 'safe',
    history: buildHistory(1.4, 0.01),
  },
  {
    metricId: 'FM004',
    issuer: '蓝海科技股份有限公司',
    metricName: '利息保障倍数',
    unit: '',
    current: 3.8,
    threshold: 3.0,
    trend: 'down',
    status: 'warning',
    history: buildHistory(4.6, -0.13),
  },
  {
    metricId: 'FM005',
    issuer: '长河制药控股集团',
    metricName: '速动比率',
    unit: '',
    current: 1.12,
    threshold: 1.0,
    trend: 'up',
    status: 'safe',
    history: buildHistory(1.0, 0.02),
  },
  {
    metricId: 'FM006',
    issuer: '北辰汽车制造集团',
    metricName: '经营性现金流/营收',
    unit: '%',
    current: 4.6,
    threshold: 8,
    trend: 'down',
    status: 'warning',
    history: buildHistory(7.5, -0.45),
  },
  {
    metricId: 'FM007',
    issuer: '金穗现代农业集团',
    metricName: 'EBITDA利息保障倍数',
    unit: '',
    current: 2.3,
    threshold: 2.5,
    trend: 'down',
    status: 'warning',
    history: buildHistory(3.2, -0.13),
  },
  {
    metricId: 'FM008',
    issuer: '星辉文化旅游集团',
    metricName: '净资产收益率',
    unit: '%',
    current: -3.2,
    threshold: 5,
    trend: 'down',
    status: 'danger',
    history: buildHistory(4.5, -1.1),
  },
];
