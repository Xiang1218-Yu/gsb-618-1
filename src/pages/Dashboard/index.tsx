import { AlertTriangle, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { useAppStore } from '../../store';
import { mockStatCards } from '../../data/mockData';

// 趋势图模拟数据
const trendData = [
  { month: '1月', bondCount: 22, alertCount: 2 },
  { month: '2月', bondCount: 24, alertCount: 3 },
  { month: '3月', bondCount: 26, alertCount: 5 },
  { month: '4月', bondCount: 28, alertCount: 6 }
];

// 控制台首页组件
const DashboardPage = () => {
  const { alerts, bondProjects, handleAlert } = useAppStore();

  // 获取高风险预警
  const highLevelAlerts = alerts.filter((a) => a.level === 'high' && !a.isHandled);
  const mediumLevelAlerts = alerts.filter((a) => a.level === 'medium' && !a.isHandled);

  // 获取进行中的项目
  const activeProjects = bondProjects.filter((p) => p.status !== 'listed' && p.status !== 'managing');

  // 获取预警等级样式
  const getAlertLevelStyle = (level: string) => {
    switch (level) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-amber-200 bg-amber-50';
      default:
        return 'border-slate-200 bg-slate-50';
    }
  };

  // 获取预警图标
  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">控制台首页</h1>
          <p className="text-slate-500 mt-1">欢迎回来，这是您的债券合规管理概览</p>
        </div>
        <div className="text-sm text-slate-500">
          最后更新：{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* 统计卡片区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {mockStatCards.map((card, index) => (
          <StatCard key={index} data={card} />
        ))}
      </div>

      {/* 图表和预警区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 趋势图 */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">业务趋势</h3>
            <StatusBadge status="近4个月" variant="info" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorBonds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="bondCount" name="债券数量" stroke="#3b82f6" strokeWidth={2} fill="url(#colorBonds)" />
                <Line type="monotone" dataKey="alertCount" name="预警数量" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 高风险预警 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">高风险预警</h3>
            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 text-sm font-bold rounded-full">
              {highLevelAlerts.length}
            </span>
          </div>
          <div className="space-y-3">
            {highLevelAlerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${getAlertLevelStyle(alert.level)} transition-all hover:shadow-md cursor-pointer`}
              >
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.level)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{alert.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{alert.relatedBond}</p>
                    <p className="text-xs text-slate-400 mt-1">{alert.createTime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/sentiment"
            className="flex items-center justify-center gap-1 mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            查看全部预警 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 项目进度和待办 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 进行中项目 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">进行中项目</h3>
            <Link to="/underwriting" className="text-sm text-blue-600 hover:text-blue-700">
              查看全部
            </Link>
          </div>
          <div className="space-y-4">
            {activeProjects.slice(0, 3).map((project) => (
              <div key={project.id} className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900">{project.projectName}</h4>
                  <StatusBadge
                    status={project.riskLevel}
                    variant={project.riskLevel === 'high' ? 'danger' : project.riskLevel === 'medium' ? 'warning' : 'success'}
                  >
                    {project.riskLevel === 'high' ? '高风险' : project.riskLevel === 'medium' ? '中风险' : '低风险'}
                  </StatusBadge>
                </div>
                <p className="text-sm text-slate-500 mb-3">{project.issuerName}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-600">{project.progress}%</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">当前阶段：{project.currentStage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 待处理事项 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">待处理事项</h3>
            <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-100 text-amber-600 text-sm font-bold rounded-full">
              {mediumLevelAlerts.length}
            </span>
          </div>
          <div className="space-y-3">
            {mediumLevelAlerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                {getAlertIcon(alert.level)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{alert.title}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{alert.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-400">{alert.createTime}</span>
                    <button
                      onClick={() => handleAlert(alert.id, '张明')}
                      className="ml-auto text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      立即处理
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
