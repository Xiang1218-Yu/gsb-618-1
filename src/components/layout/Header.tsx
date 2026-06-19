import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, Settings, X, CheckCircle, AlertTriangle, FileText, Building2, MessageSquare, TrendingUp } from 'lucide-react';
import Modal from '../common/Modal';
import { useAppStore, selectUnhandledAlertsCount } from '../../store';

// 顶部栏组件
const Header = () => {
  const navigate = useNavigate();
  const unhandledAlertsCount = useAppStore(selectUnhandledAlertsCount);
  const { alerts, bondProjects, durationBonds, setShowNewProjectModal } = useAppStore();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(alerts.filter((a) => !a.isHandled));

  // 执行搜索
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    if (keyword.trim()) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  // 搜索结果匹配
  const getSearchResults = () => {
    const keyword = searchKeyword.toLowerCase();
    const results = [];

    // 搜索承销项目
    bondProjects.forEach((p) => {
      if (p.projectName.toLowerCase().includes(keyword) || p.issuerName.toLowerCase().includes(keyword)) {
        results.push({
          type: '承销项目',
          icon: FileText,
          title: p.projectName,
          subtitle: p.issuerName,
          path: '/underwriting',
          color: 'text-blue-600 bg-blue-50'
        });
      }
    });

    // 搜索存续期债券
    durationBonds.forEach((b) => {
      if (b.bondName.toLowerCase().includes(keyword) || b.bondCode.toLowerCase().includes(keyword) || b.issuerName.toLowerCase().includes(keyword)) {
        results.push({
          type: '存续债券',
          icon: Building2,
          title: b.bondName,
          subtitle: `${b.bondCode} · ${b.issuerName}`,
          path: '/duration',
          color: 'text-emerald-600 bg-emerald-50'
        });
      }
    });

    // 搜索预警
    alerts.filter((a) => !a.isHandled).forEach((a) => {
      if (a.title.toLowerCase().includes(keyword) || a.relatedBond.toLowerCase().includes(keyword)) {
        results.push({
          type: '风险预警',
          icon: AlertTriangle,
          title: a.title,
          subtitle: a.relatedBond,
          path: '/sentiment',
          color: 'text-red-600 bg-red-50'
        });
      }
    });

    return results.slice(0, 8);
  };

  // 点击搜索结果跳转
  const handleResultClick = (path: string) => {
    navigate(path);
    setShowSearchResults(false);
    setSearchKeyword('');
  };

  // 标记通知已读
  const handleMarkAsRead = (alertId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== alertId));
  };

  const searchResults = getSearchResults();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* 左侧：搜索栏 */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchKeyword && setShowSearchResults(true)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            placeholder="搜索债券、发行人、项目..."
            className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchKeyword && (
            <button
              onClick={() => { setSearchKeyword(''); setShowSearchResults(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}

          {/* 搜索结果下拉 */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl max-h-96 overflow-y-auto">
              <div className="p-2">
                {searchResults.map((result, idx) => {
                  const Icon = result.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleResultClick(result.path)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${result.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{result.title}</p>
                        <p className="text-xs text-slate-500 truncate">{result.type} · {result.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 右侧：操作区 */}
      <div className="flex items-center gap-4">
        {/* 通知 */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {unhandledAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                {unhandledAlertsCount}
              </span>
            )}
          </button>

          {/* 通知下拉 */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-semibold text-slate-900">通知中心</h4>
                <span className="text-xs text-slate-500">{notifications.length}条未读</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">暂无未读通知</p>
                  </div>
                ) : (
                  notifications.map((alert) => (
                    <div key={alert.id} className="p-4 border-b border-slate-50 hover:bg-slate-50">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${alert.level === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{alert.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{alert.relatedBond}</p>
                          <p className="text-xs text-slate-400 mt-1">{alert.createTime}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMarkAsRead(alert.id); }}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          已读
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => { navigate('/sentiment'); setShowNotifications(false); }}
                className="w-full p-3 text-sm text-blue-600 hover:bg-slate-50 text-center"
              >
                查看全部预警
              </button>
            </div>
          )}
        </div>

        {/* 设置 */}
        <button
          onClick={() => setShowSettingsModal(true)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Settings className="w-5 h-5 text-slate-600" />
        </button>

        {/* 用户信息 */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-800">张明</p>
            <p className="text-xs text-slate-500">项目经理</p>
          </div>
          <div
            onClick={() => setShowNewProjectModal && navigate('/underwriting')}
            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
          >
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* 设置弹窗 */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="系统设置"
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-3">预警通知设置</h4>
            <div className="space-y-3">
              {['高风险预警', '中风险预警', '舆情动态', '财务指标异常', '资金用途异常'].map((item) => (
                <label key={item} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{item}</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                </label>
              ))}
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-3">显示设置</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-700">侧边栏默认展开</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-700">图表动画效果</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => { alert('设置已保存'); setShowSettingsModal(false); }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              保存设置
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
};

export default Header;
