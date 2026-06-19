import React, { useState } from 'react';
import {
  FileText,
  Clock,
  Users,
  CheckCircle,
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
import type { UnderwritingProject } from '@/types/bond';
import type { Bond } from '@/types/bond';

/**
 * 债券承销管理页面
 * 负责管理债券承销项目全流程，包括新增项目、查看详情、删除项目等功能
 */
const Underwriting: React.FC = () => {
  // 从store获取数据和方法
  const {
    underwritingProjects,
    bonds,
    addUnderwritingProject,
    deleteUnderwritingProject
  } = useDataStore();

  // 搜索和筛选状态
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal状态控制
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<UnderwritingProject | null>(null);

  // 新增表单状态
  const [addFormData, setAddFormData] = useState({
    projectName: '',
    bondId: '',
    currentStage: '',
    expectedSubmitDate: ''
  });

  /**
   * 项目状态映射配置
   * 用于将后端状态码转换为前端显示的标签和样式颜色
   */
  const statusMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'danger' | 'default' }> = {
    pending: { label: '待启动', color: 'default' },
    in_progress: { label: '进行中', color: 'info' },
    submitted: { label: '已申报', color: 'warning' },
    approved: { label: '已获批', color: 'success' },
    rejected: { label: '已驳回', color: 'danger' }
  };

  /**
   * 阶段选项配置
   * 用于新增项目表单中的阶段选择器
   */
  const stageOptions = [
    { value: '材料准备', label: '材料准备' },
    { value: '尽职调查', label: '尽职调查' },
    { value: '内核审核', label: '内核审核' },
    { value: '申报提交', label: '申报提交' },
    { value: '反馈回复', label: '反馈回复' },
    { value: '发行启动', label: '发行启动' }
  ];

  /**
   * 数据过滤函数
   * 根据搜索文本和状态筛选承销项目列表
   */
  const filteredData = underwritingProjects.filter(project => {
    const matchSearch = project.bondName.includes(searchText) ||
                       project.projectName.includes(searchText);
    const matchStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchSearch && matchStatus;
  });

  /**
   * 统计数据计算
   * 基于store中的数据实时计算各项统计指标
   */
  const stats = {
    total: underwritingProjects.length,
    inProgress: underwritingProjects.filter(p => p.status === 'in_progress').length,
    submitted: underwritingProjects.filter(p => p.status === 'submitted').length,
    approved: underwritingProjects.filter(p => p.status === 'approved').length
  };

  /**
   * 打开新增项目弹窗
   * 重置表单数据
   */
  const handleOpenAddModal = () => {
    setAddFormData({
      projectName: '',
      bondId: '',
      currentStage: '',
      expectedSubmitDate: ''
    });
    setIsAddModalOpen(true);
  };

  /**
   * 提交新增项目表单
   * 验证必填项后调用store方法添加项目
   */
  const handleAddSubmit = () => {
    // 获取选中的债券信息
    const selectedBond = bonds.find(b => b.id === addFormData.bondId);
    if (!selectedBond || !addFormData.projectName || !addFormData.currentStage || !addFormData.expectedSubmitDate) {
      alert('请填写完整信息');
      return;
    }

    // 构建新项目数据
    const newProject: Omit<UnderwritingProject, 'id'> = {
      bondId: selectedBond.id,
      bondName: selectedBond.bondName,
      projectName: addFormData.projectName,
      status: 'pending',
      statusName: '待启动',
      currentStage: addFormData.currentStage,
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      expectedSubmitDate: addFormData.expectedSubmitDate,
      teamMembers: [],
      milestones: []
    };

    addUnderwritingProject(newProject);
    setIsAddModalOpen(false);
  };

  /**
   * 打开项目详情弹窗
   */
  const handleViewDetail = (project: UnderwritingProject) => {
    setSelectedProject(project);
    setIsDetailModalOpen(true);
  };

  /**
   * 打开删除确认弹窗
   */
  const handleDeleteClick = (project: UnderwritingProject) => {
    setSelectedProject(project);
    setIsDeleteConfirmOpen(true);
  };

  /**
   * 确认删除项目
   */
  const handleConfirmDelete = () => {
    if (selectedProject) {
      deleteUnderwritingProject(selectedProject.id);
      setIsDeleteConfirmOpen(false);
      setSelectedProject(null);
    }
  };

  /**
   * 表格列配置数组
   */
  const columns: Column<UnderwritingProject>[] = [
    {
      key: 'bondName',
      title: '债券名称',
      width: '200px',
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
      width: '120px',
      render: (record) => (
        <span className="text-sm text-gray-700">{record.currentStage}</span>
      )
    },
    {
      key: 'progress',
      title: '项目进度',
      width: '160px',
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
      title: '预计申报日',
      width: '120px',
      render: (record) => <span className="text-sm text-gray-600">{record.expectedSubmitDate}</span>
    },
    {
      key: 'teamMembers',
      title: '项目成员',
      width: '100px',
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
      width: '140px',
      align: 'center',
      render: (record) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="text"
            size="sm"
            onClick={() => handleViewDetail(record)}
          >
            <Eye className="w-4 h-4" />
            <span className="ml-1">查看</span>
          </Button>
          <Button
            variant="text"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleDeleteClick(record)}
          >
            <Trash2 className="w-4 h-4" />
            <span className="ml-1">删除</span>
          </Button>
        </div>
      )
    }
  ];

  /**
   * 筛选选项配置
   */
  const filterOptions = [
    { label: '全部状态', value: 'all' },
    { label: '待启动', value: 'pending' },
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
          <Button
            variant="primary"
            onClick={handleOpenAddModal}
          >
            <Plus className="w-4 h-4 mr-1" />
            新增项目
          </Button>
        }
      />

      {/* 统计卡片区域 */}
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
          className="border-l-4 border-[#d97706]"
        />
        <StatCard
          title="已获批项目"
          value={stats.approved}
          icon={CheckCircle}
          className="border-l-4 border-green-500"
        />
      </div>

      {/* 搜索筛选区域 */}
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

      {/* 数据表格区域 */}
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

      {/* 新增项目弹窗 */}
      <Modal
        open={isAddModalOpen}
        title="新增承销项目"
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
          {/* 项目名称输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              项目名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={addFormData.projectName}
              onChange={(e) => setAddFormData({ ...addFormData, projectName: e.target.value })}
              placeholder="请输入项目名称"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none transition-colors"
            />
          </div>

          {/* 关联债券选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              关联债券 <span className="text-red-500">*</span>
            </label>
            <select
              value={addFormData.bondId}
              onChange={(e) => setAddFormData({ ...addFormData, bondId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none transition-colors"
            >
              <option value="">请选择关联债券</option>
              {bonds.map((bond: Bond) => (
                <option key={bond.id} value={bond.id}>
                  {bond.bondName} ({bond.bondCode})
                </option>
              ))}
            </select>
          </div>

          {/* 当前阶段选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              当前阶段 <span className="text-red-500">*</span>
            </label>
            <select
              value={addFormData.currentStage}
              onChange={(e) => setAddFormData({ ...addFormData, currentStage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none transition-colors"
            >
              <option value="">请选择当前阶段</option>
              {stageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 预计申报日期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              预计申报日 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={addFormData.expectedSubmitDate}
              onChange={(e) => setAddFormData({ ...addFormData, expectedSubmitDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none transition-colors"
            />
          </div>
        </div>
      </Modal>

      {/* 项目详情弹窗 */}
      <Modal
        open={isDetailModalOpen}
        title="项目详情"
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
        {selectedProject && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">项目名称</div>
                <div className="text-base font-medium text-gray-900 mt-1">{selectedProject.projectName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">关联债券</div>
                <div className="text-base font-medium text-gray-900 mt-1">{selectedProject.bondName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">项目状态</div>
                <div className="mt-1">
                  <Badge variant={statusMap[selectedProject.status]?.color || 'default'}>
                    {statusMap[selectedProject.status]?.label || selectedProject.statusName}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">当前阶段</div>
                <div className="text-base font-medium text-gray-900 mt-1">{selectedProject.currentStage}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">开始日期</div>
                <div className="text-base text-gray-700 mt-1">{selectedProject.startDate}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">预计申报日</div>
                <div className="text-base text-gray-700 mt-1">{selectedProject.expectedSubmitDate}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">项目进度</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1e3a8a] rounded-full"
                    style={{ width: `${selectedProject.progress}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-[#1e3a8a]">{selectedProject.progress}%</span>
              </div>
            </div>
            {selectedProject.teamMembers.length > 0 && (
              <div>
                <div className="text-sm text-gray-500 mb-2">项目成员</div>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.teamMembers.map((member, index) => (
                    <Badge key={index} variant="default">{member}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal
        open={isDeleteConfirmOpen}
        title="确认删除"
        width="sm"
        onClose={() => setIsDeleteConfirmOpen(false)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDelete}
            >
              确认删除
            </Button>
          </>
        }
      >
        <div className="py-4">
          <p className="text-gray-700">
            确定要删除项目 <span className="font-semibold text-[#1e3a8a]">"{selectedProject?.projectName}"</span> 吗？
          </p>
          <p className="text-sm text-gray-500 mt-2">此操作不可恢复，请谨慎操作。</p>
        </div>
      </Modal>
    </div>
  );
};

export default Underwriting;
