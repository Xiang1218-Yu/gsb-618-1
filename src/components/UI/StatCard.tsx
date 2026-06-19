import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// StatCard组件属性接口
export interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: number
  trendLabel?: string
  gradient?: boolean
  className?: string
}

// 统计卡片组件
export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  gradient = false,
  className,
}: StatCardProps) {
  const isPositive = trend && trend >= 0

  return (
    <div
      className={cn(
        'rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:shadow-lg',
        gradient
          ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white'
          : 'bg-white border border-gray-200 shadow-sm',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className={cn(
              'text-sm mb-2',
              gradient ? 'text-blue-200' : 'text-gray-500'
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              'text-2xl font-bold',
              gradient ? 'text-white' : 'text-gray-900'
            )}
          >
            {value}
          </p>
          {trend !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              {isPositive ? (
                <TrendingUp
                  className={cn(
                    'w-4 h-4',
                    gradient ? 'text-amber-400' : 'text-green-500'
                  )}
                />
              ) : (
                <TrendingDown
                  className={cn(
                    'w-4 h-4',
                    gradient ? 'text-red-400' : 'text-red-500'
                  )}
                />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  isPositive
                    ? gradient
                      ? 'text-amber-400'
                      : 'text-green-600'
                    : gradient
                    ? 'text-red-400'
                    : 'text-red-600'
                )}
              >
                {isPositive ? '+' : ''}
                {trend}%
              </span>
              {trendLabel && (
                <span
                  className={cn(
                    'text-xs',
                    gradient ? 'text-blue-200' : 'text-gray-400'
                  )}
                >
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center',
            gradient
              ? 'bg-white/10 text-amber-400'
              : 'bg-blue-50 text-[#1e3a8a]'
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {gradient && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      )}
    </div>
  )
}
