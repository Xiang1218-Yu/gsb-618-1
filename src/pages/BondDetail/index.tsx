import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Building2,
  Tag,
  Hash,
  Calendar,
  Percent,
  Clock,
  Shield,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  CheckCircle2,
  Circle,
  Flame,
  Newspaper,
  ExternalLink,
  CreditCard,
  MapPin,
  User,
} from 'lucide-react';
import { useAppStore } from '@/store';
import {
  formatAmount,
  formatRate,
  formatDate,
  getBondStatusText,
  getBondStatusClass,
  getBondTypeText,
  getRiskLevelClass,
  getRiskLevelText,
  getSentimentClass,
  getSentimentText,
} from '@/utils/formatters';
import { BondStatus } from '@/types';

/**
 * 发行流程步骤配置
 */
const issueProcessSteps = [
  { key: 'underwriting', label: '承销立项' },
  { key: 'dueDiligence', label: '尽职调查' },
  { key: 'approval', label: '发行审批' },
  { key: 'prospectus', label: '募集说明书' },
  { key: 'bookbuilding', label: '簿记建档' },
  { key: 'fundReceived', label: '资金到账' },
  { key: 'listed', label: '上市交易' },
];

/**
 * 根据债券状态获取当前流程步骤索引
 * @param status 债券状态
 * @returns 当前步骤索引
 */
const getCurrentStepIndex = (status: BondStatus): number => {
  const stepMap: Record<BondStatus, number> = {
    [BondStatus.Underwriting]: 0,
    [BondStatus.Approving]: 2,
    [BondStatus.Issuing]: 4,
    [BondStatus.Listed]: 6,
    [BondStatus.Duration]: 6,
    [BondStatus.Redeemed]: 6,
    [BondStatus.Default]: 6,
  };
  return stepMap[status] ?? 0;
};

/**
 * 债券详情页面组件
 * 展示债券基本信息、发行流程进度、风险信息和关联舆情
 */
