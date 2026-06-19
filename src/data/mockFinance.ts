// 财务模块mock数据
import type { IndicatorConfig, FinancialIndicator, FinanceWarning, IndicatorHistoryPoint } from '../types/finance';
import type { WarningLevel } from '../types/common';

// 预警等级名称映射
const warningLevelNames: Record<WarningLevel, string> = {
  normal: '正常',
  attention: '关注',
  warning: '预警',
  danger: '危险'
};

// 财务指标配置 - 8个指标
export const mockIndicatorConfigs: IndicatorConfig[] = [
  {
    id: 'config_debt_ratio',
    indicatorCode: 'debt_ratio',
    indicatorName: '资产负债率',
    unit: '%',
    warningUpper: 70,
    dangerUpper: 85,
    direction: 'lower_better',
    description: '反映企业长期偿债能力，比率越高说明偿债压力越大'
  },
  {
    id: 'config_current_ratio',
    indicatorCode: 'current_ratio',
    indicatorName: '流动比率',
    unit: '',
    warningLower: 1.5,
    dangerLower: 1,
    direction: 'higher_better',
    description: '衡量企业短期偿债能力，反映流动资产对流动负债的保障程度'
  },
  {
    id: 'config_quick_ratio',
    indicatorCode: 'quick_ratio',
    indicatorName: '速动比率',
    unit: '',
    warningLower: 1,
    dangerLower: 0.5,
    direction: 'higher_better',
    description: '衡量企业即时偿债能力，扣除存货等变现能力较差的资产'
  },
  {
    id: 'config_net_profit_margin',
    indicatorCode: 'net_profit_margin',
    indicatorName: '净利润率',
    unit: '%',
    warningLower: 5,
    dangerLower: 0,
    direction: 'higher_better',
    description: '反映企业盈利能力，净利润占营业收入的比例'
  },
  {
    id: 'config_roe',
    indicatorCode: 'roe',
    indicatorName: '净资产收益率',
    unit: '%',
    warningLower: 8,
    dangerLower: 3,
    direction: 'higher_better',
    description: '衡量股东资金使用效率，反映企业运用自有资本的能力'
  },
  {
    id: 'config_ebitda_interest',
    indicatorCode: 'ebitda_interest',
    indicatorName: 'EBITDA利息保障倍数',
    unit: '倍',
    warningLower: 3,
    dangerLower: 1.5,
    direction: 'higher_better',
    description: '反映企业盈利对利息支出的覆盖程度'
  },
  {
    id: 'config_operating_cash_flow',
    indicatorCode: 'operating_cash_flow',
    indicatorName: '经营现金流净额',
    unit: '亿元',
    warningLower: 0,
    dangerLower: -5,
    direction: 'higher_better',
    description: '企业经营活动产生的现金流量净额，反映造血能力'
  },
  {
    id: 'config_asset_liability_ratio',
    indicatorCode: 'asset_liability_ratio',
    indicatorName: '产权比率',
    unit: '%',
    warningUpper: 150,
    dangerUpper: 200,
    direction: 'lower_better',
    description: '负债总额与所有者权益总额的比率，反映财务结构稳健性'
  }
];

