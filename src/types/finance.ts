// 财务指标相关类型定义

import type { WarningLevel } from './common';

/**
 * 财务指标类型
 */
export type IndicatorType =
  | 'debt_ratio' // 资产负债率
  | 'current_ratio' // 流动比率
  | 'quick_ratio' // 速动比率
  | 'net_profit_margin' // 净利润率
  | 'roe' // 净资产收益率
  | 'ebitda_interest' // EBITDA利息保障倍数
  | 'operating_cash_flow' // 经营现金流净额
  | 'asset_liability_ratio'; // 产权比率

/**
 * 财务指标配置
 */
export interface IndicatorConfig {
  id: string;
  indicatorCode: IndicatorType;
  indicatorName: string;
  unit: string;
  warningUpper?: number; // 预警上限
  warningLower?: number; // 预警下限
  dangerUpper?: number; // 危险上限
  dangerLower?: number; // 危险下限
  direction: 'higher_better' | 'lower_better'; // 指标方向
  description?: string;
}

/**
 * 财务指标记录
 */
export interface FinancialIndicator {
  id: string;
  bondId: string;
  bondName: string;
  issuerId: string;
  issuerName: string;
  indicatorCode: IndicatorType;
  indicatorName: string;
  currentValue: number;
  lastValue: number;
  changeValue: number;
  warningLevel: WarningLevel;
  warningLevelName: string;
  reportDate: string;
  reportPeriod: string; // 报告期
  thresholdInfo: string;
}

/**
 * 财务指标历史数据点
 */
export interface IndicatorHistoryPoint {
  date: string;
  value: number;
}

/**
 * 财务预警记录
 */
export interface FinanceWarning {
  id: string;
  bondId: string;
  bondName: string;
  issuerName: string;
  indicatorName: string;
  currentValue: number;
  thresholdValue: number;
  warningLevel: WarningLevel;
  warningLevelName: string;
  triggerDate: string;
  handled: boolean;
  handler?: string;
  handleDate?: string;
  handleNote?: string;
}
