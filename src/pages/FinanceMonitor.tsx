import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Eye
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
import { mockFinancialIndicators, mockFinanceWarnings } from '@/data/mockFinance';
import type { FinancialIndicator, FinanceWarning } from '@/types/finance';

// 财务监控中心页面
const FinanceMonitor: React.FC = () => {
  // 当前激活标签页：财务指标监控/财务预警记录
  const [activeTab, setActiveTab] = useState<'indicators' | 'warnings'>('indicators');
  const [searchText, setSearchText] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  /**
   * 预警等级映射配置
   * 定义财务指标的四级预警等级
   * key: 等级编码
   * label: 中文显示名称
   * color: Badge组件颜色
   * bgColor: 背景色（用于卡片高亮）
   */
  const levelMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default'; bgColor: string }> = {
    normal: { label: '正常', color: 'success', bgColor: 'bg-green-50' },    // 指标健康
    attention: { label: '关注', color: 'info', bgColor: 'bg-blue-50' },      // 需要关注
    warning: { label: '预警', color: 'warning', bgColor: 'bg-amber-50' },    // 发出预警
    danger: { label: '危险', color: 'danger', bgColor: 'bg-red-50' }         // 危险状态
  };

  // 统计数据
  const stats = {
    total: mockFinancialIndicators.length,
    normal: mockFinancialIndicators.filter(i => i.warningLevel === 'normal').length,
    attention: mockFinancialIndicators.filter(i => i.warningLevel === 'attention').length,
    warning: mockFinancialIndicators.filter(i => i.warningLevel === 'warning').length,
    danger: mockFinancialIndicators.filter(i => i.warningLevel === 'danger').length,
    unhandledWarnings: mockFinanceWarnings.filter(w => !w.handled).length
  };

  /**
   * 财务指标表格列配置
   * 财务指标监控列表的列定义
   */
  const indicatorColumns: Column<FinancialIndicator>[] = [
    // 债券名称列：显示债券名称和发行人名称
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
    // 财务指标列：显示指标名称和报告期
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
    // 当前值列：显示指标当前数值，根据预警等级显示不同颜色
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
            {record.currentValue}{record.indicatorName.includes('率') && !record.indicatorName.includes('倍数') ? '%' : ''}
          </span>
        </div>
      )
    },
    // 较上期列：显示环比变化值，带趋势图标
    {
      key: 'changeValue',
      title: '较上期',
      width: '100px',
      align: 'right',
      render: (record) => (
        <div className="flex items-center justify-end gap-1">
          {/* 上升用红色向上箭头（财务指标上升可能是风险） */}
          {record.changeValue > 0 ? (
            <TrendingUp className="w-4 h-4 text-red-500" />
          ) : record.changeValue < 0 ? (
            /* 下降用绿色向下箭头 */
            <TrendingDown className="w-4 h-4 text-green-500" />
          ) : null}
          <span className={`text-sm font-medium ${
            record.changeValue > 0 ? 'text-red-600' :
            record.changeValue < 0 ? 'text-green-600' :
            'text-gray-500'
          }`}>
            {record.changeValue > 0 ? '+' : ''}{record.changeValue}
            {record.indicatorName.includes('率') && !record.indicatorName.includes('倍数') ? '%' : ''}
          </span>
        </div>
      )
    },
    // 预警等级列：使用Badge显示等级标签
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
    // 阈值说明列：显示指标预警阈值范围
    {
      key: 'thresholdInfo',
      title: '阈值说明',
      render: (record) => (
        <span className="text-xs text-gray-500">{record.thresholdInfo}</span>
      )
    },
    // 操作列：查看详情按钮
    {
      key: 'actions',
      title: '操作',
      width: '80px',
      align: 'center',
      render: () => (
        <div className="flex items-center justify-center">
          <Button variant="text" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  /**
   * 财务预警表格列配置
   * 预警记录列表的列定义
   */
  const warningColumns: Column<FinanceWarning>[] = [
    // 债券名称列：显示债券和发行人
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
    // 预警指标列：显示触发预警的指标名称
    {
      key: 'indicatorName',
      title: '预警指标',
      width: '150px',
      render: (record) => <span className="text-sm font-medium text-gray-800">{record.indicatorName}</span>
    },
    // 当前值列：显示触发预警时的指标值，红色加粗
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
    // 阈值列：显示预警触发阈值
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
    // 等级列：显示预警等级
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
    // 触发日期列：显示预警生成日期
    {
      key: 'triggerDate',
      title: '触发日期',
      width: '110px',
      render: (record) => <span className="text-sm text-gray-600">{record.triggerDate}</span>
    },
    // 处理状态列：显示已处理/待处理状态
    {
      key: 'status',
      title: '处理状态',
      width: '100px',
      render: (record) => (
        record.handled ? (
          <Badge variant="success" dot>已处理</Badge>
        ) : (
          <Badge variant="danger" dot>待处理</Badge>
        )
      )
    },
    // 处理人列：显示处理该预警的人员
    {
      key: 'handler',
      title: '处理人',
      width: '90px',
      render: (record) => <span className="text-sm text-gray-700">{record.handler || '-'}</span>
    }
  ];

  /**
   * 获取当前表格数据
   * 指标监控页支持按债券名称搜索+按预警等级筛选
   * 预警记录页支持按债券名称搜索
   */
  const getTableData = () => {
    switch (activeTab) {
      case 'indicators':
        return mockFinancialIndicators.filter(i => 
          i.bondName.includes(searchText) && 
          (levelFilter === 'all' || i.warningLevel === levelFilter)
        );
      case 'warnings':
        return mockFinanceWarnings.filter(w => w.bondName.includes(searchText));
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
   * Tab切换时重置页码到第1页
   */
  const tabs = [
    { key: 'indicators', label: '财务指标监控', count: mockFinancialIndicators.length },
    { key: 'warnings', label: '财务预警记录', count: mockFinanceWarnings.length }
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

      {/* 统计卡片区域 - 各等级指标数量统计 */}
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
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as typeof activeTab);
                  setCurrentPage(1);
                }}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-[#1e3a8a] text-[#1e3a8a]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-blue-100 text-[#1e3a8a]' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 搜索和筛选栏：指标页额外显示等级筛选 */}
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

        {/* 数据表格 */}
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
      </Card>
    </div>
  );
};

export default FinanceMonitor;
