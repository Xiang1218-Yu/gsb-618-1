import type {
  BondProject,
  DurationBond,
  FundRecord,
  FundFlow,
  FinancialIndicator,
  SentimentNews,
  AlertItem,
  ComplianceReport,
  StatCardData
} from '../types';

// 承销发行项目模拟数据
export const mockBondProjects: BondProject[] = [
  {
    id: 'proj-001',
    projectName: '2024年第一期公司债',
    issuerName: '华信科技集团有限公司',
    bondType: '公司债',
    issueScale: 15,
    status: 'issuing',
    currentStage: '簿记建档',
    progress: 75,
    startDate: '2024-01-15',
    expectedIssueDate: '2024-03-20',
    teamMembers: ['张明', '李华', '王芳'],
    riskLevel: 'low'
  },
  {
    id: 'proj-002',
    projectName: '2024年第二期中期票据',
    issuerName: '盛达实业股份有限公司',
    bondType: '中期票据',
    issueScale: 20,
    status: 'approving',
    currentStage: '注册审核',
    progress: 45,
    startDate: '2024-02-01',
    expectedIssueDate: '2024-04-15',
    teamMembers: ['刘强', '陈静'],
    riskLevel: 'medium'
  },
  {
    id: 'proj-003',
    projectName: '2024年绿色金融债',
    issuerName: '绿源环保科技有限公司',
    bondType: '金融债',
    issueScale: 10,
    status: 'listed',
    currentStage: '已上市',
    progress: 100,
    startDate: '2023-11-20',
    expectedIssueDate: '2024-02-28',
    teamMembers: ['赵伟', '孙丽', '周杰', '吴敏'],
    riskLevel: 'low'
  },
  {
    id: 'proj-004',
    projectName: '2024年短期融资券',
    issuerName: '恒通物流集团',
    bondType: '短融',
    issueScale: 8,
    status: 'pending',
    currentStage: '立项准备',
    progress: 15,
    startDate: '2024-03-01',
    expectedIssueDate: '2024-05-10',
    teamMembers: ['郑涛'],
    riskLevel: 'low'
  },
  {
    id: 'proj-005',
    projectName: '2024年企业债',
    issuerName: '城市建设投资集团',
    bondType: '企业债',
    issueScale: 25,
    status: 'managing',
    currentStage: '存续期管理',
    progress: 100,
    startDate: '2023-09-10',
    expectedIssueDate: '2024-01-15',
    teamMembers: ['马超', '黄蕾', '徐明'],
    riskLevel: 'high'
  }
];

// 存续期债券模拟数据
export const mockDurationBonds: DurationBond[] = [
  {
    id: 'bond-001',
    bondCode: '24华信01',
    bondName: '24华信科技债01',
    issuerName: '华信科技集团有限公司',
    issueAmount: 15,
    couponRate: 3.85,
    issueDate: '2024-01-20',
    maturityDate: '2027-01-20',
    nextPaymentDate: '2024-07-20',
    status: 'normal',
    trustee: '中信建投证券'
  },
  {
    id: 'bond-002',
    bondCode: '23盛达02',
    bondName: '23盛达实业MTN002',
    issuerName: '盛达实业股份有限公司',
    issueAmount: 20,
    couponRate: 4.25,
    issueDate: '2023-08-15',
    maturityDate: '2026-08-15',
    nextPaymentDate: '2024-08-15',
    status: 'warning',
    trustee: '国泰君安证券'
  },
  {
    id: 'bond-003',
    bondCode: '24绿源01',
    bondName: '24绿源环保绿色债',
    issuerName: '绿源环保科技有限公司',
    issueAmount: 10,
    couponRate: 3.45,
    issueDate: '2024-02-28',
    maturityDate: '2029-02-28',
    nextPaymentDate: '2025-02-28',
    status: 'normal',
    trustee: '中金公司'
  },
  {
    id: 'bond-004',
    bondCode: '23城建01',
    bondName: '23城投集团企业债',
    issuerName: '城市建设投资集团',
    issueAmount: 25,
    couponRate: 4.55,
    issueDate: '2023-12-05',
    maturityDate: '2028-12-05',
    nextPaymentDate: '2024-12-05',
    status: 'warning',
    trustee: '华泰证券'
  }
];

