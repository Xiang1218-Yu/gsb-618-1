import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Eye,
  Bell,
  CheckCircle2,
  Building2,
  CreditCard,
  FileSpreadsheet
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
import { mockDurationBonds, mockInterestPayments, mockDisclosureRecords } from '@/data/mockBonds';
import type { DurationBond, InterestPayment, DisclosureRecord } from '@/types/bond';

// 存续期管理页面
const Duration: React.FC = () => {
  // 当前激活的标签页：存续债券/付息兑付/信息披露
  const [activeTab, setActiveTab] = useState<'bonds' | 'interest' | 'disclosure'>('bonds');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // ========== Modal相关状态 ==========
  // 债券详情弹窗：控制显示/隐藏、当前选中的债券数据、详情内Tab
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBond, setSelectedBond] = useState<DurationBond | null>(null);
  const [detailTab, setDetailTab] = useState<'basic' | 'payment' | 'disclosure'>('basic');

  // 付息提醒弹窗：控制显示/隐藏、当前选中债券、备注内容、是否发送成功
  const [remindModalOpen, setRemindModalOpen] = useState(false);
  const [remindBond, setRemindBond] = useState<DurationBond | null>(null);
  const [remindNote, setRemindNote] = useState('');
  const [remindSent, setRemindSent] = useState(false);

  /**
   * 付息状态映射配置
   * 定义利息支付的各种状态
   */
  const paymentStatusMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default' }> = {
    pending: { label: '待支付', color: 'warning' },  // 即将支付但尚未支付
    paid: { label: '已支付', color: 'success' },     // 已完成支付
    overdue: { label: '逾期', color: 'danger' }       // 超过期限未支付
  };

  /**
   * 披露类型映射配置
   * 定义信息披露文件的分类
   */
  const disclosureTypeMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default' }> = {
    periodic: { label: '定期报告', color: 'info' },   // 年度/半年度/季度报告
    temporary: { label: '临时公告', color: 'warning' }, // 重大事项临时公告
    other: { label: '其他文件', color: 'default' }     // 其他披露文件
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

  /**
   * 打开债券详情弹窗
   * @param bond 要查看的债券数据
   */
  const openDetailModal = (bond: DurationBond) => {
    setSelectedBond(bond);
    setDetailTab('basic');
    setDetailModalOpen(true);
  };

  /**
   * 打开付息提醒弹窗
   * @param bond 要提醒的债券数据
   */
  const openRemindModal = (bond: DurationBond) => {
    setRemindBond(bond);
    setRemindNote('');
    setRemindSent(false);
    setRemindModalOpen(true);
  };

  /**
   * 关闭付息提醒弹窗并重置状态
   */
  const closeRemindModal = () => {
    setRemindModalOpen(false);
    setRemindBond(null);
    setRemindNote('');
    setRemindSent(false);
  };

  /**
   * 发送付息提醒
   * 在Modal内显示成功提示，2秒后自动关闭
   */
  const handleSendRemind = () => {
    setRemindSent(true);
    setTimeout(() => {
      closeRemindModal();
    }, 2000);
  };

  /**
   * 获取当前债券关联的付息记录
   */
  const getBondPayments = (bondId: string) => {
    return mockInterestPayments.filter(p => p.bondId === bondId);
  };

  /**
   * 获取当前债券关联的信息披露记录
   */
  const getBondDisclosures = (bondId: string) => {
    return mockDisclosureRecords.filter(d => d.bondId === bondId);
  };

  /**
   * 打开付息记录详情弹窗
   * 付息记录点击后，找到对应债券打开详情
   */
  const openPaymentDetail = (payment: InterestPayment) => {
    const bond = mockDurationBonds.find(b => b.id === payment.bondId);
    if (bond) {
      setSelectedBond(bond);
      setDetailTab('payment');
      setDetailModalOpen(true);
    }
  };

  /**
   * 打开信息披露记录详情弹窗
   * 披露记录点击后，找到对应债券打开详情
   */
  const openDisclosureDetail = (disclosure: DisclosureRecord) => {
    const bond = mockDurationBonds.find(b => b.id === disclosure.bondId);
    if (bond) {
      setSelectedBond(bond);
      setDetailTab('disclosure');
      setDetailModalOpen(true);
    }
  };

  /**
   * 债券表格列配置
   * 存续债券列表的列定义
   */
  const bondColumns: Column<DurationBond>[] = [
    // 债券名称列：显示债券名称和债券代码
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
    // 发行人列：显示发行主体名称
    {
      key: 'issuerName',
      title: '发行人',
      width: '200px',
      render: (record) => <span className="text-sm text-gray-700">{record.issuerName}</span>
    },
    // 发行规模列：显示发行总额（单位：亿元）
    {
      key: 'issueAmount',
      title: '发行规模(亿)',
      width: '110px',
      align: 'right',
      render: (record) => <span className="text-sm font-medium text-gray-900">{record.issueAmount}</span>
    },
    // 票面利率列：显示债券年利率，橙色高亮
    {
      key: 'issueRate',
      title: '票面利率',
      width: '100px',
      align: 'right',
      render: (record) => <span className="text-sm text-[#d97706] font-medium">{record.issueRate}%</span>
    },
    // 到期日列：显示债券到期兑付日期
    {
      key: 'maturityDate',
      title: '到期日',
      width: '110px',
      render: (record) => <span className="text-sm text-gray-600">{record.maturityDate}</span>
    },
    // 下一付息日列：显示下一次付息日期和剩余天数
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
    // 付息进度列：进度条显示已付息次数/总付息次数
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
    // 操作列：查看详情和付息提醒按钮
    {
      key: 'actions',
      title: '操作',
      width: '160px',
      align: 'center',
      render: (record) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="text"
            size="sm"
            onClick={() => openDetailModal(record)}
          >
            <Eye className="w-4 h-4 mr-1" />
            详情
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openRemindModal(record)}
          >
            <Bell className="w-4 h-4 mr-1" />
            提醒
          </Button>
        </div>
      )
    }
  ];

  /**
   * 付息记录表格列配置
   * 利息支付记录列表的列定义
   */
  const paymentColumns: Column<InterestPayment>[] = [
    // 债券名称列：显示关联的债券名称，点击可查看详情
    {
      key: 'bondName',
      title: '债券名称',
      width: '180px',
      render: (record) => (
        <span
          className="font-medium text-gray-900 hover:text-[#1e3a8a] cursor-pointer"
          onClick={() => openPaymentDetail(record)}
        >
          {record.bondName}
        </span>
      )
    },
    // 类型列：固定显示"付息"标签
    {
      key: 'paymentType',
      title: '类型',
      width: '80px',
      render: () => <Badge variant="info">付息</Badge>
    },
    // 付息日列：显示利息支付日期
    {
      key: 'paymentDate',
      title: '付息日',
      width: '110px',
      render: (record) => <span className="text-sm text-gray-600">{record.paymentDate}</span>
    },
    // 付息金额列：显示本次付息总金额（万元）
    {
      key: 'paymentAmount',
      title: '付息金额(万)',
      width: '130px',
      align: 'right',
      render: (record) => <span className="text-sm font-medium text-gray-900">{record.paymentAmount.toLocaleString()}</span>
    },
    // 状态列：显示付息状态（待支付/已支付/逾期）
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
    // 备注列：显示支付相关备注信息
    {
      key: 'remark',
      title: '备注',
      render: (record) => <span className="text-sm text-gray-500">{record.remark || '-'}</span>
    },
    // 操作列：查看详情按钮
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
            onClick={() => openPaymentDetail(record)}
          >
            <Eye className="w-4 h-4 mr-1" />
            详情
          </Button>
        </div>
      )
    }
  ];

  /**
   * 信息披露表格列配置
   * 披露文件列表的列定义
   */
  const disclosureColumns: Column<DisclosureRecord>[] = [
    // 债券名称列：关联查询显示所属债券名称，点击可查看详情
    {
      key: 'bondName',
      title: '债券名称',
      width: '180px',
      render: (record) => {
        const bond = mockDurationBonds.find(b => b.id === record.bondId);
        return (
          <span
            className="font-medium text-gray-900 hover:text-[#1e3a8a] cursor-pointer"
            onClick={() => openDisclosureDetail(record)}
          >
            {bond?.bondName || '-'}
          </span>
        );
      }
    },
    // 公告标题列：可点击查看详情
    {
      key: 'title',
      title: '公告标题',
      render: (record) => (
        <span
          className="text-sm text-gray-700 hover:text-[#1e3a8a] cursor-pointer"
          onClick={() => openDisclosureDetail(record)}
        >
          {record.title}
        </span>
      )
    },
    // 类型列：显示披露文件类型
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
    // 披露日期列：显示公告发布日期
    {
      key: 'publishDate',
      title: '披露日期',
      width: '110px',
      render: (record) => <span className="text-sm text-gray-600">{record.publishDate}</span>
    },
    // 操作列：查看详情按钮
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
            onClick={() => openDisclosureDetail(record)}
          >
            <Eye className="w-4 h-4 mr-1" />
            详情
          </Button>
        </div>
      )
    }
  ];

  /**
   * 获取当前表格数据
   * 根据激活的标签页返回对应的数据，并应用搜索过滤
   * 过滤逻辑：各标签页分别搜索对应的字段
   */
  const getTableData = () => {
    switch (activeTab) {
      case 'bonds':
        // 存续债券页：按债券名称模糊搜索
        return mockDurationBonds.filter(b => b.bondName.includes(searchText));
      case 'interest':
        // 付息兑付页：按债券名称模糊搜索
        return mockInterestPayments.filter(p => p.bondName.includes(searchText));
      case 'disclosure':
        // 信息披露页：按公告标题模糊搜索
        return mockDisclosureRecords.filter(d => d.title.includes(searchText));
      default:
        return [];
    }
  };

  /**
   * 获取当前表格列配置
   * 根据激活的标签页返回对应的列配置数组
   */
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

  /**
   * 标签页配置数组
   * 定义三个标签页的key、显示名称和数据数量
   * Tab切换逻辑：点击标签时更新activeTab状态并重置页码到第1页
   */
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

      {/* 标签页切换区域 */}
      <Card bodyClassName="p-0">
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  // 切换标签时重置到第一页
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

      {/* ========== 债券详情弹窗 ========== */}
      <Modal
        open={detailModalOpen}
        title={selectedBond ? `${selectedBond.bondName} - 债券详情` : '债券详情'}
        width="xl"
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedBond(null);
        }}
        footer={
          <Button variant="secondary" onClick={() => setDetailModalOpen(false)}>
            关闭
          </Button>
        }
      >
        {selectedBond && (
          <div className="space-y-6">
            {/* 详情内Tab切换 */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setDetailTab('basic')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  detailTab === 'basic'
                    ? 'bg-white text-[#1e3a8a] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Building2 className="w-4 h-4" />
                基本信息
              </button>
              <button
                onClick={() => setDetailTab('payment')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  detailTab === 'payment'
                    ? 'bg-white text-[#1e3a8a] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                付息兑付
              </button>
              <button
                onClick={() => setDetailTab('disclosure')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  detailTab === 'disclosure'
                    ? 'bg-white text-[#1e3a8a] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                信息披露
              </button>
            </div>

            {/* 基本信息Tab内容 */}
            {detailTab === 'basic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">债券代码</div>
                    <div className="text-sm font-medium text-gray-900">{selectedBond.bondCode}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">债券类型</div>
                    <div className="text-sm font-medium text-gray-900">{selectedBond.bondTypeName}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">发行人</div>
                    <div className="text-sm font-medium text-gray-900">{selectedBond.issuerName}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">主体评级</div>
                    <div className="text-sm font-medium text-[#d97706]">{selectedBond.creditRating}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">发行规模</div>
                    <div className="text-sm font-medium text-gray-900">{selectedBond.issueAmount} 亿元</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">票面利率</div>
                    <div className="text-sm font-medium text-[#d97706]">{selectedBond.issueRate}%</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">发行日期</div>
                    <div className="text-sm font-medium text-gray-900">{selectedBond.issueDate}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">到期日期</div>
                    <div className="text-sm font-medium text-gray-900">{selectedBond.maturityDate}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">债券期限</div>
                    <div className="text-sm font-medium text-gray-900">{selectedBond.termYears} 年</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">主承销商</div>
                    <div className="text-sm font-medium text-gray-900">{selectedBond.leadUnderwriter}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                    <div className="text-xs text-gray-500 mb-1">受托管理人</div>
                    <div className="text-sm font-medium text-gray-900">{selectedBond.trustee}</div>
                  </div>
                </div>
              </div>
            )}

            {/* 付息兑付Tab内容 */}
            {detailTab === 'payment' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="text-xs text-blue-600 mb-1">下一付息日</div>
                    <div className="text-lg font-bold text-[#1e3a8a]">{selectedBond.nextInterestDate}</div>
                    <div className="text-xs text-blue-500 mt-1">剩余 {selectedBond.remainingDays} 天</div>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <div className="text-xs text-amber-600 mb-1">下次付息金额</div>
                    <div className="text-lg font-bold text-[#d97706]">{selectedBond.nextInterestAmount.toLocaleString()}</div>
                    <div className="text-xs text-amber-500 mt-1">万元</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="text-xs text-green-600 mb-1">付息进度</div>
                    <div className="text-lg font-bold text-green-700">{selectedBond.interestPaid}/{selectedBond.totalInterests}</div>
                    <div className="text-xs text-green-500 mt-1">已完成/总期数</div>
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">付息日</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">金额(万)</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">状态</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">备注</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getBondPayments(selectedBond.id).map(payment => (
                        <tr key={payment.id} className="border-b last:border-0">
                          <td className="px-4 py-3 text-sm text-gray-700">{payment.paymentDate}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">{payment.paymentAmount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant={paymentStatusMap[payment.status]?.color || 'default'} dot>
                              {paymentStatusMap[payment.status]?.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{payment.remark || '-'}</td>
                        </tr>
                      ))}
                      {getBondPayments(selectedBond.id).length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">暂无付息记录</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 信息披露Tab内容 */}
            {detailTab === 'disclosure' && (
              <div className="space-y-3">
                {getBondDisclosures(selectedBond.id).map(disc => (
                  <div key={disc.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={disclosureTypeMap[disc.type]?.color || 'default'}>
                          {disclosureTypeMap[disc.type]?.label}
                        </Badge>
                        <span className="text-xs text-gray-500">{disc.publishDate}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{disc.title}</div>
                    </div>
                    <Button variant="text" size="sm">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {getBondDisclosures(selectedBond.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">暂无披露记录</div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ========== 付息提醒弹窗 ========== */}
      <Modal
        open={remindModalOpen}
        title={remindSent ? '发送成功' : '付息提醒确认'}
        width="md"
        onClose={closeRemindModal}
        footer={
          remindSent ? (
            <Button variant="primary" onClick={closeRemindModal}>
              确定
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="secondary" onClick={closeRemindModal}>
                取消
              </Button>
              <Button variant="primary" onClick={handleSendRemind}>
                <Bell className="w-4 h-4 mr-1" />
                确认发送
              </Button>
            </div>
          )
        }
      >
        {remindSent ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">付息提醒已发送</h4>
            <p className="text-sm text-gray-500">已成功向相关人员发送付息提醒通知</p>
          </div>
        ) : remindBond && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="text-sm font-medium text-[#1e3a8a] mb-1">{remindBond.bondName}</div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  <span className="text-gray-500">下一付息日：</span>
                  <span className="text-gray-900">{remindBond.nextInterestDate}</span>
                </div>
                <div>
                  <span className="text-gray-500">剩余天数：</span>
                  <span className="text-[#d97706] font-medium">{remindBond.remainingDays}天</span>
                </div>
                <div>
                  <span className="text-gray-500">付息金额：</span>
                  <span className="text-gray-900">{remindBond.nextInterestAmount.toLocaleString()}万元</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                提醒备注（选填）
              </label>
              <textarea
                value={remindNote}
                onChange={(e) => setRemindNote(e.target.value)}
                placeholder="请输入备注信息，将随提醒一同发送..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]/20 resize-none"
                rows={4}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Duration;
