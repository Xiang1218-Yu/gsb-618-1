import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, CheckCircle, XCircle, Clock, FileText, Download, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { useAppStore } from '../../store';

// 募集资金追踪页面
const FundsPage = () => {
  const { fundRecords } = useAppStore();
  const [selectedFundId, setSelectedFundId] = useState(fundRecords[0]?.id || '');
  const [showFlowDetail, setShowFlowDetail] = useState(false);
  const [selectedFlowIndex, setSelectedFlowIndex] = useState<number | null>(null);

  const selectedFund = fundRecords.find((f) => f.id === selectedFundId);

  // 图表颜色配置
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  // 获取状态样式
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: '已批准', variant: 'success' as const, icon: CheckCircle };
      case 'pending':
        return { label: '审批中', variant: 'warning' as const, icon: Clock };
      case 'rejected':
        return { label: '已拒绝', variant: 'danger' as const, icon: XCircle };
      default:
        return { label: '未知', variant: 'default' as const, icon: Clock };
    }
  };

  // 动态计算用途分布
  const getUsageDistribution = () => {
    if (!selectedFund) return [];
    const categoryMap = new Map<string, number>();
    selectedFund.fundFlows.forEach((flow) => {
      const current = categoryMap.get(flow.usageCategory) || 0;
      categoryMap.set(flow.usageCategory, current + flow.amount);
    });
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  };

  const usageDistribution = getUsageDistribution();

  // 查看资金流向详情
  const handleViewFlow = (index: number) => {
    setSelectedFlowIndex(index);
    setShowFlowDetail(true);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">募集资金追踪</h1>
        <p className="text-slate-500 mt-1">实时追踪募集资金到账、使用和结余情况</p>
      </div>

      {/* 债券选择 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {fundRecords.map((fund) => (
          <button
            key={fund.id}
            onClick={() => setSelectedFundId(fund.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
              ${selectedFundId === fund.id
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
          >
            {fund.bondName}
          </button>
        ))}
      </div>

      {selectedFund && (
        <>
          {/* 资金概览 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">募集总额</p>
                  <p className="text-xl font-bold text-slate-900">{selectedFund.totalAmount}<span className="text-sm font-normal text-slate-500">亿元</span></p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">已使用</p>
                  <p className="text-xl font-bold text-emerald-600">{selectedFund.usedAmount}<span className="text-sm font-normal text-slate-500">亿元</span></p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">待使用</p>
                  <p className="text-xl font-bold text-amber-600">{(selectedFund.totalAmount - selectedFund.usedAmount).toFixed(2)}<span className="text-sm font-normal text-slate-500">亿元</span></p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">合规率</p>
                  <p className="text-xl font-bold text-violet-600">{selectedFund.complianceRate}<span className="text-sm font-normal">%</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 资金用途分布饼图 */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">资金用途分布</h3>
                <button
                  onClick={() => alert('正在导出资金用途分布图...')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                  title="下载图表"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={usageDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {usageDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 资金使用柱状图 */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">资金使用明细</h3>
                <button
                  onClick={() => alert('正在导出资金使用明细...')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                  title="下载数据"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" name="金额(亿元)" radius={[4, 4, 0, 0]}>
                    {usageDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 资金流向明细 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">资金流向明细</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => alert('正在预览资金流向报告...')}
                  className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  预览报告
                </button>
                <button
                  onClick={() => alert('正在下载资金流向明细...')}
                  className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  下载
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">日期</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">金额(亿元)</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">用途分类</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">用途说明</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">审批人</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">合规</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedFund.fundFlows.map((flow, index) => {
                  const statusCfg = getStatusConfig(flow.approvalStatus);
                  return (
                    <tr key={flow.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-900">{flow.date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{flow.amount}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{flow.usageCategory}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{flow.usageDescription}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{flow.approver}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={flow.approvalStatus} variant={statusCfg.variant}>
                          {statusCfg.label}
                        </StatusBadge>
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
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewFlow(index)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-blue-600"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 资金流向详情弹窗 */}
      <Modal
        isOpen={showFlowDetail}
        onClose={() => setShowFlowDetail(false)}
        title="资金流向详情"
      >
        {selectedFund && selectedFlowIndex !== null && (
          <div className="space-y-4">
            {(() => {
              const flow = selectedFund.fundFlows[selectedFlowIndex];
              const statusCfg = getStatusConfig(flow.approvalStatus);
              return (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500">流水日期</p>
                      <p className="text-lg font-semibold text-slate-900 mt-1">{flow.date}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500">流出金额</p>
                      <p className="text-lg font-bold text-slate-900 mt-1">{flow.amount} 亿元</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500">用途分类</p>
                      <p className="text-lg font-semibold text-slate-900 mt-1">{flow.usageCategory}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500">审批状态</p>
                      <div className="mt-1">
                        <StatusBadge status={flow.approvalStatus} variant={statusCfg.variant}>
                          {statusCfg.label}
                        </StatusBadge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500 mb-2">用途说明</p>
                    <p className="text-sm text-slate-700">{flow.usageDescription}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500 mb-2">审批人</p>
                    <p className="text-sm text-slate-900 font-medium">{flow.approver}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500 mb-2">合规校验</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${flow.isCompliant ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {flow.isCompliant ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span className="text-sm font-medium">{flow.isCompliant ? '资金使用合规' : '资金使用存在异常，请核实'}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => alert('正在下载凭证...')}
                      className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      下载凭证
                    </button>
                    <button
                      onClick={() => setShowFlowDetail(false)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      关闭
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FundsPage;