const BondDetail = () => {
  const { id } = useParams<{ id: string }>();
  const getBondById = useAppStore((state) => state.getBondById);
  const getSentimentsByBondId = useAppStore((state) => state.getSentimentsByBondId);
  const riskAlerts = useAppStore((state) => state.riskAlerts);

  const bond = id ? getBondById(id) : undefined;
  const sentiments = id ? getSentimentsByBondId(id) : [];
  const bondRiskAlerts = riskAlerts.filter((alert) => alert.bondId === id);

  /**
   * 如果债券不存在，显示不存在提示
   */
  if (!bond) {
    return (
      <div className="p-6">
        <div className="page-card p-12 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">债券不存在</h2>
          <p className="text-slate-500 mb-6">未找到ID为 {id} 的债券信息</p>
          <Link to="/bonds" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            返回债券列表
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex(bond.status);

  /**
   * 基本信息项配置
   */
  const basicInfoItems = [
    {
      icon: <Hash className="w-5 h-5" />,
      label: '债券代码',
      value: bond.bondCode,
    },
    {
      icon: <Tag className="w-5 h-5" />,
      label: '债券类型',
      value: getBondTypeText(bond.bondType),
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: '发行规模',
      value: formatAmount(bond.issueAmount),
      valueClass: 'text-gold-600 font-semibold',
    },
    {
      icon: <Percent className="w-5 h-5" />,
      label: '票面利率',
      value: formatRate(bond.issueRate),
      valueClass: 'text-gold-600 font-semibold',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: '债券期限',
      value: `${bond.termYears}年`,
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: '发行日期',
      value: formatDate(bond.issueDate, 'cn'),
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: '到期日期',
      value: formatDate(bond.maturityDate, 'cn'),
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: '主体评级',
      value: bond.issuer?.creditRating || '-',
      valueClass: 'text-primary-700 font-semibold',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: '评级展望',
      value: bond.ratingOutlook || '-',
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      label: '受托管理人',
      value: bond.trustee || '-',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/bonds"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800 font-serif">{bond.bondName}</h1>
              <span className={`status-badge ${getBondStatusClass(bond.status)}`}>
                {getBondStatusText(bond.status)}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              债券代码：{bond.bondCode} | 创建时间：{formatDate(bond.createdAt, 'cn')}
            </p>
          </div>
        </div>
      </div>

      {/* 债券基本信息卡片 */}
      <div className="page-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary-800 to-primary-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">债券基本信息</h2>
              <p className="text-primary-200 text-sm">债券核心要素一览</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {/* 发行人信息 */}
          <div className="mb-6 p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-primary-700" />
              <span className="font-medium text-slate-700">发行人信息</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">发行人名称</p>
                <p className="text-slate-800 font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  {bond.issuer?.issuerName || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">所属行业</p>
                <p className="text-slate-800">{bond.issuer?.industry || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">法人代表</p>
                <p className="text-slate-800">{bond.issuer?.legalRepresentative || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">注册地址</p>
                <p className="text-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {bond.issuer?.registeredAddress || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* 债券要素 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {basicInfoItems.map((item, index) => (
              <div
                key={index}
                className="p-4 border border-slate-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/30 transition-colors"
              >
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <span className="text-primary-600">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </div>
                <p className={`text-slate-800 ${item.valueClass || ''}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 发行流程进度条 */}
      <div className="page-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary-800 to-primary-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">发行流程进度</h2>
              <p className="text-primary-200 text-sm">跟踪债券发行全流程</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="relative">
            {/* 进度条背景线 */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 rounded-full" />
            {/* 进度条已完成线 */}
            <div
              className="absolute top-5 left-0 h-1 bg-gradient-to-r from-primary-600 to-gold-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentStepIndex / (issueProcessSteps.length - 1)) * 100}%` }}
            />

            {/* 步骤节点 */}
            <div className="relative flex justify-between">
              {issueProcessSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                        isCompleted
                          ? isCurrent
                            ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30 ring-4 ring-gold-100'
                            : 'bg-primary-600 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isCompleted && !isCurrent ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className={`w-5 h-5 ${isCurrent ? 'fill-current' : ''}`} />
                      )}
                    </div>
                    <p
                      className={`mt-3 text-xs font-medium text-center max-w-20 ${
                        isCompleted ? 'text-primary-700' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 风险信息 */}
      <div className="page-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary-800 to-primary-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">风险信息</h2>
              <p className="text-primary-200 text-sm">该债券相关的风险预警</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {bondRiskAlerts.length > 0 ? (
            <div className="space-y-4">
              {bondRiskAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-slate-800">{alert.title}</h3>
                        <span
                          className={`status-badge ${getRiskLevelClass(alert.riskLevel)}`}
                        >
                          {getRiskLevelText(alert.riskLevel)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>触发时间：{alert.triggerTime}</span>
                        {alert.handler && <span>处理人：{alert.handler}</span>}
                        <span>
                          处理状态：
                          {alert.handleStatus === 'pending' && '待处理'}
                          {alert.handleStatus === 'processing' && '处理中'}
                          {alert.handleStatus === 'resolved' && '已解决'}
                          {alert.handleStatus === 'ignored' && '已忽略'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-slate-500">暂无风险预警信息</p>
            </div>
          )}
        </div>
      </div>

      {/* 关联舆情 */}
      <div className="page-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary-800 to-primary-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">关联舆情</h2>
              <p className="text-primary-200 text-sm">与该债券相关的市场舆情信息</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {sentiments.length > 0 ? (
            <div className="space-y-4">
              {sentiments.map((sentiment) => (
                <div
                  key={sentiment.id}
                  className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-slate-800">{sentiment.title}</h3>
                        <span className={`status-badge ${getSentimentClass(sentiment.sentiment)}`}>
                          {getSentimentText(sentiment.sentiment)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{sentiment.summary}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Newspaper className="w-3 h-3" />
                          {sentiment.source}
                        </span>
                        <span>{formatDate(sentiment.publishDate, 'cn')}</span>
                        <span className="flex items-center gap-1 text-orange-500">
                          <Flame className="w-3 h-3" />
                          热度 {sentiment.heat}
                        </span>
                      </div>
                      {sentiment.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {sentiment.keywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {sentiment.url && (
                      <a
                        href={sentiment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">暂无关联舆情信息</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BondDetail;
