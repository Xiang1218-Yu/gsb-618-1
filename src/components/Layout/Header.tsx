import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
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
 * 面包屑导航路径映射
 * key: 路由路径
 * value: 对应的中文显示名称
 */
const breadcrumbMap: Record<string, string> = {
  '/': '工作台',
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
 * 包含面包屑导航、搜索、通知铃铛、用户菜单
 */
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } =
    useAppStore();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  /**
   * 根据当前路径生成面包屑导航数据
   * @returns 面包屑数组，包含首页和当前页面
   */
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const crumbs: Array<{ label: string; path: string; icon?: typeof Home }> = [
      { label: '首页', path: '/', icon: Home },
    ];

    // 如果不是根路径，添加当前页面的面包屑
    if (path !== '/') {
      const label = breadcrumbMap[path];
      if (label) {
        crumbs.push({ label, path });
      }
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  // 计算未读通知数量
  const unreadCount = notifications.filter((n) => !n.read).length;

  /**
   * 处理用户菜单点击 - 导航到对应页面并关闭菜单
   * @param path - 目标路由路径
   */
  const handleUserMenuClick = (path: string) => {
    setUserMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* 左侧 - 面包屑导航 */}
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

      {/* 右侧 - 操作按钮区域 */}
      <div className="flex items-center gap-4">
        {/* 搜索按钮 - 点击提示功能 */}
        <button
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#1e3a8a] transition-colors"
          onClick={() => alert('搜索功能开发中...')}
          title="搜索"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* 通知铃铛 - 点击展开通知面板 */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              setUserMenuOpen(false);
            }}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#1e3a8a] transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {/* 未读消息红点徽章 */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* 通知下拉面板 */}
          {notificationOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-medium text-gray-800">通知中心</span>
                <button
                  onClick={() => {
                    markAllNotificationsAsRead();
                    setNotificationOpen(false);
                  }}
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
                <button
                  className="w-full text-center text-sm text-[#1e3a8a] hover:text-[#d97706] py-1 transition-colors"
                  onClick={() => {
                    setNotificationOpen(false);
                    navigate('/sentiment');
                  }}
                >
                  查看全部通知
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 用户头像 - 点击展开用户菜单 */}
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

          {/* 用户下拉菜单 - 点击菜单项导航到对应页面 */}
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-medium text-gray-800">系统管理员</p>
                <p className="text-sm text-gray-500">a****@************</p>
              </div>
              <div className="py-1">
                {/* 个人中心按钮 */}
                <button
                  onClick={() => handleUserMenuClick('/settings')}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  个人中心
                </button>
                {/* 账户设置按钮 */}
                <button
                  onClick={() => handleUserMenuClick('/settings')}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  账户设置
                </button>
                <div className="border-t border-gray-100 my-1" />
                {/* 退出登录按钮 */}
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    alert('退出登录功能开发中...');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
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
