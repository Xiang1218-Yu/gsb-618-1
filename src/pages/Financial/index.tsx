import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatusBadge from '../../components/common/StatusBadge';
import { useAppStore } from '../../store';

// 财务指标监控页面
const FinancialPage = () => {
  const { financialIndicators } = useAppStore();

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'warning':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'danger':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  // 获取趋势图标
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

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'warning':
        return '预警';
      case 'danger':
        return '危险';
      default:
        return '未知';
    }
  };

  // 按债券分组指标
  const groupedIndicators = financialIndicators.reduce((acc, indicator) => {
    if (!acc[indicator.bondName]) {
      acc[indicator.bondName] = [];
    }
    acc[indicator.bondName].push(indicator);
    return acc;
  }, {} as Record<string, typeof financialIndicators>);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">财务指标监控</h1>
        <p className="text-slate-500 mt-1">自动监控发行人关键财务指标，实时预警异常波动</p>
      </div>

      {/* 预警提示 */}
      {financialIndicators.some((i) => i.status !== 'normal') && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900">财务指标预警提醒</p>
            <p className="text-sm text-amber-700 mt-1">
              当前有 {financialIndicators.filter((i) => i.status === 'danger').length} 个指标处于危险状态，
              {financialIndicators.filter((i) => i.status === 'warning').length} 个指标触发预警阈值，
              请及时关注相关发行人的偿债能力变化。
            </p>
          </div>
        </div>
      )}

      {/* 指标面板 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {financialIndicators.map((indicator) => (
          <div
            key={indicator.id}
            className={`bg-white rounded-xl border p-5 shadow-sm transition-all hover:shadow-md
              ${indicator.status === 'danger' ? 'border-l-4 border-l-red-500' : ''}
              ${indicator.status === 'warning' ? 'border-l-4 border-l-amber-500' : ''}
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900">{indicator.indicatorName}</h3>
                <p className="text-xs text-slate-500 mt-1">{indicator.bondName}</p>
              </div>
              <StatusBadge
                status={indicator.status}
                variant={
                  indicator.status === 'normal' ? 'success' :
                  indicator.status === 'warning' ? 'warning' : 'danger'
                }
              >
                {getStatusText(indicator.status)}
              </StatusBadge>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className={`text-3xl font-bold ${
                indicator.status === 'danger' ? 'text-red-600' :
                indicator.status === 'warning' ? 'text-amber-600' : 'text-slate-900'
              }`}>
                {indicator.currentValue}
              </span>
              <span className="text-slate-500">{indicator.unit}</span>
              <div className="ml-auto flex items-center gap-1">
                {getTrendIcon(indicator.trend)}
              </div>
            </div>

            {/* 阈值提示 */}
            <div className={`p-3 rounded-lg border ${getStatusColor(indicator.status)} mb-4`}>
              <div className="flex items-center justify-between text-xs">
                <span>预警阈值: {indicator.threshold.warning}{indicator.unit}</span>
                <span>危险阈值: {indicator.threshold.danger}{indicator.unit}</span>
              </div>
            </div>

            {/* 趋势图 */}
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={indicator.historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={
                      indicator.status === 'danger' ? '#ef4444' :
                      indicator.status === 'warning' ? '#f59e0b' : '#3b82f6'
                    }
                    strokeWidth={2}
                    dot={{ fill: indicator.status === 'danger' ? '#ef4444' : indicator.status === 'warning' ? '#f59e0b' : '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* 指标详情表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">指标监控明细</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">关联债券</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">指标名称</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">当前值</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">预警阈值</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">危险阈值</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">趋势</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {financialIndicators.map((indicator) => (
                <tr key={indicator.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{indicator.bondName}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{indicator.indicatorName}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${
                    indicator.status === 'danger' ? 'text-red-600' :
                    indicator.status === 'warning' ? 'text-amber-600' : 'text-slate-900'
                  }`}>
                    {indicator.currentValue}{indicator.unit}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{indicator.threshold.warning}{indicator.unit}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{indicator.threshold.danger}{indicator.unit}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {getTrendIcon(indicator.trend)}
                      <span className="text-sm text-slate-600">
                        {indicator.trend === 'up' ? '上升' : indicator.trend === 'down' ? '下降' : '平稳'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={indicator.status}
                      variant={
                        indicator.status === 'normal' ? 'success' :
                        indicator.status === 'warning' ? 'warning' : 'danger'
                      }
                    >
                      {getStatusText(indicator.status)}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialPage;
