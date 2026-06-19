import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useAppStore } from '@/store';
import type { ToastType } from '@/store';

/**
 * Toast类型图标映射
 */
const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-primary-600" />,
};

/**
 * Toast类型样式映射
 */
const toastStyles: Record<ToastType, string> = {
  success: 'border-emerald-200 bg-emerald-50',
  error: 'border-red-200 bg-red-50',
  warning: 'border-amber-200 bg-amber-50',
  info: 'border-primary-200 bg-primary-50',
};

/**
 * 全局Toast提示容器组件
 */
const ToastContainer = () => {
  const toasts = useAppStore((state) => state.toasts);
  const removeToast = useAppStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-[100] space-y-3 pointer-events-none">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in-right ${toastStyles[toast.type]}`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {toastIcons[toast.type]}
          <span className="text-sm text-slate-700 font-medium min-w-0 max-w-xs">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 flex-shrink-0 ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
