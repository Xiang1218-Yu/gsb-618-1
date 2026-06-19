import { useState } from 'react';
import { Wallet, TrendingDown, CheckCircle, Clock, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import StatusBadge from '../../components/common/StatusBadge';
import { useAppStore } from '../../store';

// 募集资金追踪页面
const FundsPage = () => {
  const { fundRecords } = useAppStore();
  const [selectedFund, setSelectedFund] = useState(fundRecords[0] || null);

  // 图表颜色
  const COLORS = ['#3b82f6', '#e2e8f0'];

  // 根据资金流水动态计算用途分布
  const getUsageDistribution = () => {
    if (!selectedFund) return [];
    const categoryMap = new Map<string, number>();
    selectedFund.fundFlows.forEach((flow) => {
      const current = categoryMap.get(flow.usageCategory) || 0;
      categoryMap.set(flow.usageCategory, current + flow.amount);
    });
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  };

  // 柱状图颜色配置
  const barColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // 获取审批状态样式
  const getApprovalStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: '已审批', variant: 'success' as const, icon: CheckCircle };
      case 'pending':
        return { label: '待审批', variant: 'warning' as const, icon: Clock };
      case 'rejected':
        return { label: '已驳回', variant: 'danger' as const, icon: XCircle };
      default:
        return { label: '待审批', variant: 'default' as const, icon: Clock };
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">募集资金追踪</h1>
        <p className="text-slate-500 mt-1">追踪债券募集资金的到账、使用和流向情况</p>
      </div>

      {/* 资金概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {fundRecords.map((fund) => (
          <div
            key={fund.id}
            onClick={() => setSelectedFund(fund)}
            className={`bg-white rounded-xl border p-6 cursor-pointer transition-all hover:shadow-lg
              ${selectedFund?.id === fund.id
                ? 'border-blue-500 ring-2 ring-blue-100'
                : 'border-slate-200'
              }
              ${fund.complianceStatus === 'warning' ? 'border-l-4 border-l-amber-500' : ''}
              ${fund.complianceStatus === 'abnormal' ? 'border-l-4 border-l-red-500' : ''}
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">{fund.bondName}</h3>
              <StatusBadge
                status={fund.complianceStatus}
                variant={
                  fund.complianceStatus === 'normal' ? 'success' :
                  fund.complianceStatus === 'warning' ? 'warning' : 'danger'
                }
              >
                {fund.complianceStatus === 'normal' ? '合规' :
                 fund.complianceStatus === 'warning' ? '待核实' : '异常'}
              </StatusBadge>
            </div>
            <div className="flex items-center justify-center h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: '已使用', value: fund.usedAmount },
                      { name: '剩余', value: fund.remainingAmount }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#e2e8f0" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
              <p className="text-2xl font-bold text-slate-900">{fund.usedAmount}<span className="text-sm font-normal text-slate-500">/{fund.totalAmount}亿元</span></p>
              <p className="text-sm text-slate-500 mt-1">已使用 {((fund.usedAmount / fund.totalAmount) * 100).toFixed(1)}%</p>
            </div>
            <p className="text-xs text-slate-500 mt-3 line-clamp-2">
              <FileText className="w-3 h-3 inline mr-1" />
              {fund.purpose}
            </p>
          </div>
        ))}
      </div>

      {/* 资金详情 */}
      {selectedFund && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 资金流水 */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">资金流水明细</h3>
              <p className="text-sm text-slate-500 mt-1">{selectedFund.bondName}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">日期</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">金额</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">用途说明</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">审批人</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">状态</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">合规</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedFund.fundFlows.map((flow) => {
                    const statusCfg = getApprovalStatusConfig(flow.approvalStatus);
                    const StatusIcon = statusCfg.icon;
                    return (
                      <tr key={flow.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm text-slate-900">{flow.date}</td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-900">{flow.amount}</span>
                          <span className="text-sm text-slate-500">亿元</span>
                        </td>
                        <td className={`px-6 py-4 text-sm max-w-xs truncate ${!flow.isCompliant ? 'text-red-600 font-medium' : 'text-slate-700'}`}>
                          {flow.usageDescription}
                          {!flow.isCompliant && <AlertTriangle className="w-4 h-4 inline ml-1 text-red-500" />}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">{flow.approver}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <StatusIcon className={`w-4 h-4 ${
                              flow.approvalStatus === 'approved' ? 'text-emerald-500' :
                              flow.approvalStatus === 'pending' ? 'text-amber-500' : 'text-red-500'
                            }`} />
                            <StatusBadge status={flow.approvalStatus} variant={statusCfg.variant}>
                              {statusCfg.label}
                            </StatusBadge>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {flow.isCompliant ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 text-sm">
                              <CheckCircle className="w-4 h-4" /> 合规
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-600 text-sm">
                              <XCircle className="w-4 h-4" /> 异常
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 用途统计 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">用途分布</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getUsageDistribution()}
                  layout="vertical"
                >
                  <XAxis type="number" unit="亿" />
                  <YAxis type="category" dataKey="name" width={100} fontSize={12} />
                  <Tooltip formatter={(value: number) => [`${value}亿元`, '金额']} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {getUsageDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">资金概览</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div>
                    <p className="text-xs text-blue-600">总额度</p>
                    <p className="text-lg font-bold text-blue-900">{selectedFund.totalAmount}亿</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">已使用</p>
                    <p className="text-lg font-bold text-blue-900">{selectedFund.usedAmount}亿</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">剩余</p>
                    <p className="text-lg font-bold text-blue-900">{selectedFund.remainingAmount}亿</p>
                  </div>
                </div>
              </div>

              {selectedFund.complianceStatus !== 'normal' && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span className="font-medium text-amber-900">合规提醒</span>
                  </div>
                  <p className="text-sm text-amber-700">
                    发现一笔资金用途标注为"偿还银行贷款"，与募集说明书约定用途不符，需进一步核实。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundsPage;
