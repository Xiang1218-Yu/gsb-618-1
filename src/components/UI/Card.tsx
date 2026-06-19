import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// Card组件属性接口
export interface CardProps {
  title?: string
  extra?: ReactNode
  children: ReactNode
  hoverable?: boolean
  className?: string
  bodyClassName?: string
  headerClassName?: string
}

// 卡片容器组件
export default function Card({
  title,
  extra,
  children,
  hoverable = false,
  className,
  bodyClassName,
  headerClassName,
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden',
        hoverable && 'transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-200',
        className
      )}
    >
      {(title || extra) && (
        <div
          className={cn(
            'flex items-center justify-between px-5 py-4 border-b border-gray-100',
            headerClassName
          )}
        >
          {title && (
            <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          )}
          {extra && <div className="flex items-center gap-2">{extra}</div>}
        </div>
      )}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </div>
  )
}
