import React from 'react';
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
  type LucideIcon
} from 'lucide-react';
import { Card, StatCard, Badge, Button, PageHeader, EmptyState } from '@/components/UI';
import { mockDashboardStats, mockTodoList, mockWarningList } from '@/data/mockCommon';
import type { TodoItem, WarningItem } from '@/types/common';

// 图标映射
const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  ClipboardList,
  AlertTriangle,
  MessageSquare,
  Wallet,
  FileText
};

// 优先级样式映射
const priorityMap: Record<string, { color: 'danger' | 'warning' | 'info'; label: string }> = {
  high: { color: 'danger', label: '高优先级' },
  medium: { color: 'warning', label: '中优先级' },
  low: { color: 'info', label: '低优先级' }
};

// 预警等级样式映射
const warningLevelMap: Record<string, { color: 'success' | 'info' | 'warning' | 'danger'; bgColor: string }> = {
  normal: { color: 'success', bgColor: 'bg-green-50' },
  attention: { color: 'info', bgColor: 'bg-blue-50' },
  warning: { color: 'warning', bgColor: 'bg-amber-50' },
  danger: { color: 'danger', bgColor: 'bg-red-50' }
};

// 工作台首页组件
const Dashboard: React.FC = () => {
  // 获取待办类型标签
  const getTodoTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      interest: '付息',
      sentiment: '舆情',
      underwriting: '承销',
      issuance: '发行',
      fund: '资金'
    };
    return typeMap[type] || type;
  };

  // 获取待办类型颜色
  const getTodoTypeColor = (type: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    const colorMap: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      interest: 'info',
      sentiment: 'danger',
      underwriting: 'info',
      issuance: 'success',
      fund: 'warning'
    };
    return colorMap[type] || 'default';
  };

  // 渲染统计卡片
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

  // 渲染待办事项列表
  const renderTodoList = () => {
    const pendingTodos = mockTodoList.slice(0, 5);
    return (
      <Card
        title="今日待办"
        extra={
          <Button variant="text" size="sm">
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

  // 渲染风险预警列表
  const renderWarningList = () => {
    const unhandledWarnings = mockWarningList.filter(w => !w.handled).slice(0, 5);
    return (
      <Card
        title="风险预警"
        extra={
          <Button variant="text" size="sm">
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
                className={`p-3 rounded-lg ${warningLevelMap[warning.level].bgColor} border-l-4 ${
                  warning.level === 'danger' ? 'border-red-500' :
                  warning.level === 'warning' ? 'border-amber-500' :
                  'border-blue-500'
                }`}
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

  // 渲染快捷入口
  const renderQuickActions = () => {
    const actions = [
      { name: '债券承销', icon: FileText, color: 'bg-blue-900', path: '/underwriting' },
      { name: '发行管理', icon: TrendingUp, color: 'bg-amber-600', path: '/issuance' },
      { name: '存续期管理', icon: Calendar, color: 'bg-emerald-600', path: '/duration' },
      { name: '资金追踪', icon: Wallet, color: 'bg-violet-600', path: '/fund-tracker' },
      { name: '财务监控', icon: AlertTriangle, color: 'bg-rose-600', path: '/finance-monitor' },
      { name: '舆情监控', icon: MessageSquare, color: 'bg-cyan-600', path: '/sentiment-monitor' }
    ];

    return (
      <Card title="快捷入口">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-gray-700 font-medium">{action.name}</span>
              </button>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="工作台"
        description="欢迎使用债券全生命周期管理系统"
        breadcrumbs={[{ title: '首页', href: '/' }]}
      />

      {/* 统计卡片区域 */}
      {renderStatCards()}

      {/* 快捷入口 */}
      {renderQuickActions()}

      {/* 待办和预警区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderTodoList()}
        {renderWarningList()}
      </div>
    </div>
  );
};

export default Dashboard;
