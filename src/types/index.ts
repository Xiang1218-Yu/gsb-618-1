// 全局类型定义文件，集中管理债券平台所需的领域模型类型
// 命名遵循小驼峰，类型/接口使用大驼峰

// 债券生命周期状态
export type BondStatus = 'underwriting' | 'issuing' | 'duration' | 'matured' | 'defaulted';

// 信用评级枚举
export type CreditRating = 'AAA' | 'AA+' | 'AA' | 'AA-' | 'A+' | 'A' | 'BBB';

// 债券基础信息
export interface BondInfo {
  bondCode: string;          // 债券代码
  bondName: string;          // 债券简称
  issuer: string;            // 发行人
  industry: string;          // 行业
  region: string;            // 地区
  issueScale: number;        // 发行规模（亿元）
  couponRate: number;        // 票面利率（%）
  creditRating: CreditRating;// 信用评级
  issueDate: string;         // 发行日期
  maturityDate: string;      // 到期日期
  status: BondStatus;        // 债券当前状态
  remainingDays: number;     // 距到期剩余天数
  riskScore: number;         // 综合风险分（0-100）
}

// 承销项目阶段
export type UnderwritingStage = 'initiation' | 'duediligence' | 'underwriting' | 'completed';

// 承销项目
export interface UnderwritingProject {
  projectId: string;         // 项目ID
  projectName: string;       // 项目名称
  bondCode: string;          // 关联债券代码
  leadUnderwriter: string;   // 主承销商
  syndicateMembers: string[];// 联席承销团成员
  stage: UnderwritingStage;  // 当前阶段
  progress: number;          // 进度百分比
  startDate: string;         // 启动日期
  expectedIssueDate: string; // 预计发行日
  complianceScore: number;   // 合规评分
  documents: ProjectDocument[];
}

// 项目文档
export interface ProjectDocument {
  documentId: string;
  documentName: string;
  uploadDate: string;
  reviewer: string;
  status: 'pending' | 'approved' | 'rejected';
}

// 簿记建档申购明细
export interface BookbuildingRecord {
  investorId: string;
  investorName: string;
  investorType: '银行' | '保险' | '基金' | '券商' | '其他';
  subscribePrice: number;
  subscribeAmount: number;   // 申购金额（亿元）
  allotment: number;         // 配售金额
}

// 募集资金流向节点（Sankey）
export interface FundFlowLink {
  source: string;            // 来源
  target: string;            // 去向
  amount: number;            // 金额（亿元）
  isCompliant: boolean;      // 是否合规
  category: string;          // 用途分类
}

// 募集资金账户
export interface FundAccount {
  accountId: string;
  accountName: string;
  bankName: string;
  balance: number;           // 余额（亿元）
  raisedAmount: number;      // 累计募集
  usedAmount: number;        // 已使用
}

// 兑付事件类型
export type CouponEventType = 'interest' | 'principal' | 'principalAndInterest' | 'callable';

// 兑付事件
export interface CouponEvent {
  eventId: string;
  bondCode: string;
  bondName: string;
  eventDate: string;
  eventType: CouponEventType;
  amount: number;            // 兑付金额
  status: 'upcoming' | 'paid' | 'overdue';
}

// 财务指标趋势
export interface FinancialMetric {
  metricId: string;
  issuer: string;
  metricName: string;        // 指标名称
  unit: string;
  current: number;
  threshold: number;
  trend: 'up' | 'down' | 'stable';
  history: { period: string; value: number }[];
  status: 'safe' | 'warning' | 'danger';
}

// 舆情情感
export type SentimentType = 'positive' | 'neutral' | 'negative';

// 舆情事件
export interface SentimentEvent {
  eventId: string;
  bondCode: string;
  bondName: string;
  title: string;
  summary: string;
  source: string;            // 媒体来源
  sentiment: SentimentType;
  sentimentScore: number;    // -1 ~ 1
  impactLevel: 'low' | 'medium' | 'high';
  publishTime: string;
  tags: string[];
}

// 待办告警
export interface AlertItem {
  alertId: string;
  category: 'fund' | 'financial' | 'sentiment' | 'document';
  severity: 'low' | 'medium' | 'high';
  title: string;
  bondCode: string;
  createdAt: string;
}

// KPI 卡片
export interface KpiCard {
  label: string;
  value: number;
  unit: string;
  delta: number;             // 环比变化（%）
  trend: 'up' | 'down' | 'stable';
  spark: number[];           // 迷你折线数据
}