// 各债券财务指标当前值
export const mockFinancialIndicators: FinancialIndicator[] = [
  // 债券1 - 22华远01
  {
    id: 'fi_001',
    bondId: 'bond_001',
    bondName: '22华远01',
    issuerId: 'issuer_001',
    issuerName: '华远地产股份有限公司',
    indicatorCode: 'debt_ratio',
    indicatorName: '资产负债率',
    currentValue: 78.5,
    lastValue: 76.2,
    changeValue: 2.3,
    warningLevel: 'warning',
    warningLevelName: warningLevelNames.warning,
    reportDate: '2026-03-31',
    reportPeriod: '2026年一季度',
    thresholdInfo: '预警值70%，危险值85%'
  },
  {
    id: 'fi_002',
    bondId: 'bond_001',
    bondName: '22华远01',
    issuerId: 'issuer_001',
    issuerName: '华远地产股份有限公司',
    indicatorCode: 'current_ratio',
    indicatorName: '流动比率',
    currentValue: 1.3,
    lastValue: 1.45,
    changeValue: -0.15,
    warningLevel: 'warning',
    warningLevelName: warningLevelNames.warning,
    reportDate: '2026-03-31',
    reportPeriod: '2026年一季度',
    thresholdInfo: '预警值1.5，危险值1.0'
  },
  {
    id: 'fi_003',
    bondId: 'bond_001',
    bondName: '22华远01',
    issuerId: 'issuer_001',
    issuerName: '华远地产股份有限公司',
    indicatorCode: 'net_profit_margin',
    indicatorName: '净利润率',
    currentValue: -2.8,
    lastValue: 1.5,
    changeValue: -4.3,
    warningLevel: 'danger',
    warningLevelName: warningLevelNames.danger,
    reportDate: '2026-03-31',
    reportPeriod: '2026年一季度',
    thresholdInfo: '预警值5%，危险值0%'
  },
  // 债券2 - 23粤海02
  {
    id: 'fi_004',
    bondId: 'bond_002',
    bondName: '23粤海02',
    issuerId: 'issuer_002',
    issuerName: '广东粤海控股集团有限公司',
    indicatorCode: 'debt_ratio',
    indicatorName: '资产负债率',
    currentValue: 58.3,
    lastValue: 57.8,
    changeValue: 0.5,
    warningLevel: 'normal',
    warningLevelName: warningLevelNames.normal,
    reportDate: '2026-03-31',
    reportPeriod: '2026年一季度',
    thresholdInfo: '预警值70%，危险值85%'
  },
  {
    id: 'fi_005',
    bondId: 'bond_002',
    bondName: '23粤海02',
    issuerId: 'issuer_002',
    issuerName: '广东粤海控股集团有限公司',
    indicatorCode: 'roe',
    indicatorName: '净资产收益率',
    currentValue: 12.6,
    lastValue: 11.8,
    changeValue: 0.8,
    warningLevel: 'normal',
    warningLevelName: warningLevelNames.normal,
    reportDate: '2026-03-31',
    reportPeriod: '2026年一季度',
    thresholdInfo: '预警值8%，危险值3%'
  },
  {
    id: 'fi_006',
    bondId: 'bond_002',
    bondName: '23粤海02',
    issuerId: 'issuer_002',
    issuerName: '广东粤海控股集团有限公司',
    indicatorCode: 'ebitda_interest',
    indicatorName: 'EBITDA利息保障倍数',
    currentValue: 5.2,
    lastValue: 4.9,
    changeValue: 0.3,
    warningLevel: 'normal',
    warningLevelName: warningLevelNames.normal,
    reportDate: '2026-03-31',
    reportPeriod: '2026年一季度',
    thresholdInfo: '预警值3倍，危险值1.5倍'
  },
  // 债券3 - 21蓝光03 - 高风险
  {
    id: 'fi_007',
    bondId: 'bond_003',
    bondName: '21蓝光03',
    issuerId: 'issuer_003',
    issuerName: '四川蓝光发展股份有限公司',
    indicatorCode: 'debt_ratio',
    indicatorName: '资产负债率',
    currentValue: 92.1,
    lastValue: 89.7,
    changeValue: 2.4,
    warningLevel: 'danger',
    warningLevelName: warningLevelNames.danger,
    reportDate: '2026-03-31',
    reportPeriod: '2026年一季度',
    thresholdInfo: '预警值70%，危险值85%'
  },
  {
    id: 'fi_008',
    bondId: 'bond_003',
    bondName: '21蓝光03',
    issuerId: 'issuer_003',
    issuerName: '四川蓝光发展股份有限公司',
    indicatorCode: 'quick_ratio',
    indicatorName: '速动比率',
    currentValue: 0.35,
    lastValue: 0.42,
    changeValue: -0.07,
    warningLevel: 'danger',
    warningLevelName: warningLevelNames.danger,
    reportDate: '2026-03-31',
    reportPeriod: '2026年一季度',
    thresholdInfo: '预警值1.0，危险值0.5'
  },
  {
    id: 'fi_009',
    bondId: 'bond_003',
    bondName: '21蓝光03',
    issuerId: 'issuer_003',
    issuerName: '四川蓝光发展股份有限公司',
    indicatorCode: 'operating_cash_flow',
    indicatorName: '经营现金流净额',
    currentValue: -12.8,
    lastValue: -8.5,
    changeValue: -4.3,
    warningLevel: 'danger',
    warningLevelName: warningLevelNames.danger,
    reportDate: '2026-03-31',
    reportPeriod: '2026年一季度',
    thresholdInfo: '预警值0亿元，危险值-5亿元'
  },
  // 债券4 - 22首钢01 - 关注状态
  {
    id: 'fi_010',
    bondId: 'bond_004',
    bondName: '22首钢01',
    issuerId: 'issuer_004',
    issuerName: '首钢集团有限公司',
    indicatorCode: 'net_profit_margin',
    indicatorName: '净利润率',
    currentValue: 4.2,
    lastValue: 6.8,
    changeValue: -2.6,
    warningLevel: 'attention',
    warningLevelName: warningLevelNames.attention,
    reportDate: '2026-03-31',
    reportPeriod: '2026年一季度',
    thresholdInfo: '预警值5%，危险值0%'
  },
  {
    id: 'fi_011',
    bondId: 'bond_004',
    bondName: '22首钢01',
    issuerId: 'issuer_004',
    issuerName: '首钢集团有限公司',
    indicatorCode: 'asset_liability_ratio',
    indicatorName: '产权比率',
    currentValue: 158.6,
    lastValue: 148.3,
    changeValue: 10.3,
    warningLevel: 'warning',
    warningLevelName: warningLevelNames.warning,
    reportDate: '2026-03-31',
    reportPeriod: '2026年一季度',
    thresholdInfo: '预警值150%，危险值200%'
  }
];

