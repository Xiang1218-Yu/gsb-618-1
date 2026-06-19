import { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, FileBarChart } from 'lucide-react';
import { useAppStore, debtRatioTrend } from '@/store';
import { getRiskLevelClass, getRiskLevelText, formatDate, formatPercent, getBondTypeText } from '@/utils/formatters';
import { MultiLineChart, GaugeChart } from '@/components/charts';
import { RiskLevel } from '@/types';

/**
 * 财务监控中心页面
 * 展示债券财务指标监控、风险预警、趋势分析等功能
 */
const FinanceMonitor = () => {
  const bonds = useAppStore((state) => state.bonds);
  const getFinancialIndicesByBondId = useAppStore((state) => state.getFinancialIndicesByBondId);

  /**
   * 获取所有财务指标数据
   */
  const allFinancialIndices = useMemo(() => {
    const indices: Array<{
      id: string;
      bondId: string;
      bondName: string;
      bondType: string;
      indexName: string;
      value: number;
      unit: string;
      warningThreshold: number;
      criticalThreshold: number;
      period: string;
      status: RiskLevel;
      reportDate: string;
      isBetter: boolean;
    }> = [];

    bonds.forEach((bond) => {
      const bondIndices = getFinancialIndicesByBondId(bond.id);
      bondIndices.forEach((index) => {
        indices.push({
          ...index,
          bondName: bond.bondName,
          bondType: bond.bondType,
        });
      });
    });

    return indices;
  }, [bonds, getFinancialIndicesByBondId]);

  /**
   * 获取高风险债券（资产负债率超标）
   */
  const highRiskBonds = useMemo(() => {
    return allFinancialIndices
      .filter((index) => index.indexName === '资产负债率' && index.status === RiskLevel.High)
      .map((index) => {
        const bond = bonds.find((b) => b.id === index.bondId);
        return {
          ...index,
          issuerName: bond?.issuer?.issuerName || '',
          bondCode: bond?.bondCode || '',
          issueAmount: bond?.issueAmount || 0,
        };
      });
  }, [allFinancialIndices, bonds]);

  /**
   * 获取bond-002盛世地产的4个财务指标用于仪表盘展示
   */
  const shengshiIndices = useMemo(() => {
    return getFinancialIndicesByBondId('bond-002');
  }, [getFinancialIndicesByBondId]);

  /**
   * 资产负债率指标
   */
  const debtRatioIndex = shengshiIndices.find((i) => i.indexName === '资产负债率');
  /**
   * 流动比率指标
   */
  const currentRatioIndex = shengshiIndices.find((i) => i.indexName === '流动比率');
  /**
   * 速动比率指标
   */
  const quickRatioIndex = shengshiIndices.find((i) => i.indexName === '速动比率');
  /**
   * EBITDA利息保障倍数指标
   */
  const ebitdaIndex = shengshiIndices.find((i) => i.indexName === 'EBITDA利息保障倍数');

  /**
   * 多折线图配置
   */
  const multiLineConfig = {
    data: debtRatioTrend,
    xAxisKey: 'period',
    lines: [
      { key: '华信能源', name: '华信能源', color: '#0A2463' },
      { key: '盛世地产', name: '盛世地产', color: '#E63946' },
      { key: '天合交通', name: '天合交通', color: '#2A9D8F' },
    ],
    height: 320,
  };

  /**
   * 获取指标状态图标
   * @param status 风险等级
   * @returns 对应图标组件
   */
  const getStatusIcon = (status: RiskLevel) => {
    switch (status) {
      case RiskLevel.High:
        return <AlertTriangle className="w-4 h-4" />;
      case RiskLevel.Medium:
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  /**
   * 格式化指标值显示
   * @param value 指标值
   * @param unit 单位
   * @param isPercent 是否为百分比类型
   * @returns 格式化后的字符串
   */
  const formatIndexValue = (value: number, unit: string, indexName: string): string => {
    if (indexName === '资产负债率') {
      return formatPercent(value, 1);
    }
    return `${value.toFixed(2)}${unit}`;
  };

  /**
   * 格式化阈值显示
   * @param warning 预警阈值
   * @param critical 处置阈值
   * @param isBetter 是否值越高越好
   * @returns 阈值说明文字
   */
  const formatThreshold = (warning: number, critical: number, isBetter: boolean, indexName: string): string => {
    if (indexName === '资产负债率') {
      return `预警:${formatPercent(warning, 0)} / 处置:${formatPercent(critical, 0)}`;
    }
    if (isBetter) {
      return `≥${warning}正常 / ≥${critical}安全`;
    }
    return `≤${warning}正常 / ≤${critical}安全`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题区域 */}
      <div className="page-card bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <FileBarChart className="w-8 h-8 text-gold-400" />
            <h1 className="text-2xl font-bold text-white font-serif">财务监控中心</h1>
          </div>
          <p className="text-primary-200 text-sm max-w-3xl">
            实时监控在管债券发行人财务指标变化，重点跟踪资产负债率、流动比率等核心偿债能力指标，及时识别财务风险并预警。
          </p>
        </div>
      </div>

      {/* 重点监控债券区域 - 高风险债券 */}
      {highRiskBonds.length > 0 && (
        <div className="page-card p-6 border-l-4 border-red-500 bg-red-50/50">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600 animate-blink" />
            <h3 className="text-lg font-semibold text-red-800 font-serif">重点监控债券 - 资产负债率超标</h3>
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
              {highRiskBonds.length} 只
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {highRiskBonds.map((bond) => (
              <div
                key={bond.bondId}
                className="stat-card bg-white border border-red-200 hover:border-red-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-800">{bond.bondName}</h4>
                    <p className="text-xs text-slate-500">{bond.bondCode} · {bond.issuerName}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded border border-red-200 font-medium">
                    高风险
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">资产负债率</p>
                    <p className="text-2xl font-bold text-red-600">{formatPercent(bond.value, 1)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">发行规模</p>
                    <p className="text-sm font-medium text-slate-700">{bond.issueAmount}亿元</p>
                    <p className="text-xs text-slate-400 mt-1">{bond.period}</p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full"
                    style={{ width: `${Math.min(bond.value, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-slate-400">
                  <span>0%</span>
                  <span className="text-orange-500">预警70%</span>
                  <span className="text-red-500">处置75%</span>
                  <span>100%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 财务指标仪表盘区域 - 盛世地产 */}
      <div className="page-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 font-serif flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              盛世地产 - 关键财务指标仪表盘
            </h3>
            <p className="text-sm text-slate-500 mt-1">bond-002 · 23盛世02 · 2024年一季度</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskLevelClass(RiskLevel.High)}`}>
            高风险
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 资产负债率仪表盘 */}
          {debtRatioIndex && (
            <div className="text-center p-4 rounded-xl bg-gradient-to-b from-red-50 to-white border border-red-100">
              <GaugeChart
                value={debtRatioIndex.value}
                min={0}
                max={100}
                name="资产负债率"
                unit="%"
                height={180}
                thresholds={{
                  warning: debtRatioIndex.warningThreshold,
                  critical: debtRatioIndex.criticalThreshold,
                  isBetter: debtRatioIndex.isBetter,
                }}
              />
              <p className="text-xs text-slate-500 mt-2">
                预警线: {formatPercent(debtRatioIndex.warningThreshold, 0)}
              </p>
            </div>
          )}
          {/* 流动比率仪表盘 */}
          {currentRatioIndex && (
            <div className="text-center p-4 rounded-xl bg-gradient-to-b from-red-50 to-white border border-red-100">
              <GaugeChart
                value={currentRatioIndex.value}
                min={0}
                max={3}
                name="流动比率"
                unit=""
                height={180}
                thresholds={{
                  warning: currentRatioIndex.warningThreshold,
                  critical: currentRatioIndex.criticalThreshold,
                  isBetter: currentRatioIndex.isBetter,
                }}
              />
              <p className="text-xs text-slate-500 mt-2">
                安全值: ≥{currentRatioIndex.warningThreshold}
              </p>
            </div>
          )}
          {/* 速动比率仪表盘 */}
          {quickRatioIndex && (
            <div className="text-center p-4 rounded-xl bg-gradient-to-b from-red-50 to-white border border-red-100">
              <GaugeChart
                value={quickRatioIndex.value}
                min={0}
                max={2}
                name="速动比率"
                unit=""
                height={180}
                thresholds={{
                  warning: quickRatioIndex.warningThreshold,
                  critical: quickRatioIndex.criticalThreshold,
                  isBetter: quickRatioIndex.isBetter,
                }}
              />
              <p className="text-xs text-slate-500 mt-2">
                安全值: ≥{quickRatioIndex.warningThreshold}
              </p>
            </div>
          )}
          {/* EBITDA利息保障倍数仪表盘 */}
          {ebitdaIndex && (
            <div className="text-center p-4 rounded-xl bg-gradient-to-b from-red-50 to-white border border-red-100">
              <GaugeChart
                value={ebitdaIndex.value}
                min={0}
                max={6}
                name="EBITDA利息保障倍数"
                unit="倍"
                height={180}
                thresholds={{
                  warning: ebitdaIndex.warningThreshold,
                  critical: ebitdaIndex.criticalThreshold,
                  isBetter: ebitdaIndex.isBetter,
                }}
              />
              <p className="text-xs text-slate-500 mt-2">
                安全值: ≥{ebitdaIndex.warningThreshold}倍
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 资产负债率趋势图 */}
      <div className="page-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 font-serif flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gold-600" />
            资产负债率趋势对比
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#0A2463]"></span>
              <span className="text-slate-600">华信能源</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#E63946]"></span>
              <span className="text-slate-600">盛世地产</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#2A9D8F]"></span>
              <span className="text-slate-600">天合交通</span>
            </div>
          </div>
        </div>
        <MultiLineChart
          data={multiLineConfig.data}
          xAxisKey={multiLineConfig.xAxisKey}
          lines={multiLineConfig.lines}
          height={multiLineConfig.height}
        />
        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            盛世地产资产负债率自2023年Q3起持续超过75%处置阈值，需重点关注其偿债能力变化。
          </p>
        </div>
      </div>

      {/* 财务指标明细表 */}
      <div className="page-card overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 font-serif flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-primary-600" />
            财务指标明细表
          </h3>
          <p className="text-sm text-slate-500 mt-1">全部在管债券最新财务指标数据</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-800">
                <th className="table-header px-6 py-3 text-left text-xs font-semibold text-gold-300 uppercase tracking-wider">
                  指标名称
                </th>
                <th className="table-header px-6 py-3 text-left text-xs font-semibold text-gold-300 uppercase tracking-wider">
                  债券名称
                </th>
                <th className="table-header px-6 py-3 text-left text-xs font-semibold text-gold-300 uppercase tracking-wider">
                  债券类型
                </th>
                <th className="table-header px-6 py-3 text-left text-xs font-semibold text-gold-300 uppercase tracking-wider">
                  报告期
                </th>
                <th className="table-header px-6 py-3 text-right text-xs font-semibold text-gold-300 uppercase tracking-wider">
                  指标值
                </th>
                <th className="table-header px-6 py-3 text-left text-xs font-semibold text-gold-300 uppercase tracking-wider">
                  阈值标准
                </th>
                <th className="table-header px-6 py-3 text-center text-xs font-semibold text-gold-300 uppercase tracking-wider">
                  状态
                </th>
                <th className="table-header px-6 py-3 text-left text-xs font-semibold text-gold-300 uppercase tracking-wider">
                  报告日期
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {allFinancialIndices.map((index, idx) => (
                <tr
                  key={index.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    index.status === RiskLevel.High ? 'bg-red-50/30' : ''
                  }`}
                >
                  <td className="table-cell px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {index.status === RiskLevel.High ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : index.status === RiskLevel.Medium ? (
                        <TrendingDown className="w-4 h-4 text-orange-500" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                      )}
                      <span className="font-medium text-slate-800">{index.indexName}</span>
                    </div>
                  </td>
                  <td className="table-cell px-6 py-4 whitespace-nowrap">
                    <span className="text-slate-800 font-medium">{index.bondName}</span>
                  </td>
                  <td className="table-cell px-6 py-4 whitespace-nowrap">
                    <span className="text-slate-600 text-sm">{getBondTypeText(index.bondType)}</span>
                  </td>
                  <td className="table-cell px-6 py-4 whitespace-nowrap">
                    <span className="text-slate-600 text-sm">{index.period}</span>
                  </td>
                  <td className="table-cell px-6 py-4 whitespace-nowrap text-right">
                    <span
                      className={`font-bold text-lg ${
                        index.status === RiskLevel.High
                          ? 'text-red-600'
                          : index.status === RiskLevel.Medium
                          ? 'text-orange-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {formatIndexValue(index.value, index.unit, index.indexName)}
                    </span>
                  </td>
                  <td className="table-cell px-6 py-4 whitespace-nowrap">
                    <span className="text-slate-500 text-sm">
                      {formatThreshold(index.warningThreshold, index.criticalThreshold, index.isBetter, index.indexName)}
                    </span>
                  </td>
                  <td className="table-cell px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getRiskLevelClass(
                        index.status
                      )}`}
                    >
                      {getStatusIcon(index.status)}
                      {getRiskLevelText(index.status)}
                    </span>
                  </td>
                  <td className="table-cell px-6 py-4 whitespace-nowrap">
                    <span className="text-slate-500 text-sm">{formatDate(index.reportDate)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allFinancialIndices.length === 0 && (
          <div className="p-12 text-center text-slate-400">暂无财务指标数据</div>
        )}
      </div>
    </div>
  );
};

export default FinanceMonitor;
