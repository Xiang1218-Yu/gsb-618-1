import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus,
  AlertTriangle,
  Eye,
  ExternalLink,
  type LucideIcon
} from 'lucide-react';
import {
  Card,
  Badge,
  StatCard,
  Button,
  DataTable,
  PageHeader,
  SearchFilter
} from '@/components/UI';
import type { Column } from '@/components/UI/DataTable';
import { mockSentimentNews, mockSentimentStats } from '@/data/mockSentiment';
import type { SentimentNews } from '@/types/sentiment';

// 舆情监控中心页面
const SentimentMonitor: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  /**
   * 情感类型映射配置
   * 定义舆情的三种情感倾向
   * key: 情感编码
   * label: 中文显示名称
   * color: Badge组件颜色
   * icon: 对应的图标组件
   */
  const sentimentMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default'; icon: LucideIcon }> = {
    positive: { label: '正面', color: 'success', icon: ThumbsUp },  // 正面积极舆情
    neutral: { label: '中性', color: 'default', icon: Minus },       // 中性客观报道
    negative: { label: '负面', color: 'danger', icon: ThumbsDown }   // 负面舆情
  };

  /**
   * 风险等级映射配置
   * 定义舆情风险的四级分类
   */
  const riskMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default' }> = {
    normal: { label: '正常', color: 'success' },      // 无风险
    attention: { label: '关注', color: 'info' },        // 需要关注
    warning: { label: '预警', color: 'warning' },      // 风险预警
    danger: { label: '危险', color: 'danger' }          // 高风险
  };

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

  // 正面舆情占比（用于趋势显示）
  const positiveRate = ((stats.positive / stats.total) * 100).toFixed(1);

  /**
   * 数据过滤函数
   * 过滤逻辑：
   * 1. 搜索文本：匹配标题、摘要或关联债券名称
   * 2. 情感筛选：选择全部时不过滤，否则匹配指定情感
   * 3. 风险筛选：选择全部时不过滤，否则匹配指定风险等级
   * 三个条件同时满足
   */
  const filteredData = mockSentimentNews.filter(news => {
    // 搜索条件：标题、摘要或关联债券名称包含搜索文本
    const matchSearch = news.title.includes(searchText) || 
                       news.summary.includes(searchText) ||
                       news.relatedBondNames.some(name => name.includes(searchText));
    // 情感条件：全部或匹配指定情感
    const matchSentiment = sentimentFilter === 'all' || news.sentiment === sentimentFilter;
    // 风险条件：全部或匹配指定风险等级
    const matchRisk = riskFilter === 'all' || news.riskLevel === riskFilter;
    return matchSearch && matchSentiment && matchRisk;
  });

  /**
   * 新闻表格列配置
   * 舆情新闻列表的列定义
   */
  const columns: Column<SentimentNews>[] = [
    // 舆情标题列：显示标题、来源和发布日期，标题可点击
    {
      key: 'title',
      title: '舆情标题',
      width: '300px',
      render: (record) => (
        <div>
          <div className="font-medium text-gray-900 hover:text-[#1e3a8a] cursor-pointer line-clamp-2">
            {record.title}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span>{record.source}</span>
            <span>{record.publishDate}</span>
          </div>
        </div>
      )
    },
    // 情感倾向列：显示带图标的情感标签
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
    // 风险等级列：显示风险等级标签（点状Badge）
    {
      key: 'riskLevel',
      title: '风险等级',
      width: '100px',
      render: (record) => (
        <Badge variant={riskMap[record.riskLevel]?.color || 'default'} dot>
          {riskMap[record.riskLevel]?.label || record.riskLevelName}
        </Badge>
      )
    },
    // 关联债券列：以标签形式显示相关的债券名称
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
    // 关键词列：以#标签形式显示舆情关键词
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
    // 阅读量列：显示阅读数，单位转换为k（千）
    {
      key: 'readCount',
      title: '阅读量',
      width: '100px',
      align: 'right',
      render: (record) => (
        <span className="text-sm text-gray-600">{(record.readCount / 1000).toFixed(1)}k</span>
      )
    },
    // 处理状态列：显示已处理/待处理
    {
      key: 'isHandled',
      title: '处理状态',
      width: '100px',
      render: (record) => (
        record.isHandled ? (
          <Badge variant="success" dot>已处理</Badge>
        ) : (
          <Badge variant="warning" dot>待处理</Badge>
        )
      )
    },
    // 操作列：查看详情和外部链接按钮
    {
      key: 'actions',
      title: '操作',
      width: '100px',
      align: 'center',
      render: () => (
        <div className="flex items-center justify-center gap-1">
          <Button variant="text" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="text" size="sm">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      )
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="舆情监控中心"
        description="实时监控债券相关舆情信息，分析情感倾向，预警舆情风险"
        breadcrumbs={[
          { title: '舆情监控', href: '/sentiment-monitor' }
        ]}
      />

      {/* 统计卡片区域 - 舆情数据概览 */}
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
          columns={columns as Column<SentimentNews & Record<string, unknown>>[]}
          data={filteredData as (SentimentNews & Record<string, unknown>)[]}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredData.length,
            onChange: (page) => setCurrentPage(page)
          }}
        />
      </Card>
    </div>
  );
};

export default SentimentMonitor;
