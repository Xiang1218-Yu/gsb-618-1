import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Home,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';

/**
 * 面包屑导航映射
 */
const breadcrumbMap: Record<string, string> = {
  '/dashboard': '工作台',
  '/underwriting': '承销管理',
  '/issuance': '发行管理',
  '/duration': '存续期管理',
  '/funds': '募集资金',
  '/finance': '财务监控',
  '/sentiment': '舆情监控',
  '/settings': '系统设置',
};

/**
 * 顶部状态栏组件
 */
const Header = () => {
  const location = useLocation();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } =
    useAppStore();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // 获取面包屑
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const crumbs: Array<{ label: string; path: string; icon?: typeof Home }> = [
      { label: '首页', path: '/', icon: Home },
    ];

    if (path !== '/' && path !== '/dashboard') {
      const label = breadcrumbMap[path];
      if (label) {
        crumbs.push({ label, path });
      }
    } else if (path === '/dashboard' || path === '/') {
      crumbs.push({ label: '工作台', path: '/dashboard' });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* 面包屑导航 */}
      <nav className="flex items-center gap-2">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path} className="flex items-center gap-2">
            {index > 0 && <span className="text-gray-400">/</span>}
            <Link
              to={crumb.path}
              className={`flex items-center gap-1 text-sm transition-colors ${
                index === breadcrumbs.length - 1
                  ? 'text-[#1e3a8a] font-medium'
                  : 'text-gray-500 hover:text-[#1e3a8a]'
              }`}
            >
              {crumb.icon && <crumb.icon className="w-4 h-4" />}
              {crumb.label}
            </Link>
          </div>
        ))}
      </nav>

      {/* 右侧操作区 */}
      <div className="flex items-center gap-4">
        {/* 搜索图标 */}
        <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#1e3a8a] transition-colors">
          <Search className="w-5 h-5" />
        </button>

        {/* 通知铃铛 */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              setUserMenuOpen(false);
            }}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#1e3a8a] transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* 通知下拉面板 */}
          {notificationOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-medium text-gray-800">通知中心</span>
                <button
                  onClick={() => markAllNotificationsAsRead()}
                  className="text-sm text-[#1e3a8a] hover:text-[#d97706] transition-colors"
                >
                  全部已读
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-gray-400">
                    暂无通知
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markNotificationAsRead(notification.id)}
                      className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            !notification.read ? 'bg-[#d97706]' : 'bg-gray-300'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-800">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate mt-1">
                            {notification.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button className="w-full text-center text-sm text-[#1e3a8a] hover:text-[#d97706] py-1 transition-colors">
                  查看全部通知
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 用户头像下拉 */}
        <div className="relative">
          <button
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setNotificationOpen(false);
            }}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1e3a8a] to-blue-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {/* 用户下拉菜单 */}
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-medium text-gray-800">张三</p>
                <p className="text-sm text-gray-500">z*******@***********</p>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <User className="w-4 h-4" />
                  个人中心
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4" />
                  账户设置
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
