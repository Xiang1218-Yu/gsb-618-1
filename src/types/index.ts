// 债券项目接口定义
export interface BondProject {
  id: string;                    // 项目ID
  projectName: string;           // 项目名称
  issuerName: string;            // 发行人名称
  bondType: string;              // 债券类型
  issueScale: number;            // 发行规模（亿元）
  status: 'pending' | 'approving' | 'issuing' | 'listed' | 'managing'; // 项目状态
  currentStage: string;          // 当前阶段
  progress: number;              // 进度百分比
  startDate: string;             // 立项日期
  expectedIssueDate: string;     // 预计发行日期
  teamMembers: string[];         // 项目成员
  riskLevel: 'low' | 'medium' | 'high'; // 风险等级
}

// 存续期债券接口定义
export interface DurationBond {
  id: string;                    // 债券ID
  bondCode: string;              // 债券代码
  bondName: string;              // 债券简称
  issuerName: string;            // 发行人
  issueAmount: number;           // 发行规模（亿元）
  couponRate: number;            // 票面利率
  issueDate: string;             // 发行日期
  maturityDate: string;          // 到期日期
  nextPaymentDate: string;       // 下次付息日
  status: 'normal' | 'warning' | 'default'; // 状态
  trustee: string;               // 受托管理人
}

// 资金流水接口定义
export interface FundFlow {
  id: string;                    // 流水ID
  date: string;                  // 日期
  amount: number;                // 金额
  usageDescription: string;      // 使用说明
  approver: string;              // 审批人
  approvalStatus: 'pending' | 'approved' | 'rejected'; // 审批状态
  isCompliant: boolean;          // 是否合规
}

// 募集资金接口定义
export interface FundRecord {
  id: string;                    // 记录ID
  bondId: string;                // 关联债券ID
  bondName: string;              // 债券名称
  totalAmount: number;           // 总募集金额
  usedAmount: number;            // 已使用金额
  remainingAmount: number;       // 剩余金额
  purpose: string;               // 约定用途
  fundFlows: FundFlow[];         // 资金流水记录
  complianceStatus: 'normal' | 'warning' | 'abnormal'; // 合规状态
}

// 财务指标接口定义
export interface FinancialIndicator {
  id: string;                    // 指标ID
  bondId: string;                // 关联债券ID
  bondName: string;              // 债券名称
  indicatorName: string;         // 指标名称
  currentValue: number;          // 当前值
  threshold: {                   // 阈值配置
    warning: number;
    danger: number;
  };
  unit: string;                  // 单位
  trend: 'up' | 'down' | 'stable'; // 趋势
  historyData: { date: string; value: number }[]; // 历史数据
  status: 'normal' | 'warning' | 'danger'; // 状态
}

// 舆情信息接口定义
export interface SentimentNews {
  id: string;                    // 舆情ID
  title: string;                 // 标题
  source: string;                // 来源
  publishDate: string;           // 发布时间
  sentiment: 'positive' | 'neutral' | 'negative'; // 情感倾向
  riskLevel: 'low' | 'medium' | 'high'; // 风险等级
  relatedIssuer: string;         // 关联发行人
  summary: string;               // 摘要
  keywords: string[];            // 关键词
  isHandled: boolean;            // 是否已处理
}

// 预警信息接口定义
export interface AlertItem {
  id: string;                    // 预警ID
  type: 'financial' | 'sentiment' | 'fund' | 'compliance'; // 预警类型
  level: 'low' | 'medium' | 'high'; // 预警等级
  title: string;                 // 预警标题
  description: string;           // 预警描述
  relatedBond: string;           // 关联债券
  createTime: string;            // 创建时间
  isHandled: boolean;            // 是否已处理
  handler?: string;              // 处理人
}

// 合规报告接口定义
export interface ComplianceReport {
  id: string;                    // 报告ID
  reportName: string;            // 报告名称
  reportType: 'regular' | 'temporary' | 'special'; // 报告类型
  bondName: string;              // 关联债券
  reportPeriod: string;          // 报告期间
  createDate: string;            // 创建日期
  status: 'draft' | 'submitted' | 'published'; // 状态
}

// 统计卡片数据接口
export interface StatCardData {
  title: string;                 // 标题
  value: string | number;        // 数值
  unit?: string;                 // 单位
  icon: string;                  // 图标名称
  trend?: 'up' | 'down' | 'stable'; // 趋势
  trendValue?: string;           // 趋势值
  color: 'blue' | 'green' | 'amber' | 'red'; // 颜色
}