// 资金流水模拟数据
const mockFundFlows: FundFlow[] = [
  { id: 'flow-001', date: '2024-02-15', amount: 3.5, usageDescription: '项目建设工程款支付', usageCategory: '项目建设', approver: '张明', approvalStatus: 'approved', isCompliant: true },
  { id: 'flow-002', date: '2024-02-28', amount: 2.8, usageDescription: '生产设备采购款项', usageCategory: '设备采购', approver: '张明', approvalStatus: 'approved', isCompliant: true },
  { id: 'flow-003', date: '2024-03-10', amount: 1.5, usageDescription: '补充流动资金', usageCategory: '补充流动资金', approver: '李华', approvalStatus: 'pending', isCompliant: true },
  { id: 'flow-004', date: '2024-03-15', amount: 4.2, usageDescription: '偿还银行贷款（待核实）', usageCategory: '其他', approver: '王芳', approvalStatus: 'pending', isCompliant: false }
];

// 募集资金模拟数据
export const mockFundRecords: FundRecord[] = [
  {
    id: 'fund-001',
    bondId: 'bond-001',
    bondName: '24华信科技债01',
    totalAmount: 15,
    usedAmount: 7.8,
    remainingAmount: 7.2,
    purpose: '用于智能制造生产线建设项目及补充流动资金',
    fundFlows: mockFundFlows,
    complianceStatus: 'warning'
  },
  {
    id: 'fund-002',
    bondId: 'bond-003',
    bondName: '24绿源环保绿色债',
    totalAmount: 10,
    usedAmount: 3.2,
    remainingAmount: 6.8,
    purpose: '用于污水处理厂扩建及光伏发电项目',
    fundFlows: [
      { id: 'flow-005', date: '2024-03-05', amount: 2.0, usageDescription: '污水处理设备采购', usageCategory: '环保设备采购', approver: '赵伟', approvalStatus: 'approved', isCompliant: true },
      { id: 'flow-006', date: '2024-03-20', amount: 1.2, usageDescription: '光伏项目前期费用', usageCategory: '项目建设', approver: '孙丽', approvalStatus: 'approved', isCompliant: true }
    ],
    complianceStatus: 'normal'
  }
];

// 财务指标模拟数据
export const mockFinancialIndicators: FinancialIndicator[] = [
  {
    id: 'fin-001',
    bondId: 'bond-001',
    bondName: '24华信科技债01',
    indicatorName: '资产负债率',
    currentValue: 58.6,
    threshold: { warning: 65, danger: 75 },
    unit: '%',
    trend: 'stable',
    historyData: [
      { date: '2023-Q4', value: 57.2 },
      { date: '2024-Q1', value: 58.6 }
    ],
    status: 'normal'
  },
  {
    id: 'fin-002',
    bondId: 'bond-002',
    bondName: '23盛达实业MTN002',
    indicatorName: '资产负债率',
    currentValue: 72.3,
    threshold: { warning: 65, danger: 75 },
    unit: '%',
    trend: 'up',
    historyData: [
      { date: '2023-Q3', value: 65.8 },
      { date: '2023-Q4', value: 68.5 },
      { date: '2024-Q1', value: 72.3 }
    ],
    status: 'warning'
  },
  {
    id: 'fin-003',
    bondId: 'bond-001',
    bondName: '24华信科技债01',
    indicatorName: '流动比率',
    currentValue: 1.85,
    threshold: { warning: 1.5, danger: 1.0 },
    unit: '',
    trend: 'up',
    historyData: [
      { date: '2023-Q4', value: 1.72 },
      { date: '2024-Q1', value: 1.85 }
    ],
    status: 'normal'
  },
  {
    id: 'fin-004',
    bondId: 'bond-002',
    bondName: '23盛达实业MTN002',
    indicatorName: '净利润',
    currentValue: -2300,
    threshold: { warning: 0, danger: -5000 },
    unit: '万元',
    trend: 'down',
    historyData: [
      { date: '2023-Q3', value: 3200 },
      { date: '2023-Q4', value: 1500 },
      { date: '2024-Q1', value: -2300 }
    ],
    status: 'danger'
  },
  {
    id: 'fin-005',
    bondId: 'bond-004',
    bondName: '23城投集团企业债',
    indicatorName: 'EBITDA利息保障倍数',
    currentValue: 1.2,
    threshold: { warning: 1.5, danger: 1.0 },
    unit: '倍',
    trend: 'down',
    historyData: [
      { date: '2023-Q3', value: 1.8 },
      { date: '2023-Q4', value: 1.5 },
      { date: '2024-Q1', value: 1.2 }
    ],
    status: 'warning'
  }
];

