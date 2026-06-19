// 募集资金相关类型定义

/**
 * 募集资金用途类型
 */
export type FundPurposeType =
  | 'project' // 项目建设
  | 'repay_debt' // 偿还借款
  | 'supplement_liquidity' // 补充流动资金
  | 'merge_acquisition' // 并购重组
  | 'other'; // 其他

/**
 * 募集资金专户
 */
export interface SpecialAccount {
  id: string;
  bondId: string;
  bankName: string;
  accountNumber: string;
  balance: number; // 账户余额（万元）
  lastUpdateDate: string;
}

/**
 * 募集资金使用计划
 */
export interface FundUsagePlan {
  id: string;
  bondId: string;
  bondName: string;
  projectName: string;
  purposeType: FundPurposeType;
  purposeTypeName: string;
  plannedAmount: number; // 计划使用金额（万元）
  usedAmount: number; // 已使用金额（万元）
  remainingAmount: number; // 剩余金额
  progressPercent: number; // 使用进度
}

/**
 * 资金使用台账记录
 */
export interface FundUseRecord {
  id: string;
  bondId: string;
  bondName: string;
  usagePlanId: string;
  projectName: string;
  useDate: string;
  amount: number; // 使用金额（万元）
  payee: string; // 收款方
  bankAccount: string;
  purpose: string; // 具体用途说明
  voucherNumber?: string; // 凭证号
  operator: string; // 经办人
  auditor?: string; // 审核人
  status: 'pending' | 'approved' | 'rejected';
  statusName: string;
  remark?: string; // 备注
}

/**
 * 募集资金用途变更申请
 */
export interface FundChangeRequest {
  id: string;
  bondId: string;
  bondName: string;
  originalPurpose: string;
  newPurpose: string;
  changeAmount: number;
  reason: string;
  applyDate: string;
  applicant: string;
  status: 'pending' | 'approved' | 'rejected';
  statusName: string;
  approvalDate?: string;
  approver?: string;
  approvalOpinion?: string;
}

/**
 * 募集资金总览数据
 */
export interface FundOverview {
  bondId: string;
  bondName: string;
  totalRaised: number; // 募集总额（万元）
  totalUsed: number; // 累计使用（万元）
  totalRemaining: number; // 剩余金额（万元）
  accountBalance: number; // 专户余额（万元）
  purposeDistribution: {
    name: string;
    value: number;
  }[];
}
