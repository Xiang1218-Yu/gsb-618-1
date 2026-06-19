/**
 * 债券状态枚举
 */
export enum BondStatus {
  /** 承销立项 */
  Underwriting = 'underwriting',
  /** 发行审批中 */
  Approving = 'approving',
  /** 发行中 */
  Issuing = 'issuing',
  /** 已上市 */
  Listed = 'listed',
  /** 存续期 */
  Duration = 'duration',
  /** 已兑付 */
  Redeemed = 'redeemed',
  /** 违约 */
  Default = 'default',
}

/**
 * 风险等级枚举
 */
export enum RiskLevel {
  /** 高风险 */
  High = 'high',
  /** 中风险 */
  Medium = 'medium',
  /** 低风险 */
  Low = 'low',
  /** 正常 */
  Normal = 'normal',
}

/**
 * 舆情情感倾向
 */
export enum SentimentType {
  /** 正面 */
  Positive = 'positive',
  /** 中性 */
  Neutral = 'neutral',
  /** 负面 */
  Negative = 'negative',
}

/**
 * 债券类型枚举
 */
export enum BondType {
  /** 公司债 */
  Corporate = 'corporate',
  /** 企业债 */
  Enterprise = 'enterprise',
  /** 中期票据 */
  MTN = 'mtn',
  /** 短期融资券 */
  CP = 'cp',
  /** 定向工具 */
  PPN = 'ppn',
  /** 金融债 */
  Financial = 'financial',
}

/**
 * 资金用途类型
 */
export enum FundUsageType {
  /** 偿还银行贷款 */
  RepayLoan = 'repay_loan',
  /** 补充流动资金 */
  WorkingCapital = 'working_capital',
  /** 项目投资 */
  ProjectInvest = 'project_invest',
  /** 并购重组 */
  MAndA = 'm_and_a',
  /** 其他 */
  Other = 'other',
}

/**
 * 发行人信息接口
 */
export interface Issuer {
  /** 发行人ID */
  id: string;
  /** 发行人名称 */
  issuerName: string;
  /** 所属行业 */
  industry: string;
  /** 主体信用评级 */
  creditRating: string;
  /** 注册地址 */
  registeredAddress?: string;
  /** 法人代表 */
  legalRepresentative?: string;
}

/**
 * 债券信息接口
 */
export interface Bond {
  /** 债券ID */
  id: string;
  /** 债券名称 */
  bondName: string;
  /** 债券代码 */
  bondCode: string;
  /** 发行人ID */
  issuerId: string;
  /** 发行人信息 */
  issuer?: Issuer;
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
  /** 债券期限（年） */
  termYears: number;
  /** 债券状态 */
  status: BondStatus;
  /** 评级展望 */
  ratingOutlook?: string;
  /** 受托管理人 */
  trustee?: string;
  /** 创建时间 */
  createdAt: string;
}

/**
 * 募集资金流水接口
 */
export interface FundFlow {
  /** 流水ID */
  id: string;
  /** 关联债券ID */
  bondId: string;
  /** 金额（万元） */
  amount: number;
  /** 用途说明 */
  purpose: string;
  /** 用途类型 */
  usageType: FundUsageType;
  /** 拨付日期 */
  payDate: string;
  /** 收款账户 */
  account: string;
  /** 是否合规 */
  isCompliant: boolean;
  /** 备注 */
  remark?: string;
}

/**
 * 资金到账信息接口
 */
export interface FundReceived {
  /** ID */
  id: string;
  /** 关联债券ID */
  bondId: string;
  /** 到账金额（亿元） */
  receivedAmount: number;
  /** 到账日期 */
  receivedDate: string;
  /** 监管银行 */
  custodianBank: string;
  /** 监管账户 */
  custodianAccount: string;
  /** 三方监管协议签署状态 */
  agreementSigned: boolean;
}

/**
 * 财务指标接口
 */
export interface FinancialIndex {
  /** 指标ID */
  id: string;
  /** 关联债券ID */
  bondId: string;
  /** 指标名称 */
  indexName: string;
  /** 指标值 */
  value: number;
  /** 单位 */
  unit: string;
  /** 预警阈值 */
  warningThreshold: number;
  /** 处置阈值 */
  criticalThreshold: number;
  /** 报告期 */
  period: string;
  /** 指标状态 */
  status: RiskLevel;
  /** 报告日期 */
  reportDate: string;
  /** 是否优于阈值 */
  isBetter: boolean;
}

/**
 * 舆情信息接口
 */
export interface Sentiment {
  /** 舆情ID */
  id: string;
  /** 关联债券ID */
  bondId: string;
  /** 标题 */
  title: string;
  /** 内容摘要 */
  summary: string;
  /** 来源 */
  source: string;
  /** 情感倾向 */
  sentiment: SentimentType;
  /** 发布日期 */
  publishDate: string;
  /** 关键词 */
  keywords: string[];
  /** 热度值 */
  heat: number;
  /** 原文链接 */
  url?: string;
}

