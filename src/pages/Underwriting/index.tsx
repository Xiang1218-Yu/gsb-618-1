import { useState } from 'react';
import { Plus, Search, Eye, MoreHorizontal, Calendar, Users, TrendingUp } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { useAppStore } from '../../store';
import type { BondProject } from '../../types';

// 状态映射配置
const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
  pending: { label: '立项准备', variant: 'default' },
  approving: { label: '注册审核', variant: 'warning' },
  issuing: { label: '发行中', variant: 'info' },
  listed: { label: '已上市', variant: 'success' },
  managing: { label: '存续期', variant: 'success' }
};

// 债券类型选项
const bondTypeOptions = ['公司债', '企业债', '中期票据', '短期融资券', '金融债', '绿色债'];

// 承销发行管理页面
const UnderwritingPage = () => {
  const { bondProjects, showNewProjectModal, setShowNewProjectModal, addBondProject } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<BondProject | null>(null);

  // 新建项目表单状态
  const [newProjectForm, setNewProjectForm] = useState({
    projectName: '',
    issuerName: '',
    bondType: '公司债',
    issueScale: 10,
    expectedIssueDate: '',
    teamMembers: ''
  });

  // 过滤项目列表
  const filteredProjects = bondProjects.filter((project) => {
    const matchesSearch =
      project.projectName.includes(searchTerm) ||
      project.issuerName.includes(searchTerm) ||
      project.bondType.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 处理表单输入变化
  const handleFormChange = (field: string, value: string | number) => {
    setNewProjectForm((prev) => ({ ...prev, [field]: value }));
  };

  // 提交新建项目
  const handleSubmitProject = () => {
    if (!newProjectForm.projectName || !newProjectForm.issuerName || !newProjectForm.expectedIssueDate) {
      alert('请填写必填项');
      return;
    }
    addBondProject({
      projectName: newProjectForm.projectName,
      issuerName: newProjectForm.issuerName,
      bondType: newProjectForm.bondType,
      issueScale: newProjectForm.issueScale,
      expectedIssueDate: newProjectForm.expectedIssueDate,
      teamMembers: newProjectForm.teamMembers.split(/[,，、]/).filter((s) => s.trim())
    });
    // 重置表单
    setNewProjectForm({
      projectName: '',
      issuerName: '',
      bondType: '公司债',
      issueScale: 10,
      expectedIssueDate: '',
      teamMembers: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">承销发行管理</h1>
          <p className="text-slate-500 mt-1">管理债券承销项目从立项到发行的全流程</p>
        </div>
        <button
          onClick={() => setShowNewProjectModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-5 h-5" />
          新建项目
        </button>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索项目名称、发行人、债券类型..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'approving', 'issuing', 'listed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {status === 'all' ? '全部' : statusConfig[status]?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 项目列表 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">项目信息</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">规模</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">进度</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedProject?.id === project.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{project.projectName}</p>
                        <p className="text-sm text-slate-500 mt-1">{project.issuerName}</p>
                        <p className="text-xs text-slate-400 mt-1">{project.bondType}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-slate-900">{project.issueScale}</span>
                        <span className="text-sm text-slate-500">亿元</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={project.status}
                        variant={statusConfig[project.status]?.variant || 'default'}
                      >
                        {statusConfig[project.status]?.label}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-600">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-slate-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 项目详情面板 */}
        <div className="lg:col-span-1">
          {selectedProject ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-20">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">{selectedProject.projectName}</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedProject.issuerName}</p>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">立项日期</p>
                    <p className="font-medium text-slate-900">{selectedProject.startDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">预计发行日期</p>
                    <p className="font-medium text-slate-900">{selectedProject.expectedIssueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Users className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">项目成员</p>
                    <p className="font-medium text-slate-900">{selectedProject.teamMembers.join('、')}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-900 mb-3">发行进度</p>
                  <div className="space-y-4">
                    {['立项准备', '尽职调查', '材料制作', '注册审核', '簿记建档', '发行上市'].map((stage, index) => {
                      const isCompleted = selectedProject.progress >= (index + 1) * 16.67;
                      const isCurrent = selectedProject.currentStage === stage;

                      return (
                        <div key={stage} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            isCompleted ? 'bg-blue-500' : isCurrent ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'
                          }`} />
                          <span className={`text-sm ${isCurrent ? 'text-blue-600 font-medium' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    查看详情
                  </button>
                  <button className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                    编辑
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500">选择左侧项目查看详情</p>
            </div>
          )}
        </div>
      </div>

      {/* 新建项目弹窗 */}
      <Modal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        title="新建承销项目"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              项目名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newProjectForm.projectName}
              onChange={(e) => handleFormChange('projectName', e.target.value)}
              placeholder="例如：2024年第三期公司债"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              发行人名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newProjectForm.issuerName}
              onChange={(e) => handleFormChange('issuerName', e.target.value)}
              placeholder="例如：XX科技集团有限公司"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">债券类型</label>
              <select
                value={newProjectForm.bondType}
                onChange={(e) => handleFormChange('bondType', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {bondTypeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">发行规模（亿元）</label>
              <input
                type="number"
                value={newProjectForm.issueScale}
                onChange={(e) => handleFormChange('issueScale', Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              预计发行日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={newProjectForm.expectedIssueDate}
              onChange={(e) => handleFormChange('expectedIssueDate', e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">项目成员（用逗号分隔）</label>
            <input
              type="text"
              value={newProjectForm.teamMembers}
              onChange={(e) => handleFormChange('teamMembers', e.target.value)}
              placeholder="例如：张明, 李华, 王芳"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onClick={handleSubmitProject}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              创建项目
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UnderwritingPage;
