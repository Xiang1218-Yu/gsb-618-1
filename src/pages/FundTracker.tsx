import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  PiggyBank,
  FileCheck,
  Plus,
  Eye,
  Trash2
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
import { useDataStore } from '@/store/dataStore';
import type { FundUsagePlan, FundUseRecord, FundChangeRequest, SpecialAccount } from '@/types/fund';
import type { Bond } from '@/types/bond';
import {
  mockSpecialAccounts,
  mockFundUsagePlans,
  mockFundChangeRequests
} from '@/data/mockFunds';

/**
 * 募集资金追踪页面
 * 负责跟踪募集资金专户存储、使用计划、使用台账及用途变更情况
 * 重点：在"使用台账"Tab下提供新增使用记录功能
 */
const FundTracker: React.FC = () => {
  // 从store获取数据和方法
  const {
    bonds,
    fundUseRecords,
    addFundUseRecord,
    deleteFundUseRecord
  } = useDataStore();

  // Tab和分页状态
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'records' | 'changes'>('overview');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal状态控制
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);
  const [isRecordDetailModalOpen, setIsRecordDetailModalOpen] = useState(false);
  const [isDeleteRecordConfirmOpen, setIsDeleteRecordConfirmOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FundUseRecord | null>(null);

  // 新增使用记录表单状态
  const [addRecordFormData, setAddRecordFormData] = useState({
    bondId: '',
    projectName: '',
    useDate: '',
    amount: '',
    payee: '',
    purpose: ''
  });

  /**
   * 用途类型映射配置
   */
  const purposeTypeMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default' }> = {
    project: { label: '项目建设', color: 'info' },
    repay_debt: { label: '偿还借款', color: 'warning' },
    supplement_liquidity: { label: '补充流动资金', color: 'default' },
    merge_acquisition: { label: '并购重组', color: 'success' },
    other: { label: '其他', color: 'default' }
  };

  /**
   * 记录状态映射配置
   */
  const recordStatusMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default' }> = {
    pending: { label: '待审核', color: 'warning' },
    approved: { label: '已审核', color: 'success' },
    rejected: { label: '已驳回', color: 'danger' }
  };

  /**
   * 变更申请状态映射配置
   */
  const changeStatusMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default' }> = {
    pending: { label: '审批中', color: 'warning' },
    approved: { label: '已通过', color: 'success' },
    rejected: { label: '已驳回', color: 'danger' }
  };

  /**
   * 统计数据计算（基于store中的fundUseRecords）
   */
  const totalRaised = mockFundUsagePlans.reduce((sum, p) => sum + p.plannedAmount, 0) / 10000;
  const totalUsed = fundUseRecords.reduce((sum, r) => sum + r.amount, 0) / 10000;
  const totalRemaining = totalRaised - totalUsed;
  const pendingChanges = mockFundChangeRequests.filter(c => c.status === 'pending').length;

  /**
   * 使用计划表格列配置
   */
  const usageColumns: Column<FundUsagePlan>[] = [
    {
      key: 'bondName',
      title: '债券名称',
      width: '160px',
      render: (record) => <span className="font-medium text-gray-900">{record.bondName}</span>
    },
    {
      key: 'projectName',
      title: '项目/用途名称',
      width: '220px',
      render: (record) => <span className="text-sm text-gray-700">{record.projectName}</span>
    },
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
    {
      key: 'plannedAmount',
      title: '计划金额(万)',
      width: '120px',
      align: 'right',
      render: (record) => <span className="text-sm font-medium text-gray-900">{record.plannedAmount.toLocaleString()}</span>
    },
    {
      key: 'usedAmount',
      title: '已使用(万)',
      width: '120px',
      align: 'right',
      render: (record) => <span className="text-sm text-[#1e3a8a] font-medium">{record.usedAmount.toLocaleString()}</span>
    },
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
   * 资金使用记录（台账）表格列配置
   * 增加查看和删除操作按钮
   */
  const recordColumns: Column<FundUseRecord>[] = [
    {
      key: 'bondName',
      title: '债券名称',
      width: '150px',
      render: (record) => <span className="font-medium text-gray-900">{record.bondName}</span>
    },
    {
      key: 'projectName',
      title: '用途项目',
      width: '160px',
      render: (record) => <span className="text-sm text-gray-700">{record.projectName}</span>
    },
    {
      key: 'useDate',
      title: '使用日期',
      width: '110px',
      render: (record) => <span className="text-sm text-gray-600">{record.useDate}</span>
    },
    {
      key: 'amount',
      title: '金额(万)',
      width: '110px',
      align: 'right',
      render: (record) => <span className="text-sm font-medium text-[#d97706]">{record.amount.toLocaleString()}</span>
    },
    {
      key: 'payee',
      title: '收款方',
      width: '160px',
      render: (record) => <span className="text-sm text-gray-700 truncate block max-w-[140px]">{record.payee}</span>
    },
    {
      key: 'status',
      title: '状态',
      width: '90px',
      render: (record) => (
        <Badge variant={recordStatusMap[record.status]?.color || 'default'} dot>
          {recordStatusMap[record.status]?.label || record.statusName}
        </Badge>
      )
    },
    {
      key: 'actions',
      title: '操作',
      width: '140px',
      align: 'center',
      render: (record) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="text"
            size="sm"
            onClick={() => handleViewRecordDetail(record)}
          >
            <Eye className="w-4 h-4" />
            <span className="ml-1">查看</span>
          </Button>
          <Button
            variant="text"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleDeleteRecordClick(record)}
          >
            <Trash2 className="w-4 h-4" />
            <span className="ml-1">删除</span>
          </Button>
        </div>
      )
    }
  ];

  /**
   * 用途变更申请表格列配置
   */
  const changeColumns: Column<FundChangeRequest>[] = [
    {
      key: 'bondName',
      title: '债券名称',
      width: '150px',
      render: (record) => <span className="font-medium text-gray-900">{record.bondName}</span>
    },
    {
      key: 'originalPurpose',
      title: '原用途',
      width: '150px',
      render: (record) => <span className="text-sm text-gray-600 truncate block max-w-[130px]">{record.originalPurpose}</span>
    },
    {
      key: 'newPurpose',
      title: '新用途',
      width: '150px',
      render: (record) => <span className="text-sm text-gray-700 truncate block max-w-[130px]">{record.newPurpose}</span>
    },
    {
      key: 'changeAmount',
      title: '变更金额(万)',
      width: '120px',
      align: 'right',
      render: (record) => <span className="text-sm font-medium text-red-600">{record.changeAmount.toLocaleString()}</span>
    },
    {
      key: 'applyDate',
      title: '申请日期',
      width: '110px',
      render: (record) => <span className="text-sm text-gray-600">{record.applyDate}</span>
    },
    {
      key: 'applicant',
      title: '申请人',
      width: '90px',
      render: (record) => <span className="text-sm text-gray-700">{record.applicant}</span>
    },
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
   */
  const accountColumns = mockSpecialAccounts.map((account: SpecialAccount) => ({
    id: account.id,
    bondName: mockFundUsagePlans.find(p => p.bondId === account.bondId)?.bondName || '-',
    bankName: account.bankName,
    accountNumber: account.accountNumber,
    balance: account.balance,
    lastUpdateDate: account.lastUpdateDate
  }));

  /**
   * 专户总览表格列配置
   */
  const overviewColumns: Column<typeof accountColumns[0]>[] = [
    {
      key: 'bondName',
      title: '债券名称',
      width: '160px',
      render: (record) => <span className="font-medium text-gray-900">{record.bondName}</span>
    },
    {
      key: 'bankName',
      title: '开户银行',
      width: '200px',
      render: (record) => <span className="text-sm text-gray-700">{record.bankName}</span>
    },
    {
      key: 'accountNumber',
      title: '专户账号',
      width: '180px',
      render: (record) => <span className="text-sm text-gray-500 font-mono">{record.accountNumber}</span>
    },
    {
      key: 'balance',
      title: '账户余额(万)',
      width: '130px',
      align: 'right',
      render: (record) => <span className="text-lg font-bold text-[#d97706]">{record.balance.toLocaleString()}</span>
    },
    {
      key: 'lastUpdateDate',
      title: '更新日期',
      width: '110px',
      render: (record) => <span className="text-sm text-gray-600">{record.lastUpdateDate}</span>
    }
  ];

  /**
   * 获取当前表格数据（使用store中的fundUseRecords）
   */
  const getTableData = () => {
    switch (activeTab) {
      case 'overview':
        return accountColumns.filter(a => a.bondName.includes(searchText));
      case 'usage':
        return mockFundUsagePlans.filter(p => p.bondName.includes(searchText) || p.projectName.includes(searchText));
      case 'records':
        // 使用store中的动态数据
        return fundUseRecords.filter(r => r.bondName.includes(searchText) || r.projectName.includes(searchText));
      case 'changes':
        return mockFundChangeRequests.filter(c => c.bondName.includes(searchText));
      default:
        return [];
    }
  };

  /**
   * 获取当前表格列配置
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
   * 打开新增使用记录弹窗
   */
  const handleOpenAddRecordModal = () => {
    setAddRecordFormData({
      bondId: '',
      projectName: '',
      useDate: '',
      amount: '',
      payee: '',
      purpose: ''
    });
    setIsAddRecordModalOpen(true);
  };

  /**
   * 提交新增使用记录表单
   */
  const handleAddRecordSubmit = () => {
    const selectedBond = bonds.find((b: Bond) => b.id === addRecordFormData.bondId);
    if (!selectedBond || !addRecordFormData.projectName || !addRecordFormData.useDate ||
        !addRecordFormData.amount || !addRecordFormData.payee || !addRecordFormData.purpose) {
      alert('请填写完整信息');
      return;
    }

    // 构建新记录数据
    const newRecord: Omit<FundUseRecord, 'id'> = {
      bondId: selectedBond.id,
      bondName: selectedBond.bondName,
      usagePlanId: '',
      projectName: addRecordFormData.projectName,
      useDate: addRecordFormData.useDate,
      amount: parseFloat(addRecordFormData.amount),
      payee: addRecordFormData.payee,
      bankAccount: '',
      purpose: addRecordFormData.purpose,
      operator: '当前用户',
      status: 'pending',
      statusName: '待审核'
    };

    addFundUseRecord(newRecord);
    setIsAddRecordModalOpen(false);
  };

  /**
   * 查看记录详情
   */
  const handleViewRecordDetail = (record: FundUseRecord) => {
    setSelectedRecord(record);
    setIsRecordDetailModalOpen(true);
  };

  /**
   * 打开删除确认弹窗
   */
  const handleDeleteRecordClick = (record: FundUseRecord) => {
    setSelectedRecord(record);
    setIsDeleteRecordConfirmOpen(true);
  };

  /**
   * 确认删除记录
   */
  const handleConfirmDeleteRecord = () => {
    if (selectedRecord) {
      deleteFundUseRecord(selectedRecord.id);
      setIsDeleteRecordConfirmOpen(false);
      setSelectedRecord(null);
    }
  };

  /**
   * 标签页配置
   */
  const tabs = [
    { key: 'overview', label: '专户概览', count: mockSpecialAccounts.length },
    { key: 'usage', label: '使用计划', count: mockFundUsagePlans.length },
    { key: 'records', label: '使用台账', count: fundUseRecords.length },
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
      />

      {/* 统计卡片区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="累计募集资金(亿)"
          value={totalRaised.toFixed(2)}
          icon={Wallet}
          className="border-l-4 border-[#1e3a8a]"
        />
        <StatCard
          title="累计使用(亿)"
          value={totalUsed.toFixed(2)}
          icon={TrendingUp}
          className="border-l-4 border-[#d97706]"
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
          className="border-l-4 border-amber-500"
        />
      </div>

      {/* 标签页切换区域 */}
      <Card bodyClassName="p-0">
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between">
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
            {/* 仅在"使用台账"Tab下显示新增按钮 */}
            {activeTab === 'records' && (
              <div className="pr-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenAddRecordModal}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  新增使用记录
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="p-4 border-b border-gray-100">
          <SearchFilter
            searchPlaceholder={activeTab === 'records' ? '搜索债券名称或项目名称' : '搜索债券名称'}
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

      {/* 新增使用记录弹窗 */}
      <Modal
        open={isAddRecordModalOpen}
        title="新增资金使用记录"
        width="lg"
        onClose={() => setIsAddRecordModalOpen(false)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsAddRecordModalOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="primary"
              onClick={handleAddRecordSubmit}
            >
              确定提交
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* 债券选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              债券选择 <span className="text-red-500">*</span>
            </label>
            <select
              value={addRecordFormData.bondId}
              onChange={(e) => setAddRecordFormData({ ...addRecordFormData, bondId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none transition-colors"
            >
              <option value="">请选择债券</option>
              {bonds.map((bond: Bond) => (
                <option key={bond.id} value={bond.id}>
                  {bond.bondName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 项目名称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                项目名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={addRecordFormData.projectName}
                onChange={(e) => setAddRecordFormData({ ...addRecordFormData, projectName: e.target.value })}
                placeholder="请输入项目名称"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none transition-colors"
              />
            </div>

            {/* 使用日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                使用日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={addRecordFormData.useDate}
                onChange={(e) => setAddRecordFormData({ ...addRecordFormData, useDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none transition-colors"
              />
            </div>

            {/* 使用金额 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                使用金额(万元) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={addRecordFormData.amount}
                onChange={(e) => setAddRecordFormData({ ...addRecordFormData, amount: e.target.value })}
                placeholder="请输入使用金额"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none transition-colors"
              />
            </div>

            {/* 收款方 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                收款方 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={addRecordFormData.payee}
                onChange={(e) => setAddRecordFormData({ ...addRecordFormData, payee: e.target.value })}
                placeholder="请输入收款方名称"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none transition-colors"
              />
            </div>
          </div>

          {/* 用途说明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用途说明 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={addRecordFormData.purpose}
              onChange={(e) => setAddRecordFormData({ ...addRecordFormData, purpose: e.target.value })}
              placeholder="请详细说明资金用途"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none transition-colors resize-none"
            />
          </div>
        </div>
      </Modal>

      {/* 使用记录详情弹窗 */}
      <Modal
        open={isRecordDetailModalOpen}
        title="资金使用记录详情"
        width="lg"
        onClose={() => setIsRecordDetailModalOpen(false)}
        footer={
          <Button
            variant="secondary"
            onClick={() => setIsRecordDetailModalOpen(false)}
          >
            关闭
          </Button>
        }
      >
        {selectedRecord && (
          <div className="space-y-4">
            <div className="bg-[#1e3a8a]/5 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-[#1e3a8a]">{selectedRecord.bondName}</h4>
                  <p className="text-sm text-gray-500 mt-1">{selectedRecord.projectName}</p>
                </div>
                <Badge variant={recordStatusMap[selectedRecord.status]?.color || 'default'}>
                  {recordStatusMap[selectedRecord.status]?.label || selectedRecord.statusName}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">使用日期</div>
                <div className="text-base font-medium text-gray-900 mt-1">{selectedRecord.useDate}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">使用金额</div>
                <div className="text-lg font-bold text-[#d97706] mt-1">{selectedRecord.amount.toLocaleString()} 万元</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">收款方</div>
                <div className="text-base text-gray-700 mt-1">{selectedRecord.payee}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">经办人</div>
                <div className="text-base text-gray-700 mt-1">{selectedRecord.operator}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">用途说明</div>
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                {selectedRecord.purpose}
              </div>
            </div>
            {selectedRecord.remark && (
              <div>
                <div className="text-sm text-gray-500 mb-2">备注</div>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                  {selectedRecord.remark}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 删除记录确认弹窗 */}
      <Modal
        open={isDeleteRecordConfirmOpen}
        title="确认删除"
        width="sm"
        onClose={() => setIsDeleteRecordConfirmOpen(false)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteRecordConfirmOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDeleteRecord}
            >
              确认删除
            </Button>
          </>
        }
      >
        <div className="py-4">
          <p className="text-gray-700">
            确定要删除该使用记录吗？
          </p>
          <p className="text-sm text-gray-500 mt-2">
            债券：<span className="font-medium text-[#1e3a8a]">{selectedRecord?.bondName}</span>
          </p>
          <p className="text-sm text-gray-500">
            金额：<span className="font-medium text-[#d97706]">{selectedRecord?.amount.toLocaleString()} 万元</span>
          </p>
          <p className="text-sm text-red-500 mt-2">此操作不可恢复，请谨慎操作。</p>
        </div>
      </Modal>
    </div>
  );
};

export default FundTracker;
