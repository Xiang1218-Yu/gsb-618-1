import React, { useState } from 'react';
import {
  FileText,
  Clock,
  Users,
  CheckCircle,
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
import { mockUnderwritingProjects } from '@/data/mockBonds';
import type { UnderwritingProject } from '@/types/bond';

// 债券承销管理页面
const Underwriting: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 项目状态映射
  const statusMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default' }> = {
    in_progress: { label: '进行中', color: 'info' },
    submitted: { label: '已申报', color: 'warning' },
    approved: { label: '已获批', color: 'success' },
    rejected: { label: '已驳回', color: 'danger' }
  };

  // 过滤数据
  const filteredData = mockUnderwritingProjects.filter(project => {
    const matchSearch = project.bondName.includes(searchText) || 
                       project.projectName.includes(searchText);
    const matchStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 统计数据
  const stats = {
    total: mockUnderwritingProjects.length,
    inProgress: mockUnderwritingProjects.filter(p => p.status === 'in_progress').length,
    submitted: mockUnderwritingProjects.filter(p => p.status === 'submitted').length,
    approved: mockUnderwritingProjects.filter(p => p.status === 'approved').length
  };

  // 表格列配置
  const columns: Column<UnderwritingProject>[] = [
    {
      key: 'bondName',
      title: '债券名称',
      width: '180px',
      render: (record) => (
        <div>
          <div className="font-medium text-gray-900">{record.bondName}</div>
          <div className="text-xs text-gray-500 mt-0.5">{record.projectName}</div>
        </div>
      )
    },
    {
      key: 'status',
      title: '项目状态',
      width: '100px',
      render: (record) => (
        <Badge variant={statusMap[record.status]?.color || 'default'} dot>
          {statusMap[record.status]?.label || record.statusName}
        </Badge>
      )
    },
    {
      key: 'currentStage',
      title: '当前阶段',
      width: '140px',
      render: (record) => (
        <span className="text-sm text-gray-700">{record.currentStage}</span>
      )
    },
    {
      key: 'progress',
      title: '项目进度',
      width: '180px',
      render: (record) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1e3a8a] rounded-full transition-all"
              style={{ width: `${record.progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700 min-w-[40px] text-right">
            {record.progress}%
          </span>
        </div>
      )
    },
    {
      key: 'startDate',
      title: '开始日期',
      width: '110px',
      render: (record) => <span className="text-sm text-gray-600">{record.startDate}</span>
    },
    {
      key: 'expectedSubmitDate',
      title: '预计申报日期',
      width: '120px',
      render: (record) => <span className="text-sm text-gray-600">{record.expectedSubmitDate}</span>
    },
    {
      key: 'teamMembers',
      title: '项目成员',
      width: '160px',
      render: (record) => (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{record.teamMembers.length}人</span>
        </div>
      )
    },
    {
      key: 'actions',
      title: '操作',
      width: '120px',
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
    { label: '进行中', value: 'in_progress' },
    { label: '已申报', value: 'submitted' },
    { label: '已获批', value: 'approved' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="债券承销管理"
        description="管理债券承销项目全流程，跟踪项目进度"
        breadcrumbs={[
          { title: '债券承销', href: '/underwriting' }
        ]}
        extra={
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-1" />
            新建项目
          </Button>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="承销项目总数"
          value={stats.total}
          icon={FileText}
          className="border-l-4 border-[#1e3a8a]"
        />
        <StatCard
          title="进行中项目"
          value={stats.inProgress}
          icon={Clock}
          className="border-l-4 border-blue-500"
        />
        <StatCard
          title="已申报项目"
          value={stats.submitted}
          icon={FileText}
          className="border-l-4 border-amber-500"
        />
        <StatCard
          title="已获批项目"
          value={stats.approved}
          icon={CheckCircle}
          className="border-l-4 border-green-500"
        />
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <SearchFilter
          searchPlaceholder="搜索债券名称或项目名称"
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
              placeholder: '项目状态'
            }
          ]}
        />
      </Card>

      {/* 数据表格 */}
      <Card bodyClassName="p-0">
        <DataTable<UnderwritingProject & Record<string, unknown>>
          columns={columns as Column<UnderwritingProject & Record<string, unknown>>[]}
          data={filteredData as (UnderwritingProject & Record<string, unknown>)[]}
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

export default Underwriting;
