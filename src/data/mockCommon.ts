// 通用模块mock数据
import type { TodoItem, WarningItem, StatCardData } from '../types/common';
import type { WarningLevel } from '../types/common';

// 预警等级名称映射
const warningLevelNames: Record<WarningLevel, string> = {
  normal: '正常',
  attention: '关注',
  warning: '预警',
  danger: '危险'
};

// 待办事项列表
export const mockTodoList: TodoItem[] = [
  {
    id: 'todoFinanceHuaxin01',
    title: '24华鑫城投债01一季度财务指标预警跟进',
    type: 'interest',
    priority: 'high',
    dueDate: '2026-06-22',
    bondId: 'bond24Huaxin01',
    bondName: '24华鑫城投债01'
  },
  {
    id: 'todoSentimentJiangwan01',
    title: '江湾交通债务重组进展跟踪报告',
    type: 'sentiment',
    priority: 'high',
    dueDate: '2026-06-21',
    bondId: 'bond26Jiangwan01',
    bondName: '26江湾交通债01'
  },
  {
    id: 'todoInterestMingtai01',
    title: '25明泰新能债01付息资金落实确认',
    type: 'interest',
    priority: 'medium',
    dueDate: '2026-06-25',
    bondId: 'bond25Mingtai01',
    bondName: '25明泰新能债01'
  },
  {
    id: 'todoUnderwriting01',
    title: '26科创绿色债01承销材料准备',
    type: 'underwriting',
    priority: 'medium',
    dueDate: '2026-06-28'
  },
  {
    id: 'todoFundKechuang01',
    title: '科创智造二季度盈利调研',
    type: 'fund',
    priority: 'low',
    dueDate: '2026-07-05',
    bondId: 'bond25Kechuang01',
    bondName: '25科创智造债01'
  },
  {
    id: 'todoSentimentHuaxin01',
    title: '华鑫城投资产出售交易进展跟进',
    type: 'sentiment',
    priority: 'high',
    dueDate: '2026-06-20',
    bondId: 'bond24Huaxin01',
    bondName: '24华鑫城投债01'
  },
  {
    id: 'todoIssuanceKechuang01',
    title: '25科创智造债01绿色债券信息披露',
    type: 'issuance',
    priority: 'medium',
    dueDate: '2026-06-30',
    bondId: 'bond25Kechuang01',
    bondName: '25科创智造债01'
  },
  {
    id: 'todoFundIndustry01',
    title: '城投行业月度风险监测报告',
    type: 'fund',
    priority: 'low',
    dueDate: '2026-07-01'
  }
];

// 风险预警列表
export const mockWarningList: WarningItem[] = [
  {
    id: 'warnFinanceJiangwan01',
    title: '江湾交通资产负债率突破90%危险线',
    type: 'finance',
    level: 'danger',
    time: '2026-04-28 10:30:00',
    bondId: 'bond26Jiangwan01',
    bondName: '26江湾交通债01',
    description: '2026年一季度资产负债率达92.1%，超过85%危险阈值，债务风险持续加剧',
    handled: false
  },
  {
    id: 'warnFinanceHuaxin01',
    title: '华鑫城投一季度由盈转亏',
    type: 'finance',
    level: 'danger',
    time: '2026-04-26 16:00:00',
    bondId: 'bond24Huaxin01',
    bondName: '24华鑫城投债01',
    description: '一季度归母净利润-1.2亿元，同比下降156%，盈利能力大幅恶化',
    handled: false
  },
  {
    id: 'warnSentimentHuaxin01',
    title: '网传华鑫城投本地项目停工引发舆情',
    type: 'sentiment',
    level: 'warning',
    time: '2026-06-10 18:30:00',
    bondId: 'bond24Huaxin01',
    bondName: '24华鑫城投债01',
    description: '网络流传项目停工消息，阅读量超4.5万，公司已回应但仍需关注舆情走向',
    handled: false
  },
  {
    id: 'warnFinanceJiangwan02',
    title: '江湾交通到期未偿债务达328亿元',
    type: 'finance',
    level: 'danger',
    time: '2026-06-05 09:15:00',
    bondId: 'bond26Jiangwan01',
    bondName: '26江湾交通债01',
    description: '截至5月末累计违约债务本息328.45亿元，诉讼案件持续增加',
    handled: true
  },
  {
    id: 'warnFinanceKechuang01',
    title: '科创智造净利润率接近预警线',
    type: 'finance',
    level: 'attention',
    time: '2026-04-30 14:20:00',
    bondId: 'bond25Kechuang01',
    bondName: '25科创智造债01',
    description: '一季度净利润率4.2%，接近5%预警阈值，受高端制造行业周期影响',
    handled: false
  },
  {
    id: 'warnComplianceHuaxin01',
    title: '24华鑫城投债01资产处置事项需关注合规风险',
    type: 'compliance',
    level: 'attention',
    time: '2026-06-02 11:00:00',
    bondId: 'bond24Huaxin01',
    bondName: '24华鑫城投债01',
    description: '拟42亿元出售本地核心区写字楼，需关注交易定价公允性和信息披露合规性',
    handled: false
  },
  {
    id: 'warnSentimentIndustry01',
    title: '城投行业研报提示流动性风险',
    type: 'sentiment',
    level: 'attention',
    time: '2026-06-14 09:45:00',
    bondId: 'bond24Huaxin01',
    bondName: '24华鑫城投债01',
    description: '中信证券研报指出部分城投企业资产处置进展缓慢，流动性压力仍存',
    handled: false
  }
];

// 首页统计卡片数据
export const mockDashboardStats: StatCardData[] = [
  {
    title: '存续债券规模',
    value: '286.5',
    unit: '亿元',
    trend: 5.2,
    trendType: 'up',
    icon: 'TrendingUp',
    color: 'blue'
  },
  {
    title: '今日待办事项',
    value: 8,
    unit: '项',
    trend: 2,
    trendType: 'up',
    icon: 'ClipboardList',
    color: 'amber'
  },
  {
    title: '风险预警数量',
    value: 12,
    unit: '条',
    trend: -3,
    trendType: 'down',
    icon: 'AlertTriangle',
    color: 'red'
  },
  {
    title: '本月舆情总数',
    value: 1286,
    unit: '条',
    trend: 12.8,
    trendType: 'up',
    icon: 'MessageSquare',
    color: 'emerald'
  },
  {
    title: '本年付息金额',
    value: '15.8',
    unit: '亿元',
    trend: 8.3,
    trendType: 'up',
    icon: 'Wallet',
    color: 'violet'
  },
  {
    title: '承销中项目',
    value: 5,
    unit: '个',
    trend: 0,
    trendType: 'up',
    icon: 'FileText',
    color: 'cyan'
  }
];
