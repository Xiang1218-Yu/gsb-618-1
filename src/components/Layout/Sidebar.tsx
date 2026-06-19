import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Wallet,
  TrendingUp,
  MessageSquare,
  CalendarClock,
  FileCheck,
  Building2,
  ChevronRight,
} from 'lucide-react';

/**
 * 侧边栏导航菜单项配置
 */
const menuItems = [
  { path: '/', label: '工作台总览', icon: LayoutDashboard },
  { path: '/bonds', label: '债券项目管理', icon: FileText },
  { path: '/funds', label: '募集资金追踪', icon: Wallet },
  { path: '/finance', label: '财务监控中心', icon: TrendingUp },
  { path: '/sentiment', label: '舆情监控中心', icon: MessageSquare },
  { path: '/duration', label: '存续期管理', icon: CalendarClock },
  { path: '/reports', label: '合规报告中心', icon: FileCheck },
];

/**
 * 侧边栏导航组件
 */
const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-primary-800 min-h-screen flex flex-col fixed left-0 top-0 z-20 shadow-xl">
      {/* Logo区域 */}
      <div className="h-16 flex items-center px-5 border-b border-primary-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gold-500 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-900" />
          </div>
          <div>
            <h1 className="text-white font-serif font-bold text-lg leading-tight">债券合规</h1>
            <p className="text-primary-300 text-xs">管理平台</p>
          </div>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {menuItems.map((item, index) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item opacity-0 animate-slide-up stagger-${index + 1} ${isActive ? 'nav-item-active' : ''}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </NavLink>
          );
        })}
      </nav>

      {/* 底部信息 */}
      <div className="p-4 border-t border-primary-700/50">
        <div className="bg-primary-900/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-risk-low animate-pulse"></div>
            <span className="text-primary-200 text-xs">系统运行正常</span>
          </div>
          <p className="text-primary-400 text-xs">数据更新: 2024-06-19</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
