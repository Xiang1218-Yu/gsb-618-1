import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, User, ChevronDown, Menu, X, FileText, Building2, AlertTriangle, CheckSquare, CheckCheck } from 'lucide-react';
import { useAppStore } from '@/store';
import type { SearchResultItem } from '@/store';

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
 * 搜索结果类型图标映射
 */
const resultTypeIcons: Record<SearchResultItem['type'], React.ReactNode> = {
  bond: <FileText className="w-4 h-4 text-primary-600" />,
  issuer: <Building2 className="w-4 h-4 text-gold-600" />,
  risk: <AlertTriangle className="w-4 h-4 text-risk-high" />,
  todo: <CheckSquare className="w-4 h-4 text-risk-medium" />,
};

/**
 * 搜索结果类型标签映射
 */
const resultTypeLabels: Record<SearchResultItem['type'], string> = {
  bond: '债券',
  issuer: '发行人',
  risk: '风险预警',
  todo: '待办事项',
};

/**
 * 通知级别样式映射
 */
const notificationLevelStyles: Record<string, { border: string; icon: React.ReactNode; textColor: string }> = {
  high: { border: 'border-l-risk-high', icon: <AlertTriangle className="w-4 h-4 text-risk-high" />, textColor: 'text-red-600' },
  medium: { border: 'border-l-risk-medium', icon: <AlertTriangle className="w-4 h-4 text-risk-medium" />, textColor: 'text-amber-600' },
  low: { border: 'border-l-primary-500', icon: <Bell className="w-4 h-4 text-primary-600" />, textColor: 'text-primary-600' },
};

/**
 * 顶部导航Header组件
 */
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const systemNotifications = useAppStore((state) => state.systemNotifications);
  const unreadCount = systemNotifications.filter((n) => !n.read).length;
  const todoCount = useAppStore((state) => state.dashboardStats.todoCount);
  const globalSearch = useAppStore((state) => state.globalSearch);
  const markNotificationRead = useAppStore((state) => state.markNotificationRead);
  const markAllNotificationsRead = useAppStore((state) => state.markAllNotificationsRead);
  const openModal = useAppStore((state) => state.openModal);

  /** 实时搜索结果 */
  const searchResults = searchKeyword.trim() ? globalSearch(searchKeyword) : [];

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
    return [{ label: '首页', path: '/' }, ...paths.map((p) => ({ label: pageTitles['/' + p] || '债券详情', path: '/' + p }))];
  };

  /**
   * 处理搜索结果点击
   */
  const handleSearchResultClick = (result: SearchResultItem) => {
    setShowSearchResults(false);
    setSearchKeyword('');
    navigate(result.path);
  };

  /**
   * 处理回车搜索，跳转到债券列表
   */
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchKeyword.trim()) {
      setShowSearchResults(false);
      navigate(`/bonds?search=${encodeURIComponent(searchKeyword)}`);
      setSearchKeyword('');
    }
  };

  /** 点击外部关闭下拉菜单 */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
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
          <div className="relative hidden md:block" ref={searchRef}>
            <div className="flex items-center bg-slate-50 rounded-lg px-3 py-2 gap-2 w-72 border border-transparent focus-within:border-primary-300 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索债券、发行人、预警、待办..."
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => searchKeyword && setShowSearchResults(true)}
                onKeyDown={handleSearchKeyDown}
                className="bg-transparent outline-none text-sm flex-1 text-slate-700 placeholder:text-slate-400"
              />
              {searchKeyword && (
                <button
                  onClick={() => {
                    setSearchKeyword('');
                    setShowSearchResults(false);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 搜索结果下拉 */}
            {showSearchResults && searchKeyword.trim() && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-slate-100 bg-slate-50">
                  <p className="text-xs text-slate-500">
                    找到 <span className="font-semibold text-primary-700">{searchResults.length}</span> 条结果
                    {searchResults.length > 0 && '，按回车跳转到债券列表'}
                  </p>
                </div>
                {searchResults.length > 0 ? (
                  <div>
                    {searchResults.slice(0, 8).map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleSearchResultClick(result)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex items-start gap-3 transition-colors"
                      >
                        <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100">
                          {resultTypeIcons[result.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-800 truncate">{result.title}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 flex-shrink-0">
                              {resultTypeLabels[result.type]}
                            </span>
                          </div>
                          {result.subtitle && (
                            <p className="text-xs text-slate-500 mt-0.5 truncate">{result.subtitle}</p>
                          )}
                        </div>
                      </button>
                    ))}
                    {searchResults.length > 8 && (
                      <div className="p-3 text-center">
                        <button
                          onClick={() => {
                            navigate(`/bonds?search=${encodeURIComponent(searchKeyword)}`);
                            setShowSearchResults(false);
                            setSearchKeyword('');
                          }}
                          className="text-sm text-primary-700 hover:text-primary-800 font-medium"
                        >
                          查看全部 {searchResults.length} 条结果
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">未找到相关结果</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 通知 */}
          <div className="relative" ref={notificationRef}>
            <button
              className="p-2 rounded-lg hover:bg-slate-100 relative transition-colors"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-risk-high rounded-full text-white text-xs flex items-center justify-center font-medium animate-blink">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in z-40">
                <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">消息通知</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-primary-700 hover:text-primary-800 flex items-center gap-1"
                    >
                      <CheckCheck className="w-3 h-3" />全部已读
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {systemNotifications.map((notif) => {
                    const style = notificationLevelStyles[notif.level] || notificationLevelStyles.low;
                    return (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3 hover:bg-slate-50 border-l-4 cursor-pointer transition-colors ${style.border} ${!notif.read ? 'bg-slate-50/50' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 flex-shrink-0">{style.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-sm font-medium ${notif.read ? 'text-slate-500' : 'text-slate-800'}`}>
                                {notif.title}
                              </p>
                              {!notif.read && <span className="w-2 h-2 rounded-full bg-risk-high flex-shrink-0"></span>}
                            </div>
                            <p className={`text-xs mt-1 ${notif.read ? 'text-slate-400' : 'text-slate-500'}`}>{notif.content}</p>
                            <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 border-t border-slate-100 text-center">
                  <button className="text-sm text-primary-700 hover:text-primary-800 font-medium">查看全部消息</button>
                </div>
              </div>
            )}
          </div>

          {/* 用户信息 */}
          <div className="relative" ref={userMenuRef}>
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
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in z-40">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      openModal('profileSettings');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-500" />个人设置
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      openModal('changePassword');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    修改密码
                  </button>
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
