// 通用类型定义

/**
 * 债券状态枚举
 */
export type BondStatus =
  | 'underwriting' // 承销中
  | 'issuing' // 发行中
  | 'duration' // 存续期
  | 'matured' // 已到期
  | 'defaulted'; // 违约

/**
 * 预警等级
 */
export type WarningLevel =
  | 'normal' // 正常
  | 'attention' // 关注
  | 'warning' // 预警
  | 'danger'; // 危险

/**
 * 情感倾向
 */
export type SentimentType =
  | 'positive' // 正面
  | 'neutral' // 中性
  | 'negative'; // 负面

/**
 * 待办事项类型
 */
export interface TodoItem {
  id: string;
  title: string;
  type: 'underwriting' | 'issuance' | 'interest' | 'sentiment' | 'fund';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  bondId?: string;
  bondName?: string;
}

/**
 * 预警项
 */
export interface WarningItem {
  id: string;
  title: string;
  type: 'finance' | 'sentiment' | 'fund' | 'compliance';
  level: WarningLevel;
  time: string;
  bondId?: string;
  bondName?: string;
  description: string;
  handled: boolean;
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  total: number;
}

/**
 * 统计卡片数据
 */
export interface StatCardData {
  title: string;
  value: number | string;
  unit?: string;
  trend?: number;
  trendType?: 'up' | 'down';
  icon: string;
  color: string;
}
