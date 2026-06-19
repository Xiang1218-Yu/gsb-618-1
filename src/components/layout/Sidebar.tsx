import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Building2,
  Wallet,
  TrendingUp,
  MessageSquare,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useAppStore } from '../../store';

// 导航菜单项配置
const menuItems = [
  { path: '/', label: '控制台首页', icon: LayoutDashboard },
  { path: '/underwriting', label: '承销发行管理', icon: FileText },
  { path: '/duration', label: '存续期管理', icon: Building2 },
  { path: '/funds', label: '募集资金追踪', icon: Wallet },
  { path: '/financial', label: '财务指标监控', icon: TrendingUp },
  { path: '/sentiment', label: '舆情动态监控', icon: MessageSquare },
  { path: '/reports', label: '合规报告中心', icon: FileCheck }
];

// 侧边栏组件
const Sidebar = () => {
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-slate-900 text-white transition-all duration-300 ease-in-out z-40 flex flex-col
        ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Logo区域 */}
      <div className="h-16 flex items-center justify-center border-b border-slate-700 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold whitespace-nowrap">债券合规平台</h1>
              <p className="text-xs text-slate-400 whitespace-nowrap">Bond Compliance System</p>
            </div>
          )}
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 折叠按钮 */}
      <div className="p-3 border-t border-slate-700">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">收起菜单</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
