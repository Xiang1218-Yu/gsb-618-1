import { useState } from 'react';
import {
  FileCheck,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  ClipboardCheck,
  FileBarChart,
  Send,
} from 'lucide-react';
import { useAppStore, mockComplianceChecks } from '@/store';
import { formatDate } from '@/utils/formatters';

/**
 * 监管报送事项接口
 */
interface RegulatorySubmission {
  /** 报送事项ID */
  id: string;
  /** 报送事项名称 */
  item: string;
  /** 债券名称 */
  bondName: string;
  /** 报送截止日 */
  deadline: string;
  /** 报送状态 */
  status: 'submitted' | 'pending';
}

/**
 * 可生成报告接口
 */
interface ReportItem {
  /** 报告ID */
  id: string;
  /** 报告标题 */
  title: string;
  /** 报告描述 */
  description: string;
  /** 报告图标 */
  icon: typeof FileText;
  /** 图标颜色 */
  iconColor: string;
  /** 图标背景色 */
  iconBg: string;
}

/**
 * 合规报告中心页面
 */
const Reports = () => {
  const bonds = useAppStore((state) => state.bonds);
  const [generatingReportId, setGeneratingReportId] = useState<string | null>(null);

  /**
   * 根据债券ID获取债券名称
   * @param bondId 债券ID
   * @returns 债券名称
   */
  const getBondNameById = (bondId: string): string => {
    const bond = bonds.find((b) => b.id === bondId);
    return bond?.bondName || '-';
  };

  /**
   * 合规检查数据（补充整改状态默认值）
   */
  const complianceChecks = mockComplianceChecks.map((check) => ({
    ...check,
    rectificationStatus: check.rectificationStatus || (check.isCompliant ? 'none' : 'pending'),
  }));

  /**
   * 统计数据计算
   */
  const totalChecks = complianceChecks.length;
  const compliantCount = complianceChecks.filter((c) => c.isCompliant).length;
  const nonCompliantCount = complianceChecks.filter((c) => !c.isCompliant).length;
  const rectificationCompletedCount = complianceChecks.filter(
    (c) => c.rectificationStatus === 'completed'
  ).length;
  const rectificationRate =
    nonCompliantCount > 0
      ? ((rectificationCompletedCount / nonCompliantCount) * 100).toFixed(1)
      : '100.0';

  /**
   * 统计卡片配置
   */
  const statCards = [
    {
      title: '合规检查项总数',
      value: totalChecks,
      unit: '项',
      icon: ClipboardCheck,
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-700',
      borderColor: 'border-primary-500',
    },
    {
      title: '合规项数',
      value: compliantCount,
      unit: '项',
      icon: CheckCircle,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-500',
    },
    {
      title: '不合规项数',
      value: nonCompliantCount,
      unit: '项',
      icon: XCircle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      borderColor: 'border-red-500',
    },
    {
      title: '整改完成率',
      value: rectificationRate,
      unit: '%',
      icon: FileBarChart,
      iconBg: 'bg-gold-100',
      iconColor: 'text-gold-600',
      borderColor: 'border-gold-500',
    },
  ];

  /**
   * 可生成报告列表
   */
  const reportList: ReportItem[] = [
    {
      id: 'report-001',
      title: '存续期合规定期报告',
      description: '按月/季度生成债券存续期合规检查情况汇总报告，包含资金使用、信息披露、财务指标等合规要点',
      icon: FileCheck,
      iconColor: 'text-primary-600',
      iconBg: 'bg-primary-50',
    },
    {
      id: 'report-002',
      title: '年度风险管理报告',
      description: '年度全面风险管理报告，涵盖信用风险、市场风险、流动性风险等各类风险识别、评估与应对措施',
      icon: FileBarChart,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    {
      id: 'report-003',
      title: '募集资金使用专项报告',
      description: '针对募集资金到账、使用、专户管理等情况的专项核查报告，确保资金用途与募集说明书约定一致',
      icon: FileText,
      iconColor: 'text-gold-600',
      iconBg: 'bg-gold-50',
    },
    {
      id: 'report-004',
      title: '风险排查报告',
      description: '定期或专项风险排查工作报告，包含风险事项清单、成因分析、整改措施及跟踪落实情况',
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-50',
    },
  ];

  /**
   * 监管报送跟踪数据
   */
  const regulatorySubmissions: RegulatorySubmission[] = [
    {
      id: 'sub-001',
      item: '2024年一季度受托管理事务报告',
      bondName: '23华信01',
      deadline: '2024-06-30',
      status: 'pending',
    },
    {
      id: 'sub-002',
      item: '2023年年度受托管理事务报告',
      bondName: '23盛世02',
      deadline: '2024-06-30',
      status: 'pending',
    },
    {
      id: 'sub-003',
      item: '募集资金存放与使用情况专项报告',
      bondName: '24天合MTN001',
      deadline: '2024-07-15',
      status: 'pending',
    },
    {
      id: 'sub-004',
      item: '2024年一季度受托管理事务报告',
      bondName: '24中鼎CP001',
      deadline: '2024-05-15',
      status: 'submitted',
    },
    {
      id: 'sub-005',
      item: '临时受托管理事务报告（违约事项）',
      bondName: '22盛世01',
      deadline: '2024-05-15',
      status: 'submitted',
    },
    {
      id: 'sub-006',
      item: '2023年年度受托管理事务报告',
      bondName: '23华信01',
      deadline: '2024-04-30',
      status: 'submitted',
    },
  ];

  /**
   * 获取整改状态文本
   * @param status 整改状态
   * @returns 中文文本
   */
  const getRectificationStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      none: '无需整改',
      pending: '待整改',
      completed: '已完成',
    };
    return statusMap[status] || status;
  };

  /**
   * 获取整改状态样式类名
   * @param status 整改状态
   * @returns Tailwind CSS类名
   */
  const getRectificationStatusClass = (status: string): string => {
    const classMap: Record<string, string> = {
      none: 'bg-slate-100 text-slate-600',
      pending: 'bg-amber-100 text-amber-700',
      completed: 'bg-emerald-100 text-emerald-700',
    };
    return classMap[status] || 'bg-slate-100 text-slate-600';
  };

  /**
   * 获取报送状态文本
   * @param status 报送状态
   * @returns 中文文本
   */
  const getSubmissionStatusText = (status: string): string => {
    return status === 'submitted' ? '已报送' : '待报送';
  };

  /**
   * 获取报送状态样式类名
   * @param status 报送状态
   * @returns Tailwind CSS类名
   */
  const getSubmissionStatusClass = (status: string): string => {
    return status === 'submitted'
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-amber-100 text-amber-700';
  };

  /**
   * 处理生成报告
   * @param reportId 报告ID
   */
  const handleGenerateReport = (reportId: string) => {
    setGeneratingReportId(reportId);
    setTimeout(() => {
      setGeneratingReportId(null);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题区域 */}
      <div className="page-card bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-primary-600/20 rounded-full translate-y-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <FileCheck className="w-8 h-8 text-gold-400" />
            <h1 className="text-2xl font-bold text-white font-serif">合规报告中心</h1>
          </div>
          <p className="text-primary-200 text-sm">集中管理债券存续期合规检查、报告生成与监管报送事务</p>
        </div>
      </div>

      {/* 统计卡片区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`stat-card opacity-0 animate-slide-up stagger-${index + 1} relative overflow-hidden`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${card.borderColor.replace('border-', 'bg-')}`}></div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-sm mb-1">{card.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-800">{card.value}</span>
                    <span className="text-slate-500 text-sm">{card.unit}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 合规检查表 */}
      <div className="page-card opacity-0 animate-slide-up stagger-1">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary-700" />
            <h3 className="text-lg font-semibold text-slate-800 font-serif">合规检查记录</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="table-header px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">检查类别</th>
                <th className="table-header px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">检查项</th>
                <th className="table-header px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">债券名称</th>
                <th className="table-header px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">检查日期</th>
                <th className="table-header px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">合规状态</th>
                <th className="table-header px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">问题描述</th>
                <th className="table-header px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">整改状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complianceChecks.map((check) => (
                <tr
                  key={check.id}
                  className={`hover:bg-slate-50 transition-colors ${!check.isCompliant ? 'bg-red-50' : ''}`}
                >
                  <td className="table-cell px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-700">{check.category}</span>
                  </td>
                  <td className="table-cell px-6 py-4">
                    <span className="text-sm text-slate-800 font-medium">{check.checkItem}</span>
                  </td>
                  <td className="table-cell px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">{getBondNameById(check.bondId)}</span>
                  </td>
                  <td className="table-cell px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-500">{formatDate(check.checkDate)}</span>
                  </td>
                  <td className="table-cell px-6 py-4 whitespace-nowrap">
                    {check.isCompliant ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        <CheckCircle className="w-3.5 h-3.5" />
                        合规
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <XCircle className="w-3.5 h-3.5" />
                        不合规
                      </span>
                    )}
                  </td>
                  <td className="table-cell px-6 py-4">
                    <span className={`text-sm ${check.isCompliant ? 'text-slate-400' : 'text-red-700'}`}>
                      {check.issueDescription || '-'}
                    </span>
                  </td>
                  <td className="table-cell px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getRectificationStatusClass(check.rectificationStatus || 'none')}`}>
                      {getRectificationStatusText(check.rectificationStatus || 'none')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 报告生成区域 */}
      <div className="page-card p-6 opacity-0 animate-slide-up stagger-2">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary-700" />
          <h3 className="text-lg font-semibold text-slate-800 font-serif">报告生成</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportList.map((report) => {
            const Icon = report.icon;
            const isGenerating = generatingReportId === report.id;
            return (
              <div
                key={report.id}
                className="border border-slate-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${report.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${report.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-slate-800 mb-1">{report.title}</h4>
                    <p className="text-sm text-slate-500 mb-3 line-clamp-2">{report.description}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleGenerateReport(report.id)}
                        disabled={isGenerating}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-700 hover:bg-primary-800 disabled:bg-primary-400 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        {isGenerating ? (
                          <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            生成中...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            生成报告
                          </>
                        )}
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-primary-300 text-slate-600 hover:text-primary-700 text-sm font-medium rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                        预览
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 监管报送跟踪 */}
      <div className="page-card opacity-0 animate-slide-up stagger-3">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-primary-700" />
            <h3 className="text-lg font-semibold text-slate-800 font-serif">监管报送跟踪</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="table-header px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">报送事项</th>
                <th className="table-header px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">债券名称</th>
                <th className="table-header px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">报送截止日</th>
                <th className="table-header px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">报送状态</th>
                <th className="table-header px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {regulatorySubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-slate-50 transition-colors">
                  <td className="table-cell px-6 py-4">
                    <span className="text-sm text-slate-800 font-medium">{submission.item}</span>
                  </td>
                  <td className="table-cell px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">{submission.bondName}</span>
                  </td>
                  <td className="table-cell px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-500">{formatDate(submission.deadline)}</span>
                  </td>
                  <td className="table-cell px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getSubmissionStatusClass(submission.status)}`}>
                      {submission.status === 'submitted' ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      {getSubmissionStatusText(submission.status)}
                    </span>
                  </td>
                  <td className="table-cell px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {submission.status === 'submitted' ? (
                        <button className="inline-flex items-center gap-1 text-sm text-primary-700 hover:text-primary-800 font-medium">
                          <Eye className="w-4 h-4" />
                          查看
                        </button>
                      ) : (
                        <>
                          <button className="inline-flex items-center gap-1 text-sm text-primary-700 hover:text-primary-800 font-medium">
                            <Send className="w-4 h-4" />
                            报送
                          </button>
                          <button className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
                            <Eye className="w-4 h-4" />
                            预览
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
