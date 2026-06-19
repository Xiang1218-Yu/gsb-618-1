// 通用组件：面板容器
import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface PanelProps {
  // 模块编号（如 01）
  index?: string;
  // 中文标题
  title: string;
  // 英文副标题
  subtitle?: string;
  // 右上角附加操作区
  action?: ReactNode;
  // 子内容
  children: ReactNode;
  // 自定义类名
  className?: string;
}

// 通用信息面板：金色编号 + 衬线标题 + 等宽英文副标题
export default function Panel({ index, title, subtitle, action, children, className = '' }: PanelProps) {
  return (
    <section className={`panel panel-glow p-6 transition-shadow duration-300 ${className}`}>
      <header className="mb-4 flex items-end justify-between">
        <div className="flex items-end gap-3">
          {index && (
            <span className="font-mono text-[11px] tracking-[0.25em] text-gold/70 leading-none mb-[5px]">
              {index}
            </span>
          )}
          <div>
            <h2 className="font-display text-2xl leading-none text-[var(--color-text)]">{title}</h2>
            {subtitle && (
              <div className="mt-1 font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-text-faint)]">
                {subtitle}
              </div>
            )}
          </div>
        </div>
        {action ? (
          <div>{action}</div>
        ) : (
          <ChevronRight size={14} className="text-gold/50" />
        )}
      </header>
      <div className="gold-rule mb-4 opacity-40" />
      {children}
    </section>
  );
}
