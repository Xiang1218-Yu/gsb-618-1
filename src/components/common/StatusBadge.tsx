import { ReactNode } from 'react';

// 状态标签组件属性
interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children?: ReactNode;
}

// 状态标签组件
const StatusBadge = ({ status, variant = 'default', children }: StatusBadgeProps) => {
  // 颜色映射配置
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variantStyles[variant]}`}>
      {children || status}
    </span>
  );
};

export default StatusBadge;
