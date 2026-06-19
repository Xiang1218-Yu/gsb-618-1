// 债券模块mock数据
import type {
  Issuer,
  Bond,
  UnderwritingProject,
  Milestone,
  IssuanceInfo,
  DurationBond,
  InterestPayment,
  DisclosureRecord
} from '../types/bond';
import type { BondStatus } from '../types/common';

// 债券状态名称映射
const bondStatusNames: Record<BondStatus, string> = {
  underwriting: '承销中',
  issuing: '发行中',
  duration: '存续期',
  matured: '已到期',
  defaulted: '违约'
};

// 发行人数据
export const mockIssuers: Issuer[] = [
  {
    id: 'issuerHuaxin',
    issuerName: '华鑫城市建设投资集团有限公司',
    industry: '城市基础设施建设',
    creditRating: 'AAA',
    registeredCapital: 1000000,
    establishDate: '2005-08-15',
    legalRepresentative: '张国华'
  },
  {
    id: 'issuerMingtai',
    issuerName: '明泰新能源科技股份有限公司',
    industry: '新能源',
    creditRating: 'AA+',
    registeredCapital: 500000,
    establishDate: '2010-03-22',
    legalRepresentative: '李明阳'
  },
  {
    id: 'issuerJiangwan',
    issuerName: '江湾交通发展集团有限公司',
    industry: '交通运输',
    creditRating: 'AAA',
    registeredCapital: 800000,
    establishDate: '2002-11-08',
    legalRepresentative: '王建平'
  },
  {
    id: 'issuerKechuang',
    issuerName: '科创智能制造有限公司',
    industry: '高端制造',
    creditRating: 'AA',
    registeredCapital: 200000,
    establishDate: '2015-06-30',
    legalRepresentative: '陈思远'
  }
];

