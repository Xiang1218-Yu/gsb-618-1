import {
  Briefcase,
  TrendingUp,
  AlertTriangle,
  PieChart,
  ArrowUp,
  ArrowDown,
  Minus,
  LucideIcon
} from 'lucide-react';
import type { StatCardData } from '../../types';

// 图标映射
const iconMap: Record<string, LucideIcon> = {
  'briefcase': Briefcase,
  'trending-up': TrendingUp,
  'alert-triangle': AlertTriangle,
  'pie-chart': PieChart
};

// 颜色映射
const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-500',
    text: 'text-blue-600',
    border: 'border-blue-100'
  },
  green: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-500',
    text: 'text-emerald-600',
    border: 'border-emerald-100'
  },
  amber: {
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-500',
    text: 'text-amber-600',
    border: 'border-amber-100'
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-500',
    text: 'text-red-600',
    border: 'border-red-100'
  }
};

// 统计卡片组件
interface StatCardProps {
  data: StatCardData;
}

const StatCard = ({ data }: StatCardProps) => {
  const Icon = iconMap[data.icon] || Briefcase;
  const colors = colorMap[data.color];

  // 渲染趋势图标
  const renderTrendIcon = () => {
    switch (data.trend) {
      case 'up':
        return <ArrowUp className="w-3 h-3" />;
      case 'down':
        return <ArrowDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  // 获取趋势颜色
  const getTrendColor = () => {
    if (data.color === 'red' && data.trend === 'up') return 'text-red-600 bg-red-100';
    if (data.color === 'red') return 'text-red-600 bg-red-100';
    if (data.trend === 'up') return 'text-emerald-600 bg-emerald-100';
    if (data.trend === 'down') return 'text-red-600 bg-red-100';
    return 'text-slate-600 bg-slate-100';
  };

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600 font-medium mb-2">{data.title}</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-bold ${colors.text}`}>{data.value}</span>
            {data.unit && <span className="text-slate-500 text-sm">{data.unit}</span>}
          </div>
          {data.trend && (
            <div className={`mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor()}`}>
              {renderTrendIcon()}
              <span>{data.trendValue || ''}</span>
            </div>
          )}
        </div>
        <div className={`${colors.iconBg} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
