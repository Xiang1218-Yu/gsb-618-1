import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Building2, Calendar, DollarSign, Activity, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { useAppStore } from '../../store';
import type { FinancialIndicator } from '../../types';

// 财务指标监控页面
const FinancialPage = () => {
  const { durationBonds, financialIndicators } = useAppStore();
  const [selectedBondId, setSelectedBondId] = useState(durationBonds[0]?.id || '');
  const [selectedIndicator, setSelectedIndicator] = useState<FinancialIndicator | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const selectedBond = durationBonds.find((b) => b.id === selectedBondId);

  // 获取该债券的财务指标
  const bondIndicators = financialIndicators.filter((ind) => ind.bondId === selectedBondId);

  // 获取指标趋势图标
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  // 获取指标状态
  const getIndicatorStatus = (indicator: FinancialIndicator) => {
    if (indicator.isAbnormal) {
      return { variant: 'danger' as const, label: '异常', icon: AlertTriangle };
    }
    return { variant: 'success' as const, label: '正常', icon: CheckCircle };
  };

  // 趋势图数据（模拟）
  const trendChartData = bondIndicators.length > 0 ? [
    { quarter: 'Q1', value: bondIndicators[0]?.value ? bondIndicators[0].value * 0.9 : 4.2, threshold: bondIndicators[0]?.threshold || 5 },
    { quarter: 'Q2', value: bondIndicators[0]?.value ? bondIndicators[0].value * 0.95 : 4.5, threshold: bondIndicators[0]?.threshold || 5 },
    { quarter: 'Q3', value: bondIndicators[0]?.value ? bondIndicators[0].value * 0.98 : 4.8, threshold: bondIndicators[0]?.threshold || 5 },
    { quarter: 'Q4', value: bondIndicators[0]?.value || 5.2, threshold: bondIndicators[0]?.threshold || 5 }
  ] : [];

  // 资产负债数据（模拟）
  const balanceSheetData = [
    { month: '1月', assets: 520, liabilities: 310 },
    { month: '2月', assets: 530, liabilities: 315 },
    { month: '3月', assets: 545, liabilities: 320 },
    { month: '4月', assets: 560, liabilities: 325 },
    { month: '5月', assets: 575, liabilities: 330 },
    { month: '6月', assets: 590, liabilities: 335 }
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">财务指标监控</h1>
        <p className="text-slate-500 mt-1">自动追踪发行人关键财务指标，及时发现异常波动</p>
      </div>

      {/* 发行人选择 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">选择发行人：</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {durationBonds.map((bond) => (
              <button
                key={bond.id}
                onClick={() => setSelectedBondId(bond.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${selectedBondId === bond.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                {bond.issuerName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedBond && (
        <>
          {/* 发行人基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">主体评级</p>
                  <p className="text-lg font-bold text-slate-900">AAA</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">总资产</p>
                  <p className="text-lg font-bold text-slate-900">590<span className="text-sm font-normal text-slate-500">亿元</span></p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">资产负债率</p>
                  <p className="text-lg font-bold text-slate-900">56.8<span className="text-sm font-normal text-slate-500">%</span></p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">报告期</p>
                  <p className="text-lg font-bold text-slate-900">2024Q2</p>
                </div>
              </div>
            </div>
          </div>

          {/* 指标异常提醒 */}
          {bondIndicators.some((ind) => ind.isAbnormal) && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">指标异常提醒</p>
                  <div className="mt-2 space-y-1">
                    {bondIndicators.filter((ind) => ind.isAbnormal).map((ind) => (
                      <p key={ind.id} className="text-sm text-red-700">
                        · {ind.name}当前值{ind.value}%，{ind.comparisonDescription}，阈值为{ind.threshold}%
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 财务指标列表 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">关键财务指标</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">指标名称</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">当前值</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">预警阈值</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">趋势</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">状态</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">报告期</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bondIndicators.map((indicator) => {
                    const statusCfg = getIndicatorStatus(indicator);
                    const StatusIcon = statusCfg.icon;
                    return (
                      <tr key={indicator.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-900">{indicator.name}</p>
                            <p className="text-sm text-slate-500 mt-1">{indicator.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-lg font-bold ${indicator.isAbnormal ? 'text-red-600' : 'text-slate-900'}`}>
                            {indicator.value}<span className="text-sm font-normal text-slate-500">{indicator.unit}</span>
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600">{indicator.threshold}{indicator.unit}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getTrendIcon(indicator.trend)}
                            <span className="text-sm text-slate-600">{indicator.comparisonDescription}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={indicator.isAbnormal ? 'danger' : 'success'} variant={statusCfg.variant}>
                            <span className="inline-flex items-center gap-1">
                              <StatusIcon className="w-3 h-3" />
                              {statusCfg.label}
                            </span>
                          </StatusBadge>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-500">{indicator.reportPeriod}</p>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => { setSelectedIndicator(indicator); setShowDetailModal(true); }}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-blue-600 inline-flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">详情</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 趋势图表 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">资产负债率趋势</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="quarter" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="资产负债率(%)" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                  <Line type="monotone" dataKey="threshold" name="预警线(%)" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">资产负债变化</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={balanceSheetData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="assets" name="总资产(亿元)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="liabilities" name="总负债(亿元)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* 指标详情弹窗 */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="指标详情"
      >
        {selectedIndicator && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">指标名称</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">{selectedIndicator.name}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">当前值</p>
                <p className={`text-lg font-bold mt-1 ${selectedIndicator.isAbnormal ? 'text-red-600' : 'text-emerald-600'}`}>
                  {selectedIndicator.value}{selectedIndicator.unit}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">预警阈值</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">{selectedIndicator.threshold}{selectedIndicator.unit}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">报告期</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">{selectedIndicator.reportPeriod}</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-2">指标说明</p>
              <p className="text-sm text-slate-700">{selectedIndicator.description}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-2">变动分析</p>
              <p className="text-sm text-slate-700">
                {selectedIndicator.comparisonDescription}。
                {selectedIndicator.isAbnormal
                  ? '该指标已超过预警阈值，建议密切关注发行人经营状况，及时采取风险应对措施。'
                  : '该指标处于正常区间，发行人财务状况稳健。'}
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                知道了
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FinancialPage;
