import { useState } from 'react';
import { FileText, FileCheck, Clock, Download, Eye, Plus, Calendar, Building2 } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { useAppStore } from '../../store';

// 合规报告中心页面
const ReportsPage = () => {
  const { reports } = useAppStore();
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // 获取报告类型配置
  const getReportTypeConfig = (type: string) => {
    switch (type) {
      case 'regular':
        return { label: '定期报告', icon: FileCheck, color: 'text-blue-600 bg-blue-50' };
      case 'temporary':
        return { label: '临时报告', icon: Clock, color: 'text-amber-600 bg-amber-50' };
      case 'special':
        return { label: '专项报告', icon: FileText, color: 'text-emerald-600 bg-emerald-50' };
      default:
        return { label: '其他', icon: FileText, color: 'text-slate-600 bg-slate-50' };
    }
  };

  // 获取状态配置
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'published':
        return { label: '已发布', variant: 'success' as const };
      case 'submitted':
        return { label: '已提交', variant: 'info' as const };
      case 'draft':
        return { label: '草稿', variant: 'default' as const };
      default:
        return { label: '未知', variant: 'default' as const };
    }
  };

  // 过滤报告
  const filteredReports = reports.filter((report) => {
    if (typeFilter === 'all') return true;
    return report.reportType === typeFilter;
  });

  // 按类型分组统计
  const reportStats = {
    total: reports.length,
    regular: reports.filter((r) => r.reportType === 'regular').length,
    temporary: reports.filter((r) => r.reportType === 'temporary').length,
    special: reports.filter((r) => r.reportType === 'special').length
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">合规报告中心</h1>
          <p className="text-slate-500 mt-1">管理债券存续期各类合规报告，支持在线查看和下载</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
          <Plus className="w-5 h-5" />
          新建报告
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{reportStats.total}</p>
              <p className="text-sm text-slate-500">报告总数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{reportStats.regular}</p>
              <p className="text-sm text-slate-500">定期报告</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{reportStats.temporary}</p>
              <p className="text-sm text-slate-500">临时报告</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{reportStats.special}</p>
              <p className="text-sm text-slate-500">专项报告</p>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex gap-2">
          {[
            { key: 'all', label: '全部' },
            { key: 'regular', label: '定期报告' },
            { key: 'temporary', label: '临时报告' },
            { key: 'special', label: '专项报告' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTypeFilter(item.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${typeFilter === item.key
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((report) => {
          const typeCfg = getReportTypeConfig(report.reportType);
          const statusCfg = getStatusConfig(report.status);
          const TypeIcon = typeCfg.icon;

          return (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeCfg.color}`}>
                  <TypeIcon className="w-6 h-6" />
                </div>
                <StatusBadge status={report.status} variant={statusCfg.variant}>
                  {statusCfg.label}
                </StatusBadge>
              </div>

              <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {report.reportName}
              </h3>

              <div className="space-y-2 text-sm text-slate-600 mb-5">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>{report.bondName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{report.reportPeriod}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>创建于 {report.createDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                  <Eye className="w-4 h-4" />
                  预览
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <Download className="w-4 h-4" />
                  下载
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 报告模板区域 */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">快速生成报告</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: '季度受托管理报告', desc: '包含债券基本情况、发行人经营情况、募集资金使用情况等', icon: FileCheck },
            { name: '年度受托管理报告', desc: '年度全面报告，含年度财务数据分析、重大事项说明等', icon: FileText },
            { name: '临时事项公告', desc: '针对重大事项的临时信息披露报告模板', icon: Clock }
          ].map((template) => {
            const Icon = template.icon;
            return (
              <div key={template.name} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-slate-900">{template.name}</h4>
                </div>
                <p className="text-sm text-slate-500">{template.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
