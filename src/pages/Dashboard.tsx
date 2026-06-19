import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ClipboardList,
  AlertTriangle,
  MessageSquare,
  Wallet,
  FileText,
  Calendar,
  ArrowRight,
  Bell,
  Building2,
  Settings,
  type LucideIcon
} from 'lucide-react';
import { Card, StatCard, Badge, Button, PageHeader, EmptyState } from '@/components/UI';
import { mockDashboardStats, mockTodoList, mockWarningList } from '@/data/mockCommon';
import type { TodoItem, WarningItem } from '@/types/common';

// ==================== 图标映射配置 ====================
/** 统计卡片图标名称到组件的映射 */
const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  ClipboardList,
  AlertTriangle,
  MessageSquare,
  Wallet,
  FileText
};

// ==================== 状态样式映射 ====================
/** 待办事项优先级样式映射 - high(高优先级红色), medium(中优先级橙色), low(低优先级蓝色) */
const priorityMap: Record<string, { color: 'danger' | 'warning' | 'info'; label: string }> = {
  high: { color: 'danger', label: '高优先级' },
  medium: { color: 'warning', label: '中优先级' },
  low: { color: 'info', label: '低优先级' }
};

/** 预警等级样式映射 - normal(正常绿色), attention(关注蓝色), warning(预警橙色), danger(危险红色) */
const warningLevelMap: Record<string, { color: 'success' | 'info' | 'warning' | 'danger'; bgColor: string }> = {
  normal: { color: 'success', bgColor: 'bg-green-50' },
  attention: { color: 'info', bgColor: 'bg-blue-50' },
  warning: { color: 'warning', bgColor: 'bg-amber-50' },
  danger: { color: 'danger', bgColor: 'bg-red-50' }
};

/** 待办事项类型标签映射 - 根据不同业务类型显示中文名称 */
const todoTypeLabelMap: Record<string, string> = {
  interest: '付息提醒',
  sentiment: '舆情处理',
  underwriting: '承销审核',
  issuance: '发行批复',
  fund: '资金审批'
};

/** 待办事项类型颜色映射 - 不同类型使用不同颜色标签便于区分 */
const todoTypeColorMap: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  interest: 'info',
  sentiment: 'danger',
  underwriting: 'info',
  issuance: 'success',
  fund: 'warning'
};

/** 快捷入口配置数组 - 包含入口名称、图标、背景色、路由路径 */
const quickActionConfigs: Array<{
  name: string;
  icon: LucideIcon;
  color: string;
  path: string;
}> = [
  { name: '债券承销', icon: FileText, color: 'bg-blue-900', path: '/underwriting' },
  { name: '发行管理', icon: TrendingUp, color: 'bg-amber-600', path: '/issuance' },
  { name: '存续期管理', icon: Calendar, color: 'bg-emerald-600', path: '/duration' },
  { name: '募集资金', icon: Wallet, color: 'bg-violet-600', path: '/funds' },
  { name: '财务监控', icon: AlertTriangle, color: 'bg-rose-600', path: '/finance' },
  { name: '舆情监控', icon: MessageSquare, color: 'bg-cyan-600', path: '/sentiment' },
  { name: '发行人管理', icon: Building2, color: 'bg-indigo-600', path: '/duration' },
  { name: '系统设置', icon: Settings, color: 'bg-gray-600', path: '/settings' }
];