// 债券基本数据
export const mockBonds: Bond[] = [
  {
    id: 'bond24Huaxin01',
    bondName: '24华鑫城投债01',
    bondCode: '2480001.IB',
    issuerId: 'issuerHuaxin',
    issuerName: '华鑫城市建设投资集团有限公司',
    bondType: 'enterprise',
    bondTypeName: '企业债',
    issueAmount: 20,
    issueRate: 3.25,
    issuePrice: 100,
    termYears: 5,
    issueDate: '2024-03-15',
    maturityDate: '2029-03-15',
    listingDate: '2024-03-25',
    status: 'duration',
    statusName: '存续期',
    creditRating: 'AAA',
    leadUnderwriter: '中信证券',
    trustee: '中信证券'
  },
  {
    id: 'bond25Mingtai01',
    bondName: '25明泰新能债01',
    bondCode: '2580002.SH',
    issuerId: 'issuerMingtai',
    issuerName: '明泰新能源科技股份有限公司',
    bondType: 'corporate',
    bondTypeName: '公司债',
    issueAmount: 10,
    issueRate: 3.85,
    issuePrice: 100,
    termYears: 3,
    issueDate: '2025-01-20',
    maturityDate: '2028-01-20',
    listingDate: '2025-02-01',
    status: 'duration',
    statusName: '存续期',
    creditRating: 'AA+',
    leadUnderwriter: '国泰君安证券',
    trustee: '国泰君安证券'
  },
  {
    id: 'bond26Jiangwan01',
    bondName: '26江湾交通债01',
    bondCode: '2680003.SZ',
    issuerId: 'issuerJiangwan',
    issuerName: '江湾交通发展集团有限公司',
    bondType: 'enterprise',
    bondTypeName: '企业债',
    issueAmount: 15,
    issueRate: 3.15,
    issuePrice: 100,
    termYears: 7,
    issueDate: '2026-04-10',
    maturityDate: '2033-04-10',
    status: 'issuing',
    statusName: '发行中',
    creditRating: 'AAA',
    leadUnderwriter: '中金公司',
    trustee: '中金公司'
  },
  {
    id: 'bond25Kechuang01',
    bondName: '25科创智造债01',
    bondCode: '2580004.IB',
    issuerId: 'issuerKechuang',
    issuerName: '科创智能制造有限公司',
    bondType: 'corporate',
    bondTypeName: '公司债',
    issueAmount: 5,
    issueRate: 4.25,
    issuePrice: 100,
    termYears: 3,
    issueDate: '2025-06-15',
    maturityDate: '2028-06-15',
    status: 'underwriting',
    statusName: '承销中',
    creditRating: 'AA',
    leadUnderwriter: '海通证券',
    trustee: '海通证券'
  },
  {
    id: 'bond24Huaxin02',
    bondName: '24华鑫城投债02',
    bondCode: '2480005.SH',
    issuerId: 'issuerHuaxin',
    issuerName: '华鑫城市建设投资集团有限公司',
    bondType: 'municipal',
    bondTypeName: '地方政府债',
    issueAmount: 12,
    issueRate: 2.98,
    issuePrice: 100,
    termYears: 10,
    issueDate: '2024-09-08',
    maturityDate: '2034-09-08',
    listingDate: '2024-09-18',
    status: 'duration',
    statusName: '存续期',
    creditRating: 'AAA',
    leadUnderwriter: '中信建投证券',
    trustee: '中信建投证券'
  },
  {
    id: 'bond25MingtaiConvert',
    bondName: '25明泰可转债',
    bondCode: '123456.SH',
    issuerId: 'issuerMingtai',
    issuerName: '明泰新能源科技股份有限公司',
    bondType: 'convertible',
    bondTypeName: '可转债',
    issueAmount: 8,
    issueRate: 0.5,
    issuePrice: 100,
    termYears: 6,
    issueDate: '2025-08-20',
    maturityDate: '2031-08-20',
    status: 'underwriting',
    statusName: '承销中',
    creditRating: 'AA+',
    leadUnderwriter: '华泰证券',
    trustee: '华泰证券'
  },
  {
    id: 'bond24JiangwanFinance',
    bondName: '24江湾金融债01',
    bondCode: '2420007.IB',
    issuerId: 'issuerJiangwan',
    issuerName: '江湾交通发展集团有限公司',
    bondType: 'financial',
    bondTypeName: '金融债',
    issueAmount: 25,
    issueRate: 3.05,
    issuePrice: 100,
    termYears: 3,
    issueDate: '2024-11-25',
    maturityDate: '2027-11-25',
    listingDate: '2024-12-05',
    status: 'duration',
    statusName: '存续期',
    creditRating: 'AAA',
    leadUnderwriter: '招商银行',
    trustee: '招商银行'
  },
  {
    id: 'bond26KechuangGreen01',
    bondName: '26科创绿色债01',
    bondCode: '2680008.SZ',
    issuerId: 'issuerKechuang',
    issuerName: '科创智能制造有限公司',
    bondType: 'corporate',
    bondTypeName: '绿色公司债',
    issueAmount: 6,
    issueRate: 4.05,
    issuePrice: 100,
    termYears: 5,
    issueDate: '2026-02-28',
    maturityDate: '2031-02-28',
    status: 'issuing',
    statusName: '发行中',
    creditRating: 'AA',
    leadUnderwriter: '广发证券',
    trustee: '广发证券'
  },
  {
    id: 'bond23Huaxin03',
    bondName: '23华鑫城投债03',
    bondCode: '2380009.IB',
    issuerId: 'issuerHuaxin',
    issuerName: '华鑫城市建设投资集团有限公司',
    bondType: 'enterprise',
    bondTypeName: '企业债',
    issueAmount: 18,
    issueRate: 3.45,
    issuePrice: 100,
    termYears: 5,
    issueDate: '2023-07-12',
    maturityDate: '2028-07-12',
    listingDate: '2023-07-22',
    status: 'duration',
    statusName: '存续期',
    creditRating: 'AAA',
    leadUnderwriter: '中信证券',
    trustee: '中信证券'
  }
];

