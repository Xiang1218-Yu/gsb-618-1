import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, User, ChevronDown, Menu, X } from 'lucide-react';
import { useAppStore } from '@/store';

/**
 * 页面标题映射
 */
const pageTitles: Record<string, string> = {
  '/': '工作台总览',
  '/bonds': '债券项目管理',
  '/funds': '募集资金追踪',
  '/finance': '财务监控中心',
  '/sentiment': '舆情监控中心',
  '/duration': '存续期管理',
  '/reports': '合规报告中心',
};

/**
 * 顶部导航Header组件
 */
const Header = () => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const highRiskCount = useAppStore((state) => state.dashboardStats.highRiskCount);
  const todoCount = useAppStore((state) => state.dashboardStats.todoCount);

  /**
   * 获取当前页面标题
   */
  const getPageTitle = () => {
    if (location.pathname.startsWith('/bonds/')) return '债券详情';
    return pageTitles[location.pathname] || '工作台';
  };

  /**
   * 获取面包屑路径
   */
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return [{ label: '首页', path: '/' }, ...paths.map((p) => ({ label: pageTitles['/' + p] || p, path: '/' + p }))];
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="h-full px-6 flex items-center justify-between">
        {/* 左侧：面包屑 */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <h2 className="text-lg font-semibold text-slate-800 font-serif">{getPageTitle()}</h2>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              {getBreadcrumbs().map((crumb, index, arr) => (
                <span key={crumb.path} className="flex items-center">
                  {index > 0 && <span className="mx-1">/</span>}
                  <span className={index === arr.length - 1 ? 'text-primary-700' : ''}>{crumb.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：搜索、通知、用户 */}
        <div className="flex items-center gap-3">
          {/* 搜索框 */}
          <div className="hidden md:flex items-center bg-slate-50 rounded-lg px-3 py-2 gap-2 w-64">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索债券代码/名称..."
              className="bg-transparent outline-none text-sm flex-1 text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* 通知 */}
          <div className="relative">
            <button
              className="p-2 rounded-lg hover:bg-slate-100 relative transition-colors"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {highRiskCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-risk-high rounded-full text-white text-xs flex items-center justify-center font-medium animate-blink">
                  {highRiskCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
                <div className="p-3 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">消息通知</h3>
                </div>
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  <div className="p-3 hover:bg-red-50 border-l-4 border-risk-high cursor-pointer">
                    <p className="text-sm font-medium text-slate-800">高风险预警</p>
                    <p className="text-xs text-slate-500 mt-1">盛世地产相关债券出现{highRiskCount}项高风险预警</p>
                    <p className="text-xs text-slate-400 mt-1">2024-06-19 09:30</p>
                  </div>
                  <div className="p-3 hover:bg-amber-50 border-l-4 border-risk-medium cursor-pointer">
                    <p className="text-sm font-medium text-slate-800">待办提醒</p>
                    <p className="text-xs text-slate-500 mt-1">您有{todoCount}项待办事项待处理</p>
                    <p className="text-xs text-slate-400 mt-1">2024-06-19 08:00</p>
                  </div>
                </div>
                <div className="p-3 border-t border-slate-100 text-center">
                  <button className="text-sm text-primary-700 hover:text-primary-800 font-medium">查看全部消息</button>
                </div>
              </div>
            )}
          </div>

          {/* 用户信息 */}
          <div className="relative">
            <button
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-700">合规管理员</p>
                <p className="text-xs text-slate-500">风险管理部</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
                <div className="p-2">
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50">个人设置</button>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50">修改密码</button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-risk-high hover:bg-red-50">退出登录</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
