// 债券相关类型定义

import type { BondStatus } from './common';

/**
 * 发行人信息
 */
export interface Issuer {
  id: string;
  issuerName: string;
  industry: string;
  creditRating: string;
  registeredCapital: number;
  establishDate: string;
  legalRepresentative: string;
}

/**
 * 债券基本信息
 */
export interface Bond {
  id: string;
  bondName: string;
  bondCode: string;
  issuerId: string;
  issuerName: string;
  bondType: 'corporate' | 'enterprise' | 'municipal' | 'financial' | 'convertible';
  bondTypeName: string;
  issueAmount: number; // 发行规模（亿元）
  issueRate: number; // 票面利率（%）
  issuePrice: number; // 发行价格
  termYears: number; // 债券期限（年）
  issueDate: string;
  maturityDate: string;
  listingDate?: string;
  status: BondStatus;
  statusName: string;
  creditRating: string;
  leadUnderwriter: string; // 主承销商
  trustee: string; // 受托管理人
}

/**
 * 承销项目
 */
export interface UnderwritingProject {
  id: string;
  bondId: string;
  bondName: string;
  projectName: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
  statusName: string;
  currentStage: string;
  progress: number; // 进度百分比
  startDate: string;
  expectedSubmitDate: string;
  teamMembers: string[];
  milestones: Milestone[];
}

/**
 * 里程碑节点
 */
export interface Milestone {
  id: string;
  name: string;
  date: string;
  completed: boolean;
  description?: string;
}

/**
 * 发行信息
 */
export interface IssuanceInfo {
  id: string;
  bondId: string;
  bondName: string;
  issueMethod: string; // 发行方式
  bookbuildingDate?: string; // 簿记建档日
  paymentDeadline: string; // 缴款截止日
  listingLocation: string; // 上市地点
  subscriptionMultiple?: number; // 认购倍数
  allocatedAmount: number; // 已配售金额
  totalSubscriptions: number; // 总认购金额
  status: 'preparing' | 'bookbuilding' | 'allocating' | 'completed';
  statusName: string;
}

/**
 * 存续期债券信息
 */
export interface DurationBond extends Bond {
  nextInterestDate: string; // 下一付息日
  remainingDays: number; // 剩余天数
  interestPaid: number; // 已付息期数
  totalInterests: number; // 总付息期数
  nextInterestAmount: number; // 下次付息金额（万元）
}

/**
 * 付息兑付记录
 */
export interface InterestPayment {
  id: string;
  bondId: string;
  bondName: string;
  paymentDate: string;
  paymentType: 'interest' | 'principal'; // 付息或兑付本金
  paymentAmount: number; // 金额（万元）
  status: 'pending' | 'paid' | 'overdue';
  statusName: string;
  remark?: string;
}

/**
 * 信息披露记录
 */
export interface DisclosureRecord {
  id: string;
  bondId: string;
  title: string;
  type: 'periodic' | 'temporary' | 'other';
  typeName: string;
  publishDate: string;
  fileUrl?: string;
}
