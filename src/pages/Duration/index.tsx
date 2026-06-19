import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Building2, Percent, Shield, AlertCircle, CheckCircle, FileText, Download, Eye } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { useAppStore } from '../../store';
import type { DurationBond } from '../../types';

// 存续期管理页面
const DurationPage = () => {
  const navigate = useNavigate();
  const { durationBonds, reports } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBond, setSelectedBond] = useState<DurationBond | null>(durationBonds[0] || null);
  const [showDisclosureModal, setShowDisclosureModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // 过滤债券列表
  const filteredBonds = durationBonds.filter((bond) => {
    const matchesSearch =
      bond.bondName.includes(searchTerm) ||
      bond.issuerName.includes(searchTerm) ||
      bond.bondCode.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || bond.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 获取当前债券相关报告
  const bondReports = selectedBond
    ? reports.filter((r) => r.bondName === selectedBond.bondName)
    : [];

  // 获取状态样式
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'normal':
        return { label: '正常', variant: 'success' as const, icon: CheckCircle };
      case 'warning':
        return { label: '关注', variant: 'warning' as const, icon: AlertCircle };
      case 'default':
        return { label: '违约', variant: 'danger' as const, icon: AlertCircle };
      default:
        return { label: '正常', variant: 'success' as const, icon: CheckCircle };
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">存续期管理</h1>
        <p className="text-slate-500 mt-1">管理已发行债券的存续期事务，包括付息兑付、信息披露等</p>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索债券代码、名称、发行人..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: '全部' },
              { key: 'normal', label: '正常' },
              { key: 'warning', label: '关注' },
              { key: 'default', label: '违约' }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 债券列表 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">债券信息</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">规模/利率</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">下次付息</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBonds.map((bond) => {
                  const statusCfg = getStatusConfig(bond.status);
                  return (
                    <tr
                      key={bond.id}
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedBond?.id === bond.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedBond(bond)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{bond.bondName}</p>
                          <p className="text-sm text-slate-500 mt-1">{bond.bondCode}</p>
                          <p className="text-xs text-slate-400 mt-1">{bond.issuerName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">{bond.issueAmount}亿元</p>
                          <p className="text-sm text-slate-500 mt-1">票面利率 {bond.couponRate}%</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={bond.status} variant={statusCfg.variant}>
                          {statusCfg.label}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-900">{bond.nextPaymentDate}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 债券详情 */}
        <div className="lg:col-span-1">
          {selectedBond ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-20">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{selectedBond.bondName}</h3>
                    <p className="text-sm text-slate-500 mt-1">{selectedBond.bondCode}</p>
                  </div>
                  <StatusBadge
                    status={selectedBond.status}
                    variant={getStatusConfig(selectedBond.status).variant}
                  >
                    {getStatusConfig(selectedBond.status).label}
                  </StatusBadge>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-500">发行规模</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{selectedBond.issueAmount}<span className="text-sm font-normal text-slate-500">亿元</span></p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Percent className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-500">票面利率</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{selectedBond.couponRate}<span className="text-sm font-normal text-slate-500">%</span></p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">发行日期</p>
                      <p className="font-medium text-slate-900">{selectedBond.issueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">到期日期</p>
                      <p className="font-medium text-slate-900">{selectedBond.maturityDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-xs text-blue-600">下次付息日</p>
                      <p className="font-medium text-blue-900">{selectedBond.nextPaymentDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Shield className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">受托管理人</p>
                      <p className="font-medium text-slate-900">{selectedBond.trustee}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-900 mb-3">付息兑付计划</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
                      <span className="text-sm text-emerald-700">2024-07-20</span>
                      <span className="text-sm font-medium text-emerald-700">付息</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-600">2025-01-20</span>
                      <span className="text-sm text-slate-600">付息</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-600">2025-07-20</span>
                      <span className="text-sm text-slate-600">付息</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowDisclosureModal(true)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    信息披露
                  </button>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    查看报告
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
              <p className="text-slate-500">选择左侧债券查看详情</p>
            </div>
          )}
        </div>
      </div>

      {/* 信息披露弹窗 */}
      <Modal
        isOpen={showDisclosureModal}
        onClose={() => setShowDisclosureModal(false)}
        title="信息披露"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">选择需要披露的信息类型：</p>
          <div className="space-y-2">
            {['年度报告', '半年度报告', '季度报告', '重大事项公告', '付息兑付公告', '受托管理事务报告'].map((item) => (
              <button
                key={item}
                onClick={() => { alert(`已提交「${item}」披露申请，正在跳转至报告编辑页面...`); setShowDisclosureModal(false); navigate('/reports'); }}
                className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-900">{item}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowDisclosureModal(false)}
            className="w-full px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
        </div>
      </Modal>

      {/* 查看报告弹窗 */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="相关报告"
      >
        <div className="space-y-3">
          {bondReports.length === 0 ? (
            <p className="text-center text-slate-500 py-8">暂无相关报告</p>
          ) : (
            bondReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                <div>
                  <p className="text-sm font-medium text-slate-900">{report.reportName}</p>
                  <p className="text-xs text-slate-500 mt-1">{report.reportPeriod} · {report.createDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert('正在打开报告预览...')}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                  </button>
                  <button
                    onClick={() => alert('正在下载报告...')}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            ))
          )}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => { setShowReportModal(false); navigate('/reports'); }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              前往报告中心
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DurationPage;
