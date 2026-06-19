import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck,
  Send,
  Clock,
  Wallet,
  BarChart3,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';

/**
 * 导航菜单项配置
 */
const menuItems = [
  { path: '/dashboard', label: '工作台', icon: LayoutDashboard },
  { path: '/underwriting', label: '承销管理', icon: FileCheck },
  { path: '/issuance', label: '发行管理', icon: Send },
  { path: '/duration', label: '存续期管理', icon: Clock },
  { path: '/funds', label: '募集资金', icon: Wallet },
  { path: '/finance', label: '财务监控', icon: BarChart3 },
  { path: '/sentiment', label: '舆情监控', icon: MessageSquare },
  { path: '/settings', label: '系统设置', icon: Settings },
];

/**
 * 左侧导航栏组件
 */
const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside
      className={`flex flex-col h-screen bg-[#1e3a8a] text-white transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo 区域 */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#d97706] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">债</span>
          </div>
          {!sidebarCollapsed && (
            <span className="font-bold text-lg whitespace-nowrap">
              债券合规管理平台
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-blue-800 transition-colors flex-shrink-0"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-900 text-[#d97706]'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* 用户信息区域 */}
      <div className="p-4 border-t border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d97706] to-amber-500 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">张三</p>
              <p className="text-xs text-blue-300 truncate">合规管理员</p>
            </div>
          )}
          {!sidebarCollapsed && (
            <button className="p-2 rounded-lg hover:bg-blue-800 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
