import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Eye,
  BarChart3,
  Activity,
  CheckCircle2,
  LineChart,
  PieChart
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
import { mockFinancialIndicators, mockFinanceWarnings, mockIndicatorHistory } from '@/data/mockFinance';
import type { FinancialIndicator, FinanceWarning, IndicatorHistoryPoint } from '@/types/finance';

// 财务监控中心页面
const FinanceMonitor: React.FC = () => {
  // 当前激活标签页：指标总览/财务指标监控/财务预警记录/趋势分析
  const [activeTab, setActiveTab] = useState<'overview' | 'indicators' | 'warnings' | 'trend'>('overview');
  const [searchText, setSearchText] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // ========== Modal相关状态 ==========
  // 预警处理弹窗：控制显示/隐藏、当前选中预警、处理备注、处理中状态
  const [handleModalOpen, setHandleModalOpen] = useState(false);
  const [selectedWarning, setSelectedWarning] = useState<FinanceWarning | null>(null);
  const [handleNote, setHandleNote] = useState('');
  const [handleSuccess, setHandleSuccess] = useState(false);

  // 指标详情弹窗：控制显示/隐藏、当前选中指标
  const [indicatorModalOpen, setIndicatorModalOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<FinancialIndicator | null>(null);

  // 本地已处理预警ID集合（维护本地状态）
  const [locallyHandledIds, setLocallyHandledIds] = useState<Set<string>>(new Set());
  // 本地处理备注记录
  const [localHandleNotes, setLocalHandleNotes] = useState<Record<string, string>>({});

  /**
   * 预警等级映射配置
   * 定义财务指标的四级预警等级
   */
  const levelMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default'; bgColor: string; borderColor: string }> = {
    normal: { label: '正常', color: 'success', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    attention: { label: '关注', color: 'info', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    warning: { label: '预警', color: 'warning', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
    danger: { label: '危险', color: 'danger', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
  };

  // 合并本地处理状态后的预警列表
  const mergedWarnings = mockFinanceWarnings.map(w => {
    if (locallyHandledIds.has(w.id)) {
      return {
        ...w,
        handled: true,
        handler: '当前用户',
        handleDate: new Date().toISOString().split('T')[0],
        handleNote: localHandleNotes[w.id] || w.handleNote
      };
    }
    return w;
  });

  // 统计数据
  const stats = {
    total: mockFinancialIndicators.length,
    normal: mockFinancialIndicators.filter(i => i.warningLevel === 'normal').length,
    attention: mockFinancialIndicators.filter(i => i.warningLevel === 'attention').length,
    warning: mockFinancialIndicators.filter(i => i.warningLevel === 'warning').length,
    danger: mockFinancialIndicators.filter(i => i.warningLevel === 'danger').length,
    unhandledWarnings: mergedWarnings.filter(w => !w.handled).length
  };

  /**
   * 检查预警是否已处理（原始数据或本地处理）
   */
  const isWarningHandled = (warningId: string) => {
    const original = mockFinanceWarnings.find(w => w.id === warningId);
    return (original?.handled || locallyHandledIds.has(warningId));
  };

  /**
   * 打开处理预警弹窗
   */
  const openHandleModal = (warning: FinanceWarning) => {
    setSelectedWarning(warning);
    setHandleNote('');
    setHandleSuccess(false);
    setHandleModalOpen(true);
  };

  /**
   * 关闭处理预警弹窗
   */
  const closeHandleModal = () => {
    setHandleModalOpen(false);
    setSelectedWarning(null);
    setHandleNote('');
    setHandleSuccess(false);
  };

  /**
   * 提交处理预警
   * 更新本地状态，标记为已处理
   */
  const submitHandleWarning = () => {
    if (selectedWarning) {
      setLocallyHandledIds(prev => new Set([...prev, selectedWarning.id]));
      setLocalHandleNotes(prev => ({ ...prev, [selectedWarning.id]: handleNote }));
      setHandleSuccess(true);
      setTimeout(() => {
        closeHandleModal();
      }, 1500);
    }
  };

  /**
   * 打开指标详情弹窗
   */
  const openIndicatorModal = (indicator: FinancialIndicator) => {
    setSelectedIndicator(indicator);
    setIndicatorModalOpen(true);
  };

  /**
   * 获取指标历史趋势数据
   */
  const getIndicatorHistory = (indicator: FinancialIndicator): IndicatorHistoryPoint[] => {
    const key = `${indicator.bondId}_${indicator.indicatorCode}`;
    return mockIndicatorHistory[key] || [];
  };

  /**
   * 渲染简单趋势线图（使用SVG）
   */
  const renderTrendChart = (historyData: IndicatorHistoryPoint[]) => {
    if (historyData.length === 0) return null;

    const width = 500;
    const height = 200;
    const padding = 30;
    const values = historyData.map(d => d.value);
    const minVal = Math.min(...values) * 0.9;
    const maxVal = Math.max(...values) * 1.1;
    const range = maxVal - minVal;

    // 计算坐标点
    const points = historyData.map((d, i) => {
      const x = padding + (i / (historyData.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((d.value - minVal) / range) * (height - 2 * padding);
      return { x, y, value: d.value, date: d.date };
    });

    // 生成路径
    const pathD = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
    // 生成填充区域路径
    const areaD = pathD + ` L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return (
      <div className="w-full overflow-x-auto">
        <svg width={width} height={height} className="mx-auto">
          {/* 网格线 */}
          {[0, 1, 2, 3, 4].map(i => {
            const y = padding + i * ((height - 2 * padding) / 4);
            const val = maxVal - (i / 4) * range;
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e5e7eb" strokeDasharray="4 4" />
                <text x={padding - 5} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}
          {/* X轴标签 */}
          {points.map((p, i) => (
            i % 2 === 0 && (
              <text key={i} x={p.x} y={height - 10} textAnchor="middle" fontSize="10" fill="#9ca3af">
                {p.date}
              </text>
            )
          ))}
          {/* 填充区域 */}
          <path d={areaD} fill="url(#gradient)" opacity="0.3" />
          {/* 趋势线 */}
          <path d={pathD} fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* 数据点 */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#d97706" stroke="white" strokeWidth="2" />
          ))}
          {/* 渐变定义 */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  /**
   * 财务指标表格列配置
   */
  const indicatorColumns: Column<FinancialIndicator>[] = [
    {
      key: 'bondName',
      title: '债券名称',
      width: '120px',
      render: (record) => (
        <div>
          <div className="font-medium text-gray-900">{record.bondName}</div>
          <div className="text-xs text-gray-500">{record.issuerName}</div>
        </div>
      )
    },
    {
      key: 'indicatorName',
      title: '财务指标',
      width: '160px',
      render: (record) => (
        <div>
          <span className="text-sm font-medium text-gray-800">{record.indicatorName}</span>
          <div className="text-xs text-gray-400 mt-0.5">{record.reportPeriod}</div>
        </div>
      )
    },
    {
      key: 'currentValue',
      title: '当前值',
      width: '100px',
      align: 'right',
      render: (record) => (
        <div className="text-right">
          <span className={`text-lg font-bold ${
            record.warningLevel === 'danger' ? 'text-red-600' :
            record.warningLevel === 'warning' ? 'text-amber-600' :
            record.warningLevel === 'attention' ? 'text-blue-600' :
            'text-green-600'
          }`}>
            {record.currentValue}
          </span>
        </div>
      )
    },
    {
      key: 'changeValue',
      title: '较上期',
      width: '100px',
      align: 'right',
      render: (record) => (
        <div className="flex items-center justify-end gap-1">
          {record.changeValue > 0 ? (
            <TrendingUp className="w-4 h-4 text-red-500" />
          ) : record.changeValue < 0 ? (
            <TrendingDown className="w-4 h-4 text-green-500" />
          ) : null}
          <span className={`text-sm font-medium ${
            record.changeValue > 0 ? 'text-red-600' :
            record.changeValue < 0 ? 'text-green-600' :
            'text-gray-500'
          }`}>
            {record.changeValue > 0 ? '+' : ''}{record.changeValue}
          </span>
        </div>
      )
    },
    {
      key: 'warningLevel',
      title: '预警等级',
      width: '100px',
      render: (record) => (
        <Badge variant={levelMap[record.warningLevel]?.color || 'default'} dot>
          {levelMap[record.warningLevel]?.label || record.warningLevelName}
        </Badge>
      )
    },
    {
      key: 'thresholdInfo',
      title: '阈值说明',
      render: (record) => (
        <span className="text-xs text-gray-500">{record.thresholdInfo}</span>
      )
    },
    {
      key: 'actions',
      title: '操作',
      width: '100px',
      align: 'center',
      render: (record) => (
        <div className="flex items-center justify-center">
          <Button
            variant="text"
            size="sm"
            onClick={() => openIndicatorModal(record)}
          >
            <Eye className="w-4 h-4 mr-1" />
            详情
          </Button>
        </div>
      )
    }
  ];

  /**
   * 财务预警表格列配置
   */
  const warningColumns: Column<FinanceWarning>[] = [
    {
      key: 'bondName',
      title: '债券名称',
      width: '120px',
      render: (record) => (
        <div>
          <div className="font-medium text-gray-900">{record.bondName}</div>
          <div className="text-xs text-gray-500">{record.issuerName}</div>
        </div>
      )
    },
    {
      key: 'indicatorName',
      title: '预警指标',
      width: '150px',
      render: (record) => <span className="text-sm font-medium text-gray-800">{record.indicatorName}</span>
    },
    {
      key: 'currentValue',
      title: '当前值',
      width: '100px',
      align: 'right',
      render: (record) => (
        <span className="text-sm font-bold text-red-600">
          {record.currentValue}
        </span>
      )
    },
    {
      key: 'thresholdValue',
      title: '阈值',
      width: '100px',
      align: 'right',
      render: (record) => (
        <span className="text-sm text-gray-500">
          {record.thresholdValue}
        </span>
      )
    },
    {
      key: 'warningLevel',
      title: '等级',
      width: '80px',
      render: (record) => (
        <Badge variant={levelMap[record.warningLevel]?.color || 'default'} dot>
          {levelMap[record.warningLevel]?.label || record.warningLevelName}
        </Badge>
      )
    },
    {
      key: 'triggerDate',
      title: '触发日期',
      width: '110px',
      render: (record) => <span className="text-sm text-gray-600">{record.triggerDate}</span>
    },
    {
      key: 'status',
      title: '处理状态',
      width: '100px',
      render: (record) => {
        const handled = isWarningHandled(record.id);
        return handled ? (
          <Badge variant="success" dot>已处理</Badge>
        ) : (
          <Badge variant="danger" dot>待处理</Badge>
        );
      }
    },
    {
      key: 'handler',
      title: '处理人',
      width: '90px',
      render: (record) => {
        const mergedW = mergedWarnings.find(w => w.id === record.id);
        return <span className="text-sm text-gray-700">{mergedW?.handler || '-'}</span>;
      }
    },
    {
      key: 'actions',
      title: '操作',
      width: '120px',
      align: 'center',
      render: (record) => {
        const handled = isWarningHandled(record.id);
        return (
          <div className="flex items-center justify-center gap-1">
            {handled ? (
              <Button variant="secondary" size="sm" disabled>
                <CheckCircle className="w-4 h-4 mr-1" />
                已处理
              </Button>
            ) : (
              <Button
                variant="gold"
                size="sm"
                onClick={() => openHandleModal(record)}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                标记处理
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  /**
   * 获取当前表格数据
   */
  const getTableData = () => {
    switch (activeTab) {
      case 'indicators':
        return mockFinancialIndicators.filter(i =>
          i.bondName.includes(searchText) &&
          (levelFilter === 'all' || i.warningLevel === levelFilter)
        );
      case 'warnings':
        return mergedWarnings.filter(w => w.bondName.includes(searchText));
      default:
        return [];
    }
  };

  /**
   * 获取当前表格列配置
   */
  const getColumns = () => {
    switch (activeTab) {
      case 'indicators':
        return indicatorColumns;
      case 'warnings':
        return warningColumns;
      default:
        return [];
    }
  };

  // 预警等级筛选选项
  const levelOptions = [
    { label: '全部等级', value: 'all' },
    { label: '正常', value: 'normal' },
    { label: '关注', value: 'attention' },
    { label: '预警', value: 'warning' },
    { label: '危险', value: 'danger' }
  ];

  /**
   * 标签页配置
   */
  const tabs = [
    { key: 'overview', label: '指标总览', icon: PieChart },
    { key: 'indicators', label: '财务指标监控', count: mockFinancialIndicators.length, icon: Activity },
    { key: 'warnings', label: '财务预警记录', count: mergedWarnings.length, icon: AlertTriangle },
    { key: 'trend', label: '趋势分析', icon: LineChart }
  ];

  /**
   * 指标总览：按等级分组统计卡片
   */
  const indicatorGroups = [
    { key: 'normal', label: '正常指标', items: mockFinancialIndicators.filter(i => i.warningLevel === 'normal'), color: 'green' },
    { key: 'attention', label: '关注指标', items: mockFinancialIndicators.filter(i => i.warningLevel === 'attention'), color: 'blue' },
    { key: 'warning', label: '预警指标', items: mockFinancialIndicators.filter(i => i.warningLevel === 'warning'), color: 'amber' },
    { key: 'danger', label: '危险指标', items: mockFinancialIndicators.filter(i => i.warningLevel === 'danger'), color: 'red' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="财务监控中心"
        description="监控发行人财务指标变化，及时发现和处置财务风险"
        breadcrumbs={[
          { title: '财务监控', href: '/finance-monitor' }
        ]}
      />

      {/* 统计卡片区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="监控指标总数"
          value={stats.total}
          icon={CheckCircle}
          className="border-l-4 border-[#1e3a8a]"
        />
        <StatCard
          title="正常指标"
          value={stats.normal}
          icon={CheckCircle}
          className="border-l-4 border-green-500"
        />
        <StatCard
          title="关注指标"
          value={stats.attention}
          icon={AlertTriangle}
          className="border-l-4 border-blue-500"
        />
        <StatCard
          title="预警指标"
          value={stats.warning}
          icon={AlertTriangle}
          className="border-l-4 border-amber-500"
        />
        <StatCard
          title="危险指标"
          value={stats.danger}
          icon={AlertTriangle}
          className="border-l-4 border-red-500"
        />
      </div>

      {/* 标签页切换区域 */}
      <Card bodyClassName="p-0">
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key as typeof activeTab);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-[#1e3a8a] text-[#1e3a8a]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                  {'count' in tab && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                      activeTab === tab.key ? 'bg-blue-100 text-[#1e3a8a]' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 指标总览Tab内容 */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            <p className="text-sm text-gray-500">点击卡片查看该等级下所有财务指标详情</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {indicatorGroups.map(group => (
                <div
                  key={group.key}
                  className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${levelMap[group.key]?.bgColor} ${levelMap[group.key]?.borderColor} border-l-4`}
                  onClick={() => {
                    setLevelFilter(group.key);
                    setActiveTab('indicators');
                  }}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`font-semibold text-lg ${
                        group.color === 'green' ? 'text-green-800' :
                        group.color === 'blue' ? 'text-blue-800' :
                        group.color === 'amber' ? 'text-amber-800' :
                        'text-red-800'
                      }`}>
                        {group.label}
                      </h3>
                      <span className={`text-3xl font-bold ${
                        group.color === 'green' ? 'text-green-600' :
                        group.color === 'blue' ? 'text-blue-600' :
                        group.color === 'amber' ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {group.items.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {group.items.slice(0, 3).map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{item.bondName}</span>
                          <span className={`font-medium ${
                            group.color === 'green' ? 'text-green-600' :
                            group.color === 'blue' ? 'text-blue-600' :
                            group.color === 'amber' ? 'text-amber-600' :
                            'text-red-600'
                          }`}>
                            {item.indicatorName}: {item.currentValue}
                          </span>
                        </div>
                      ))}
                      {group.items.length > 3 && (
                        <div className="text-xs text-gray-500 mt-2">
                          还有 {group.items.length - 3} 项指标...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 搜索和筛选栏：指标页显示等级筛选 */}
        {(activeTab === 'indicators' || activeTab === 'warnings') && (
          <div className="p-4 border-b border-gray-100">
            <SearchFilter
              searchPlaceholder="搜索债券名称"
              searchValue={searchText}
              onSearchChange={(val) => {
                setSearchText(val);
                setCurrentPage(1);
              }}
              selects={activeTab === 'indicators' ? [
                {
                  key: 'level',
                  value: levelFilter,
                  onChange: (val) => {
                    setLevelFilter(val);
                    setCurrentPage(1);
                  },
                  options: levelOptions,
                  placeholder: '预警等级'
                }
              ] : []}
            />
          </div>
        )}

        {/* 趋势分析Tab内容 */}
        {activeTab === 'trend' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-[#1e3a8a]" />
              <h3 className="font-semibold text-gray-900">关键指标趋势分析</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 危险指标趋势展示 */}
              {mockFinancialIndicators
                .filter(i => i.warningLevel === 'danger' || i.warningLevel === 'warning')
                .slice(0, 4)
                .map(indicator => {
                  const history = getIndicatorHistory(indicator);
                  return (
                    <Card key={indicator.id} className="overflow-hidden">
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{indicator.bondName}</div>
                            <div className="text-sm text-gray-500">{indicator.indicatorName}</div>
                          </div>
                          <Badge variant={levelMap[indicator.warningLevel]?.color || 'default'} dot>
                            {levelMap[indicator.warningLevel]?.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        {renderTrendChart(history)}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div>
                            <div className="text-xs text-gray-500">当前值</div>
                            <div className={`text-xl font-bold ${
                              indicator.warningLevel === 'danger' ? 'text-red-600' : 'text-amber-600'
                            }`}>
                              {indicator.currentValue}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">较上期</div>
                            <div className={`text-lg font-medium flex items-center gap-1 ${
                              indicator.changeValue > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {indicator.changeValue > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              {indicator.changeValue > 0 ? '+' : ''}{indicator.changeValue}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openIndicatorModal(indicator)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            详情
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}

        {/* 数据表格 */}
        {(activeTab === 'indicators' || activeTab === 'warnings') && (
          <DataTable<Record<string, unknown>>
            columns={getColumns() as unknown as Column<Record<string, unknown>>[]}
            data={getTableData() as unknown as Record<string, unknown>[]}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize,
              total: getTableData().length,
              onChange: (page) => setCurrentPage(page)
            }}
          />
        )}
      </Card>

      {/* ========== 预警处理弹窗 ========== */}
      <Modal
        open={handleModalOpen}
        title={handleSuccess ? '处理成功' : '标记预警已处理'}
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
              <Button variant="primary" onClick={submitHandleWarning}>
                <CheckCircle className="w-4 h-4 mr-1" />
                提交处理
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
            <h4 className="text-lg font-semibold text-gray-900 mb-2">预警已标记为处理</h4>
            <p className="text-sm text-gray-500">该预警状态已更新为已处理</p>
          </div>
        ) : selectedWarning && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">{selectedWarning.indicatorName} 预警</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">债券名称：</span>
                  <span className="text-gray-900">{selectedWarning.bondName}</span>
                </div>
                <div>
                  <span className="text-gray-500">发行人：</span>
                  <span className="text-gray-900">{selectedWarning.issuerName}</span>
                </div>
                <div>
                  <span className="text-gray-500">当前值：</span>
                  <span className="text-red-600 font-bold">{selectedWarning.currentValue}</span>
                </div>
                <div>
                  <span className="text-gray-500">预警阈值：</span>
                  <span className="text-gray-900">{selectedWarning.thresholdValue}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                处理备注 <span className="text-gray-400">（必填）</span>
              </label>
              <textarea
                value={handleNote}
                onChange={(e) => setHandleNote(e.target.value)}
                placeholder="请输入处理说明，如：已联系发行人、已发送风险提示函等..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]/20 resize-none"
                rows={4}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* ========== 指标详情弹窗（带趋势图） ========== */}
      <Modal
        open={indicatorModalOpen}
        title={selectedIndicator ? `${selectedIndicator.bondName} - ${selectedIndicator.indicatorName}` : '指标详情'}
        width="xl"
        onClose={() => {
          setIndicatorModalOpen(false);
          setSelectedIndicator(null);
        }}
        footer={
          <Button variant="secondary" onClick={() => setIndicatorModalOpen(false)}>
            关闭
          </Button>
        }
      >
        {selectedIndicator && (
          <div className="space-y-6">
            {/* 指标基本信息 */}
            <div className="grid grid-cols-4 gap-4">
              <div className={`rounded-lg p-4 ${levelMap[selectedIndicator.warningLevel]?.bgColor} border ${levelMap[selectedIndicator.warningLevel]?.borderColor}`}>
                <div className="text-xs text-gray-500 mb-1">当前值</div>
                <div className={`text-2xl font-bold ${
                  selectedIndicator.warningLevel === 'danger' ? 'text-red-600' :
                  selectedIndicator.warningLevel === 'warning' ? 'text-amber-600' :
                  selectedIndicator.warningLevel === 'attention' ? 'text-blue-600' :
                  'text-green-600'
                }`}>
                  {selectedIndicator.currentValue}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 mb-1">上期值</div>
                <div className="text-2xl font-bold text-gray-700">{selectedIndicator.lastValue}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 mb-1">变动值</div>
                <div className={`text-2xl font-bold flex items-center gap-1 ${
                  selectedIndicator.changeValue > 0 ? 'text-red-600' :
                  selectedIndicator.changeValue < 0 ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {selectedIndicator.changeValue > 0 ? <TrendingUp className="w-5 h-5" /> : selectedIndicator.changeValue < 0 ? <TrendingDown className="w-5 h-5" /> : null}
                  {selectedIndicator.changeValue > 0 ? '+' : ''}{selectedIndicator.changeValue}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 mb-1">预警等级</div>
                <div className="mt-1">
                  <Badge variant={levelMap[selectedIndicator.warningLevel]?.color || 'default'} dot>
                    {levelMap[selectedIndicator.warningLevel]?.label}
                  </Badge>
                </div>
              </div>
            </div>

            {/* 阈值信息 */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="text-sm font-medium text-[#1e3a8a] mb-1">阈值说明</div>
              <div className="text-sm text-gray-700">{selectedIndicator.thresholdInfo}</div>
              <div className="text-xs text-gray-500 mt-2">报告期：{selectedIndicator.reportPeriod} | 报告日期：{selectedIndicator.reportDate}</div>
            </div>

            {/* 趋势图 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <LineChart className="w-4 h-4 text-[#1e3a8a]" />
                近12个月趋势
              </h4>
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                {renderTrendChart(getIndicatorHistory(selectedIndicator))}
              </div>
            </div>

            {/* 发行人信息 */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 mb-1">发行人</div>
                <div className="font-medium text-gray-900">{selectedIndicator.issuerName}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 mb-1">债券名称</div>
                <div className="font-medium text-gray-900">{selectedIndicator.bondName}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FinanceMonitor;