// 舆情信息模拟数据
export const mockSentimentNews: SentimentNews[] = [
  {
    id: 'news-001',
    title: '华信科技集团2024年一季度营收同比增长25%，智能制造业务表现亮眼',
    source: '证券时报',
    publishDate: '2024-04-15',
    sentiment: 'positive',
    riskLevel: 'low',
    relatedIssuer: '华信科技集团有限公司',
    summary: '华信科技集团发布2024年第一季度报告，实现营业收入45.6亿元，同比增长25.3%；净利润5.2亿元，同比增长18.7%。其中智能制造业务板块贡献营收18.2亿元，成为主要增长引擎。',
    keywords: ['业绩增长', '智能制造', '营收'],
    isHandled: true
  },
  {
    id: 'news-002',
    title: '盛达实业股份有限公司被列为被执行人，涉及金额超2亿元',
    source: '中国执行信息公开网',
    publishDate: '2024-04-12',
    sentiment: 'negative',
    riskLevel: 'high',
    relatedIssuer: '盛达实业股份有限公司',
    summary: '据中国执行信息公开网显示，盛达实业股份有限公司于近日被列为被执行人，执行标的金额达2.15亿元。公司回应称正在与相关方积极沟通解决。',
    keywords: ['被执行人', '诉讼', '债务'],
    isHandled: false
  },
  {
    id: 'news-003',
    title: '绿源环保科技中标5亿元污水处理PPP项目',
    source: '中国环境报',
    publishDate: '2024-04-10',
    sentiment: 'positive',
    riskLevel: 'low',
    relatedIssuer: '绿源环保科技有限公司',
    summary: '绿源环保科技有限公司成功中标某地级市污水处理厂PPP项目，项目总投资约5亿元，特许经营期30年。',
    keywords: ['中标', 'PPP项目', '污水处理'],
    isHandled: true
  },
  {
    id: 'news-004',
    title: '城市建设投资集团旗下子公司拟转让部分商业地产项目',
    source: '21世纪经济报道',
    publishDate: '2024-04-08',
    sentiment: 'neutral',
    riskLevel: 'medium',
    relatedIssuer: '城市建设投资集团',
    summary: '据消息人士透露，城市建设投资集团正在考虑转让旗下部分商业地产项目以盘活存量资产，相关事宜仍在初步洽谈阶段。',
    keywords: ['资产转让', '商业地产', '盘活资产'],
    isHandled: false
  },
  {
    id: 'news-005',
    title: '惠誉维持盛达实业BB+评级，展望调整为负面',
    source: '彭博社',
    publishDate: '2024-04-05',
    sentiment: 'negative',
    riskLevel: 'high',
    relatedIssuer: '盛达实业股份有限公司',
    summary: '国际评级机构惠誉发布报告，维持盛达实业股份有限公司BB+的长期发行人评级，但将评级展望由稳定调整为负面，主要基于公司盈利能力下滑及杠杆率上升的担忧。',
    keywords: ['评级展望', '负面', '杠杆率'],
    isHandled: false
  },
  {
    id: 'news-006',
    title: '绿色债券市场持续升温，一季度发行规模同比增长40%',
    source: '金融时报',
    publishDate: '2024-04-03',
    sentiment: 'neutral',
    riskLevel: 'low',
    relatedIssuer: '绿源环保科技有限公司',
    summary: '据统计，2024年一季度国内绿色债券发行规模达到1250亿元，同比增长40%，绿源环保等企业发行的绿色债受到市场广泛认可。',
    keywords: ['绿色债券', '发行规模', '市场动态'],
    isHandled: true
  }
];

