// 募集资金模块mock数据
import type {
  SpecialAccount,
  FundUsagePlan,
  FundUseRecord,
  FundChangeRequest,
  FundOverview,
  FundPurposeType
} from '../types/fund';

// 资金用途类型名称映射
const purposeTypeNames: Record<FundPurposeType, string> = {
  project: '项目建设',
  repay_debt: '偿还借款',
  supplement_liquidity: '补充流动资金',
  merge_acquisition: '并购重组',
  other: '其他'
};

// 募集资金专户信息
export const mockSpecialAccounts: SpecialAccount[] = [
  {
    id: 'account_001',
    bondId: 'bond_001',
    bankName: '中国工商银行华鑫支行',
    accountNumber: '6222 0212 **** 8899',
    balance: 86500,
    lastUpdateDate: '2025-06-15'
  },
  {
    id: 'account_002',
    bondId: 'bond_002',
    bankName: '中国建设银行明泰支行',
    accountNumber: '6227 0025 **** 3344',
    balance: 42800,
    lastUpdateDate: '2025-06-18'
  },
  {
    id: 'account_003',
    bondId: 'bond_005',
    bankName: '中国银行江湾支行',
    accountNumber: '6217 8536 **** 7788',
    balance: 95000,
    lastUpdateDate: '2025-06-10'
  },
  {
    id: 'account_004',
    bondId: 'bond_007',
    bankName: '招商银行交通支行',
    accountNumber: '6226 0987 **** 2233',
    balance: 185625,
    lastUpdateDate: '2025-06-20'
  },
  {
    id: 'account_005',
    bondId: 'bond_008',
    bankName: '兴业银行科创支行',
    accountNumber: '6229 0864 **** 5566',
    balance: 60000,
    lastUpdateDate: '2026-03-05'
  },
  {
    id: 'account_006',
    bondId: 'bond_009',
    bankName: '中信证券股份有限公司',
    accountNumber: '7000 1234 **** 9900',
    balance: 98600,
    lastUpdateDate: '2025-06-12'
  }
];

// 资金使用计划
export const mockFundUsagePlans: FundUsagePlan[] = [
  {
    id: 'plan_001',
    bondId: 'bond_001',
    bondName: '24华鑫城投债01',
    projectName: '城东新区基础设施建设项目',
    purposeType: 'project',
    purposeTypeName: purposeTypeNames.project,
    plannedAmount: 120000,
    usedAmount: 85000,
    remainingAmount: 35000,
    progressPercent: 71
  },
  {
    id: 'plan_002',
    bondId: 'bond_001',
    bondName: '24华鑫城投债01',
    projectName: '偿还银行借款',
    purposeType: 'repay_debt',
    purposeTypeName: purposeTypeNames.repay_debt,
    plannedAmount: 60000,
    usedAmount: 28500,
    remainingAmount: 31500,
    progressPercent: 48
  },
  {
    id: 'plan_003',
    bondId: 'bond_001',
    bondName: '24华鑫城投债01',
    projectName: '补充营运资金',
    purposeType: 'supplement_liquidity',
    purposeTypeName: purposeTypeNames.supplement_liquidity,
    plannedAmount: 20000,
    usedAmount: 0,
    remainingAmount: 20000,
    progressPercent: 0
  },
  {
    id: 'plan_004',
    bondId: 'bond_002',
    bondName: '25明泰新能债01',
    projectName: '锂电池生产线扩建项目',
    purposeType: 'project',
    purposeTypeName: purposeTypeNames.project,
    plannedAmount: 60000,
    usedAmount: 38200,
    remainingAmount: 21800,
    progressPercent: 64
  },
  {
    id: 'plan_005',
    bondId: 'bond_002',
    bondName: '25明泰新能债01',
    projectName: '补充流动资金',
    purposeType: 'supplement_liquidity',
    purposeTypeName: purposeTypeNames.supplement_liquidity,
    plannedAmount: 40000,
    usedAmount: 19000,
    remainingAmount: 21000,
    progressPercent: 48
  },
  {
    id: 'plan_006',
    bondId: 'bond_005',
    bondName: '24华鑫城投债02',
    projectName: '城市轨道交通配套项目',
    purposeType: 'project',
    purposeTypeName: purposeTypeNames.project,
    plannedAmount: 80000,
    usedAmount: 25000,
    remainingAmount: 55000,
    progressPercent: 31
  },
  {
    id: 'plan_007',
    bondId: 'bond_005',
    bondName: '24华鑫城投债02',
    projectName: '偿还存量债务',
    purposeType: 'repay_debt',
    purposeTypeName: purposeTypeNames.repay_debt,
    plannedAmount: 40000,
    usedAmount: 0,
    remainingAmount: 40000,
    progressPercent: 0
  },
  {
    id: 'plan_008',
    bondId: 'bond_007',
    bondName: '24江湾金融债01',
    projectName: '高速公路改扩建工程',
    purposeType: 'project',
    purposeTypeName: purposeTypeNames.project,
    plannedAmount: 180000,
    usedAmount: 64375,
    remainingAmount: 115625,
    progressPercent: 36
  },
  {
    id: 'plan_009',
    bondId: 'bond_007',
    bondName: '24江湾金融债01',
    projectName: '补充流动资金',
    purposeType: 'supplement_liquidity',
    purposeTypeName: purposeTypeNames.supplement_liquidity,
    plannedAmount: 70000,
    usedAmount: 0,
    remainingAmount: 70000,
    progressPercent: 0
  },
  {
    id: 'plan_010',
    bondId: 'bond_008',
    bondName: '26科创绿色债01',
    projectName: '智能工厂绿色改造项目',
    purposeType: 'project',
    purposeTypeName: purposeTypeNames.project,
    plannedAmount: 60000,
    usedAmount: 0,
    remainingAmount: 60000,
    progressPercent: 0
  },
  {
    id: 'plan_011',
    bondId: 'bond_009',
    bondName: '23华鑫城投债03',
    projectName: '保障性住房建设项目',
    purposeType: 'project',
    purposeTypeName: purposeTypeNames.project,
    plannedAmount: 100000,
    usedAmount: 72400,
    remainingAmount: 27600,
    progressPercent: 72
  },
  {
    id: 'plan_012',
    bondId: 'bond_009',
    bondName: '23华鑫城投债03',
    projectName: '偿还金融机构借款',
    purposeType: 'repay_debt',
    purposeTypeName: purposeTypeNames.repay_debt,
    plannedAmount: 80000,
    usedAmount: 9000,
    remainingAmount: 71000,
    progressPercent: 11
  }
];

