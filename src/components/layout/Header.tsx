import { Bell, Search, User, Settings } from 'lucide-react';
import { useAppStore, selectUnhandledAlertsCount } from '../../store';

// 顶部栏组件
const Header = () => {
  const unhandledAlertsCount = useAppStore(selectUnhandledAlertsCount);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* 左侧：搜索栏 */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="搜索债券、发行人、项目..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* 右侧：操作区 */}
      <div className="flex items-center gap-4">
        {/* 通知 */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          {unhandledAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {unhandledAlertsCount}
            </span>
          )}
        </button>

        {/* 设置 */}
        <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Settings className="w-5 h-5 text-slate-600" />
        </button>

        {/* 用户信息 */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-800">张明</p>
            <p className="text-xs text-slate-500">项目经理</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
