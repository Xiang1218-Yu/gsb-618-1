import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  PiggyBank,
  FileCheck,
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
import {
  mockSpecialAccounts,
  mockFundUsagePlans,
  mockFundUseRecords,
  mockFundChangeRequests
} from '@/data/mockFunds';
import type { FundUsagePlan, FundUseRecord, FundChangeRequest } from '@/types/fund';

// 募集资金追踪页面
const FundTracker: React.FC = () => {
  // 当前激活的标签页：专户概览/使用计划/使用台账/用途变更
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'records' | 'changes'>('overview');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  /**
   * 用途类型映射配置
   * 定义募集资金的各种使用用途分类
   */
  const purposeTypeMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default' }> = {
    project: { label: '项目建设', color: 'info' },              // 用于募投项目建设
    repay_debt: { label: '偿还借款', color: 'warning' },        // 用于偿还公司债务
    supplement_liquidity: { label: '补充流动资金', color: 'default' }, // 补充营运资金
    merge_acquisition: { label: '并购重组', color: 'success' },  // 用于并购重组
    other: { label: '其他', color: 'default' }                   // 其他用途
  };

  /**
   * 记录状态映射配置
   * 定义资金使用记录的审核状态
   */
  const recordStatusMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default' }> = {
    pending: { label: '待审核', color: 'warning' },   // 等待审核
    approved: { label: '已审核', color: 'success' },  // 审核通过
    rejected: { label: '已驳回', color: 'danger' }    // 审核驳回
  };

  /**
   * 变更申请状态映射配置
   * 定义用途变更申请的审批状态
   */
  const changeStatusMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default' }> = {
    pending: { label: '审批中', color: 'warning' },   // 审批流程中
    approved: { label: '已通过', color: 'success' },  // 审批通过
    rejected: { label: '已驳回', color: 'danger' }    // 审批驳回
  };

  // 统计数据计算
  const totalRaised = mockFundUsagePlans.reduce((sum, p) => sum + p.plannedAmount, 0) / 10000;
  const totalUsed = mockFundUsagePlans.reduce((sum, p) => sum + p.usedAmount, 0) / 10000;
  const totalRemaining = totalRaised - totalUsed;
  const pendingChanges = mockFundChangeRequests.filter(c => c.status === 'pending').length;

  /**
   * 资金使用计划表格列配置
   * 使用计划列表的列定义
   */
  const usageColumns: Column<FundUsagePlan>[] = [
    // 债券名称列：显示关联债券名称
    {
      key: 'bondName',
      title: '债券名称',
      width: '160px',
      render: (record) => <span className="font-medium text-gray-900">{record.bondName}</span>
    },
    // 项目/用途名称列：显示具体用途名称
    {
      key: 'projectName',
      title: '项目/用途名称',
      width: '220px',
      render: (record) => <span className="text-sm text-gray-700">{record.projectName}</span>
    },
    // 用途类型列：显示用途分类标签
    {
      key: 'purposeType',
      title: '用途类型',
      width: '110px',
      render: (record) => (
        <Badge variant={purposeTypeMap[record.purposeType]?.color || 'default'}>
          {purposeTypeMap[record.purposeType]?.label || record.purposeTypeName}
        </Badge>
      )
    },
    // 计划金额列：显示计划投入金额（万元）
    {
      key: 'plannedAmount',
      title: '计划金额(万)',
      width: '120px',
      align: 'right',
      render: (record) => <span className="text-sm font-medium text-gray-900">{record.plannedAmount.toLocaleString()}</span>
    },
    // 已使用列：显示已投入金额（万元），深蓝色高亮
    {
      key: 'usedAmount',
      title: '已使用(万)',
      width: '120px',
      align: 'right',
      render: (record) => <span className="text-sm text-[#1e3a8a] font-medium">{record.usedAmount.toLocaleString()}</span>
    },
    // 使用进度列：进度条显示使用百分比，根据进度变色
    {
      key: 'progressPercent',
      title: '使用进度',
      width: '180px',
      render: (record) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                record.progressPercent >= 80 ? 'bg-green-500' :
                record.progressPercent >= 50 ? 'bg-[#d97706]' :
                'bg-[#1e3a8a]'
              }`}
              style={{ width: `${record.progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700 min-w-[40px] text-right">
            {record.progressPercent}%
          </span>
        </div>
      )
    }
  ];

  /**
   * 资金使用记录表格列配置
   * 使用台账（实际支出记录）的列定义
   */
  const recordColumns: Column<FundUseRecord>[] = [
    // 债券名称列：显示关联债券
    {
      key: 'bondName',
      title: '债券名称',
      width: '150px',
      render: (record) => <span className="font-medium text-gray-900">{record.bondName}</span>
    },
    // 用途项目列：显示资金投向的项目
    {
      key: 'projectName',
      title: '用途项目',
      width: '200px',
      render: (record) => <span className="text-sm text-gray-700">{record.projectName}</span>
    },
    // 使用日期列：显示资金支出日期
    {
      key: 'useDate',
      title: '使用日期',
      width: '110px',
      render: (record) => <span className="text-sm text-gray-600">{record.useDate}</span>
    },
    // 金额列：显示支出金额（万元），橙色高亮
    {
      key: 'amount',
      title: '金额(万)',
      width: '110px',
      align: 'right',
      render: (record) => <span className="text-sm font-medium text-[#d97706]">{record.amount.toLocaleString()}</span>
    },
    // 收款方列：显示资金接收方名称
    {
      key: 'payee',
      title: '收款方',
      width: '200px',
      render: (record) => <span className="text-sm text-gray-700 truncate block max-w-[180px]">{record.payee}</span>
    },
    // 凭证号列：显示会计凭证编号，等宽字体显示
    {
      key: 'voucherNumber',
      title: '凭证号',
      width: '130px',
      render: (record) => <span className="text-sm text-gray-500 font-mono">{record.voucherNumber}</span>
    },
    // 状态列：显示审核状态
    {
      key: 'status',
      title: '状态',
      width: '90px',
      render: (record) => (
        <Badge variant={recordStatusMap[record.status]?.color || 'default'} dot>
          {recordStatusMap[record.status]?.label || record.statusName}
        </Badge>
      )
    }
  ];

  /**
   * 用途变更申请表格列配置
   * 资金用途变更申请列表的列定义
   */
  const changeColumns: Column<FundChangeRequest>[] = [
    // 债券名称列：显示关联债券
    {
      key: 'bondName',
      title: '债券名称',
      width: '150px',
      render: (record) => <span className="font-medium text-gray-900">{record.bondName}</span>
    },
    // 原用途列：显示变更前的用途
    {
      key: 'originalPurpose',
      title: '原用途',
      width: '180px',
      render: (record) => <span className="text-sm text-gray-600">{record.originalPurpose}</span>
    },
    // 新用途列：显示变更后的用途
    {
      key: 'newPurpose',
      title: '新用途',
      width: '180px',
      render: (record) => <span className="text-sm text-gray-700">{record.newPurpose}</span>
    },
    // 变更金额列：显示涉及变更的金额（万元），红色高亮
    {
      key: 'changeAmount',
      title: '变更金额(万)',
      width: '120px',
      align: 'right',
      render: (record) => <span className="text-sm font-medium text-red-600">{record.changeAmount.toLocaleString()}</span>
    },
    // 申请日期列：显示提交申请的日期
    {
      key: 'applyDate',
      title: '申请日期',
      width: '110px',
      render: (record) => <span className="text-sm text-gray-600">{record.applyDate}</span>
    },
    // 申请人列：显示提交申请的人员
    {
      key: 'applicant',
      title: '申请人',
      width: '90px',
      render: (record) => <span className="text-sm text-gray-700">{record.applicant}</span>
    },
    // 状态列：显示审批状态
    {
      key: 'status',
      title: '状态',
      width: '90px',
      render: (record) => (
        <Badge variant={changeStatusMap[record.status]?.color || 'default'} dot>
          {changeStatusMap[record.status]?.label || record.statusName}
        </Badge>
      )
    }
  ];

  /**
   * 专户总览数据处理
   * 将专户数据与资金计划关联，补充债券名称信息
   */
  const accountColumns = mockSpecialAccounts.map(account => ({
    id: account.id,
    bondName: mockFundUsagePlans.find(p => p.bondId === account.bondId)?.bondName || '-',
    bankName: account.bankName,
    accountNumber: account.accountNumber,
    balance: account.balance,
    lastUpdateDate: account.lastUpdateDate
  }));

  /**
   * 专户总览表格列配置
   * 募集资金专户列表的列定义
   */
  const overviewColumns: Column<typeof accountColumns[0]>[] = [
    // 债券名称列：显示专户对应的债券
    {
      key: 'bondName',
      title: '债券名称',
      width: '160px',
      render: (record) => <span className="font-medium text-gray-900">{record.bondName}</span>
    },
    // 开户银行列：显示专户开立的银行名称
    {
      key: 'bankName',
      title: '开户银行',
      width: '200px',
      render: (record) => <span className="text-sm text-gray-700">{record.bankName}</span>
    },
    // 专户账号列：显示银行账号，等宽字体
    {
      key: 'accountNumber',
      title: '专户账号',
      width: '180px',
      render: (record) => <span className="text-sm text-gray-500 font-mono">{record.accountNumber}</span>
    },
    // 账户余额列：显示当前专户余额（万元），大号橙色字体突出
    {
      key: 'balance',
      title: '账户余额(万)',
      width: '130px',
      align: 'right',
      render: (record) => <span className="text-lg font-bold text-[#d97706]">{record.balance.toLocaleString()}</span>
    },
    // 更新日期列：显示最后一次对账日期
    {
      key: 'lastUpdateDate',
      title: '更新日期',
      width: '110px',
      render: (record) => <span className="text-sm text-gray-600">{record.lastUpdateDate}</span>
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

  /**
   * 获取当前表格数据
   * 根据激活的标签页返回对应数据，并应用搜索过滤
   */
  const getTableData = () => {
    switch (activeTab) {
      case 'overview':
        // 专户概览：按债券名称搜索
        return accountColumns.filter(a => a.bondName.includes(searchText));
      case 'usage':
        // 使用计划：按债券名称或项目名称搜索
        return mockFundUsagePlans.filter(p => p.bondName.includes(searchText) || p.projectName.includes(searchText));
      case 'records':
        // 使用台账：按债券名称搜索
        return mockFundUseRecords.filter(r => r.bondName.includes(searchText));
      case 'changes':
        // 用途变更：按债券名称搜索
        return mockFundChangeRequests.filter(c => c.bondName.includes(searchText));
      default:
        return [];
    }
  };

  /**
   * 获取当前表格列配置
   * 根据激活的标签页返回对应的列配置
   */
  const getColumns = () => {
    switch (activeTab) {
      case 'overview':
        return overviewColumns;
      case 'usage':
        return usageColumns;
      case 'records':
        return recordColumns;
      case 'changes':
        return changeColumns;
      default:
        return [];
    }
  };

  /**
   * 标签页配置数组
   * Tab切换逻辑：点击切换时重置页码到第1页
   */
  const tabs = [
    { key: 'overview', label: '专户概览', count: mockSpecialAccounts.length },
    { key: 'usage', label: '使用计划', count: mockFundUsagePlans.length },
    { key: 'records', label: '使用台账', count: mockFundUseRecords.length },
    { key: 'changes', label: '用途变更', count: mockFundChangeRequests.length }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="募集资金追踪"
        description="跟踪募集资金专户存储、使用计划、使用台账及用途变更情况"
        breadcrumbs={[
          { title: '募集资金追踪', href: '/fund-tracker' }
        ]}
        extra={
          <Button 
            variant="primary"
            onClick={() => alert('新增资金使用记录功能开发中...')}
          >
            <Plus className="w-4 h-4 mr-1" />
            新增资金使用
          </Button>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="累计募集资金(亿)"
          value={totalRaised.toFixed(2)}
          icon={Wallet}
          gradient
        />
        <StatCard
          title="累计使用(亿)"
          value={totalUsed.toFixed(2)}
          icon={TrendingUp}
          className="border-l-4 border-[#1e3a8a]"
        />
        <StatCard
          title="剩余资金(亿)"
          value={totalRemaining.toFixed(2)}
          icon={PiggyBank}
          className="border-l-4 border-green-500"
        />
        <StatCard
          title="待审批变更"
          value={pendingChanges}
          icon={FileCheck}
          trendLabel="项"
          className="border-l-4 border-amber-500"
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

        {/* 搜索栏 */}
        <div className="p-4 border-b border-gray-100">
          <SearchFilter
            searchPlaceholder="搜索债券名称"
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

export default FundTracker;