// 资金使用台账记录
export const mockFundUseRecords: FundUseRecord[] = [
  {
    id: 'record_001',
    bondId: 'bond_001',
    bondName: '24华鑫城投债01',
    usagePlanId: 'plan_001',
    projectName: '城东新区基础设施建设项目',
    useDate: '2024-05-20',
    amount: 25000,
    payee: '华鑫建筑工程集团有限公司',
    bankAccount: '6222 0212 0000 1234',
    purpose: '支付城东新区道路工程进度款',
    voucherNumber: 'PZ-2024-05001',
    operator: '张会计',
    auditor: '李财务总监',
    status: 'approved',
    statusName: '已审核'
  },
  {
    id: 'record_002',
    bondId: 'bond_001',
    bondName: '24华鑫城投债01',
    usagePlanId: 'plan_001',
    projectName: '城东新区基础设施建设项目',
    useDate: '2024-08-15',
    amount: 35000,
    payee: '江湾市政工程有限公司',
    bankAccount: '6227 0025 0000 5678',
    purpose: '支付给排水管网建设费用',
    voucherNumber: 'PZ-2024-08002',
    operator: '张会计',
    auditor: '李财务总监',
    status: 'approved',
    statusName: '已审核'
  },
  {
    id: 'record_003',
    bondId: 'bond_001',
    bondName: '24华鑫城投债01',
    usagePlanId: 'plan_001',
    projectName: '城东新区基础设施建设项目',
    useDate: '2024-11-30',
    amount: 25000,
    payee: '华鑫建设监理有限公司',
    bankAccount: '6217 8536 0000 9012',
    purpose: '支付项目监理费及部分工程款',
    voucherNumber: 'PZ-2024-11003',
    operator: '张会计',
    auditor: '李财务总监',
    status: 'approved',
    statusName: '已审核'
  },
  {
    id: 'record_004',
    bondId: 'bond_001',
    bondName: '24华鑫城投债01',
    usagePlanId: 'plan_002',
    projectName: '偿还银行借款',
    useDate: '2025-01-10',
    amount: 28500,
    payee: '中国工商银行华鑫支行',
    bankAccount: '6222 0212 9999 0001',
    purpose: '偿还2022年工行流动资金贷款',
    voucherNumber: 'PZ-2025-01001',
    operator: '张会计',
    auditor: '李财务总监',
    status: 'approved',
    statusName: '已审核'
  },
  {
    id: 'record_005',
    bondId: 'bond_002',
    bondName: '25明泰新能债01',
    usagePlanId: 'plan_004',
    projectName: '锂电池生产线扩建项目',
    useDate: '2025-03-05',
    amount: 18200,
    payee: '德恩机械设备制造有限公司',
    bankAccount: '6226 0987 0000 3456',
    purpose: '支付锂电池生产设备采购款',
    voucherNumber: 'PZ-2025-03001',
    operator: '王出纳',
    auditor: '陈财务经理',
    status: 'approved',
    statusName: '已审核'
  },
  {
    id: 'record_006',
    bondId: 'bond_002',
    bondName: '25明泰新能债01',
    usagePlanId: 'plan_004',
    projectName: '锂电池生产线扩建项目',
    useDate: '2025-05-18',
    amount: 20000,
    payee: '江湾第二建筑工程公司',
    bankAccount: '6229 0864 0000 7890',
    purpose: '支付车间厂房建设工程款',
    voucherNumber: 'PZ-2025-05002',
    operator: '王出纳',
    status: 'pending',
    statusName: '待审核'
  },
  {
    id: 'record_007',
    bondId: 'bond_002',
    bondName: '25明泰新能债01',
    usagePlanId: 'plan_005',
    projectName: '补充流动资金',
    useDate: '2025-04-22',
    amount: 19000,
    payee: '明泰新能源原材料供应商',
    bankAccount: '6227 0025 0000 4321',
    purpose: '支付正负极材料采购货款',
    voucherNumber: 'PZ-2025-04003',
    operator: '王出纳',
    auditor: '陈财务经理',
    status: 'approved',
    statusName: '已审核'
  },
  {
    id: 'record_008',
    bondId: 'bond_005',
    bondName: '24华鑫城投债02',
    usagePlanId: 'plan_006',
    projectName: '城市轨道交通配套项目',
    useDate: '2025-02-28',
    amount: 25000,
    payee: '江湾地铁集团有限公司',
    bankAccount: '6217 8536 0000 8888',
    purpose: '轨道交通3号线站点配套设施建设款',
    voucherNumber: 'PZ-2025-02001',
    operator: '张会计',
    auditor: '李财务总监',
    status: 'approved',
    statusName: '已审核'
  },
  {
    id: 'record_009',
    bondId: 'bond_007',
    bondName: '24江湾金融债01',
    usagePlanId: 'plan_008',
    projectName: '高速公路改扩建工程',
    useDate: '2025-03-15',
    amount: 64375,
    payee: '江湾交通建设集团',
    bankAccount: '6226 0987 0000 5555',
    purpose: '沪昆高速江湾段改扩建工程一期款',
    voucherNumber: 'PZ-2025-03002',
    operator: '刘财务',
    auditor: '赵总会计师',
    status: 'approved',
    statusName: '已审核'
  },
  {
    id: 'record_010',
    bondId: 'bond_009',
    bondName: '23华鑫城投债03',
    usagePlanId: 'plan_011',
    projectName: '保障性住房建设项目',
    useDate: '2024-06-10',
    amount: 42400,
    payee: '华鑫安居工程建设公司',
    bankAccount: '6222 0212 0000 7777',
    purpose: '惠民花园保障房项目主体工程款',
    voucherNumber: 'PZ-2024-06001',
    operator: '张会计',
    auditor: '李财务总监',
    status: 'approved',
    statusName: '已审核'
  },
  {
    id: 'record_011',
    bondId: 'bond_009',
    bondName: '23华鑫城投债03',
    usagePlanId: 'plan_011',
    projectName: '保障性住房建设项目',
    useDate: '2024-12-05',
    amount: 30000,
    payee: '江湾建材集团有限公司',
    bankAccount: '6227 0025 0000 6666',
    purpose: '支付保障房项目建材采购款',
    voucherNumber: 'PZ-2024-12002',
    operator: '张会计',
    auditor: '李财务总监',
    status: 'approved',
    statusName: '已审核'
  },
  {
    id: 'record_012',
    bondId: 'bond_009',
    bondName: '23华鑫城投债03',
    usagePlanId: 'plan_012',
    projectName: '偿还金融机构借款',
    useDate: '2025-05-08',
    amount: 9000,
    payee: '国家开发银行江湾分行',
    bankAccount: '6217 8536 9999 0002',
    purpose: '偿还国开行2021年中长期贷款利息',
    voucherNumber: 'PZ-2025-05004',
    operator: '张会计',
    status: 'rejected',
    statusName: '已驳回',
    remark: '缺少还款凭证附件'
  }
];

