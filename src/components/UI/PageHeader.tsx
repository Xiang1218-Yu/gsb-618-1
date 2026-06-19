import { ReactNode } from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

// 面包屑项接口
export interface BreadcrumbItem {
  title: string
  href?: string
}

// PageHeader组件属性接口
export interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  extra?: ReactNode
  className?: string
  showHome?: boolean
}

// 页面头部组件
export default function PageHeader({
  title,
  description,
  breadcrumbs,
  extra,
  className,
  showHome = true,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      {(breadcrumbs || showHome) && (
        <nav className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          {showHome && (
            <>
              <a href="/" className="flex items-center gap-1 hover:text-[#1e3a8a] transition-colors">
                <Home className="w-4 h-4" />
                <span>首页</span>
              </a>
              {breadcrumbs && breadcrumbs.length > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </>
          )}
          {breadcrumbs?.map((item, index) => (
            <span key={index} className="flex items-center gap-1">
              {item.href ? (
                <a href={item.href} className="hover:text-[#1e3a8a] transition-colors">
                  {item.title}
                </a>
              ) : (
                <span className="text-gray-700">{item.title}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-1 h-7 bg-[#1e3a8a] rounded-full" />
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-gray-500 text-sm">{description}</p>
          )}
        </div>
        {extra && <div className="flex items-center gap-3 flex-shrink-0">{extra}</div>}
      </div>
    </div>
  )
}