// 生成近12个月历史数据
function generateHistoryData(baseValue: number, volatility: number, trend: number = 0): IndicatorHistoryPoint[] {
  const result: IndicatorHistoryPoint[] = [];
  const months = ['2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03'];
  let currentValue = baseValue - trend * 11;
  months.forEach(month => {
    currentValue = currentValue + (Math.random() - 0.5) * volatility * 2 + trend;
    result.push({
      date: month,
      value: Number(currentValue.toFixed(2))
    });
  });
  return result;
}

// 财务指标历史趋势数据
export const mockIndicatorHistory: Record<string, IndicatorHistoryPoint[]> = {
  // 华远地产 - 资产负债率恶化趋势
  'bond_001_debt_ratio': generateHistoryData(78.5, 2, 0.5),
  'bond_001_current_ratio': generateHistoryData(1.3, 0.15, -0.03),
  'bond_001_net_profit_margin': generateHistoryData(-2.8, 3, -0.8),
  // 粤海控股 - 指标健康
  'bond_002_debt_ratio': generateHistoryData(58.3, 1.5, 0),
  'bond_002_roe': generateHistoryData(12.6, 1, 0.1),
  'bond_002_ebitda_interest': generateHistoryData(5.2, 0.5, 0.05),
  // 蓝光发展 - 严重恶化
  'bond_003_debt_ratio': generateHistoryData(92.1, 2, 0.8),
  'bond_003_quick_ratio': generateHistoryData(0.35, 0.1, -0.02),
  'bond_003_operating_cash_flow': generateHistoryData(-12.8, 4, -1.2),
  // 首钢集团 - 小幅下滑
  'bond_004_net_profit_margin': generateHistoryData(4.2, 2, -0.4),
  'bond_004_asset_liability_ratio': generateHistoryData(158.6, 8, 1.5)
};

// 财务预警记录列表
export const mockFinanceWarnings: FinanceWarning[] = [
  {
    id: 'fw_001',
    bondId: 'bond_003',
    bondName: '21蓝光03',
    issuerName: '四川蓝光发展股份有限公司',
    indicatorName: '资产负债率',
    currentValue: 92.1,
    thresholdValue: 85,
    warningLevel: 'danger',
    warningLevelName: warningLevelNames.danger,
    triggerDate: '2026-04-28',
    handled: false
  },
  {
    id: 'fw_002',
    bondId: 'bond_001',
    bondName: '22华远01',
    issuerName: '华远地产股份有限公司',
    indicatorName: '净利润率',
    currentValue: -2.8,
    thresholdValue: 0,
    warningLevel: 'danger',
    warningLevelName: warningLevelNames.danger,
    triggerDate: '2026-04-26',
    handled: false
  },
  {
    id: 'fw_003',
    bondId: 'bond_003',
    bondName: '21蓝光03',
    issuerName: '四川蓝光发展股份有限公司',
    indicatorName: '速动比率',
    currentValue: 0.35,
    thresholdValue: 0.5,
    warningLevel: 'danger',
    warningLevelName: warningLevelNames.danger,
    triggerDate: '2026-04-28',
    handled: true,
    handler: '张明',
    handleDate: '2026-05-02',
    handleNote: '已发送风险提示函，要求补充流动性说明'
  },
  {
    id: 'fw_004',
    bondId: 'bond_001',
    bondName: '22华远01',
    issuerName: '华远地产股份有限公司',
    indicatorName: '资产负债率',
    currentValue: 78.5,
    thresholdValue: 70,
    warningLevel: 'warning',
    warningLevelName: warningLevelNames.warning,
    triggerDate: '2026-04-26',
    handled: false
  },
  {
    id: 'fw_005',
    bondId: 'bond_004',
    bondName: '22首钢01',
    issuerName: '首钢集团有限公司',
    indicatorName: '产权比率',
    currentValue: 158.6,
    thresholdValue: 150,
    warningLevel: 'warning',
    warningLevelName: warningLevelNames.warning,
    triggerDate: '2026-04-30',
    handled: true,
    handler: '李华',
    handleDate: '2026-05-05',
    handleNote: '钢铁行业周期影响，持续关注后续季度数据'
  },
  {
    id: 'fw_006',
    bondId: 'bond_003',
    bondName: '21蓝光03',
    issuerName: '四川蓝光发展股份有限公司',
    indicatorName: '经营现金流净额',
    currentValue: -12.8,
    thresholdValue: -5,
    warningLevel: 'danger',
    warningLevelName: warningLevelNames.danger,
    triggerDate: '2026-04-28',
    handled: false
  },
  {
    id: 'fw_007',
    bondId: 'bond_001',
    bondName: '22华远01',
    issuerName: '华远地产股份有限公司',
    indicatorName: '流动比率',
    currentValue: 1.3,
    thresholdValue: 1.5,
    warningLevel: 'warning',
    warningLevelName: warningLevelNames.warning,
    triggerDate: '2026-04-26',
    handled: false
  },
  {
    id: 'fw_008',
    bondId: 'bond_004',
    bondName: '22首钢01',
    issuerName: '首钢集团有限公司',
    indicatorName: '净利润率',
    currentValue: 4.2,
    thresholdValue: 5,
    warningLevel: 'attention',
    warningLevelName: warningLevelNames.attention,
    triggerDate: '2026-04-30',
    handled: false
  }
];