// 用途变更申请
export const mockFundChangeRequests: FundChangeRequest[] = [
  {
    id: 'change_001',
    bondId: 'bond_001',
    bondName: '24华鑫城投债01',
    originalPurpose: '城东新区基础设施建设项目',
    newPurpose: '补充流动资金',
    changeAmount: 15000,
    reason: '因项目进度调整，原计划用于基础设施建设的部分资金暂时闲置，为提高资金使用效率，拟将该部分资金临时用于补充公司流动资金，待项目需要时再行调配。',
    applyDate: '2025-04-12',
    applicant: '张会计',
    status: 'approved',
    statusName: '已通过',
    approvalDate: '2025-04-25',
    approver: '李财务总监',
    approvalOpinion: '同意本次用途变更，请严格按照募集资金管理规定执行，确保资金安全。'
  },
  {
    id: 'change_002',
    bondId: 'bond_002',
    bondName: '25明泰新能债01',
    originalPurpose: '锂电池生产线扩建项目',
    newPurpose: '偿还银行借款',
    changeAmount: 8000,
    reason: '受市场环境影响，锂电池生产线扩建项目一期工程进度延后，预计设备采购时间推迟3个月。为降低财务费用，优化债务结构，申请将部分闲置募集资金用于偿还即将到期的银行流动资金借款。',
    applyDate: '2025-05-20',
    applicant: '王出纳',
    status: 'pending',
    statusName: '审批中'
  },
  {
    id: 'change_003',
    bondId: 'bond_009',
    bondName: '23华鑫城投债03',
    originalPurpose: '偿还金融机构借款',
    newPurpose: '保障性住房建设项目',
    changeAmount: 20000,
    reason: '由于保障性住房建设项目惠民花园二期工程进度加快，资金需求超出原计划。同时，公司通过其他资金来源已安排偿还部分金融机构借款，因此拟调整部分募集资金用途，优先保障民生工程项目建设。',
    applyDate: '2025-06-01',
    applicant: '张会计',
    status: 'rejected',
    statusName: '已驳回',
    approvalDate: '2025-06-10',
    approver: '债券持有人会议',
    approvalOpinion: '鉴于本次变更金额较大，且涉及用途性质变化，需进一步补充项目资金需求测算依据，并召开债券持有人会议审议。'
  },
  {
    id: 'change_004',
    bondId: 'bond_007',
    bondName: '24江湾金融债01',
    originalPurpose: '补充流动资金',
    newPurpose: '高速公路改扩建工程',
    changeAmount: 30000,
    reason: '高速公路改扩建工程进展顺利，为抢抓施工黄金期，确保工程按期通车，需提前支付部分材料采购款和工程进度款。经测算，原计划用于补充流动资金的部分资金可调整用于项目建设。',
    applyDate: '2025-06-08',
    applicant: '刘财务',
    status: 'pending',
    statusName: '审批中'
  }
];

