import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus,
  AlertTriangle,
  Eye,
  CheckCircle2,
  Tag,
  Edit3,
  Newspaper,
  TrendingUp,
  Link2,
  BarChart3,
  User,
  Clock,
  Share2,
  MessageCircle
} from 'lucide-react';
import {
  Card,
  Badge,
  StatCard,
  Button,
  DataTable,
  PageHeader,
  SearchFilter,
  Modal
} from '@/components/UI';
import type { Column } from '@/components/UI/DataTable';
import { mockSentimentNews, mockSentimentStats } from '@/data/mockSentiment';
import type { SentimentNews } from '@/types/sentiment';
import type { WarningLevel } from '@/types/common';

// 舆情监控中心页面
const SentimentMonitor: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // ========== Modal相关状态 ==========
  // 舆情详情弹窗：控制显示/隐藏、当前选中新闻
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<SentimentNews | null>(null);

  // 标记处理弹窗：控制显示/隐藏、当前选中新闻、处理说明、成功状态
  const [handleModalOpen, setHandleModalOpen] = useState(false);
  const [handleNews, setHandleNews] = useState<SentimentNews | null>(null);
  const [handleNote, setHandleNote] = useState('');
  const [handleSuccess, setHandleSuccess] = useState(false);

  // 风险标记弹窗：控制显示/隐藏、当前选中新闻、选中的新风险等级
  const [riskModalOpen, setRiskModalOpen] = useState(false);
  const [riskNews, setRiskNews] = useState<SentimentNews | null>(null);
  const [newRiskLevel, setNewRiskLevel] = useState<WarningLevel>('warning');

  // ========== 本地状态管理 ==========
  // 本地已处理舆情ID集合
  const [locallyHandledIds, setLocallyHandledIds] = useState<Set<string>>(new Set());
  // 本地处理备注记录
  const [localHandleNotes, setLocalHandleNotes] = useState<Record<string, string>>({});
  // 本地修改后的风险等级
  const [localRiskLevels, setLocalRiskLevels] = useState<Record<string, WarningLevel>>({});

  /**
   * 情感类型映射配置
   */
  const sentimentMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default'; bgColor: string; icon: React.ElementType }> = {
    positive: { label: '正面', color: 'success', bgColor: 'bg-green-50', icon: ThumbsUp },
    neutral: { label: '中性', color: 'default', bgColor: 'bg-gray-50', icon: Minus },
    negative: { label: '负面', color: 'danger', bgColor: 'bg-red-50', icon: ThumbsDown }
  };

  /**
   * 风险等级映射配置
   */
  const riskMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default'; bgColor: string; borderColor: string }> = {
    normal: { label: '正常', color: 'success', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    attention: { label: '关注', color: 'info', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    warning: { label: '预警', color: 'warning', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
    danger: { label: '危险', color: 'danger', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
  };

  // 风险等级选项列表（用于风险标记弹窗）
  const riskLevelOptions: { value: WarningLevel; label: string; color: string }[] = [
    { value: 'normal', label: '正常', color: 'text-green-600' },
    { value: 'attention', label: '关注', color: 'text-blue-600' },
    { value: 'warning', label: '预警', color: 'text-amber-600' },
    { value: 'danger', label: '危险', color: 'text-red-600' }
  ];

  /**
   * 获取舆情的实际风险等级（优先本地修改）
   */
  const getNewsRiskLevel = (news: SentimentNews): WarningLevel => {
    return localRiskLevels[news.id] || news.riskLevel;
  };

  /**
   * 获取舆情的实际处理状态（优先本地处理）
   */
  const isNewsHandled = (news: SentimentNews): boolean => {
    return news.isHandled || locallyHandledIds.has(news.id);
  };

  /**
   * 获取舆情实际处理备注
   */
  const getNewsHandleNote = (news: SentimentNews): string | undefined => {
    return localHandleNotes[news.id] || news.handleNote;
  };

  /**
   * 获取处理人
   */
  const getNewsHandler = (news: SentimentNews): string | undefined => {
    if (locallyHandledIds.has(news.id)) return '当前用户';
    return news.handler;
  };

  // 合并本地状态后的新闻列表
  const mergedNewsList = mockSentimentNews.map(news => ({
    ...news,
    riskLevel: getNewsRiskLevel(news),
    riskLevelName: riskMap[getNewsRiskLevel(news)]?.label || news.riskLevelName,
    isHandled: isNewsHandled(news),
    handleNote: getNewsHandleNote(news),
    handler: getNewsHandler(news)
  }));

  // 统计数据
  const stats = {
    total: mockSentimentStats.totalCount,
    today: mockSentimentStats.todayCount,
    positive: mockSentimentStats.positiveCount,
    neutral: mockSentimentStats.neutralCount,
    negative: mockSentimentStats.negativeCount,
    danger: mockSentimentStats.dangerCount,
    warning: mockSentimentStats.warningCount
  };

  // 正面舆情占比
  const positiveRate = ((stats.positive / stats.total) * 100).toFixed(1);

  /**
   * 数据过滤函数
   */
  const filteredData = mergedNewsList.filter(news => {
    const matchSearch = news.title.includes(searchText) ||
                       news.summary.includes(searchText) ||
                       news.relatedBondNames.some(name => name.includes(searchText));
    const matchSentiment = sentimentFilter === 'all' || news.sentiment === sentimentFilter;
    const matchRisk = riskFilter === 'all' || getNewsRiskLevel(news) === riskFilter;
    return matchSearch && matchSentiment && matchRisk;
  });

  /**
   * 打开舆情详情弹窗
   */
  const openDetailModal = (news: SentimentNews) => {
    setSelectedNews(news);
    setDetailModalOpen(true);
  };

  /**
   * 打开标记处理弹窗
   */
  const openHandleModal = (news: SentimentNews) => {
    setHandleNews(news);
    setHandleNote('');
    setHandleSuccess(false);
    setHandleModalOpen(true);
  };

  /**
   * 关闭标记处理弹窗
   */
  const closeHandleModal = () => {
    setHandleModalOpen(false);
    setHandleNews(null);
    setHandleNote('');
    setHandleSuccess(false);
  };

  /**
   * 提交标记处理
   */
  const submitHandleNews = () => {
    if (handleNews) {
      setLocallyHandledIds(prev => new Set([...prev, handleNews.id]));
      setLocalHandleNotes(prev => ({ ...prev, [handleNews.id]: handleNote }));
      setHandleSuccess(true);
      setTimeout(() => {
        closeHandleModal();
      }, 1500);
    }
  };

  /**
   * 打开风险标记弹窗
   */
  const openRiskModal = (news: SentimentNews) => {
    setRiskNews(news);
    setNewRiskLevel(getNewsRiskLevel(news));
    setRiskModalOpen(true);
  };

  /**
   * 关闭风险标记弹窗
   */
  const closeRiskModal = () => {
    setRiskModalOpen(false);
    setRiskNews(null);
  };

  /**
   * 提交风险等级更新
   */
  const submitRiskUpdate = () => {
    if (riskNews) {
      setLocalRiskLevels(prev => ({ ...prev, [riskNews.id]: newRiskLevel }));
      closeRiskModal();
    }
  };

  /**
   * 新闻表格列配置
   */
  const columns: Column<SentimentNews & { riskLevel: WarningLevel }>[] = [
    {
      key: 'title',
      title: '舆情标题',
      width: '300px',
      render: (record) => (
        <div>
          <div
            className="font-medium text-gray-900 hover:text-[#1e3a8a] cursor-pointer line-clamp-2"
            onClick={() => openDetailModal(record)}
          >
            {record.title}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Newspaper className="w-3 h-3" />
              {record.source}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {record.publishDate}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'sentiment',
      title: '情感倾向',
      width: '100px',
      render: (record) => {
        const SentimentIcon = sentimentMap[record.sentiment]?.icon || Minus;
        return (
          <Badge variant={sentimentMap[record.sentiment]?.color || 'default'}>
            <SentimentIcon className="w-3 h-3 mr-1" />
            {sentimentMap[record.sentiment]?.label || record.sentimentName}
          </Badge>
        );
      }
    },
    {
      key: 'riskLevel',
      title: '风险等级',
      width: '100px',
      render: (record) => {
        const actualRisk = getNewsRiskLevel(record);
        return (
          <Badge variant={riskMap[actualRisk]?.color || 'default'} dot>
            {riskMap[actualRisk]?.label}
          </Badge>
        );
      }
    },
    {
      key: 'relatedBondNames',
      title: '关联债券',
      width: '150px',
      render: (record) => (
        <div className="flex flex-wrap gap-1">
          {record.relatedBondNames.map((name, idx) => (
            <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
              {name}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'keywords',
      title: '关键词',
      width: '200px',
      render: (record) => (
        <div className="flex flex-wrap gap-1">
          {record.keywords.map((keyword, idx) => (
            <span key={idx} className="text-xs text-gray-500">
              #{keyword}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'readCount',
      title: '阅读量',
      width: '100px',
      align: 'right',
      render: (record) => (
        <div className="flex items-center justify-end gap-1 text-sm text-gray-600">
          <Eye className="w-3 h-3" />
          {(record.readCount / 1000).toFixed(1)}k
        </div>
      )
    },
    {
      key: 'isHandled',
      title: '处理状态',
      width: '100px',
      render: (record) => {
        const handled = isNewsHandled(record);
        return handled ? (
          <Badge variant="success" dot>已处理</Badge>
        ) : (
          <Badge variant="warning" dot>待处理</Badge>
        );
      }
    },
    {
      key: 'actions',
      title: '操作',
      width: '200px',
      align: 'center',
      render: (record) => {
        const handled = isNewsHandled(record);
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="text"
              size="sm"
              onClick={() => openDetailModal(record)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            {handled ? (
              <Button variant="secondary" size="sm" disabled>
                <CheckCircle2 className="w-4 h-4 mr-1" />
                已处理
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openHandleModal(record)}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                处理
              </Button>
            )}
            <Button
              variant="text"
              size="sm"
              onClick={() => openRiskModal(record)}
            >
              <Tag className="w-4 h-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  // 情感筛选选项
  const sentimentOptions = [
    { label: '全部情感', value: 'all' },
    { label: '正面', value: 'positive' },
    { label: '中性', value: 'neutral' },
    { label: '负面', value: 'negative' }
  ];

  // 风险等级筛选选项
  const riskOptions = [
    { label: '全部风险', value: 'all' },
    { label: '正常', value: 'normal' },
    { label: '关注', value: 'attention' },
    { label: '预警', value: 'warning' },
    { label: '危险', value: 'danger' }
  ];

  /**
   * 获取合并后的新闻数据（用于详情弹窗）
   */
  const getMergedNews = (news: SentimentNews | null) => {
    if (!news) return null;
    return mergedNewsList.find(n => n.id === news.id) || news;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="舆情监控中心"
        description="实时监控债券相关舆情信息，分析情感倾向，预警舆情风险"
        breadcrumbs={[
          { title: '舆情监控', href: '/sentiment-monitor' }
        ]}
      />

      {/* 统计卡片区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard
          title="舆情总数"
          value={stats.total.toLocaleString()}
          icon={MessageSquare}
          gradient
        />
        <StatCard
          title="今日新增"
          value={stats.today}
          icon={MessageSquare}
          className="border-l-4 border-[#1e3a8a]"
        />
        <StatCard
          title="正面舆情"
          value={stats.positive}
          icon={ThumbsUp}
          trend={Number(positiveRate)}
          trendLabel="占比"
          className="border-l-4 border-green-500"
        />
        <StatCard
          title="中性舆情"
          value={stats.neutral}
          icon={Minus}
          className="border-l-4 border-gray-500"
        />
        <StatCard
          title="负面舆情"
          value={stats.negative}
          icon={ThumbsDown}
          className="border-l-4 border-red-500"
        />
        <StatCard
          title="高风险预警"
          value={stats.danger}
          icon={AlertTriangle}
          className="border-l-4 border-red-600"
        />
        <StatCard
          title="中风险预警"
          value={stats.warning}
          icon={AlertTriangle}
          className="border-l-4 border-amber-500"
        />
      </div>

      {/* 搜索和筛选区域 */}
      <Card>
        <SearchFilter
          searchPlaceholder="搜索舆情标题、摘要或关联债券"
          searchValue={searchText}
          onSearchChange={(val) => {
            setSearchText(val);
            setCurrentPage(1);
          }}
          selects={[
            {
              key: 'sentiment',
              value: sentimentFilter,
              onChange: (val) => {
                setSentimentFilter(val);
                setCurrentPage(1);
              },
              options: sentimentOptions,
              placeholder: '情感倾向'
            },
            {
              key: 'risk',
              value: riskFilter,
              onChange: (val) => {
                setRiskFilter(val);
                setCurrentPage(1);
              },
              options: riskOptions,
              placeholder: '风险等级'
            }
          ]}
        />
      </Card>

      {/* 数据表格 */}
      <Card bodyClassName="p-0">
        <DataTable<SentimentNews & Record<string, unknown>>
          columns={columns as unknown as Column<SentimentNews & Record<string, unknown>>[]}
          data={filteredData as unknown as (SentimentNews & Record<string, unknown>)[]}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredData.length,
            onChange: (page) => setCurrentPage(page)
          }}
        />
      </Card>

      {/* ========== 舆情详情弹窗 ========== */}
      <Modal
        open={detailModalOpen}
        title="舆情详情"
        width="xl"
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedNews(null);
        }}
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDetailModalOpen(false)}>
              关闭
            </Button>
            {selectedNews && !isNewsHandled(selectedNews) && (
              <Button variant="outline" onClick={() => {
                setDetailModalOpen(false);
                openHandleModal(selectedNews);
              }}>
                <Edit3 className="w-4 h-4 mr-1" />
                标记处理
              </Button>
            )}
            <Button variant="primary" onClick={() => {
              setDetailModalOpen(false);
              if (selectedNews) openRiskModal(selectedNews);
            }}>
              <Tag className="w-4 h-4 mr-1" />
              调整风险
            </Button>
          </div>
        }
      >
        {(() => {
          const news = getMergedNews(selectedNews);
          if (!news) return null;
          const SentimentIcon = sentimentMap[news.sentiment]?.icon || Minus;
          return (
            <div className="space-y-6">
              {/* 标题和标签区域 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{news.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Badge variant={sentimentMap[news.sentiment]?.color || 'default'}>
                    <SentimentIcon className="w-3 h-3 mr-1" />
                    {sentimentMap[news.sentiment]?.label}
                  </Badge>
                  <Badge variant={riskMap[getNewsRiskLevel(news)]?.color || 'default'} dot>
                    风险等级：{riskMap[getNewsRiskLevel(news)]?.label}
                  </Badge>
                  {isNewsHandled(news) ? (
                    <Badge variant="success" dot>已处理</Badge>
                  ) : (
                    <Badge variant="warning" dot>待处理</Badge>
                  )}
                </div>
              </div>

              {/* 来源和发布信息 */}
              <div className="flex items-center gap-6 text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-[#1e3a8a]" />
                  <span>来源：{news.source}</span>
                </div>
                {news.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#1e3a8a]" />
                    <span>作者：{news.author}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1e3a8a]" />
                  <span>发布时间：{news.publishDate}</span>
                </div>
              </div>

              {/* 传播数据 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Eye className="w-5 h-5 text-[#1e3a8a] mx-auto mb-2" />
                  <div className="text-xl font-bold text-[#1e3a8a]">{(news.readCount / 1000).toFixed(1)}k</div>
                  <div className="text-xs text-blue-600">阅读量</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <Share2 className="w-5 h-5 text-green-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-green-600">{news.repostCount}</div>
                  <div className="text-xs text-green-600">转发量</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 text-center">
                  <MessageCircle className="w-5 h-5 text-amber-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-amber-600">{news.commentCount}</div>
                  <div className="text-xs text-amber-600">评论数</div>
                </div>
              </div>

              {/* 完整新闻内容 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-[#1e3a8a]" />
                  新闻正文
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                  {news.content}
                </div>
              </div>

              {/* 摘要 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#1e3a8a]" />
                  内容摘要
                </h4>
                <div className="text-sm text-gray-600 italic">
                  "{news.summary}"
                </div>
              </div>

              {/* 情感分析 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#1e3a8a]" />
                  情感分析
                </h4>
                <div className={`rounded-lg p-4 border ${sentimentMap[news.sentiment]?.bgColor} border-${news.sentiment === 'positive' ? 'green' : news.sentiment === 'negative' ? 'red' : 'gray'}-200`}>
                  <div className="flex items-center gap-2 mb-2">
                    <SentimentIcon className={`w-5 h-5 ${
                      news.sentiment === 'positive' ? 'text-green-600' :
                      news.sentiment === 'negative' ? 'text-red-600' :
                      'text-gray-600'
                    }`} />
                    <span className="font-medium text-gray-900">
                      情感倾向：{sentimentMap[news.sentiment]?.label}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {news.sentiment === 'positive' && '该报道对主体持积极正面态度，有助于提升市场信心。'}
                    {news.sentiment === 'negative' && '该报道包含负面信息，可能对主体信用状况产生不利影响，需重点关注。'}
                    {news.sentiment === 'neutral' && '该报道为客观中性报道，无明显情感倾向。'}
                  </div>
                </div>
              </div>

              {/* 关联债券 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-[#1e3a8a]" />
                  关联债券
                </h4>
                <div className="flex flex-wrap gap-2">
                  {news.relatedBondNames.map((name, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-[#1e3a8a]/10 text-[#1e3a8a] rounded-lg text-sm font-medium">
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* 关键词 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">关键词标签</h4>
                <div className="flex flex-wrap gap-2">
                  {news.keywords.map((keyword, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* 影响评估 */}
              {news.impactAnalysis && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#d97706]" />
                    影响评估
                  </h4>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                    {news.impactAnalysis}
                  </div>
                </div>
              )}

              {/* 处理记录（如果已处理） */}
              {isNewsHandled(news) && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    处理记录
                  </h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-green-700 font-medium">处理人：{getNewsHandler(news)}</span>
                    </div>
                    {getNewsHandleNote(news) && (
                      <div className="text-green-600">
                        处理说明：{getNewsHandleNote(news)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* ========== 标记处理弹窗 ========== */}
      <Modal
        open={handleModalOpen}
        title={handleSuccess ? '处理成功' : '标记舆情已处理'}
        width="md"
        onClose={closeHandleModal}
        footer={
          handleSuccess ? (
            <Button variant="primary" onClick={closeHandleModal}>
              确定
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="secondary" onClick={closeHandleModal}>
                取消
              </Button>
              <Button variant="primary" onClick={submitHandleNews}>
                <CheckCircle2 className="w-4 h-4 mr-1" />
                完成处理
              </Button>
            </div>
          )
        }
      >
        {handleSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">舆情已标记为处理</h4>
            <p className="text-sm text-gray-500">该舆情状态已更新为已处理</p>
          </div>
        ) : handleNews && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="text-sm font-medium text-[#1e3a8a] mb-2 line-clamp-2">{handleNews.title}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{handleNews.source}</span>
                <span>•</span>
                <span>{handleNews.publishDate}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                处理说明 <span className="text-gray-400">（选填）</span>
              </label>
              <textarea
                value={handleNote}
                onChange={(e) => setHandleNote(e.target.value)}
                placeholder="请输入处理说明，如：已核实内容、已通知相关部门、持续跟踪中..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]/20 resize-none"
                rows={4}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* ========== 风险等级标记弹窗 ========== */}
      <Modal
        open={riskModalOpen}
        title="调整风险等级"
        width="md"
        onClose={closeRiskModal}
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={closeRiskModal}>
              取消
            </Button>
            <Button variant="gold" onClick={submitRiskUpdate}>
              <Tag className="w-4 h-4 mr-1" />
              确认更新
            </Button>
          </div>
        }
      >
        {riskNews && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <div className="text-sm font-medium text-amber-800 mb-2 line-clamp-2">{riskNews.title}</div>
              <div className="flex items-center gap-2 text-xs text-amber-600">
                <AlertTriangle className="w-3 h-3" />
                当前风险等级：{riskMap[getNewsRiskLevel(riskNews)]?.label}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                选择新的风险等级
              </label>
              <div className="grid grid-cols-2 gap-3">
                {riskLevelOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setNewRiskLevel(option.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      newRiskLevel === option.value
                        ? `${riskMap[option.value]?.borderColor} ${riskMap[option.value]?.bgColor}`
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className={`font-semibold ${option.color}`}>
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {option.value === 'normal' && '无风险，正常监控'}
                      {option.value === 'attention' && '需要持续关注'}
                      {option.value === 'warning' && '发出风险预警'}
                      {option.value === 'danger' && '高风险，需立即处理'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SentimentMonitor;
