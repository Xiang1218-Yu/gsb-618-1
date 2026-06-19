import { ReactNode } from 'react'
import { LucideIcon, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

// EmptyState组件属性接口
export interface EmptyStateProps {
  icon?: LucideIcon
  title?: string
  description?: string
  extra?: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

// 尺寸样式映射
const sizeStyles = {
  sm: {
    icon: 'w-12 h-12',
    title: 'text-base',
    desc: 'text-xs',
  },
  md: {
    icon: 'w-16 h-16',
    title: 'text-lg',
    desc: 'text-sm',
  },
  lg: {
    icon: 'w-20 h-20',
    title: 'text-xl',
    desc: 'text-base',
  },
}

// 空状态占位组件
export default function EmptyState({
  icon: Icon = Inbox,
  title = '暂无数据',
  description,
  extra,
  className,
  size = 'md',
}: EmptyStateProps) {
  const styles = sizeStyles[size]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div
        className={cn(
          'rounded-full bg-gray-100 flex items-center justify-center mb-4',
          size === 'sm' ? 'p-3' : size === 'md' ? 'p-4' : 'p-5'
        )}
      >
        <Icon className={cn(styles.icon, 'text-gray-400')} />
      </div>
      <h3 className={cn(styles.title, 'font-medium text-gray-700 mb-1')}>
        {title}
      </h3>
      {description && (
        <p className={cn(styles.desc, 'text-gray-500 max-w-sm')}>
          {description}
        </p>
      )}
      {extra && <div className="mt-4">{extra}</div>}
    </div>
  )
}