// 里程碑数据
const milestones: Milestone[][] = [
  [
    { id: 'milestone01Stage01', name: '项目立项', date: '2025-09-01', completed: true, description: '完成内部立项审批' },
    { id: 'milestone01Stage02', name: '尽职调查', date: '2025-10-15', completed: true, description: '完成发行人尽职调查' },
    { id: 'milestone01Stage03', name: '材料制作', date: '2025-11-30', completed: false, description: '制作申报材料' },
    { id: 'milestone01Stage04', name: '内核审核', date: '2025-12-20', completed: false, description: '公司内部内核审核' },
    { id: 'milestone01Stage05', name: '申报提交', date: '2026-01-15', completed: false, description: '向监管机构提交申报' }
  ],
  [
    { id: 'milestone02Stage01', name: '项目立项', date: '2025-10-10', completed: true, description: '完成内部立项审批' },
    { id: 'milestone02Stage02', name: '尽职调查', date: '2025-11-20', completed: true, description: '完成发行人尽职调查' },
    { id: 'milestone02Stage03', name: '材料制作', date: '2025-12-25', completed: true, description: '制作申报材料' },
    { id: 'milestone02Stage04', name: '内核审核', date: '2026-01-10', completed: false, description: '公司内部内核审核' },
    { id: 'milestone02Stage05', name: '申报提交', date: '2026-01-30', completed: false, description: '向监管机构提交申报' }
  ],
  [
    { id: 'milestone03Stage01', name: '项目立项', date: '2026-01-05', completed: true, description: '完成内部立项审批' },
    { id: 'milestone03Stage02', name: '尽职调查', date: '2026-02-20', completed: true, description: '完成发行人尽职调查' },
    { id: 'milestone03Stage03', name: '材料制作', date: '2026-03-30', completed: true, description: '制作申报材料' },
    { id: 'milestone03Stage04', name: '内核审核', date: '2026-04-15', completed: true, description: '公司内部内核审核' },
    { id: 'milestone03Stage05', name: '申报提交', date: '2026-04-30', completed: false, description: '向监管机构提交申报' }
  ]
];

// 承销项目数据
export const mockUnderwritingProjects: UnderwritingProject[] = [
  {
    id: 'underwritingProject01',
    bondId: 'bond25Kechuang01',
    bondName: '25科创智造债01',
    projectName: '科创智造5亿元公司债承销项目',
    status: 'in_progress',
    statusName: '进行中',
    currentStage: '材料制作阶段',
    progress: 60,
    startDate: '2025-09-01',
    expectedSubmitDate: '2026-01-15',
    teamMembers: ['张伟', '李娜', '王强', '刘芳'],
    milestones: milestones[0]
  },
  {
    id: 'underwritingProject02',
    bondId: 'bond25MingtaiConvert',
    bondName: '25明泰可转债',
    projectName: '明泰新能8亿元可转债承销项目',
    status: 'in_progress',
    statusName: '进行中',
    currentStage: '内核审核阶段',
    progress: 80,
    startDate: '2025-10-10',
    expectedSubmitDate: '2026-01-30',
    teamMembers: ['赵磊', '陈静', '周涛'],
    milestones: milestones[1]
  },
  {
    id: 'underwritingProject03',
    bondId: 'bond26KechuangGreen01',
    bondName: '26科创绿色债01',
    projectName: '科创智造6亿元绿色债承销项目',
    status: 'submitted',
    statusName: '已申报',
    currentStage: '等待监管反馈',
    progress: 90,
    startDate: '2026-01-05',
    expectedSubmitDate: '2026-04-30',
    teamMembers: ['吴敏', '郑浩', '孙丽', '马超'],
    milestones: milestones[2]
  },
  {
    id: 'underwritingProject04',
    bondId: 'bond26Jiangwan01',
    bondName: '26江湾交通债01',
    projectName: '江湾交通15亿元企业债承销项目',
    status: 'approved',
    statusName: '已获批',
    currentStage: '发行准备阶段',
    progress: 100,
    startDate: '2025-08-01',
    expectedSubmitDate: '2025-12-20',
    teamMembers: ['黄勇', '徐婷', '朱伟'],
    milestones: [
      { id: 'milestone04Stage01', name: '项目立项', date: '2025-08-01', completed: true },
      { id: 'milestone04Stage02', name: '尽职调查', date: '2025-09-15', completed: true },
      { id: 'milestone04Stage03', name: '材料制作', date: '2025-10-30', completed: true },
      { id: 'milestone04Stage04', name: '内核审核', date: '2025-11-20', completed: true },
      { id: 'milestone04Stage05', name: '申报提交', date: '2025-12-20', completed: true },
      { id: 'milestone04Stage06', name: '获取批文', date: '2026-03-15', completed: true }
    ]
  }
];

