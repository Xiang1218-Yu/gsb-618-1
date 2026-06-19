import { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Modal组件属性接口
export interface ModalProps {
  /** 弹窗是否可见 */
  open: boolean;
  /** 弹窗标题 */
  title?: string;
  /** 弹窗宽度尺寸 */
  width?: 'sm' | 'md' | 'lg' | 'xl';
  /** 子内容 */
  children?: ReactNode;
  /** 底部操作区域 */
  footer?: ReactNode;
  /** 关闭弹窗回调 */
  onClose: () => void;
  /** 自定义类名 */
  className?: string;
}

// 宽度样式映射
const widthStyles: Record<string, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

/**
 * 通用模态弹窗组件
 * 支持自定义标题、宽度、底部按钮，点击遮罩或X按钮关闭
 */
const Modal = ({
  open,
  title,
  width = 'md',
  children,
  footer,
  onClose,
  className,
}: ModalProps) => {
  // 打开弹窗时禁止body滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ESC键关闭弹窗
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div
        className={cn(
          'relative bg-white rounded-xl shadow-2xl w-full mx-4 flex flex-col max-h-[90vh]',
          widthStyles[width],
          className
        )}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      >
        {/* 头部标题栏 */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* 内容区域 - 可滚动 */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* 底部操作区域 */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
