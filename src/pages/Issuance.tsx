import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  CheckCircle,
  DollarSign,
  Plus,
  Eye,
  Edit
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
import type { Bond } from '@/types/bond';

/**
 * 债券发行管理页面
 * 负责管理处于发行中状态的债券，包括新增发行、查看详情、编辑等功能
 */
const Issuance: React.FC = () => {
  // 从store获取数据和方法
  const { bonds, addBond } = useDataStore();

  // 搜索和筛选状态
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal状态控制
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);

  // 新增表单状态
  const [addFormData, setAddFormData] = useState({
    bondName: '',
    bondCode: '',
    issuerName: '',
    issueAmount: '',
    issueRate: '',
    issueDate: ''
  });

  /**
   * 债券类型配置
   * 用于新增债券时的类型选择
   */
  const bondTypeOptions = [
    { value: 'corporate', label: '公司债', typeName: '公司债' },
    { value: 'enterprise', label: '企业债', typeName: '企业债' },
    { value: 'municipal', label: '地方政府债', typeName: '地方政府债' },
    { value: 'financial', label: '金融债', typeName: '金融债' },
    { value: 'convertible', label: '可转债', typeName: '可转债' }
  ];

  /**
   * 筛选出状态为'issuing'（发行中）的债券
   */
  const issuingBonds = bonds.filter(bond => bond.status === 'issuing');

  /**
   * 数据过滤函数
   * 根据搜索文本筛选发行中的债券
   */
  const filteredData = issuingBonds.filter(bond => {
    const matchSearch = bond.bondName.includes(searchText) ||
                       bond.bondCode.includes(searchText) ||
                       bond.issuerName.includes(searchText);
    return matchSearch;
  });

  /**
   * 统计数据计算
   */
  const stats = {
    total: issuingBonds.length,
    totalAmount: issuingBonds.reduce((sum, b) => sum + b.issueAmount, 0),
    avgRate: issuingBonds.length > 0
      ? (issuingBonds.reduce((sum, b) => sum + b.issueRate, 0) / issuingBonds.length).toFixed(2)
      : '0.00'
  };

  /**
   * 打开新增发行弹窗
   */
  const handleOpenAddModal = () => {
    setAddFormData({
      bondName: '',
      bondCode: '',
      issuerName: '',
      issueAmount: '',
      issueRate: '',
      issueDate: ''
    });
    setIsAddModalOpen(true);
  };

  /**
   * 提交新增发行表单
   */
  const handleAddSubmit = () => {
    if (!addFormData.bondName || !addFormData.bondCode || !addFormData.issuerName ||
        !addFormData.issueAmount || !addFormData.issueRate || !addFormData.issueDate) {
      alert('请填写完整信息');
      return;
    }

    // 默认使用公司债类型
    const defaultType = bondTypeOptions[0];

    // 构建新债券数据
    const newBond: Omit<Bond, 'id'> = {
      bondName: addFormData.bondName,
      bondCode: addFormData.bondCode,
      issuerId: `issuer_${Date.now()}`,
      issuerName: addFormData.issuerName,
      bondType: defaultType.value as Bond['bondType'],
      bondTypeName: defaultType.typeName,
      issueAmount: parseFloat(addFormData.issueAmount),
      issueRate: parseFloat(addFormData.issueRate),
      issuePrice: 100,
      termYears: 3,
      issueDate: addFormData.issueDate,
      maturityDate: addFormData.issueDate,
      status: 'issuing',
      statusName: '发行中',
      creditRating: 'AAA',
      leadUnderwriter: '主承销商',
      trustee: '受托管理人'
    };

    addBond(newBond);
    setIsAddModalOpen(false);
  };

  /**
   * 打开债券详情弹窗
   */
  const handleViewDetail = (bond: Bond) => {
    setSelectedBond(bond);
    setIsDetailModalOpen(true);
  };

  /**
   * 打开编辑弹窗（只读展示）
   */
  const handleEdit = (bond: Bond) => {
    setSelectedBond(bond);
    setIsEditModalOpen(true);
  };

  /**
   * 表格列配置数组
   */
  const columns: Column<Bond>[] = [
    {
      key: 'bondName',
      title: '债券名称',
      width: '200px',
      render: (record) => (
        <div>
          <div className="font-medium text-gray-900">{record.bondName}</div>
          <div className="text-xs text-gray-500 mt-0.5 font-mono">{record.bondCode}</div>
        </div>
      )
    },
    {
      key: 'issuerName',
      title: '发行人',
      width: '160px',
      render: (record) => (
        <span className="text-sm text-gray-700">{record.issuerName}</span>
      )
    },
    {
      key: 'bondTypeName',
      title: '债券类型',
      width: '100px',
      render: (record) => (
        <Badge variant="default">{record.bondTypeName}</Badge>
      )
    },
    {
      key: 'issueAmount',
      title: '发行规模(亿)',
      width: '120px',
      align: 'right',
      render: (record) => (
        <span className="text-sm font-semibold text-[#1e3a8a]">{record.issueAmount.toFixed(2)}</span>
      )
    },
    {
      key: 'issueRate',
      title: '票面利率(%)',
      width: '120px',
      align: 'right',
      render: (record) => (
        <span className="text-sm font-medium text-[#d97706]">{record.issueRate.toFixed(2)}%</span>
      )
    },
    {
      key: 'creditRating',
      title: '信用评级',
      width: '90px',
      align: 'center',
      render: (record) => (
        <Badge variant="success">{record.creditRating}</Badge>
      )
    },
    {
      key: 'issueDate',
      title: '发行日期',
      width: '110px',
      render: (record) => (
        <span className="text-sm text-gray-600">{record.issueDate}</span>
      )
    },
    {
      key: 'actions',
      title: '操作',
      width: '160px',
      align: 'center',
      render: (record) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="text"
            size="sm"
            onClick={() => handleViewDetail(record)}
          >
            <Eye className="w-4 h-4" />
            <span className="ml-1">查看详情</span>
          </Button>
          <Button
            variant="text"
            size="sm"
            onClick={() => handleEdit(record)}
          >
            <Edit className="w-4 h-4" />
            <span className="ml-1">编辑</span>
          </Button>
        </div>
      )
    }
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
            onClick={handleOpenAddModal}
          >
            <Plus className="w-4 h-4 mr-1" />
            新增发行
          </Button>
        }
      />

      {/* 统计卡片区域 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="发行中债券"
          value={stats.total}
          icon={TrendingUp}
          className="border-l-4 border-[#1e3a8a]"
        />
        <StatCard
          title="累计发行规模(亿)"
          value={stats.totalAmount.toFixed(2)}
          icon={DollarSign}
          className="border-l-4 border-[#d97706]"
        />
        <StatCard
          title="平均票面利率(%)"
          value={stats.avgRate}
          icon={Calendar}
          className="border-l-4 border-green-500"
        />
      </div>

      {/* 搜索筛选区域 */}
      <Card>
        <SearchFilter
          searchPlaceholder="搜索债券名称、代码或发行人"
          searchValue={searchText}
          onSearchChange={setSearchText}
        />
      </Card>

      {/* 数据表格区域 */}
      <Card bodyClassName="p-0">
        <DataTable<Bond & Record<string, unknown>>
          columns={columns as Column<Bond & Record<string, unknown>>[]}
          data={filteredData as (Bond & Record<string, unknown>)[]}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredData.length,
            onChange: (page) => setCurrentPage(page)
          }}
        />
      </Card>

      {/* 新增发行弹窗 */}
      <Modal
        open={isAddModalOpen}
        title="新增债券发行"
        width="lg"
        onClose={() => setIsAddModalOpen(false)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="primary"
              onClick={handleAddSubmit}
            >
              确定提交
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* 债券名称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                债券名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={addFormData.bondName}
                onChange={(e) => setAddFormData({ ...addFormData, bondName: e.target.value })}
                placeholder="请输入债券名称"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none transition-colors"
              />
            </div>

            {/* 债券代码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                债券代码 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={addFormData.bondCode}
                onChange={(e) => setAddFormData({ ...addFormData, bondCode: e.target.value })}
                placeholder="请输入债券代码"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none transition-colors"
              />
            </div>

            {/* 发行人 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                发行人 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={addFormData.issuerName}
                onChange={(e) => setAddFormData({ ...addFormData, issuerName: e.target.value })}
                placeholder="请输入发行人名称"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none transition-colors"
              />
            </div>

            {/* 发行规模 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                发行规模(亿元) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={addFormData.issueAmount}
                onChange={(e) => setAddFormData({ ...addFormData, issueAmount: e.target.value })}
                placeholder="请输入发行规模"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none transition-colors"
              />
            </div>

            {/* 票面利率 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                票面利率(%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={addFormData.issueRate}
                onChange={(e) => setAddFormData({ ...addFormData, issueRate: e.target.value })}
                placeholder="请输入票面利率"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none transition-colors"
              />
            </div>

            {/* 发行日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                发行日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={addFormData.issueDate}
                onChange={(e) => setAddFormData({ ...addFormData, issueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* 债券详情弹窗 */}
      <Modal
        open={isDetailModalOpen}
        title="债券发行详情"
        width="lg"
        onClose={() => setIsDetailModalOpen(false)}
        footer={
          <Button
            variant="secondary"
            onClick={() => setIsDetailModalOpen(false)}
          >
            关闭
          </Button>
        }
      >
        {selectedBond && (
          <div className="space-y-4">
            <div className="bg-[#1e3a8a]/5 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-semibold text-[#1e3a8a]">{selectedBond.bondName}</h4>
              <p className="text-sm text-gray-500 mt-1 font-mono">{selectedBond.bondCode}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">发行人</div>
                <div className="text-base font-medium text-gray-900 mt-1">{selectedBond.issuerName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">债券类型</div>
                <div className="mt-1">
                  <Badge variant="info">{selectedBond.bondTypeName}</Badge>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">发行规模</div>
                <div className="text-lg font-bold text-[#1e3a8a] mt-1">{selectedBond.issueAmount.toFixed(2)} 亿元</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">票面利率</div>
                <div className="text-lg font-bold text-[#d97706] mt-1">{selectedBond.issueRate.toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">信用评级</div>
                <div className="mt-1">
                  <Badge variant="success">{selectedBond.creditRating}</Badge>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">发行日期</div>
                <div className="text-base text-gray-700 mt-1">{selectedBond.issueDate}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">主承销商</div>
                <div className="text-base text-gray-700 mt-1">{selectedBond.leadUnderwriter}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">受托管理人</div>
                <div className="text-base text-gray-700 mt-1">{selectedBond.trustee}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 编辑弹窗（只读展示） */}
      <Modal
        open={isEditModalOpen}
        title="编辑债券信息（只读）"
        width="lg"
        onClose={() => setIsEditModalOpen(false)}
        footer={
          <Button
            variant="secondary"
            onClick={() => setIsEditModalOpen(false)}
          >
            关闭
          </Button>
        }
      >
        {selectedBond && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-amber-700">当前为只读模式，如需修改请联系系统管理员</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">债券名称</label>
                <input
                  type="text"
                  value={selectedBond.bondName}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">债券代码</label>
                <input
                  type="text"
                  value={selectedBond.bondCode}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">发行人</label>
                <input
                  type="text"
                  value={selectedBond.issuerName}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">发行规模(亿元)</label>
                <input
                  type="text"
                  value={selectedBond.issueAmount.toFixed(2)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">票面利率(%)</label>
                <input
                  type="text"
                  value={selectedBond.issueRate.toFixed(2)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">发行日期</label>
                <input
                  type="text"
                  value={selectedBond.issueDate}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Issuance;
