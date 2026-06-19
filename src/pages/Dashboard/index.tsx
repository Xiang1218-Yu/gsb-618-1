import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Wallet,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  FileText,
  AlertCircle,
  ChevronRight,
  MessageSquare,
  FileCheck,
} from 'lucide-react';
import { useAppStore, fundUsageTrend, bondTypeDistribution } from '@/store';
import { BarLineChart, PieChart } from '@/components/charts';
import { formatAmount, getRiskLevelClass, getRiskLevelText, formatDate } from '@/utils/formatters';
import { RiskLevel } from '@/types';

/**
 * 工作台总览页面
 */
const Dashboard = () => {
  const stats = useAppStore((state) => state.dashboardStats);
  const riskAlerts = useAppStore((state) => state.riskAlerts);
  const todoItems = useAppStore((state) => state.todoItems);
  const completeTodo = useAppStore((state) => state.completeTodo);
  const handleAlert = useAppStore((state) => state.handleAlert);

  const [selectedAlertFilter, setSelectedAlertFilter] = useState<RiskLevel | 'all'>('all');

  /**
   * 统计卡片数据配置
   */
  const statCards = [
    {
      title: '在管债券',
      value: stats.totalBonds,
      unit: '只',
      icon: FileText,
      color: 'from-primary-600 to-primary-800',
      trend: '+2',
      trendUp: true,
      iconBg: 'bg-primary-500/20',
    },
    {
      title: '募集资金总额',
      value: stats.totalFunds,
      unit: '亿',
      icon: Wallet,
      color: 'from-emerald-500 to-emerald-700',
      trend: `已使用 ${formatAmount(stats.usedFunds)}`,
      trendUp: true,
      iconBg: 'bg-emerald-500/20',
      progress: (stats.usedFunds / stats.totalFunds) * 100,
    },
    {
      title: '风险预警',
      value: stats.alertCount,
      unit: '项',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-700',
      trend: `高风险 ${stats.highRiskCount} 项`,
      trendUp: false,
      iconBg: 'bg-red-500/20',
    },
    {
      title: '本月到期',
      value: stats.thisMonthMaturity,
      unit: '只',
      icon: Calendar,
      color: 'from-gold-500 to-gold-700',
      trend: `待办 ${stats.todoCount} 项`,
      trendUp: true,
      iconBg: 'bg-gold-500/20',
    },
  ];

  /**
   * 根据风险等级过滤预警
   */
  const filteredAlerts = riskAlerts
    .filter((alert) => selectedAlertFilter === 'all' || alert.riskLevel === selectedAlertFilter)
    .slice(0, 5);

  /**
   * 处理预警处置
   */
  const handleAlertResolve = (alertId: string) => {
    handleAlert(alertId, 'resolved', '已核实并处置');
  };

  /**
   * 优先级颜色映射
   */
  const priorityColorMap: Record<string, string> = {
    high: 'text-red-600 bg-red-50',
    medium: 'text-amber-600 bg-amber-50',
    low: 'text-slate-600 bg-slate-50',
  };

  return (
    <div className="p-6 space-y-6">
      {/* 欢迎区域 */}
      <div className="page-card bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-primary-600/20 rounded-full translate-y-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white font-serif mb-2">债券发行与存续期合规管理平台</h1>
          <p className="text-primary-200 text-sm">今日是 2024年6月19日，系统已监控 {stats.totalBonds} 只在管债券，实时追踪财务指标与舆情动态</p>
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
                    <span className="text-slate-500 text-sm">{card.unit}</span>
                  </div>
                  <p className={`text-xs mt-2 ${card.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                    {card.trend}
                  </p>
                  {card.progress !== undefined && (
                    <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${card.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" style={{ color: card.color.includes('primary') ? '#0A2463' : card.color.includes('emerald') ? '#059669' : card.color.includes('red') ? '#DC2626' : '#C19A2E' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 资金使用趋势图 */}
        <div className="lg:col-span-2 page-card p-6 opacity-0 animate-slide-up stagger-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 font-serif">募集资金使用趋势</h3>
            <Link to="/funds" className="text-sm text-primary-700 hover:text-primary-800 flex items-center gap-1">
              查看详情 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <BarLineChart
            data={fundUsageTrend}
            xAxisKey="month"
            barKey="used"
            barName="已使用（亿元）"
            height={280}
          />
        </div>

        {/* 债券类型分布 */}
        <div className="page-card p-6 opacity-0 animate-slide-up stagger-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 font-serif">债券类型分布</h3>
            <Link to="/bonds" className="text-sm text-primary-700 hover:text-primary-800 flex items-center gap-1">
              全部 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <PieChart
            data={bondTypeDistribution.map((item, index) => ({
              ...item,
              color: ['#0A2463', '#2C52AB', '#D8B44A', '#2A9D8F', '#F77F00'][index],
            }))}
            height={280}
          />
        </div>
      </div>

      {/* 预警和待办区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 风险预警 */}
        <div className="page-card opacity-0 animate-slide-up stagger-3">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 font-serif flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-risk-high" />
                风险预警
              </h3>
              <div className="flex gap-2">
                {(['all', RiskLevel.High, RiskLevel.Medium] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedAlertFilter(level)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      selectedAlertFilter === level
                        ? level === RiskLevel.High
                          ? 'bg-red-100 text-red-700 font-medium'
                          : level === RiskLevel.Medium
                          ? 'bg-orange-100 text-orange-700 font-medium'
                          : 'bg-primary-100 text-primary-700 font-medium'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {level === 'all' ? '全部' : getRiskLevelText(level)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto scrollbar-thin">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-slate-400">暂无预警信息</div>
            ) : (
              filteredAlerts.map((alert) => (
                <div key={alert.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        alert.riskLevel === RiskLevel.High
                          ? 'bg-red-100'
                          : alert.riskLevel === RiskLevel.Medium
                          ? 'bg-orange-100'
                          : 'bg-emerald-100'
                      }`}
                    >
                      <AlertTriangle
                        className={`w-4 h-4 ${
                          alert.riskLevel === RiskLevel.High
                            ? 'text-red-600'
                            : alert.riskLevel === RiskLevel.Medium
                            ? 'text-orange-600'
                            : 'text-emerald-600'
                        } ${alert.riskLevel === RiskLevel.High ? 'animate-blink' : ''}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`status-badge ${getRiskLevelClass(alert.riskLevel)}`}
                        >
                          {getRiskLevelText(alert.riskLevel)}
                        </span>
                        <span className="text-xs text-slate-400">{alert.bondName}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 mb-1">{alert.title}</p>
                      <p className="text-xs text-slate-500 mb-2 line-clamp-2">{alert.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">{alert.triggerTime}</span>
                        {alert.handleStatus === 'pending' && (
                          <button
                            onClick={() => handleAlertResolve(alert.id)}
                            className="text-xs text-primary-700 hover:text-primary-800 font-medium"
                          >
                            立即处置
                          </button>
                        )}
                        {alert.handleStatus === 'processing' && (
                          <span className="text-xs text-amber-600 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 处理中
                          </span>
                        )}
                        {alert.handleStatus === 'resolved' && (
                          <span className="text-xs text-emerald-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> 已处置
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 待办事项 */}
        <div className="page-card opacity-0 animate-slide-up stagger-4">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 font-serif flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold-600" />
                待办事项
              </h3>
              <span className="text-sm text-slate-500">{todoItems.filter((t) => t.status === 'pending').length} 项待处理</span>
            </div>
          </div>
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto scrollbar-thin">
            {todoItems.map((todo) => (
              <div
                key={todo.id}
                className={`p-4 hover:bg-slate-50 transition-colors ${todo.status === 'done' ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => todo.status === 'pending' && completeTodo(todo.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      todo.status === 'done'
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 hover:border-primary-600'
                    }`}
                  >
                    {todo.status === 'done' && <CheckCircle className="w-3 h-3" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${todo.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {todo.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${priorityColorMap[todo.priority]}`}>
                        {todo.priority === 'high' ? '紧急' : todo.priority === 'medium' ? '一般' : '低'}
                      </span>
                      {todo.bondName && (
                        <span className="text-xs text-slate-400">{todo.bondName}</span>
                      )}
                      <span className="text-xs text-slate-400 ml-auto">截止: {formatDate(todo.deadline)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="page-card p-6 opacity-0 animate-slide-up stagger-5">
        <h3 className="text-lg font-semibold text-slate-800 font-serif mb-4">快捷操作</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { name: '债券列表', path: '/bonds', icon: FileText, color: 'text-primary-600 bg-primary-50' },
            { name: '资金追踪', path: '/funds', icon: Wallet, color: 'text-emerald-600 bg-emerald-50' },
            { name: '财务监控', path: '/finance', icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
            { name: '舆情监控', path: '/sentiment', icon: MessageSquare, color: 'text-purple-600 bg-purple-50' },
            { name: '存续期', path: '/duration', icon: Calendar, color: 'text-gold-600 bg-gold-50' },
            { name: '合规报告', path: '/reports', icon: FileCheck, color: 'text-orange-600 bg-orange-50' },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-50 transition-all hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm text-slate-700 font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
