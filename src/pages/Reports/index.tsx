import { useState } from 'react';
import { FileText, Download, Eye, Plus, Calendar, CheckCircle, Clock, AlertCircle, Trash2, Edit3, FileCheck, FileSpreadsheet } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { useAppStore } from '../../store';
import type { ComplianceReport, NewReportFormData } from '../../types';

// 合规报告中心页面
const ReportsPage = () => {
  const { reports, durationBonds, setShowNewReportModal, showNewReportModal, addComplianceReport } = useAppStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [formData, setFormData] = useState<NewReportFormData>({
    reportName: '',
    reportType: 'annual',
    bondName: '',
    reportPeriod: ''
  });

  // 获取报告类型配置
  const getReportTypeConfig = (type: string) => {
    switch (type) {
      case 'annual':
        return { label: '年度报告', icon: FileCheck, color: 'text-blue-600 bg-blue-100' };
      case 'interim':
        return { label: '半年度报告', icon: FileSpreadsheet, color: 'text-emerald-600 bg-emerald-100' };
      case 'quarterly':
        return { label: '季度报告', icon: FileText, color: 'text-violet-600 bg-violet-100' };
      case 'trustee':
        return { label: '受托管理报告', icon: FileText, color: 'text-amber-600 bg-amber-100' };
      default:
        return { label: '临时报告', icon: FileText, color: 'text-slate-600 bg-slate-100' };
    }
  };

  // 获取报告状态配置
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'published':
        return { label: '已发布', variant: 'success' as const, icon: CheckCircle };
      case 'reviewing':
        return { label: '审核中', variant: 'warning' as const, icon: Clock };
      case 'draft':
        return { label: '草稿', variant: 'default' as const, icon: Edit3 };
      default:
        return { label: '草稿', variant: 'default' as const, icon: Edit3 };
    }
  };

  // 过滤报告列表
  const filteredReports = reports.filter((report) => {
    return filterType === 'all' || report.reportType === filterType;
  });

  // 统计数据
  const stats = {
    total: reports.length,
    published: reports.filter((r) => r.status === 'published').length,
    reviewing: reports.filter((r) => r.status === 'reviewing').length,
    draft: reports.filter((r) => r.status === 'draft').length
  };

  // 快速生成报告模板
  const quickTemplates = [
    { type: 'annual', name: '年度合规报告', desc: '包含年度财务、募集资金、重大事项等内容' },
    { type: 'interim', name: '半年度合规报告', desc: '包含半年度财务及运营情况' },
    { type: 'quarterly', name: '季度跟踪报告', desc: '季度财务指标及风险监控' },
    { type: 'trustee', name: '受托管理事务报告', desc: '受托管理人履职情况报告' }
  ];

  // 打开编辑弹窗
  const handleEdit = (report: ComplianceReport) => {
    setSelectedReport(report);
    setFormData({
      reportName: report.reportName,
      reportType: report.reportType,
      bondName: report.bondName,
      reportPeriod: report.reportPeriod
    });
    setShowEditModal(true);
  };

  // 提交编辑
  const handleEditSubmit = () => {
    if (!selectedReport) return;
    alert(`报告「${formData.reportName}」已更新！`);
    setShowEditModal(false);
    setSelectedReport(null);
  };

  // 提交新建
  const handleCreateSubmit = () => {
    if (!formData.reportName || !formData.bondName) {
      alert('请填写完整信息');
      return;
    }
    addComplianceReport(formData);
    setFormData({ reportName: '', reportType: 'annual', bondName: '', reportPeriod: '' });
  };

  // 使用模板快速创建
  const useTemplate = (template: typeof quickTemplates[0]) => {
    setFormData({
      ...formData,
      reportName: `${template.name}`,
      reportType: template.type as any
    });
    setShowNewReportModal(true);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">合规报告中心</h1>
          <p className="text-slate-500 mt-1">管理各类合规报告的编制、审核和发布</p>
        </div>
        <button
          onClick={() => setShowNewReportModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          新建报告
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '报告总数', value: stats.total, color: 'bg-blue-100 text-blue-600', icon: FileText },
          { label: '已发布', value: stats.published, color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle },
          { label: '审核中', value: stats.reviewing, color: 'bg-amber-100 text-amber-600', icon: Clock },
          { label: '草稿', value: stats.draft, color: 'bg-slate-100 text-slate-600', icon: Edit3 }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{item.label}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 快速生成 */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">快速生成报告</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quickTemplates.map((template) => (
            <button
              key={template.type}
              onClick={() => useTemplate(template)}
              className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group"
            >
              <FileText className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-slate-900">{template.name}</p>
              <p className="text-xs text-slate-500 mt-1">{template.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex gap-2">
          {[
            { key: 'all', label: '全部' },
            { key: 'annual', label: '年度报告' },
            { key: 'interim', label: '半年度报告' },
            { key: 'quarterly', label: '季度报告' },
            { key: 'trustee', label: '受托管理报告' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilterType(item.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${filterType === item.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 报告列表 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">报告名称</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">关联债券</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">报告期间</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">状态</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">创建时间</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredReports.map((report) => {
              const typeCfg = getReportTypeConfig(report.reportType);
              const statusCfg = getStatusConfig(report.status);
              const TypeIcon = typeCfg.icon;
              return (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeCfg.color}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{report.reportName}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{typeCfg.label}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-900">{report.bondName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{report.reportPeriod}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={report.status} variant={statusCfg.variant}>
                      {statusCfg.label}
                    </StatusBadge>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-500">{report.createDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setSelectedReport(report); setShowPreviewModal(true); }}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-blue-600"
                        title="预览"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`正在下载「${report.reportName}」...`)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-emerald-600"
                        title="下载"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(report)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-amber-600"
                        title="编辑"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {report.status === 'draft' && (
                        <button
                          onClick={() => {
                            if (confirm(`确定要删除「${report.reportName}」吗？`)) {
                              alert('删除成功（模拟）');
                            }
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-slate-600 hover:text-red-600"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 新建报告弹窗 */}
      <Modal
        isOpen={showNewReportModal}
        onClose={() => setShowNewReportModal(false)}
        title="新建合规报告"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">报告名称</label>
            <input
              type="text"
              value={formData.reportName}
              onChange={(e) => setFormData({ ...formData, reportName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入报告名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">报告类型</label>
            <select
              value={formData.reportType}
              onChange={(e) => setFormData({ ...formData, reportType: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="annual">年度报告</option>
              <option value="interim">半年度报告</option>
              <option value="quarterly">季度报告</option>
              <option value="trustee">受托管理报告</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">关联债券</label>
            <select
              value={formData.bondName}
              onChange={(e) => setFormData({ ...formData, bondName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">请选择债券</option>
              {durationBonds.map((bond) => (
                <option key={bond.id} value={bond.bondName}>{bond.bondName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">报告期间</label>
            <input
              type="text"
              value={formData.reportPeriod}
              onChange={(e) => setFormData({ ...formData, reportPeriod: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例如：2024年度"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowNewReportModal(false)}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleCreateSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              创建报告
            </button>
          </div>
        </div>
      </Modal>

      {/* 报告预览弹窗 */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="报告预览"
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-center text-slate-900 mb-4">{selectedReport.reportName}</h2>
              <div className="text-sm text-slate-600 space-y-2">
                <p><strong>关联债券：</strong>{selectedReport.bondName}</p>
                <p><strong>报告期间：</strong>{selectedReport.reportPeriod}</p>
                <p><strong>报告类型：</strong>{getReportTypeConfig(selectedReport.reportType).label}</p>
                <p><strong>编制日期：</strong>{selectedReport.createDate}</p>
                <p><strong>编制人：</strong>{selectedReport.creator}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-600">
                <p className="mb-2">【报告摘要】</p>
                <p>本报告期内，发行人经营状况良好，募集资金使用合规，本息兑付正常，未发现重大风险事项...</p>
                <p className="mt-4 text-slate-400 italic">（此处为模拟预览内容，实际将生成完整报告文档）</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowPreviewModal(false); handleEdit(selectedReport); }}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                编辑
              </button>
              <button
                onClick={() => { alert(`正在下载「${selectedReport.reportName}」...`); setShowPreviewModal(false); }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                下载
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 编辑报告弹窗 */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="编辑报告"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">报告名称</label>
            <input
              type="text"
              value={formData.reportName}
              onChange={(e) => setFormData({ ...formData, reportName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">报告类型</label>
            <select
              value={formData.reportType}
              onChange={(e) => setFormData({ ...formData, reportType: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="annual">年度报告</option>
              <option value="interim">半年度报告</option>
              <option value="quarterly">季度报告</option>
              <option value="trustee">受托管理报告</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">报告期间</label>
            <input
              type="text"
              value={formData.reportPeriod}
              onChange={(e) => setFormData({ ...formData, reportPeriod: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">报告内容</label>
            <textarea
              rows={6}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="请输入报告内容..."
              defaultValue="本报告期内，发行人经营状况良好，募集资金使用合规..."
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

export default ReportsPage;