// ==================== 工作台首页组件 ====================
const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  /**
   * 获取待办事项类型中文标签
   * @param type - 待办类型字符串
   * @returns 对应的中文标签
   */
  const getTodoTypeLabel = (type: string): string => {
    return todoTypeLabelMap[type] || type;
  };

  /**
   * 获取待办事项类型标签颜色
   * @param type - 待办类型字符串
   * @returns Badge组件使用的颜色变体
   */
  const getTodoTypeColor = (type: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    return todoTypeColorMap[type] || 'default';
  };

  /**
   * 渲染顶部统计卡片区域
   * 循环mockDashboardStats数据，渲染6个关键指标统计卡片
   */
  const renderStatCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {mockDashboardStats.map((stat, index) => {
          const IconComponent = iconMap[stat.icon] || TrendingUp;
          return (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={IconComponent}
              trend={stat.trend}
              gradient={index === 0}
            />
          );
        })}
      </div>
    );
  };

  /**
   * 渲染左侧待办事项列表
   * 显示最多5条待办，按优先级区分颜色，点击可跳转对应业务页面
   */
  const renderTodoList = () => {
    // 截取前5条待办事项用于首页展示
    const pendingTodos = mockTodoList.slice(0, 5);
    return (
      <Card
        title="今日待办"
        extra={
          <Button variant="text" size="sm" onClick={() => navigate('/underwriting')}>
            查看全部 <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        }
      >
        {pendingTodos.length === 0 ? (
          <EmptyState title="暂无待办事项" description="所有任务已处理完成" />
        ) : (
          <div className="space-y-3">
            {pendingTodos.map((todo: TodoItem) => (
              <div
                key={todo.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => {
                  // 根据待办类型跳转到对应页面
                  const routeMap: Record<string, string> = {
                    underwriting: '/underwriting',
                    issuance: '/issuance',
                    interest: '/duration',
                    fund: '/funds',
                    sentiment: '/sentiment'
                  };
                  navigate(routeMap[todo.type] || '/');
                }}
              >
                <div className="mt-0.5">
                  <Badge variant={priorityMap[todo.priority].color}>
                    {priorityMap[todo.priority].label}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{todo.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getTodoTypeColor(todo.type)}>
                      {getTodoTypeLabel(todo.type)}
                    </Badge>
                    {todo.bondName && (
                      <span className="text-xs text-gray-500">{todo.bondName}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                  <Calendar className="w-3 h-3" />
                  {todo.dueDate}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    );
  };

  /**
   * 渲染右侧风险预警列表
   * 过滤未处理的预警，按等级排序，不同等级使用不同背景色和边框色
   */
  const renderWarningList = () => {
    // 过滤出未处理的预警，最多显示5条
    const unhandledWarnings = mockWarningList.filter(w => !w.handled).slice(0, 5);
    return (
      <Card
        title="风险预警"
        extra={
          <Button variant="text" size="sm" onClick={() => navigate('/finance')}>
            查看全部 <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        }
      >
        {unhandledWarnings.length === 0 ? (
          <EmptyState title="暂无风险预警" description="当前所有指标正常" />
        ) : (
          <div className="space-y-3">
            {unhandledWarnings.map((warning: WarningItem) => (
              <div
                key={warning.id}
                className={`p-3 rounded-lg ${warningLevelMap[warning.level].bgColor} border-l-4 cursor-pointer hover:shadow-sm transition-shadow`}
                style={{
                  borderLeftColor:
                    warning.level === 'danger' ? '#dc2626' :
                    warning.level === 'warning' ? '#d97706' :
                    '#0284c7'
                }}
                onClick={() => {
                  // 根据预警类型跳转到对应页面
                  const routeMap: Record<string, string> = {
                    finance: '/finance',
                    sentiment: '/sentiment',
                    fund: '/funds',
                    compliance: '/settings'
                  };
                  navigate(routeMap[warning.type] || '/finance');
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={warningLevelMap[warning.level].color}>
                        {warning.level === 'danger' ? '危险' : warning.level === 'warning' ? '预警' : '关注'}
                      </Badge>
                      <span className="text-xs text-gray-500">{warning.time}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mt-1">{warning.title}</p>
                    {warning.bondName && (
                      <p className="text-xs text-gray-500 mt-1">关联债券：{warning.bondName}</p>
                    )}
                  </div>
                  <Bell className={`w-5 h-5 flex-shrink-0 ${
                    warning.level === 'danger' ? 'text-red-500' :
                    warning.level === 'warning' ? 'text-amber-500' :
                    'text-blue-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    );
  };

  /**
   * 渲染快捷入口区域
   * 8个功能入口图标按钮，点击使用Link跳转到对应路由
   */
  const renderQuickActions = () => {
    return (
      <Card title="快捷入口">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {quickActionConfigs.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={index}
                to={action.path}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors group no-underline"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-gray-700 font-medium">{action.name}</span>
              </Link>
            );
          })}
        </div>
      </Card>
    );
  };

  // 主渲染
  return (
    <div className="space-y-6">
      <PageHeader
        title="工作台"
        description="欢迎使用债券全生命周期管理系统"
        breadcrumbs={[{ title: '首页', href: '/' }]}
      />

      {/* 统计卡片区域 - 展示关键业务指标 */}
      {renderStatCards()}

      {/* 快捷功能入口 - 快速导航到各功能模块 */}
      {renderQuickActions()}

      {/* 待办事项和风险预警 - 两栏布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderTodoList()}
        {renderWarningList()}
      </div>
    </div>
  );
};

export default Dashboard;
