import { cn } from '@/lib/utils'

// LoadingSpinner组件属性接口
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'gold' | 'white' | 'gray'
  text?: string
  className?: string
  fullScreen?: boolean
}

// 尺寸样式映射
const sizeStyles = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-3',
  xl: 'w-14 h-14 border-4',
}

// 文字尺寸映射
const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
}

// 颜色样式映射
const colorStyles = {
  primary: 'border-[#1e3a8a]/20 border-t-[#1e3a8a]',
  gold: 'border-[#d97706]/20 border-t-[#d97706]',
  white: 'border-white/20 border-t-white',
  gray: 'border-gray-200 border-t-gray-500',
}

// 文字颜色映射
const textColors = {
  primary: 'text-[#1e3a8a]',
  gold: 'text-[#d97706]',
  white: 'text-white',
  gray: 'text-gray-500',
}

// 加载中组件
export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
  text,
  className,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'rounded-full animate-spin',
          sizeStyles[size],
          colorStyles[color]
        )}
      />
      {text && (
        <span className={cn(textSizes[size], textColors[color])}>
          {text}
        </span>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    )
  }

  return spinner
}
