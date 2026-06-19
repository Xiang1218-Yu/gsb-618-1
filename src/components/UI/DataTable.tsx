import { ReactNode, useMemo, useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// 排序方向类型
export type SortDirection = 'asc' | 'desc' | null

// 列配置接口
export interface Column<T> {
  key: keyof T | string
  title: string
  width?: string | number
  sortable?: boolean
  render?: (record: T, index: number) => ReactNode
  align?: 'left' | 'center' | 'right'
}

// DataTable组件属性接口
export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey?: keyof T
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
  }
  onSort?: (key: string, direction: SortDirection) => void
  className?: string
  emptyText?: string
}

// 数据表格组件
export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey = 'id' as keyof T,
  loading = false,
  pagination,
  onSort,
  className,
  emptyText = '暂无数据',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // 处理排序
  const handleSort = (key: string) => {
    let newDirection: SortDirection = 'asc'
    if (sortKey === key) {
      if (sortDirection === 'asc') newDirection = 'desc'
      else if (sortDirection === 'desc') newDirection = null
    }
    setSortKey(newDirection ? key : null)
    setSortDirection(newDirection)
    onSort?.(key, newDirection)
  }

  // 渲染排序图标
  const renderSortIcon = (key: string) => {
    if (sortKey !== key) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="w-4 h-4 text-[#1e3a8a]" />
    }
    if (sortDirection === 'desc') {
      return <ChevronDown className="w-4 h-4 text-[#1e3a8a]" />
    }
    return <ChevronsUpDown className="w-4 h-4 text-gray-400" />
  }

  // 计算总页数
  const totalPages = useMemo(() => {
    if (!pagination) return 0
    return Math.ceil(pagination.total / pagination.pageSize)
  }, [pagination])

  // 生成页码数组
  const pages = useMemo(() => {
    if (!pagination) return []
    const result: (number | string)[] = []
    const current = pagination.current
    const total = totalPages

    if (total <= 7) {
      for (let i = 1; i <= total; i++) result.push(i)
    } else {
      result.push(1)
      if (current > 3) result.push('...')
      const start = Math.max(2, current - 1)
      const end = Math.min(total - 1, current + 1)
      for (let i = start; i <= end; i++) result.push(i)
      if (current < total - 2) result.push('...')
      result.push(total)
    }
    return result
  }, [pagination, totalPages])

  // 对齐方式样式
  const alignStyles: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-4 py-3 text-sm font-semibold text-gray-700 whitespace-nowrap',
                    alignStyles[col.align || 'left'],
                    col.sortable && 'cursor-pointer hover:bg-gray-100 select-none'
                  )}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className={cn('flex items-center gap-1.5', col.align === 'right' && 'justify-end', col.align === 'center' && 'justify-center')}>
                    {col.title}
                    {col.sortable && renderSortIcon(String(col.key))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="animate-spin h-8 w-8 text-[#1e3a8a]" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>加载中...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-500">
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((record, index) => (
                <tr
                  key={String(record[rowKey]) ?? index}
                  className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={cn('px-4 py-3 text-sm text-gray-700', alignStyles[col.align || 'left'])}
                    >
                      {col.render
                        ? col.render(record, index)
                        : (record[col.key as keyof T] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            共 {pagination.total} 条记录
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
              disabled={pagination.current <= 1}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                pagination.current <= 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200'
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {pages.map((page, idx) =>
              typeof page === 'number' ? (
                <button
                  key={idx}
                  onClick={() => pagination.onChange(page, pagination.pageSize)}
                  className={cn(
                    'min-w-[32px] h-8 px-2 rounded-md text-sm font-medium transition-colors',
                    page === pagination.current
                      ? 'bg-[#1e3a8a] text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {page}
                </button>
              ) : (
                <span key={idx} className="px-2 text-gray-400">
                  {page}
                </span>
              )
            )}
            <button
              onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
              disabled={pagination.current >= totalPages}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                pagination.current >= totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200'
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
