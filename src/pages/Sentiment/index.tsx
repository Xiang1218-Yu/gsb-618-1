import { useState, useMemo } from 'react';
import {
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Newspaper,
  Flame,
  Clock,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useAppStore, sentimentDistribution, sentimentSourceDistribution } from '@/store';
import { getSentimentClass, getSentimentText, formatDate } from '@/utils/formatters';
import { PieChart } from '@/components/charts';

/**
 * 舆情筛选类型
 */
type SentimentFilter = 'all' | 'positive' | 'neutral' | 'negative';

/**
 * 舆情监控中心页面
 */
const Sentiment = () => {
  const bonds = useAppStore((state) => state.bonds);
  const getSentimentsByBondId = useAppStore((state) => state.getSentimentsByBondId);

  const [selectedFilter, setSelectedFilter] = useState<SentimentFilter>('all');

  /**
   * 获取所有舆情数据并关联债券名称
   */
  const allSentiments = useMemo(() => {
    const sentiments = bonds.flatMap((bond) =>
      getSentimentsByBondId(bond.id).map((sentiment) => ({
        ...sentiment,
        bondName: bond.bondName,
      }))
    );
    return sentiments.sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  }, [bonds, getSentimentsByBondId]);

  /**
   * 统计数据计算
   */
  const stats = useMemo(() => {
    const total = allSentiments.length;
    const negative = allSentiments.filter((s) => s.sentiment === 'negative').length;
    const bondIds = new Set(allSentiments.map((s) => s.bondId));
    const avgHeat =
      allSentiments.length > 0
        ? Math.round(allSentiments.reduce((sum, s) => sum + s.heat, 0) / allSentiments.length)
        : 0;
    return { total, negative, bondCount: bondIds.size, avgHeat };
  }, [allSentiments]);

  /**
   * 来源分布数据（添加颜色）
   */
  const sourceDistributionWithColors = useMemo(() => {
    const colors = ['#0A2463', '#D8B44A', '#E63946', '#2A9D8F', '#94a3b8'];
    return sentimentSourceDistribution.map((item, index) => ({
      ...item,
      color: colors[index % colors.length],
    }));
  }, []);

  /**
   * 根据筛选条件过滤舆情
   */
  const filteredSentiments = useMemo(() => {
    if (selectedFilter === 'all') return allSentiments;
    return allSentiments.filter((s) => s.sentiment === selectedFilter);
  }, [allSentiments, selectedFilter]);

  /**
   * 统计卡片配置
   */
  const statCards = [
    {
      title: '今日舆情总数',
      value: stats.total,
      unit: '条',
      icon: MessageSquare,
      iconBg: 'bg-primary-500/20',
      iconColor: '#0A2463',
      gradient: 'from-primary-600 to-primary-800',
    },
    {
      title: '负面舆情数',
      value: stats.negative,
      unit: '条',
      icon: AlertCircle,
      iconBg: 'bg-red-500/20',
      iconColor: '#E63946',
      gradient: 'from-red-500 to-red-700',
    },
    {
      title: '涉及债券数',
      value: stats.bondCount,
      unit: '只',
      icon: Newspaper,
      iconBg: 'bg-gold-500/20',
      iconColor: '#C19A2E',
      gradient: 'from-gold-500 to-gold-700',
    },
    {
      title: '平均热度',
      value: stats.avgHeat,
      unit: '',
      icon: TrendingUp,
      iconBg: 'bg-emerald-500/20',
      iconColor: '#059669',
      gradient: 'from-emerald-500 to-emerald-700',
    },
  ];

  /**
   * 筛选Tab配置
   */
  const filterTabs: { key: SentimentFilter; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'positive', label: '正面' },
    { key: 'neutral', label: '中性' },
    { key: 'negative', label: '负面' },
  ];

  /**
   * 获取来源标签样式
   * @param source 来源名称
   * @returns Tailwind CSS类名
   */
  const getSourceClass = (source: string): string => {
    const classMap: Record<string, string> = {
      财新网: 'bg-primary-100 text-primary-700',
      公司公告: 'bg-gold-100 text-gold-700',
      中国能源报: 'bg-emerald-100 text-emerald-700',
      中国交通报: 'bg-emerald-100 text-emerald-700',
      联合资信: 'bg-red-100 text-red-700',
      证券时报: 'bg-blue-100 text-blue-700',
      华尔街见闻: 'bg-red-100 text-red-700',
      健康报: 'bg-emerald-100 text-emerald-700',
    };
    return classMap[source] || 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题区域 */}
      <div className="page-card bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-primary-600/20 rounded-full translate-y-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Radio className="w-8 h-8 text-gold-400" />
            <h1 className="text-2xl font-bold text-white font-serif">舆情监控中心</h1>
          </div>
          <p className="text-primary-200 text-sm">
            实时追踪债券市场舆情动态，智能识别情感倾向，及时预警负面信息
          </p>
        </div>
      </div>

      {/* 统计卡片区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`stat-card opacity-0 animate-slide-up stagger-${index + 1} relative overflow-hidden`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`}></div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-sm mb-1">{card.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-800">{card.value}</span>
                    <span className="text-slate-500 text-sm">{card.unit}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" style={{ color: card.iconColor }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 情感分布饼图 */}
        <div className="page-card p-6 opacity-0 animate-slide-up stagger-1">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-primary-700" />
            <h3 className="text-lg font-semibold text-slate-800 font-serif">情感分布</h3>
          </div>
          <PieChart data={sentimentDistribution} height={280} />
        </div>

        {/* 来源分布饼图 */}
        <div className="page-card p-6 opacity-0 animate-slide-up stagger-2">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-5 h-5 text-gold-600" />
            <h3 className="text-lg font-semibold text-slate-800 font-serif">来源分布</h3>
          </div>
          <PieChart data={sourceDistributionWithColors} height={280} />
        </div>
      </div>

      {/* 舆情列表区域 */}
      <div className="page-card opacity-0 animate-slide-up stagger-3">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-700" />
              <h3 className="text-lg font-semibold text-slate-800 font-serif">舆情信息流</h3>
              <span className="text-sm text-slate-500 ml-2">共 {filteredSentiments.length} 条</span>
            </div>
            <div className="flex gap-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedFilter(tab.key)}
                  className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                    selectedFilter === tab.key
                      ? tab.key === 'negative'
                        ? 'bg-red-100 text-red-700 font-medium'
                        : tab.key === 'positive'
                        ? 'bg-emerald-100 text-emerald-700 font-medium'
                        : tab.key === 'neutral'
                        ? 'bg-slate-200 text-slate-700 font-medium'
                        : 'bg-primary-100 text-primary-700 font-medium'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 舆情卡片流 */}
        <div className="p-6">
          {filteredSentiments.length === 0 ? (
            <div className="py-12 text-center text-slate-400">暂无相关舆情信息</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSentiments.map((sentiment) => (
                <div
                  key={sentiment.id}
                  className="border border-slate-100 rounded-xl p-5 hover:shadow-lg hover:border-primary-200 transition-all duration-300 bg-white hover:-translate-y-1"
                >
                  {/* 头部标签 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`status-badge ${getSentimentClass(sentiment.sentiment)}`}>
                        {getSentimentText(sentiment.sentiment)}
                      </span>
                      <span className={`status-badge ${getSourceClass(sentiment.source)}`}>
                        {sentiment.source}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        sentiment.heat >= 80 ? 'text-red-600' : 'text-slate-500'
                      }`}
                    >
                      <Flame
                        className={`w-4 h-4 ${sentiment.heat >= 80 ? 'animate-pulse' : ''}`}
                      />
                      <span
                        className={`text-sm font-semibold ${
                          sentiment.heat >= 80 ? 'text-red-600' : ''
                        }`}
                      >
                        {sentiment.heat}
                      </span>
                    </div>
                  </div>

                  {/* 标题 */}
                  <h4 className="text-base font-semibold text-slate-800 mb-2 line-clamp-2 leading-snug">
                    {sentiment.title}
                  </h4>

                  {/* 摘要 */}
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                    {sentiment.summary}
                  </p>

                  {/* 关键词 */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {sentiment.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-2 py-0.5 bg-slate-50 text-slate-600 text-xs rounded border border-slate-100"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>

                  {/* 底部信息 */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(sentiment.publishDate)}
                      </span>
                      <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                        {sentiment.bondName}
                      </span>
                    </div>
                    {sentiment.url && (
                      <button className="text-slate-400 hover:text-primary-700 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sentiment;
