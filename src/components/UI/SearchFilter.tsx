import { ReactNode, useState } from 'react'
import { Search, X, ChevronDown, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

// 筛选标签接口
export interface FilterTag {
  key: string
  label: string
}

// 下拉选项接口
export interface SelectOption {
  value: string
  label: string
}

// 下拉选择配置接口
export interface SelectConfig {
  key: string
  placeholder?: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
}

// SearchFilter组件属性接口
export interface SearchFilterProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  onSearch?: (value: string) => void
  tags?: FilterTag[]
  activeTag?: string
  onTagChange?: (key: string) => void
  selects?: SelectConfig[]
  extra?: ReactNode
  className?: string
  showFilterButton?: boolean
  onFilterClick?: () => void
}

// 搜索筛选栏组件
export default function SearchFilter({
  searchPlaceholder = '请输入搜索内容',
  searchValue: controlledSearchValue,
  onSearchChange,
  onSearch,
  tags,
  activeTag,
  onTagChange,
  selects,
  extra,
  className,
  showFilterButton = false,
  onFilterClick,
}: SearchFilterProps) {
  const [internalSearchValue, setInternalSearchValue] = useState('')
  const searchValue = controlledSearchValue ?? internalSearchValue
  const [openSelect, setOpenSelect] = useState<string | null>(null)

  // 处理搜索输入变化
  const handleSearchChange = (value: string) => {
    if (controlledSearchValue === undefined) {
      setInternalSearchValue(value)
    }
    onSearchChange?.(value)
  }

  // 处理搜索提交
  const handleSearch = () => {
    onSearch?.(searchValue)
  }

  // 处理清除搜索
  const handleClear = () => {
    handleSearchChange('')
    onSearch?.('')
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-4', className)}>
      <div className="flex flex-wrap items-center gap-3">
        {/* 搜索框 */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]/20 transition-colors"
          />
          {searchValue && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 筛选标签 */}
        {tags && tags.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto">
            {tags.map((tag) => (
              <button
                key={tag.key}
                onClick={() => onTagChange?.(tag.key)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors',
                  activeTag === tag.key
                    ? 'bg-[#1e3a8a] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {tag.label}
              </button>
            ))}
          </div>
        )}

        {/* 下拉选择器 */}
        {selects?.map((select) => (
          <div key={select.key} className="relative">
            <button
              onClick={() => setOpenSelect(openSelect === select.key ? null : select.key)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm min-w-[120px] transition-colors',
                select.value
                  ? 'text-gray-700 bg-white'
                  : 'text-gray-400 bg-white',
                openSelect === select.key && 'border-[#1e3a8a] ring-1 ring-[#1e3a8a]/20'
              )}
            >
              <span className="flex-1 text-left truncate">
                {select.options.find((o) => o.value === select.value)?.label ||
                  select.placeholder || '请选择'}
              </span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-gray-400 transition-transform',
                  openSelect === select.key && 'rotate-180'
                )}
              />
            </button>
            {openSelect === select.key && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
                {select.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      select.onChange?.(option.value)
                      setOpenSelect(null)
                    }}
                    className={cn(
                      'w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors',
                      select.value === option.value && 'bg-blue-50 text-[#1e3a8a]'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* 筛选按钮 */}
        {showFilterButton && (
          <button
            onClick={onFilterClick}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            筛选
          </button>
        )}

        {/* 额外内容 */}
        {extra && <div className="flex items-center gap-2 ml-auto">{extra}</div>}
      </div>
    </div>
  )
}