/**
 * 付息兑付事项接口
 */
export interface Payment {
  /** 事项ID */
  id: string;
  /** 关联债券ID */
  bondId: string;
  /** 事项类型 */
  paymentType: 'interest' | 'principal' | 'call' | 'put';
  /** 金额（万元） */
  amount: number;
  /** 付息/兑付日期 */
  payDate: string;
  /** 状态 */
  status: 'pending' | 'processing' | 'completed' | 'overdue' | 'upcoming';
  /** 备注 */
  remark?: string;
}

/**
 * 信息披露事项接口
 */
export interface Disclosure {
  /** 披露ID */
  id: string;
  /** 关联债券ID */
  bondId: string;
  /** 披露类型 */
  disclosureType: 'annual' | 'semi_annual' | 'quarterly' | 'temporary' | 'rating' | 'other';
  /** 标题 */
  title: string;
  /** 截止日期 */
  deadlineDate: string;
  /** 披露日期 */
  disclosureDate?: string;
  /** 状态 */
  status: 'pending' | 'upcoming' | 'disclosed' | 'overdue';
}

/**
 * 合规检查项接口
 */
export interface ComplianceCheck {
  /** 检查项ID */
  id: string;
  /** 关联债券ID */
  bondId: string;
  /** 检查项名称 */
  checkItem: string;
  /** 检查类别 */
  category: string;
  /** 是否合规 */
  isCompliant: boolean;
  /** 检查日期 */
  checkDate: string;
  /** 问题描述 */
  issueDescription?: string;
  /** 整改状态 */
  rectificationStatus?: 'none' | 'pending' | 'completed';
}

/**
 * 风险预警接口
 */
export interface RiskAlert {
  /** 预警ID */
  id: string;
  /** 关联债券ID */
  bondId: string;
  /** 债券名称 */
  bondName?: string;
  /** 预警类型 */
  alertType: 'financial' | 'sentiment' | 'fund' | 'disclosure' | 'payment';
  /** 预警标题 */
  title: string;
  /** 预警描述 */
  description: string;
  /** 风险等级 */
  riskLevel: RiskLevel;
  /** 触发时间 */
  triggerTime: string;
  /** 处理状态 */
  handleStatus: 'pending' | 'processing' | 'resolved' | 'ignored';
  /** 处理人 */
  handler?: string;
  /** 处理意见 */
  handleRemark?: string;
}

/**
 * 待办事项接口
 */
export interface TodoItem {
  /** 待办ID */
  id: string;
  /** 标题 */
  title: string;
  /** 关联债券ID */
  bondId?: string;
  /** 债券名称 */
  bondName?: string;
  /** 待办类型 */
  todoType: 'approval' | 'disclosure' | 'reply' | 'review';
  /** 优先级 */
  priority: 'high' | 'medium' | 'low';
  /** 截止日期 */
  deadline: string;
  /** 状态 */
  status: 'pending' | 'done';
}

/**
 * 工作台统计数据接口
 */
export interface DashboardStats {
  /** 在管债券数量 */
  totalBonds: number;
  /** 募集资金总额（亿元） */
  totalFunds: number;
  /** 已使用资金（亿元） */
  usedFunds: number;
  /** 预警总数 */
  alertCount: number;
  /** 高风险预警数 */
  highRiskCount: number;
  /** 本月到期兑付数 */
  thisMonthMaturity: number;
  /** 待办事项数 */
  todoCount: number;
}

/**
 * 违约处置进展步骤接口
 */
export interface DefaultProgressStep {
  /** 步骤名称 */
  step: string;
  /** 日期 */
  date: string;
  /** 状态 */
  status: 'completed' | 'processing' | 'pending';
  /** 描述 */
  desc: string;
}

/**
 * 可生成报告模板接口
 */
export interface ReportTemplate {
  /** 报告ID */
  id: string;
  /** 报告标题 */
  title: string;
  /** 报告描述 */
  description: string;
  /** 图标名称 */
  iconType: 'filecheck' | 'chart' | 'filetext' | 'warning';
}

/**
 * 监管报送事项接口
 */
export interface RegulatorySubmission {
  /** 报送事项ID */
  id: string;
  /** 关联债券ID */
  bondId: string;
  /** 报送事项名称 */
  item: string;
  /** 报送截止日 */
  deadline: string;
  /** 报送日期 */
  submittedDate?: string;
  /** 报送状态 */
  status: 'submitted' | 'pending';
}

/**
 * 系统通知消息接口
 */
export interface SystemNotification {
  /** 消息ID */
  id: string;
  /** 消息标题 */
  title: string;
  /** 消息内容 */
  content: string;
  /** 时间 */
  time: string;
  /** 级别 */
  level: 'high' | 'medium' | 'low';
  /** 是否已读 */
  read: boolean;
}
