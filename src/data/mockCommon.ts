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
    id: 'todo_001',
    title: '22华远01一季度财务指标预警跟进',
    type: 'interest',
    priority: 'high',
    dueDate: '2026-06-22',
    bondId: 'bond_001',
    bondName: '22华远01'
  },
  {
    id: 'todo_002',
    title: '蓝光发展债务重组进展跟踪报告',
    type: 'sentiment',
    priority: 'high',
    dueDate: '2026-06-21',
    bondId: 'bond_003',
    bondName: '21蓝光03'
  },
  {
    id: 'todo_003',
    title: '23粤海02付息资金落实确认',
    type: 'interest',
    priority: 'medium',
    dueDate: '2026-06-25',
    bondId: 'bond_002',
    bondName: '23粤海02'
  },
  {
    id: 'todo_004',
    title: '24京能01承销材料准备',
    type: 'underwriting',
    priority: 'medium',
    dueDate: '2026-06-28'
  },
  {
    id: 'todo_005',
    title: '首钢集团二季度盈利调研',
    type: 'fund',
    priority: 'low',
    dueDate: '2026-07-05',
    bondId: 'bond_004',
    bondName: '22首钢01'
  },
  {
    id: 'todo_006',
    title: '华远地产资产出售交易进展跟进',
    type: 'sentiment',
    priority: 'high',
    dueDate: '2026-06-20',
    bondId: 'bond_001',
    bondName: '22华远01'
  },
  {
    id: 'todo_007',
    title: '22首钢01绿色债券信息披露',
    type: 'issuance',
    priority: 'medium',
    dueDate: '2026-06-30',
    bondId: 'bond_004',
    bondName: '22首钢01'
  },
  {
    id: 'todo_008',
    title: '房地产行业月度风险监测报告',
    type: 'fund',
    priority: 'low',
    dueDate: '2026-07-01'
  }
];

// 风险预警列表
export const mockWarningList: WarningItem[] = [
  {
    id: 'warn_001',
    title: '蓝光发展资产负债率突破90%危险线',
    type: 'finance',
    level: 'danger',
    time: '2026-04-28 10:30:00',
    bondId: 'bond_003',
    bondName: '21蓝光03',
    description: '2026年一季度资产负债率达92.1%，超过85%危险阈值，债务风险持续加剧',
    handled: false
  },
  {
    id: 'warn_002',
    title: '华远地产一季度由盈转亏',
    type: 'finance',
    level: 'danger',
    time: '2026-04-26 16:00:00',
    bondId: 'bond_001',
    bondName: '22华远01',
    description: '一季度归母净利润-1.2亿元，同比下降156%，盈利能力大幅恶化',
    handled: false
  },
  {
    id: 'warn_003',
    title: '网传华远地产北京项目停工引发舆情',
    type: 'sentiment',
    level: 'warning',
    time: '2026-06-10 18:30:00',
    bondId: 'bond_001',
    bondName: '22华远01',
    description: '网络流传项目停工消息，阅读量超4.5万，公司已回应但仍需关注舆情走向',
    handled: false
  },
  {
    id: 'warn_004',
    title: '蓝光发展到期未偿债务达328亿元',
    type: 'finance',
    level: 'danger',
    time: '2026-06-05 09:15:00',
    bondId: 'bond_003',
    bondName: '21蓝光03',
    description: '截至5月末累计违约债务本息328.45亿元，诉讼案件持续增加',
    handled: true
  },
  {
    id: 'warn_005',
    title: '首钢集团净利润率接近预警线',
    type: 'finance',
    level: 'attention',
    time: '2026-04-30 14:20:00',
    bondId: 'bond_004',
    bondName: '22首钢01',
    description: '一季度净利润率4.2%，接近5%预警阈值，受钢铁行业周期影响',
    handled: false
  },
  {
    id: 'warn_006',
    title: '22华远01资产处置事项需关注合规风险',
    type: 'compliance',
    level: 'attention',
    time: '2026-06-02 11:00:00',
    bondId: 'bond_001',
    bondName: '22华远01',
    description: '拟42亿元出售北京核心区写字楼，需关注交易定价公允性和信息披露合规性',
    handled: false
  },
  {
    id: 'warn_007',
    title: '地产行业研报提示流动性风险',
    type: 'sentiment',
    level: 'attention',
    time: '2026-06-14 09:45:00',
    bondId: 'bond_001',
    bondName: '22华远01',
    description: '中信证券研报指出部分房企资产处置进展缓慢，流动性压力仍存',
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
