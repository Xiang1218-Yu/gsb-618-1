import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Button变体类型
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'gold'

// Button尺寸类型
export type ButtonSize = 'sm' | 'md' | 'lg'

// Button组件属性接口
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean
  children?: ReactNode
}

// 变体样式映射
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#1e3a8a] text-white hover:bg-blue-950 active:bg-blue-950 shadow-sm',
  secondary:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-200',
  outline:
    'border border-[#1e3a8a] text-[#1e3a8a] hover:bg-blue-50 active:bg-blue-100 bg-transparent',
  text: 'text-[#1e3a8a] hover:bg-blue-50 active:bg-blue-100 bg-transparent',
  gold:
    'bg-[#d97706] text-white hover:bg-amber-700 active:bg-amber-700 shadow-sm',
}

// 尺寸样式映射
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-2.5 text-base gap-2',
}

// 图标尺寸映射
const iconSizes: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
}

// 按钮组件
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      loading = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/30',
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin"
            width={iconSizes[size]}
            height={iconSizes[size]}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {Icon && !loading && iconPosition === 'left' && (
          <Icon size={iconSizes[size]} />
        )}
        {children}
        {Icon && !loading && iconPosition === 'right' && (
          <Icon size={iconSizes[size]} />
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
