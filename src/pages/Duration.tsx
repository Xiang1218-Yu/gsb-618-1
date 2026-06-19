import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Eye,
  Bell
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
import { mockDurationBonds, mockInterestPayments, mockDisclosureRecords } from '@/data/mockBonds';
import type { DurationBond, InterestPayment, DisclosureRecord } from '@/types/bond';

// 存续期管理页面
const Duration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bonds' | 'interest' | 'disclosure'>('bonds');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 付息状态映射
  const paymentStatusMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default' }> = {
    pending: { label: '待支付', color: 'warning' },
    paid: { label: '已支付', color: 'success' },
    overdue: { label: '逾期', color: 'danger' }
  };

  // 披露类型映射
  const disclosureTypeMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default' }> = {
    periodic: { label: '定期报告', color: 'info' },
    temporary: { label: '临时公告', color: 'warning' },
    other: { label: '其他文件', color: 'default' }
  };

  // 统计数据
  const stats = {
    total: mockDurationBonds.length,
    totalAmount: mockDurationBonds.reduce((sum, b) => sum + b.issueAmount, 0),
    pendingPayment: mockInterestPayments.filter(p => p.status === 'pending').length,
    nextPaymentDate: mockDurationBonds.reduce((min, b) => 
      !min || b.remainingDays < min.remainingDays ? b : min,
      null as DurationBond | null
    )
  };

  // 债券表格列配置
  const bondColumns: Column<DurationBond>[] = [
    {
      key: 'bondName',
      title: '债券名称',
      width: '180px',
      render: (record) => (
        <div>
          <div className="font-medium text-gray-900">{record.bondName}</div>
          <div className="text-xs text-gray-500 mt-0.5">{record.bondCode}</div>
        </div>
      )
    },
    {
      key: 'issuerName',
      title: '发行人',
      width: '200px',
      render: (record) => <span className="text-sm text-gray-700">{record.issuerName}</span>
    },
    {
      key: 'issueAmount',
      title: '发行规模(亿)',
      width: '110px',
      align: 'right',
      render: (record) => <span className="text-sm font-medium text-gray-900">{record.issueAmount}</span>
    },
    {
      key: 'issueRate',
      title: '票面利率',
      width: '100px',
      align: 'right',
      render: (record) => <span className="text-sm text-[#d97706] font-medium">{record.issueRate}%</span>
    },
    {
      key: 'maturityDate',
      title: '到期日',
      width: '110px',
      render: (record) => <span className="text-sm text-gray-600">{record.maturityDate}</span>
    },
    {
      key: 'nextInterestDate',
      title: '下一付息日',
      width: '140px',
      render: (record) => (
        <div>
          <div className="text-sm text-gray-700">{record.nextInterestDate}</div>
          <div className="text-xs text-gray-500">剩余{record.remainingDays}天</div>
        </div>
      )
    },
    {
      key: 'interestProgress',
      title: '付息进度',
      width: '140px',
      render: (record) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1e3a8a] rounded-full"
              style={{ width: `${(record.interestPaid / record.totalInterests) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-600 min-w-[40px]">
            {record.interestPaid}/{record.totalInterests}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      title: '操作',
      width: '100px',
      align: 'center',
      render: () => (
        <div className="flex items-center justify-center gap-2">
          <Button variant="text" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  // 付息记录表格列配置
  const paymentColumns: Column<InterestPayment>[] = [
    {
      key: 'bondName',
      title: '债券名称',
      width: '180px',
      render: (record) => <span className="font-medium text-gray-900">{record.bondName}</span>
    },
    {
      key: 'paymentType',
      title: '类型',
      width: '80px',
      render: () => <Badge variant="info">付息</Badge>
    },
    {
      key: 'paymentDate',
      title: '付息日',
      width: '110px',
      render: (record) => <span className="text-sm text-gray-600">{record.paymentDate}</span>
    },
    {
      key: 'paymentAmount',
      title: '付息金额(万)',
      width: '130px',
      align: 'right',
      render: (record) => <span className="text-sm font-medium text-gray-900">{record.paymentAmount.toLocaleString()}</span>
    },
    {
      key: 'status',
      title: '状态',
      width: '100px',
      render: (record) => (
        <Badge variant={paymentStatusMap[record.status]?.color || 'default'} dot>
          {paymentStatusMap[record.status]?.label || record.statusName}
        </Badge>
      )
    },
    {
      key: 'remark',
      title: '备注',
      render: (record) => <span className="text-sm text-gray-500">{record.remark || '-'}</span>
    }
  ];

  // 信息披露表格列配置
  const disclosureColumns: Column<DisclosureRecord>[] = [
    {
      key: 'bondName',
      title: '债券名称',
      width: '180px',
      render: (record) => {
        const bond = mockDurationBonds.find(b => b.id === record.bondId);
        return <span className="font-medium text-gray-900">{bond?.bondName || '-'}</span>;
      }
    },
    {
      key: 'title',
      title: '公告标题',
      render: (record) => <span className="text-sm text-gray-700 hover:text-[#1e3a8a] cursor-pointer">{record.title}</span>
    },
    {
      key: 'type',
      title: '类型',
      width: '100px',
      render: (record) => (
        <Badge variant={disclosureTypeMap[record.type]?.color || 'default'}>
          {disclosureTypeMap[record.type]?.label || record.typeName}
        </Badge>
      )
    },
    {
      key: 'publishDate',
      title: '披露日期',
      width: '110px',
      render: (record) => <span className="text-sm text-gray-600">{record.publishDate}</span>
    }
  ];

  // 获取当前表格数据
  const getTableData = () => {
    switch (activeTab) {
      case 'bonds':
        return mockDurationBonds.filter(b => b.bondName.includes(searchText));
      case 'interest':
        return mockInterestPayments.filter(p => p.bondName.includes(searchText));
      case 'disclosure':
        return mockDisclosureRecords.filter(d => d.title.includes(searchText));
      default:
        return [];
    }
  };

  // 获取当前表格列配置
  const getColumns = () => {
    switch (activeTab) {
      case 'bonds':
        return bondColumns;
      case 'interest':
        return paymentColumns;
      case 'disclosure':
        return disclosureColumns;
      default:
        return [];
    }
  };

  // 标签页配置
  const tabs = [
    { key: 'bonds', label: '存续债券', count: mockDurationBonds.length },
    { key: 'interest', label: '付息兑付', count: mockInterestPayments.length },
    { key: 'disclosure', label: '信息披露', count: mockDisclosureRecords.length }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="存续期管理"
        description="管理存续期债券，跟踪付息兑付、信息披露等事项"
        breadcrumbs={[
          { title: '存续期管理', href: '/duration' }
        ]}
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="存续债券数量"
          value={stats.total}
          icon={FileText}
          className="border-l-4 border-[#1e3a8a]"
        />
        <StatCard
          title="存续规模(亿)"
          value={stats.totalAmount}
          icon={DollarSign}
          className="border-l-4 border-[#d97706]"
        />
        <StatCard
          title="待付息事项"
          value={stats.pendingPayment}
          icon={Bell}
          className="border-l-4 border-amber-500"
        />
        <StatCard
          title="最近付息"
          value={stats.nextPaymentDate ? `${stats.nextPaymentDate.remainingDays}天后` : '-'}
          icon={Clock}
          trendLabel={stats.nextPaymentDate?.nextInterestDate}
          className="border-l-4 border-blue-500"
        />
      </div>

      {/* 标签页切换 */}
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

        {/* 搜索栏 */}
        <div className="p-4 border-b border-gray-100">
          <SearchFilter
            searchPlaceholder={
              activeTab === 'bonds' ? '搜索债券名称' :
              activeTab === 'interest' ? '搜索债券名称' :
              '搜索公告标题'
            }
            searchValue={searchText}
            onSearchChange={(val) => {
              setSearchText(val);
              setCurrentPage(1);
            }}
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

export default Duration;
