// 应用主布局：左侧导航 + 顶部状态栏 + 主内容区
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Banknote,
  CalendarClock,
  Wallet,
  LineChart,
  Radio,
  CircleDot,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

// 左侧导航项配置
const navigationItems = [
  { path: '/', label: '驾驶舱', subtitle: 'Cockpit', icon: LayoutDashboard },
  { path: '/underwriting', label: '承销管理', subtitle: 'Underwriting', icon: Briefcase },
  { path: '/issuance', label: '发行管理', subtitle: 'Issuance', icon: Banknote },
  { path: '/duration', label: '存续期管理', subtitle: 'Duration', icon: CalendarClock },
  { path: '/fund-tracking', label: '募集资金', subtitle: 'Fund Tracking', icon: Wallet },
  { path: '/financial', label: '财务监控', subtitle: 'Financial', icon: LineChart },
  { path: '/sentiment', label: '舆情监测', subtitle: 'Sentiment', icon: Radio },
];

export default function AppLayout() {
  const location = useLocation();
  // 获取当前页面对应的导航项，用于顶部面包屑
  const currentNav = navigationItems.find((nav) =>
    nav.path === '/' ? location.pathname === '/' : location.pathname.startsWith(nav.path),
  );

  return (
    <div className="relative z-10 flex min-h-screen text-[14px] text-[var(--color-text)]">
      {/* 左侧固定导航 */}
      <aside className="w-[244px] shrink-0 border-r border-line/70 bg-[rgba(11,27,43,0.7)] backdrop-blur">
        <div className="px-6 pb-4 pt-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center border border-gold/60">
              <Sparkles size={16} className="text-gold-light" />
            </div>
            <div>
              <div className="font-display text-xl leading-none text-gold-light">Mercury</div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-text-faint)]">
                BOND COMPLIANCE
              </div>
            </div>
          </div>
        </div>
        <div className="gold-rule mb-4" />
        <nav className="px-3">
          {navigationItems.map((item) => {
            const isActive =
              item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-3 px-3 py-3 transition-all duration-200 ${
                  isActive ? 'text-gold-light' : 'text-[var(--color-text-muted)] hover:text-white'
                }`}
              >
                {/* 选中态左侧金色细线 */}
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute left-0 top-2 bottom-2 w-[2px] bg-gold-light"
                  />
                )}
                <Icon size={16} strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium leading-tight">{item.label}</span>
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--color-text-faint)]">
                    {item.subtitle}
                  </span>
                </div>
              </NavLink>
            );
          })}
        </nav>
        <div className="gold-rule mt-6" />
        <div className="px-6 py-4 text-[11px] text-[var(--color-text-faint)]">
          <div className="font-mono uppercase tracking-[0.2em]">Operator</div>
          <div className="mt-1 font-display text-base text-[var(--color-text)]">承销经理 · 林之翰</div>
          <div className="font-mono text-[10px]">ID 0428 / 风控合规</div>
        </div>
      </aside>

      {/* 主内容区域 */}
      <main className="flex flex-1 flex-col">
        {/* 顶部状态栏 */}
        <header className="flex items-center justify-between border-b border-line/70 bg-[rgba(15,35,53,0.55)] px-8 py-4 backdrop-blur">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--color-text-faint)]">
              MODULE / {currentNav?.subtitle?.toUpperCase()}
            </span>
            <h1 className="font-display text-3xl text-gold-light">{currentNav?.label}</h1>
          </div>
          <div className="flex items-center gap-6 text-[12px]">
            <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
              <CircleDot size={12} className="text-signal-green animate-pulse" />
              <span className="font-mono">市场行情 · 实时</span>
            </div>
            <div className="flex items-center gap-3 border border-line px-3 py-1.5">
              <span className="text-[var(--color-text-faint)] font-mono text-[10px]">CGB10Y</span>
              <span className="font-mono text-gold-light">2.184%</span>
              <span className="font-mono text-signal-red text-[11px]">+1.2bp</span>
            </div>
            <div className="flex items-center gap-3 border border-line px-3 py-1.5">
              <span className="text-[var(--color-text-faint)] font-mono text-[10px]">SHIBOR</span>
              <span className="font-mono text-gold-light">1.812%</span>
              <span className="font-mono text-signal-green text-[11px]">-0.4bp</span>
            </div>
            <div className="font-mono text-[var(--color-text-muted)]">
              {new Date().toLocaleDateString('zh-CN')} · {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </header>

        {/* 路由出口 */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