// 发行信息数据
export const mockIssuanceInfoList: IssuanceInfo[] = [
  {
    id: 'issuanceInfo01',
    bondId: 'bond26Jiangwan01',
    bondName: '26江湾交通债01',
    issueMethod: '簿记建档',
    bookbuildingDate: '2026-04-08',
    paymentDeadline: '2026-04-12',
    listingLocation: '深圳证券交易所',
    subscriptionMultiple: 2.35,
    allocatedAmount: 150000,
    totalSubscriptions: 352500,
    status: 'allocating',
    statusName: '配售中'
  },
  {
    id: 'issuanceInfo02',
    bondId: 'bond26KechuangGreen01',
    bondName: '26科创绿色债01',
    issueMethod: '公开招标',
    bookbuildingDate: '2026-02-26',
    paymentDeadline: '2026-03-02',
    listingLocation: '深圳证券交易所',
    subscriptionMultiple: 3.12,
    allocatedAmount: 60000,
    totalSubscriptions: 187200,
    status: 'completed',
    statusName: '发行完成'
  },
  {
    id: 'issuanceInfo03',
    bondId: 'bond25Kechuang01',
    bondName: '25科创智造债01',
    issueMethod: '簿记建档',
    paymentDeadline: '2025-06-20',
    listingLocation: '银行间市场',
    allocatedAmount: 0,
    totalSubscriptions: 0,
    status: 'preparing',
    statusName: '发行准备'
  }
];

// 存续期债券扩展信息
export const mockDurationBonds: DurationBond[] = [
  {
    ...mockBonds[0],
    nextInterestDate: '2025-03-15',
    remainingDays: 269,
    interestPaid: 1,
    totalInterests: 10,
    nextInterestAmount: 3250
  },
  {
    ...mockBonds[1],
    nextInterestDate: '2026-01-20',
    remainingDays: 215,
    interestPaid: 0,
    totalInterests: 6,
    nextInterestAmount: 1925
  },
  {
    ...mockBonds[4],
    nextInterestDate: '2025-09-08',
    remainingDays: 81,
    interestPaid: 0,
    totalInterests: 20,
    nextInterestAmount: 1788
  },
  {
    ...mockBonds[6],
    nextInterestDate: '2025-11-25',
    remainingDays: 159,
    interestPaid: 0,
    totalInterests: 6,
    nextInterestAmount: 3812.5
  },
  {
    ...mockBonds[8],
    nextInterestDate: '2025-07-12',
    remainingDays: 23,
    interestPaid: 3,
    totalInterests: 10,
    nextInterestAmount: 3105
  }
];

