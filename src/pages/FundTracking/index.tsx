import { useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Banknote,
  Building,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useAppStore } from '@/store';
import {
  formatAmount,
  formatWanAmount,
  formatDate,
  getFundUsageTypeText,
  getBondTypeText,
} from '@/utils/formatters';
import { BarLineChart } from '@/components/charts';

/**
 * 募集资金追踪页面
 * 展示监管专户统计、资金到账信息、资金使用流水及合规状态
 */
const FundTracking = () => {
  const fundReceivedList = useAppStore((state) => state.fundReceivedList);
  const fundFlows = useAppStore((state) => state.fundFlows);
  const fundUsageTrend = useAppStore((state) => state.fundUsageTrend);
  const bonds = useAppStore((state) => state.bonds);

  /**
   * 根据债券ID获取债券信息
   * @param bondId 债券ID
   * @returns 债券对象
   */
  const getBondById = (bondId: string) => {
    return bonds.find((b) => b.id === bondId);
  };

  /**
   * 统计数据计算
   */
  const stats = useMemo(() => {
    const custodianCount = fundReceivedList.length;
    const totalReceived = fundReceivedList.reduce((sum, item) => sum + item.receivedAmount, 0);
    const totalDisbursedWan = fundFlows.reduce((sum, item) => sum + item.amount, 0);
    const nonCompliantCount = fundFlows.filter((f) => !f.isCompliant).length;
    const totalDisbursed = totalDisbursedWan / 10000;
    const usageProgress = totalReceived > 0 ? (totalDisbursed / totalReceived) * 100 : 0;

    return {
      custodianCount,
      totalReceived,
      totalDisbursed,
      totalDisbursedWan,
      nonCompliantCount,
      usageProgress,
    };
  }, [fundFlows, fundReceivedList, bonds]);

  /**
   * 统计卡片配置
   */
  const statCards = [
    {
      title: '监管专户数量',
      value: stats.custodianCount,
      unit: '个',
      icon: Building,
      color: 'from-primary-600 to-primary-800',
      iconBg: 'bg-primary-500/20',
      iconColor: '#0A2463',
      trend: '专户监管',
      trendUp: true,
    },
    {
      title: '到账总额',
      value: formatAmount(stats.totalReceived),
      unit: '',
      icon: Wallet,
      color: 'from-emerald-500 to-emerald-700',
      iconBg: 'bg-emerald-500/20',
      iconColor: '#059669',
      trend: '募集资金全额到账',
      trendUp: true,
    },
    {
      title: '已拨付金额',
      value: formatAmount(stats.totalDisbursed),
      unit: '',
      icon: Banknote,
      color: 'from-gold-500 to-gold-700',
      iconBg: 'bg-gold-500/20',
      iconColor: '#C19A2E',
      trend: `使用率 ${stats.usageProgress.toFixed(1)}%`,
      trendUp: stats.usageProgress > 50,
      progress: stats.usageProgress,
    },
    {
      title: '不合规笔数',
      value: stats.nonCompliantCount,
      unit: '笔',
      icon: AlertCircle,
      color: 'from-red-500 to-red-700',
      iconBg: 'bg-red-500/20',
      iconColor: '#DC2626',
      trend: stats.nonCompliantCount > 0 ? '需关注整改' : '全部合规',
      trendUp: stats.nonCompliantCount === 0,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题区域 */}
      <div className="page-card bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-primary-600/20 rounded-full translate-y-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white font-serif mb-2">募集资金追踪</h1>
          <p className="text-primary-200 text-sm">
            实时监控 {stats.custodianCount} 个监管专户资金流向，已到账 {formatAmount(stats.totalReceived)}，
            已拨付 {formatAmount(stats.totalDisbursed)}，合规率 {((1 - stats.nonCompliantCount / Math.max(fundFlows.length, 1)) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* 统计卡片区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`stat-card opacity-0 animate-slide-up stagger-${index + 1} relative overflow-hidden`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color}`}></div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-sm mb-1">{card.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-800">{card.value}</span>
                    {card.unit && <span className="text-slate-500 text-sm">{card.unit}</span>}
                  </div>
                  <p className={`text-xs mt-2 flex items-center gap-1 ${card.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                    {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {card.trend}
                  </p>
                  {card.progress !== undefined && (
                    <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-gold-500 to-gold-600 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(card.progress, 100)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" style={{ color: card.iconColor }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 资金使用进度区域 */}
      <div className="page-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 font-serif flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gold-600" />
            募集资金使用进度
          </h3>
          <span className="text-sm text-slate-500">
            剩余 {formatAmount(stats.totalReceived - stats.totalDisbursed)} 未拨付
          </span>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">资金使用整体进度</span>
            <span className="font-semibold text-primary-800">{stats.usageProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-600 via-primary-500 to-gold-500 transition-all duration-1000 flex items-center justify-end pr-2"
              style={{ width: `${Math.min(stats.usageProgress, 100)}%` }}
            >
              {stats.usageProgress > 10 && (
                <span className="text-white text-xs font-medium">{stats.usageProgress.toFixed(0)}%</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">到账总额</p>
              <p className="text-lg font-bold text-primary-800">{formatAmount(stats.totalReceived)}</p>
            </div>
            <div className="text-center p-3 bg-gold-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">已拨付</p>
              <p className="text-lg font-bold text-gold-700">{formatAmount(stats.totalDisbursed)}</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">未拨付</p>
              <p className="text-lg font-bold text-slate-700">{formatAmount(stats.totalReceived - stats.totalDisbursed)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 资金使用趋势图 */}
      <div className="page-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 font-serif">募集资金使用趋势</h3>
          <span className="text-sm text-slate-500">近6个月资金拨付情况</span>
        </div>
        <BarLineChart
          data={fundUsageTrend}
          xAxisKey="month"
          barKey="used"
          barName="已使用（亿元）"
          lineKey="total"
          lineName="到账总额（亿元）"
          height={300}
        />
      </div>

      {/* 资金到账信息表格 */}
      <div className="page-card">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 font-serif flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary-700" />
            资金到账信息
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">到账日期</th>
                <th className="table-header">债券名称</th>
                <th className="table-header">监管银行</th>
                <th className="table-header">监管账户</th>
                <th className="table-header">到账金额</th>
                <th className="table-header">协议签署状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fundReceivedList.map((item) => {
                const bond = getBondById(item.bondId);
                return (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="table-cell whitespace-nowrap">{formatDate(item.receivedDate)}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{bond?.bondName ?? '--'}</span>
                      {bond && (
                        <span className="inline-flex px-1.5 py-0.5 rounded text-xs bg-slate-100 text-slate-600">
                          {getBondTypeText(bond.bondType)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">{item.custodianBank}</td>
                  <td className="table-cell font-mono text-xs text-slate-600">{item.custodianAccount}</td>
                  <td className="table-cell font-semibold text-primary-800">{formatAmount(item.receivedAmount)}</td>
                  <td className="table-cell">
                    {item.agreementSigned ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        <CheckCircle className="w-3 h-3" />
                        已签署
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <XCircle className="w-3 h-3" />
                        未签署
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

      {/* 资金使用流水表格 */}
      <div className="page-card">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 font-serif flex items-center gap-2">
              <Banknote className="w-5 h-5 text-gold-600" />
              资金使用流水
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                合规 {fundFlows.filter((f) => f.isCompliant).length} 笔
              </span>
              <span className="flex items-center gap-1 text-red-600">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                不合规 {stats.nonCompliantCount} 笔
              </span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">拨付日期</th>
                <th className="table-header">债券名称</th>
                <th className="table-header">用途类型</th>
                <th className="table-header">用途说明</th>
                <th className="table-header">金额（万元）</th>
                <th className="table-header">收款账户</th>
                <th className="table-header">合规状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fundFlows.map((flow) => {
                const bond = getBondById(flow.bondId);
                return (
                <tr
                  key={flow.id}
                  className={`hover:bg-slate-50 transition-colors ${!flow.isCompliant ? 'bg-red-50/30' : ''}`}
                >
                  <td className="table-cell whitespace-nowrap">{formatDate(flow.payDate)}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{bond?.bondName ?? '--'}</span>
                      {bond && (
                        <span className="inline-flex px-1.5 py-0.5 rounded text-xs bg-slate-100 text-slate-600">
                          {getBondTypeText(bond.bondType)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700">
                      {getFundUsageTypeText(flow.usageType)}
                    </span>
                  </td>
                  <td className="table-cell max-w-xs truncate" title={flow.purpose}>
                    {flow.purpose}
                    {flow.remark && (
                      <p className="text-xs text-red-500 mt-1">{flow.remark}</p>
                    )}
                  </td>
                  <td className="table-cell font-semibold text-slate-800">{formatWanAmount(flow.amount)}</td>
                  <td className="table-cell font-mono text-xs text-slate-600">{flow.account}</td>
                  <td className="table-cell">
                    {flow.isCompliant ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        <CheckCircle className="w-3 h-3" />
                        合规
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <XCircle className="w-3 h-3" />
                        不合规
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
    </div>
  );
};

export default FundTracking;
