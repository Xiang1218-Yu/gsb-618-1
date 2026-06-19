import { useState } from 'react';
import { Plus, Search, Calendar, Building2, Users, TrendingUp, ChevronRight, Eye, Edit3 } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { useAppStore } from '../../store';
import type { BondProject, NewProjectFormData } from '../../types';

// 承销发行管理页面
const UnderwritingPage = () => {
  const { bondProjects, setShowNewProjectModal, showNewProjectModal, addBondProject } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<BondProject | null>(null);
  const [formData, setFormData] = useState<NewProjectFormData>({
    projectName: '',
    issuerName: '',
    bondType: 'corporate',
    issueScale: 0,
    expectedIssueDate: '',
    teamMembers: ''
  });

  // 过滤项目列表
  const filteredProjects = bondProjects.filter((project) => {
    const matchesSearch =
      project.projectName.includes(searchTerm) ||
      project.issuerName.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 获取阶段进度条颜色
  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-amber-500';
      case 'approved': return 'bg-emerald-500';
      default: return 'bg-slate-300';
    }
  };

  // 统计数据
  const stats = {
    total: bondProjects.length,
    inProgress: bondProjects.filter((p) => p.status === 'in_progress').length,
    completed: bondProjects.filter((p) => p.status === 'completed').length,
    pending: bondProjects.filter((p) => p.status === 'pending').length
  };

  // 阶段流程
  const stages = ['立项准备', '尽职调查', '材料制作', '审核申报', '发行上市'];

  // 打开详情
  const handleViewDetail = (project: BondProject) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  };

  // 打开编辑
  const handleEdit = (project: BondProject) => {
    setSelectedProject(project);
    setFormData({
      projectName: project.projectName,
      issuerName: project.issuerName,
      bondType: project.bondType,
      issueScale: project.issueScale,
      expectedIssueDate: project.expectedIssueDate,
      teamMembers: project.teamMembers.join('、')
    });
    setShowEditModal(true);
  };

  // 提交编辑
  const handleEditSubmit = () => {
    alert(`项目「${formData.projectName}」已更新！`);
    setShowEditModal(false);
    setSelectedProject(null);
  };

  // 提交新建
  const handleCreateSubmit = () => {
    if (!formData.projectName || !formData.issuerName) {
      alert('请填写完整信息');
      return;
    }
    addBondProject(formData);
    setFormData({
      projectName: '',
      issuerName: '',
      bondType: 'corporate',
      issueScale: 0,
      expectedIssueDate: '',
      teamMembers: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">承销发行管理</h1>
          <p className="text-slate-500 mt-1">管理债券承销项目全流程，从立项到发行</p>
        </div>
        <button
          onClick={() => setShowNewProjectModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          新建项目
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">项目总数</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">进行中</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">已完成</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">待立项</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索项目名称、发行人..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: '全部' },
              { key: 'in_progress', label: '进行中' },
              { key: 'completed', label: '已完成' },
              { key: 'pending', label: '待立项' }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setStatusFilter(item.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${statusFilter === item.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 项目列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {project.projectName}
                  </h3>
                  <StatusBadge status={project.status}>
                    {project.status === 'completed' ? '已完成' : project.status === 'in_progress' ? '进行中' : '待立项'}
                  </StatusBadge>
                </div>
                <p className="text-sm text-slate-500 mt-1">{project.issuerName}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); handleViewDetail(project); }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                  title="查看详情"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleEdit(project); }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                  title="编辑"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">发行规模</p>
                <p className="text-lg font-bold text-slate-900 mt-1">{project.issueScale}<span className="text-sm font-normal text-slate-500">亿</span></p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">当前阶段</p>
                <p className="text-sm font-semibold text-blue-600 mt-1">{project.currentStage}</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">完成进度</p>
                <p className="text-lg font-bold text-slate-900 mt-1">{project.progress}<span className="text-sm font-normal text-slate-500">%</span></p>
              </div>
            </div>

            {/* 进度条 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">项目进度</span>
                <span className="text-xs font-medium text-slate-700">{project.progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(project.status)} rounded-full transition-all duration-500`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* 阶段指示器 */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              {stages.map((stage, index) => {
                const stageIndex = stages.indexOf(project.currentStage);
                const isCompleted = index < stageIndex;
                const isCurrent = index === stageIndex;
                return (
                  <div key={stage} className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full transition-colors
                      ${isCompleted ? 'bg-emerald-500' : isCurrent ? 'bg-blue-500 ring-4 ring-blue-100' : 'bg-slate-200'}`}
                    />
                    <span className={`text-xs mt-1.5 transition-colors
                      ${isCurrent ? 'text-blue-600 font-medium' : isCompleted ? 'text-slate-600' : 'text-slate-400'}`}
                    >
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 新建项目弹窗 */}
      <Modal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        title="新建承销项目"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">项目名称 *</label>
            <input
              type="text"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入项目名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">发行人 *</label>
            <input
              type="text"
              value={formData.issuerName}
              onChange={(e) => setFormData({ ...formData, issuerName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入发行人名称"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">债券类型</label>
              <select
                value={formData.bondType}
                onChange={(e) => setFormData({ ...formData, bondType: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="corporate">公司债</option>
                <option value="enterprise">企业债</option>
                <option value="municipal">地方政府债</option>
                <option value="financial">金融债</option>
                <option value="abs">ABS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">发行规模(亿元)</label>
              <input
                type="number"
                value={formData.issueScale || ''}
                onChange={(e) => setFormData({ ...formData, issueScale: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">预计发行日期</label>
            <input
              type="date"
              value={formData.expectedIssueDate}
              onChange={(e) => setFormData({ ...formData, expectedIssueDate: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">项目成员</label>
            <input
              type="text"
              value={formData.teamMembers}
              onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="多个成员用顿号分隔"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowNewProjectModal(false)}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleCreateSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              创建项目
            </button>
          </div>
        </div>
      </Modal>

      {/* 项目详情弹窗 */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="项目详情"
      >
        {selectedProject && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-slate-900">{selectedProject.projectName}</h3>
              <StatusBadge status={selectedProject.status}>
                {selectedProject.status === 'completed' ? '已完成' : selectedProject.status === 'in_progress' ? '进行中' : '待立项'}
              </StatusBadge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">发行人</p>
                <p className="text-base font-semibold text-slate-900 mt-1">{selectedProject.issuerName}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">发行规模</p>
                <p className="text-base font-semibold text-slate-900 mt-1">{selectedProject.issueScale} 亿元</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">当前阶段</p>
                <p className="text-base font-semibold text-blue-600 mt-1">{selectedProject.currentStage}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">风险等级</p>
                <p className={`text-base font-semibold mt-1 ${
                  selectedProject.riskLevel === 'low' ? 'text-emerald-600' : selectedProject.riskLevel === 'medium' ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {selectedProject.riskLevel === 'low' ? '低风险' : selectedProject.riskLevel === 'medium' ? '中风险' : '高风险'}
                </p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-2">项目团队</p>
              <div className="flex flex-wrap gap-2">
                {selectedProject.teamMembers.map((member) => (
                  <span key={member} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-700">
                    {member}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-2">时间安排</p>
              <div className="space-y-2 text-sm">
                <p><span className="text-slate-500">立项日期：</span>{selectedProject.startDate}</p>
                <p><span className="text-slate-500">预计发行：</span>{selectedProject.expectedIssueDate}</p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => { setShowDetailModal(false); handleEdit(selectedProject); }}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                编辑项目
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 编辑项目弹窗 */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="编辑项目"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">项目名称</label>
            <input
              type="text"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">发行人</label>
            <input
              type="text"
              value={formData.issuerName}
              onChange={(e) => setFormData({ ...formData, issuerName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">债券类型</label>
              <select
                value={formData.bondType}
                onChange={(e) => setFormData({ ...formData, bondType: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="corporate">公司债</option>
                <option value="enterprise">企业债</option>
                <option value="municipal">地方政府债</option>
                <option value="financial">金融债</option>
                <option value="abs">ABS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">发行规模(亿元)</label>
              <input
                type="number"
                value={formData.issueScale || ''}
                onChange={(e) => setFormData({ ...formData, issueScale: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">预计发行日期</label>
            <input
              type="date"
              value={formData.expectedIssueDate}
              onChange={(e) => setFormData({ ...formData, expectedIssueDate: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowEditModal(false)}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleEditSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              保存修改
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UnderwritingPage;