// 付息兑付记录
export const mockInterestPayments: InterestPayment[] = [
  {
    id: 'interestPayment01',
    bondId: 'bond24Huaxin01',
    bondName: '24华鑫城投债01',
    paymentDate: '2025-03-15',
    paymentType: 'interest',
    paymentAmount: 6500,
    status: 'paid',
    statusName: '已支付',
    remark: '首期利息支付完成'
  },
  {
    id: 'interestPayment02',
    bondId: 'bond23Huaxin03',
    bondName: '23华鑫城投债03',
    paymentDate: '2024-07-12',
    paymentType: 'interest',
    paymentAmount: 6210,
    status: 'paid',
    statusName: '已支付'
  },
  {
    id: 'interestPayment03',
    bondId: 'bond23Huaxin03',
    bondName: '23华鑫城投债03',
    paymentDate: '2025-01-12',
    paymentType: 'interest',
    paymentAmount: 6210,
    status: 'paid',
    statusName: '已支付'
  },
  {
    id: 'interestPayment04',
    bondId: 'bond23Huaxin03',
    bondName: '23华鑫城投债03',
    paymentDate: '2025-07-12',
    paymentType: 'interest',
    paymentAmount: 6210,
    status: 'pending',
    statusName: '待支付',
    remark: '正在准备付息资金'
  },
  {
    id: 'interestPayment05',
    bondId: 'bond24JiangwanFinance',
    bondName: '24江湾金融债01',
    paymentDate: '2025-05-25',
    paymentType: 'interest',
    paymentAmount: 7625,
    status: 'paid',
    statusName: '已支付'
  },
  {
    id: 'interestPayment06',
    bondId: 'bond25Mingtai01',
    bondName: '25明泰新能债01',
    paymentDate: '2026-01-20',
    paymentType: 'interest',
    paymentAmount: 3850,
    status: 'pending',
    statusName: '待支付'
  },
  {
    id: 'interestPayment07',
    bondId: 'bond24Huaxin02',
    bondName: '24华鑫城投债02',
    paymentDate: '2025-09-08',
    paymentType: 'interest',
    paymentAmount: 3576,
    status: 'pending',
    statusName: '待支付'
  }
];

// 信息披露记录
export const mockDisclosureRecords: DisclosureRecord[] = [
  {
    id: 'disclosure01',
    bondId: 'bond24Huaxin01',
    title: '2024年年度报告',
    type: 'periodic',
    typeName: '定期报告',
    publishDate: '2025-04-30',
    fileUrl: '/files/bond24Huaxin01_annual_2024.pdf'
  },
  {
    id: 'disclosure02',
    bondId: 'bond24Huaxin01',
    title: '2025年一季度财务报告',
    type: 'periodic',
    typeName: '定期报告',
    publishDate: '2025-04-30'
  },
  {
    id: 'disclosure03',
    bondId: 'bond24Huaxin01',
    title: '关于24华鑫城投债01首期付息事项的公告',
    type: 'temporary',
    typeName: '临时公告',
    publishDate: '2025-03-10'
  },
  {
    id: 'disclosure04',
    bondId: 'bond25Mingtai01',
    title: '2024年年度审计报告',
    type: 'periodic',
    typeName: '定期报告',
    publishDate: '2025-04-28'
  },
  {
    id: 'disclosure05',
    bondId: 'bond26Jiangwan01',
    title: '26江湾交通债01发行公告',
    type: 'temporary',
    typeName: '临时公告',
    publishDate: '2026-04-05'
  },
  {
    id: 'disclosure06',
    bondId: 'bond26Jiangwan01',
    title: '26江湾交通债01募集说明书',
    type: 'other',
    typeName: '其他文件',
    publishDate: '2026-04-03'
  },
  {
    id: 'disclosure07',
    bondId: 'bond23Huaxin03',
    title: '关于召开2025年第一次债券持有人会议的通知',
    type: 'temporary',
    typeName: '临时公告',
    publishDate: '2025-06-15'
  },
  {
    id: 'disclosure08',
    bondId: 'bond24JiangwanFinance',
    title: '2024年年度受托管理事务报告',
    type: 'periodic',
    typeName: '定期报告',
    publishDate: '2025-05-20'
  },
  {
    id: 'disclosure09',
    bondId: 'bond26KechuangGreen01',
    title: '26科创绿色债01发行结果公告',
    type: 'temporary',
    typeName: '临时公告',
    publishDate: '2026-03-03'
  }
];
