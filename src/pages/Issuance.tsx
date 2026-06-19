import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  CheckCircle,
  DollarSign,
  Plus,
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
import { mockIssuanceInfoList } from '@/data/mockBonds';
import type { IssuanceInfo } from '@/types/bond';

// 债券发行管理页面
const Issuance: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  /**
   * 发行状态映射配置
   * 定义债券发行流程中的各个阶段状态
   * key: 状态编码
   * label: 中文显示名称
   * color: Badge组件的颜色样式
   */
  const statusMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default' }> = {
    preparing: { label: '发行准备', color: 'default' },      // 发行前期准备阶段
    bookbuilding: { label: '簿记建档', color: 'info' },      // 簿记建档询价阶段
    allocating: { label: '配售中', color: 'warning' },        // 债券配售分配阶段
    completed: { label: '发行完成', color: 'success' }        // 发行全部完成
  };

  // 过滤数据
  const filteredData = mockIssuanceInfoList.filter(item => {
    const matchSearch = item.bondName.includes(searchText);
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 统计数据
  const stats = {
    total: mockIssuanceInfoList.length,
    preparing: mockIssuanceInfoList.filter(i => i.status === 'preparing').length,
    allocating: mockIssuanceInfoList.filter(i => i.status === 'allocating').length,
    completed: mockIssuanceInfoList.filter(i => i.status === 'completed').length,
    totalAmount: mockIssuanceInfoList.reduce((sum, i) => sum + i.allocatedAmount, 0) / 10000
  };

  // 格式化金额（万元转亿元）
  const formatAmount = (amount: number): string => {
    return (amount / 10000).toFixed(2) + '亿';
  };

  /**
   * 表格列配置数组
   * 定义债券发行列表的各列显示规则
   */
  const columns: Column<IssuanceInfo>[] = [
    // 债券名称列：显示债券全称
    {
      key: 'bondName',
      title: '债券名称',
      width: '180px',
      render: (record) => (
        <div className="font-medium text-gray-900">{record.bondName}</div>
      )
    },
    // 发行状态列：使用Badge显示当前发行阶段
    {
      key: 'status',
      title: '发行状态',
      width: '110px',
      render: (record) => (
        <Badge variant={statusMap[record.status]?.color || 'default'} dot>
          {statusMap[record.status]?.label || record.statusName}
        </Badge>
      )
    },
    // 发行方式列：显示公开发行/私募等方式
    {
      key: 'issueMethod',
      title: '发行方式',
      width: '110px',
      render: (record) => (
        <span className="text-sm text-gray-700">{record.issueMethod}</span>
      )
    },
    // 上市地点列：显示债券挂牌交易的场所
    {
      key: 'listingLocation',
      title: '上市地点',
      width: '140px',
      render: (record) => (
        <span className="text-sm text-gray-600">{record.listingLocation}</span>
      )
    },
    // 簿记日期列：显示簿记建档的日期
    {
      key: 'bookbuildingDate',
      title: '簿记日期',
      width: '110px',
      render: (record) => (
        <span className="text-sm text-gray-600">{record.bookbuildingDate || '-'}</span>
      )
    },
    // 缴款截止日列：显示认购方缴款的最后期限
    {
      key: 'paymentDeadline',
      title: '缴款截止日',
      width: '110px',
      render: (record) => (
        <span className="text-sm text-gray-600">{record.paymentDeadline}</span>
      )
    },
    // 认购倍数列：显示超额认购倍数，用橙色高亮
    {
      key: 'subscriptionMultiple',
      title: '认购倍数',
      width: '100px',
      align: 'right',
      render: (record) => (
        <span className="text-sm font-medium text-[#d97706]">
          {record.subscriptionMultiple ? `${record.subscriptionMultiple}x` : '-'}
        </span>
      )
    },
    // 配售金额列：显示最终配售的金额，格式化显示
    {
      key: 'allocatedAmount',
      title: '配售金额',
      width: '110px',
      align: 'right',
      render: (record) => (
        <span className="text-sm text-gray-700">
          {record.allocatedAmount > 0 ? formatAmount(record.allocatedAmount) : '-'}
        </span>
      )
    },
    // 操作列：查看详情按钮
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

  // 筛选选项
  const filterOptions = [
    { label: '全部状态', value: 'all' },
    { label: '发行准备', value: 'preparing' },
    { label: '簿记建档', value: 'bookbuilding' },
    { label: '配售中', value: 'allocating' },
    { label: '发行完成', value: 'completed' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="债券发行管理"
        description="管理债券发行流程，跟踪簿记建档、配售、缴款等环节"
        breadcrumbs={[
          { title: '发行管理', href: '/issuance' }
        ]}
        extra={
          <Button 
            variant="primary"
            onClick={() => alert('新增债券发行功能开发中...')}
          >
            <Plus className="w-4 h-4 mr-1" />
            新增发行
          </Button>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="发行项目总数"
          value={stats.total}
          icon={TrendingUp}
          className="border-l-4 border-[#1e3a8a]"
        />
        <StatCard
          title="发行准备"
          value={stats.preparing}
          icon={Calendar}
          className="border-l-4 border-gray-500"
        />
        <StatCard
          title="配售中"
          value={stats.allocating}
          icon={DollarSign}
          className="border-l-4 border-amber-500"
        />
        <StatCard
          title="已完成发行"
          value={stats.completed}
          icon={CheckCircle}
          className="border-l-4 border-green-500"
        />
        <StatCard
          title="累计发行规模"
          value={`${stats.totalAmount.toFixed(1)}亿`}
          icon={DollarSign}
          className="border-l-4 border-[#d97706]"
        />
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <SearchFilter
          searchPlaceholder="搜索债券名称"
          searchValue={searchText}
          onSearchChange={setSearchText}
          selects={[
            {
              key: 'status',
              value: statusFilter,
              onChange: (val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              },
              options: filterOptions,
              placeholder: '发行状态'
            }
          ]}
        />
      </Card>

      {/* 数据表格 */}
      <Card bodyClassName="p-0">
        <DataTable<IssuanceInfo & Record<string, unknown>>
          columns={columns as Column<IssuanceInfo & Record<string, unknown>>[]}
          data={filteredData as (IssuanceInfo & Record<string, unknown>)[]}
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

export default Issuance;