// 预警信息模拟数据
export const mockAlerts: AlertItem[] = [
  {
    id: 'alert-001',
    type: 'financial',
    level: 'high',
    title: '盛达实业净利润转负',
    description: '盛达实业2024年一季度净利润为-2300万元，已触发危险阈值，需立即关注偿债能力变化。',
    relatedBond: '23盛达实业MTN002',
    createTime: '2024-04-16 09:30:00',
    isHandled: false
  },
  {
    id: 'alert-002',
    type: 'sentiment',
    level: 'high',
    title: '盛达实业被列为被执行人',
    description: '盛达实业被列为被执行人，涉及金额2.15亿元，可能对公司信用状况产生重大影响。',
    relatedBond: '23盛达实业MTN002',
    createTime: '2024-04-12 14:20:00',
    isHandled: false
  },
  {
    id: 'alert-003',
    type: 'financial',
    level: 'medium',
    title: '盛达实业资产负债率超预警线',
    description: '盛达实业资产负债率达到72.3%，超过65%的预警阈值。',
    relatedBond: '23盛达实业MTN002',
    createTime: '2024-04-15 10:00:00',
    isHandled: false
  },
  {
    id: 'alert-004',
    type: 'fund',
    level: 'medium',
    title: '华信科技债资金用途待核实',
    description: '华信科技债有一笔4.2亿元资金用途标注为"偿还银行贷款"，与募集说明书约定用途不符，待核实。',
    relatedBond: '24华信科技债01',
    createTime: '2024-03-16 16:45:00',
    isHandled: false
  },
  {
    id: 'alert-005',
    type: 'sentiment',
    level: 'medium',
    title: '城建集团拟转让商业地产项目',
    description: '城建集团旗下子公司拟转让部分商业地产项目，需关注对公司经营和偿债能力的影响。',
    relatedBond: '23城投集团企业债',
    createTime: '2024-04-08 11:30:00',
    isHandled: false
  },
  {
    id: 'alert-006',
    type: 'financial',
    level: 'medium',
    title: '城建集团利息保障倍数下降',
    description: '城建集团EBITDA利息保障倍数降至1.2倍，低于1.5倍的预警线。',
    relatedBond: '23城投集团企业债',
    createTime: '2024-04-14 09:15:00',
    isHandled: false
  },
  {
    id: 'alert-007',
    type: 'sentiment',
    level: 'high',
    title: '惠誉下调盛达实业展望至负面',
    description: '惠誉将盛达实业评级展望调整为负面，需密切关注后续评级变动及市场反应。',
    relatedBond: '23盛达实业MTN002',
    createTime: '2024-04-05 18:00:00',
    isHandled: true,
    handler: '陈静'
  }
];

// 合规报告模拟数据
export const mockReports: ComplianceReport[] = [
  {
    id: 'report-001',
    reportName: '2024年第一季度受托管理事务报告',
    reportType: 'regular',
    bondName: '24华信科技债01',
    reportPeriod: '2024年第一季度',
    createDate: '2024-04-10',
    status: 'published'
  },
  {
    id: 'report-002',
    reportName: '关于盛达实业被列为被执行人的临时公告',
    reportType: 'temporary',
    bondName: '23盛达实业MTN002',
    reportPeriod: '2024年4月',
    createDate: '2024-04-13',
    status: 'published'
  },
  {
    id: 'report-003',
    reportName: '2023年度受托管理事务报告',
    reportType: 'regular',
    bondName: '23盛达实业MTN002',
    reportPeriod: '2023年度',
    createDate: '2024-03-25',
    status: 'published'
  },
  {
    id: 'report-004',
    reportName: '绿源环保绿色债券2024年一季度专项报告',
    reportType: 'special',
    bondName: '24绿源环保绿色债',
    reportPeriod: '2024年第一季度',
    createDate: '2024-04-08',
    status: 'submitted'
  },
  {
    id: 'report-005',
    reportName: '2024年一季度募集资金使用情况核查报告',
    reportType: 'special',
    bondName: '24华信科技债01',
    reportPeriod: '2024年第一季度',
    createDate: '2024-04-15',
    status: 'draft'
  }
];

// 首页统计卡片数据
export const mockStatCards: StatCardData[] = [
  {
    title: '在管债券总数',
    value: 28,
    unit: '只',
    icon: 'briefcase',
    trend: 'up',
    trendValue: '+3',
    color: 'blue'
  },
  {
    title: '承销项目进行中',
    value: 5,
    unit: '个',
    icon: 'trending-up',
    color: 'green'
  },
  {
    title: '待处理预警',
    value: 6,
    unit: '条',
    icon: 'alert-triangle',
    trend: 'up',
    trendValue: '+2',
    color: 'red'
  },
  {
    title: '募集资金使用率',
    value: 52.3,
    unit: '%',
    icon: 'pie-chart',
    trend: 'stable',
    color: 'amber'
  }
];