// 资金总览数据
export const mockFundOverviewList: FundOverview[] = [
  {
    bondId: 'bond_001',
    bondName: '24华鑫城投债01',
    totalRaised: 200000,
    totalUsed: 113500,
    totalRemaining: 86500,
    accountBalance: 86500,
    purposeDistribution: [
      { name: '城东新区基础设施建设', value: 85000 },
      { name: '偿还银行借款', value: 28500 },
      { name: '补充流动资金', value: 0 }
    ]
  },
  {
    bondId: 'bond_002',
    bondName: '25明泰新能债01',
    totalRaised: 100000,
    totalUsed: 57200,
    totalRemaining: 42800,
    accountBalance: 42800,
    purposeDistribution: [
      { name: '锂电池生产线扩建', value: 38200 },
      { name: '补充流动资金', value: 19000 }
    ]
  },
  {
    bondId: 'bond_005',
    bondName: '24华鑫城投债02',
    totalRaised: 120000,
    totalUsed: 25000,
    totalRemaining: 95000,
    accountBalance: 95000,
    purposeDistribution: [
      { name: '城市轨道交通配套项目', value: 25000 },
      { name: '偿还存量债务', value: 0 }
    ]
  },
  {
    bondId: 'bond_007',
    bondName: '24江湾金融债01',
    totalRaised: 250000,
    totalUsed: 64375,
    totalRemaining: 185625,
    accountBalance: 185625,
    purposeDistribution: [
      { name: '高速公路改扩建工程', value: 64375 },
      { name: '补充流动资金', value: 0 }
    ]
  },
  {
    bondId: 'bond_008',
    bondName: '26科创绿色债01',
    totalRaised: 60000,
    totalUsed: 0,
    totalRemaining: 60000,
    accountBalance: 60000,
    purposeDistribution: [
      { name: '智能工厂绿色改造项目', value: 0 }
    ]
  },
  {
    bondId: 'bond_009',
    bondName: '23华鑫城投债03',
    totalRaised: 180000,
    totalUsed: 81400,
    totalRemaining: 98600,
    accountBalance: 98600,
    purposeDistribution: [
      { name: '保障性住房建设', value: 72400 },
      { name: '偿还金融机构借款', value: 9000 }
    ]
  }
];
