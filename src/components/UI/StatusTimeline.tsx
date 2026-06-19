import { ReactNode } from 'react'
import { LucideIcon, Check, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

// 时间线节点状态类型
export type TimelineNodeStatus = 'completed' | 'current' | 'pending'

// 时间线节点接口
export interface TimelineNode {
  title: string
  description?: string
  time?: string
  status: TimelineNodeStatus
  icon?: LucideIcon
  extra?: ReactNode
}

// StatusTimeline组件属性接口
export interface StatusTimelineProps {
  nodes: TimelineNode[]
  className?: string
  align?: 'left' | 'right'
}

// 状态样式映射
const statusStyles: Record<TimelineNodeStatus, { dot: string; line: string; title: string; desc: string }> = {
  completed: {
    dot: 'bg-[#1e3a8a] text-white border-[#1e3a8a]',
    line: 'bg-[#1e3a8a]',
    title: 'text-gray-900 font-medium',
    desc: 'text-gray-500',
  },
  current: {
    dot: 'bg-[#d97706] text-white border-[#d97706] ring-4 ring-amber-100',
    line: 'bg-gray-200',
    title: 'text-[#1e3a8a] font-semibold',
    desc: 'text-gray-600',
  },
  pending: {
    dot: 'bg-white text-gray-400 border-gray-300',
    line: 'bg-gray-200',
    title: 'text-gray-400',
    desc: 'text-gray-400',
  },
}

// 垂直时间线组件
export default function StatusTimeline({
  nodes,
  className,
  align = 'left',
}: StatusTimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {nodes.map((node, index) => {
        const isLast = index === nodes.length - 1
        const styles = statusStyles[node.status]
        const IconComponent = node.icon
          ? node.icon
          : node.status === 'completed'
          ? Check
          : node.status === 'current'
          ? Clock
          : null

        return (
          <div
            key={index}
            className={cn(
              'relative flex gap-4 pb-6',
              isLast && 'pb-0'
            )}
          >
            {/* 连接线 */}
            {!isLast && (
              <div
                className={cn(
                  'absolute left-[19px] top-10 w-0.5 h-[calc(100%-20px)]',
                  styles.line
                )}
              />
            )}

            {/* 节点圆点 */}
            <div
              className={cn(
                'relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all',
                styles.dot
              )}
            >
              {IconComponent && <IconComponent className="w-5 h-5" />}
              {node.status === 'current' && (
                <span className="absolute w-full h-full rounded-full animate-ping bg-[#d97706]/30" />
              )}
            </div>

            {/* 内容区 */}
            <div
              className={cn(
                'flex-1 pt-1',
                align === 'right' && 'text-right'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className={cn('text-sm', styles.title)}>{node.title}</h4>
                {node.time && (
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {node.time}
                  </span>
                )}
              </div>
              {node.description && (
                <p className={cn('text-sm mt-1', styles.desc)}>
                  {node.description}
                </p>
              )}
              {node.extra && <div className="mt-2">{node.extra}</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
