import { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, ExternalLink, MessageSquare, TrendingUp, TrendingDown, Minus, Eye, Share2 } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { useAppStore } from '../../store';

// 舆情动态监控页面
const SentimentPage = () => {
  const { sentimentNews, markNewsAsHandled, alerts, handleAlert } = useAppStore();
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(sentimentNews[0]?.id || null);
  const [showNewsDetail, setShowNewsDetail] = useState(false);

  const selectedNews = sentimentNews.find((n) => n.id === selectedNewsId);
  const highRiskAlerts = alerts.filter((a) => a.level === 'high' && !a.isHandled);

  // 获取情感标签样式
  const getSentimentConfig = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return { label: '正面', variant: 'success' as const, icon: TrendingUp, color: 'text-emerald-500' };
      case 'negative':
        return { label: '负面', variant: 'danger' as const, icon: TrendingDown, color: 'text-red-500' };
      default:
        return { label: '中性', variant: 'default' as const, icon: Minus, color: 'text-slate-500' };
    }
  };

  // 获取风险等级样式
  const getRiskConfig = (level: string) => {
    switch (level) {
      case 'high':
        return { label: '高风险', variant: 'danger' as const, dotColor: 'bg-red-500' };
      case 'medium':
        return { label: '中风险', variant: 'warning' as const, dotColor: 'bg-amber-500' };
      default:
        return { label: '低风险', variant: 'success' as const, dotColor: 'bg-emerald-500' };
    }
  };

  // 过滤舆情列表
  const filteredNews = sentimentNews.filter((news) => {
    if (riskFilter === 'all') return true;
    return news.riskLevel === riskFilter;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">舆情动态监控</h1>
        <p className="text-slate-500 mt-1">实时监控发行人舆情动态，智能识别风险事件</p>
      </div>

      {/* 风险预警横幅 */}
      {highRiskAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-900">高风险预警 ({highRiskAlerts.length}条)</p>
              <div className="mt-2 space-y-2">
                {highRiskAlerts.slice(0, 2).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-100">
                    <div>
                      <p className="text-sm font-medium text-red-800">{alert.title}</p>
                      <p className="text-xs text-red-600 mt-1">{alert.relatedBond} · {alert.createTime}</p>
                    </div>
                    <button
                      onClick={() => handleAlert(alert.id, '张明')}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                    >
                      处理
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{sentimentNews.length}</p>
              <p className="text-sm text-slate-500">舆情总数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{sentimentNews.filter((n) => n.sentiment === 'positive').length}</p>
              <p className="text-sm text-slate-500">正面舆情</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{sentimentNews.filter((n) => n.sentiment === 'negative').length}</p>
              <p className="text-sm text-slate-500">负面舆情</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{sentimentNews.filter((n) => !n.isHandled).length}</p>
              <p className="text-sm text-slate-500">待处理</p>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex gap-2">
          {[
            { key: 'all', label: '全部' },
            { key: 'high', label: '高风险' },
            { key: 'medium', label: '中风险' },
            { key: 'low', label: '低风险' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setRiskFilter(item.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${riskFilter === item.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 舆情列表 */}
        <div className="lg:col-span-2 space-y-4">
          {filteredNews.map((news) => {
            const sentimentCfg = getSentimentConfig(news.sentiment);
            const riskCfg = getRiskConfig(news.riskLevel);
            const SentimentIcon = sentimentCfg.icon;

            return (
              <div
                key={news.id}
                onClick={() => setSelectedNewsId(news.id)}
                className={`bg-white rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md
                  ${selectedNewsId === news.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}
                  ${news.riskLevel === 'high' && !news.isHandled ? 'border-l-4 border-l-red-500' : ''}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${riskCfg.dotColor} ${news.riskLevel === 'high' ? 'animate-pulse' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-slate-900 leading-tight">{news.title}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className={`flex items-center gap-1 ${sentimentCfg.color}`}>
                          <SentimentIcon className="w-4 h-4" />
                        </div>
                        <StatusBadge status={news.riskLevel} variant={riskCfg.variant}>
                          {riskCfg.label}
                        </StatusBadge>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{news.summary}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-slate-500">{news.source}</span>
                      <span className="text-xs text-slate-400">{news.publishDate}</span>
                      <span className="text-xs text-slate-500">{news.relatedIssuer}</span>
                      <div className="ml-auto flex items-center gap-2">
                        {news.keywords.slice(0, 3).map((keyword) => (
                          <span key={keyword} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 舆情详情 */}
        <div className="lg:col-span-1">
          {selectedNews ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-20">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-3 h-3 rounded-full ${getRiskConfig(selectedNews.riskLevel).dotColor}`} />
                  <StatusBadge
                    status={selectedNews.riskLevel}
                    variant={getRiskConfig(selectedNews.riskLevel).variant}
                  >
                    {getRiskConfig(selectedNews.riskLevel).label}
                  </StatusBadge>
                  <StatusBadge
                    status={selectedNews.sentiment}
                    variant={getSentimentConfig(selectedNews.sentiment).variant}
                  >
                    {getSentimentConfig(selectedNews.sentiment).label}
                  </StatusBadge>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{selectedNews.title}</h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">来源：</span>
                    <span className="text-slate-900 font-medium">{selectedNews.source}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">发布时间：</span>
                    <span className="text-slate-900">{selectedNews.publishDate}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-900 mb-2">关联主体</p>
                  <p className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg inline-block">
                    {selectedNews.relatedIssuer}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-900 mb-2">舆情摘要</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedNews.summary}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-900 mb-2">关键词</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedNews.keywords.map((keyword) => (
                      <span key={keyword} className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-slate-500">处理状态</span>
                    {selectedNews.isHandled ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-sm">
                        <CheckCircle className="w-4 h-4" /> 已处理
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 text-sm">
                        <Clock className="w-4 h-4" /> 待处理
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowNewsDetail(true)}
                      className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium inline-flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      查看原文
                    </button>
                    {!selectedNews.isHandled && (
                      <button
                        onClick={() => markNewsAsHandled(selectedNews.id)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        标记已处理
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => alert('链接已复制到剪贴板')}
                    className="w-full mt-2 px-4 py-2 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium inline-flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    分享舆情
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">选择左侧舆情查看详情</p>
            </div>
          )}
        </div>
      </div>

      {/* 查看原文弹窗 */}
      <Modal
        isOpen={showNewsDetail}
        onClose={() => setShowNewsDetail(false)}
        title="舆情原文"
      >
        {selectedNews && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>{selectedNews.source}</span>
              <span>·</span>
              <span>{selectedNews.publishDate}</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{selectedNews.title}</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-slate-700 leading-relaxed">{selectedNews.summary}</p>
              <p className="text-slate-600 leading-relaxed mt-4">
                【正文内容】根据相关报道，{selectedNews.relatedIssuer}近期经营状况受到市场广泛关注。
                本资讯来源于公开信息整理，仅供参考，不构成任何投资建议。投资者据此操作，风险自担。
              </p>
              <p className="text-slate-500 text-sm mt-4 italic">
                （以上为模拟原文内容，实际使用时将对接真实舆情数据源）
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); window.open('https://www.example.com', '_blank'); }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium inline-flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                打开原文链接
              </a>
              <button
                onClick={() => setShowNewsDetail(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
              >
                关闭
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SentimentPage;
