// 通用模态弹窗组件 - 用于新建/编辑/确认删除等场景
import { type ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  // 是否显示
  open: boolean;
  // 关闭回调
  onClose: () => void;
  // 标题
  title: string;
  // 副标题
  subtitle?: string;
  // 弹窗宽度
  width?: number;
  // 子内容
  children: ReactNode;
  // 底部操作区
  footer?: ReactNode;
}

// 通用模态弹窗
export default function Modal({ open, onClose, title, subtitle, width = 520, children, footer }: ModalProps) {
  // ESC 键关闭弹窗
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* 遮罩层 */}
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* 弹窗主体 */}
          <motion.div
            className="panel relative z-10 max-h-[88vh] overflow-auto p-6"
            style={{ width }}
            initial={{ y: 16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-display text-2xl text-gold-light">{title}</div>
                {subtitle && (
                  <div className="mt-1 font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-text-faint)]">
                    {subtitle}
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-[var(--color-text-muted)] hover:text-gold-light transition"
                aria-label="关闭"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <div className="gold-rule mb-4 opacity-50" />
            <div>{children}</div>
            {footer && (
              <>
                <div className="gold-rule mt-4 mb-4 opacity-30" />
                <div className="flex justify-end gap-2">{footer}</div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 表单字段（统一样式）
interface FieldProps {
  label: string;
  children: ReactNode;
  span?: 1 | 2;
}

// 表单字段容器
export function Field({ label, children, span = 1 }: FieldProps) {
  return (
    <label className={`flex flex-col gap-1.5 ${span === 2 ? 'col-span-2' : ''}`}>
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-faint)]">
        {label}
      </span>
      {children}
    </label>
  );
}

// 通用输入框样式类（用于 input/select）
export const inputClass =
  'bg-[rgba(11,27,43,0.7)] border border-line/80 px-3 py-2 text-[13px] text-[var(--color-text)] outline-none focus:border-gold-light transition placeholder:text-[var(--color-text-faint)]';
