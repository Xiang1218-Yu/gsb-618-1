import { useMemo } from 'react';
import {
  CalendarClock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  DollarSign,
  FileWarning,
} from 'lucide-react';
import { useAppStore, mockPayments, mockDisclosures } from '@/store';
import { formatWanAmount, formatDate } from '@/utils/formatters';
import type { Payment, Disclosure } from '@/types';

/**
 * 付息兑付事项类型文本映射
 */
const paymentTypeTextMap: Record<string, string> = {
  interest: '付息',
  principal: '兑付',
  put: '回售',
  call: '赎回',
};

/**
 * 付息兑付状态配置
 */
const paymentStatusConfig: Record<string, { text: string; bgClass: string; textClass: string; icon: typeof CheckCircle }> = {
  completed: { text: '已完成', bgClass: 'bg-emerald-50', textClass: 'text-emerald-600', icon: CheckCircle },
  processing: { text: '处理中', bgClass: 'bg-amber-50', textClass: 'text-amber-600', icon: Clock },
  pending: { text: '待处理', bgClass: 'bg-slate-100', textClass: 'text-slate-500', icon: Clock },
  upcoming: { text: '待处理', bgClass: 'bg-slate-100', textClass: 'text-slate-500', icon: Clock },
  overdue: { text: '逾期', bgClass: 'bg-red-50', textClass: 'text-red-600', icon: AlertTriangle },
};

/**
 * 披露类型文本映射
 */
const disclosureTypeTextMap: Record<string, string> = {
  annual: '年报',
  semi_annual: '半年报',
  quarterly: '季报',
  temporary: '临时',
  rating: '评级',
  other: '其他',
};

/**
 * 披露状态配置
 */
const disclosureStatusConfig: Record<string, { text: string; bgClass: string; textClass: string }> = {
  disclosed: { text: '已披露', bgClass: 'bg-emerald-100 text-emerald-700 border-emerald-200', textClass: '' },
  upcoming: { text: '即将到期', bgClass: 'bg-amber-100 text-amber-700 border-amber-200', textClass: '' },
  pending: { text: '待披露', bgClass: 'bg-slate-100 text-slate-600 border-slate-200', textClass: '' },
  overdue: { text: '逾期', bgClass: 'bg-red-100 text-red-700 border-red-200', textClass: '' },
};

/**
 * 存续期管理页面
 */
const Duration = () => {
  const bonds = useAppStore((state) => state.bonds);

  /**
   * 根据债券ID获取债券名称
   * @param bondId 债券ID
   * @returns 债券名称
   */
  const getBondName = (bondId: string): string => {
    const bond = bonds.find((b) => b.id === bondId);
    return bond?.bondName || '';
  };

  /**
   * 统计卡片数据
   */
  const statCards = useMemo(() => {
    const pendingInterest = mockPayments.filter(
      (p) => p.paymentType === 'interest' && p.status !== 'completed' && p.status !== 'overdue'
    ).length;
    const pendingPrincipal = mockPayments.filter(
      (p) => p.paymentType === 'principal' && p.status !== 'completed' && p.status !== 'overdue'
    ).length;
    const pendingDisclosure = mockDisclosures.filter(
      (d) => d.status !== 'disclosed'
    ).length;
    const defaultedBonds = bonds.filter((b) => b.status === 'default').length;

    return [
      {
        title: '待付息',
        value: pendingInterest,
        unit: '笔',
        icon: DollarSign,
        iconColor: '#D8B44A',
        iconBg: 'bg-gold-50',
        borderColor: 'border-l-gold-500',
        desc: '未来3个月内应付利息',
      },
      {
        title: '待兑付',
        value: pendingPrincipal,
        unit: '笔',
        icon: CalendarClock,
        iconColor: '#0A2463',
        iconBg: 'bg-primary-50',
        borderColor: 'border-l-primary-600',
        desc: '未来3个月内到期本金',
      },
      {
        title: '待披露',
        value: pendingDisclosure,
        unit: '项',
        icon: FileText,
        iconColor: '#2C52AB',
        iconBg: 'bg-primary-50',
        borderColor: 'border-l-primary-500',
        desc: '尚未完成的披露事项',
      },
      {
        title: '已违约',
        value: defaultedBonds,
        unit: '只',
        icon: FileWarning,
        iconColor: '#E63946',
        iconBg: 'bg-red-50',
        borderColor: 'border-l-risk-high',
        desc: '已发生违约的债券',
      },
    ];
  }, [bonds]);

  /**
   * 未来3个月的付息兑付事项（按日期排序，以2024-06-19为基准日）
   */
  const upcomingPayments = useMemo(() => {
    const today = new Date('2024-06-19');
    const threeMonthsLater = new Date(today);
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

    return mockPayments
      .filter((p) => {
        const payDate = new Date(p.payDate);
        return payDate >= today && payDate <= threeMonthsLater;
      })
      .sort((a, b) => new Date(a.payDate).getTime() - new Date(b.payDate).getTime());
  }, []);

  /**
   * 按日期分组付息兑付事项
   */
  const groupedPayments = useMemo(() => {
    const groups: Record<string, Payment[]> = {};
    upcomingPayments.forEach((payment) => {
      const dateKey = payment.payDate;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(payment);
    });
    return groups;
  }, [upcomingPayments]);

  /**
   * 信息披露事项列表
   */
  const disclosures = useMemo(() => {
    return [...mockDisclosures].sort((a, b) => {
      const statusOrder: Record<string, number> = { overdue: 0, upcoming: 1, pending: 2, disclosed: 3 };
      return (statusOrder[a.status] ?? 4) - (statusOrder[b.status] ?? 4);
    });
  }, []);

  /**
   * 违约债券信息（22盛世01）
   */
  const defaultBond = useMemo(() => {
    return bonds.find((b) => b.bondName === '22盛世01');
  }, [bonds]);

  /**
   * 违约付息事项
   */
  const defaultPayments = useMemo(() => {
    return mockPayments.filter((p) => p.bondId === 'bond-008' && p.status === 'overdue');
  }, []);

  /**
   * 违约处置进展步骤
   */
  const defaultProgress = [
    { step: '违约认定', date: '2024-05-11', status: 'completed', desc: '发行人未能按期兑付2024年5月10日应付利息，构成实质违约' },
    { step: '风险预警', date: '2024-05-11', status: 'completed', desc: '受托管理人发布风险预警公告，通知全体债券持有人' },
    { step: '持有人会议', date: '2024-05-25', status: 'completed', desc: '召开债券持有人会议，审议通过违约处置议案' },
    { step: '追偿方案', date: '2024-06-10', status: 'processing', desc: '正在与发行人协商制定偿债方案，推进资产处置' },
    { step: '司法程序', date: '', status: 'pending', desc: '视协商进展启动司法追偿程序' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="page-card bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-primary-600/20 rounded-full translate-y-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <CalendarClock className="w-8 h-8 text-gold-400" />
            <h1 className="text-2xl font-bold text-white font-serif">存续期管理</h1>
          </div>
          <p className="text-primary-200 text-sm">实时监控债券付息兑付、信息披露义务履行情况，跟踪违约债券处置进展</p>
        </div>
      </div>

      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`stat-card opacity-0 animate-slide-up stagger-${index + 1} border-l-4 ${card.borderColor}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-sm mb-1">{card.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-800">{card.value}</span>
                    <span className="text-slate-500 text-sm">{card.unit}</span>
                  </div>
                  <p className="text-xs mt-2 text-slate-400">{card.desc}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" style={{ color: card.iconColor }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 付息兑付日历 */}
      <div className="page-card opacity-0 animate-slide-up stagger-2">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-600" />
            <h3 className="text-lg font-semibold text-slate-800 font-serif">付息兑付日历</h3>
            <span className="text-sm text-slate-400 ml-2">未来3个月到期事项</span>
          </div>
        </div>
        <div className="p-6">
          {Object.keys(groupedPayments).length === 0 ? (
            <div className="py-12 text-center text-slate-400">未来3个月暂无付息兑付事项</div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedPayments).map(([date, payments]) => (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary-800 text-white flex-shrink-0">
                      <div className="text-center">
                        <div className="text-xs text-primary-200">{new Date(date).getMonth() + 1}月</div>
                        <div className="text-lg font-bold leading-none">{new Date(date).getDate()}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-800">{formatDate(date, 'cn')}</div>
                      <div className="text-xs text-slate-400">共{payments.length}笔事项</div>
                    </div>
                  </div>
                  <div className="ml-[68px] space-y-3">
                    {payments.map((payment) => {
                      const statusConf = paymentStatusConfig[payment.status] || paymentStatusConfig.pending;
                      const StatusIcon = statusConf.icon;
                      const bondName = getBondName(payment.bondId);
                      return (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg ${statusConf.bgClass} flex items-center justify-center flex-shrink-0`}>
                              <StatusIcon className={`w-5 h-5 ${statusConf.textClass}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-800">{bondName}</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  payment.paymentType === 'interest'
                                    ? 'bg-gold-100 text-gold-700'
                                    : payment.paymentType === 'principal'
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'bg-purple-100 text-purple-700'
                                }`}>
                                  {paymentTypeTextMap[payment.paymentType] || payment.paymentType}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  {formatWanAmount(payment.amount)}
                                </span>
                                <span className="text-xs text-slate-400">
                                  {formatDate(payment.payDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusConf.bgClass}`}>
                            <StatusIcon className={`w-4 h-4 ${statusConf.textClass}`} />
                            <span className={`text-xs font-medium ${statusConf.textClass}`}>{statusConf.text}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 信息披露管理 */}
      <div className="page-card opacity-0 animate-slide-up stagger-3">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-slate-800 font-serif">信息披露管理</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">披露标题</th>
                <th className="table-header">债券名称</th>
                <th className="table-header">披露类型</th>
                <th className="table-header">截止日期</th>
                <th className="table-header">披露日期</th>
                <th className="table-header">状态</th>
              </tr>
            </thead>
            <tbody>
              {disclosures.map((disclosure: Disclosure) => {
                const bondName = getBondName(disclosure.bondId);
                const statusConf = disclosureStatusConfig[disclosure.status] || disclosureStatusConfig.pending;
                return (
                  <tr key={disclosure.id} className="hover:bg-slate-50 transition-colors">
                    <td className="table-cell">
                      <span className="font-medium text-slate-800">{disclosure.title}</span>
                    </td>
                    <td className="table-cell text-slate-600">{bondName}</td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        disclosure.disclosureType === 'annual'
                          ? 'bg-primary-100 text-primary-700'
                          : disclosure.disclosureType === 'semi_annual'
                          ? 'bg-blue-100 text-blue-700'
                          : disclosure.disclosureType === 'quarterly'
                          ? 'bg-cyan-100 text-cyan-700'
                          : disclosure.disclosureType === 'temporary'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {disclosureTypeTextMap[disclosure.disclosureType] || disclosure.disclosureType}
                      </span>
                    </td>
                    <td className="table-cell text-slate-600">{formatDate(disclosure.deadlineDate)}</td>
                    <td className="table-cell text-slate-600">
                      {disclosure.disclosureDate ? formatDate(disclosure.disclosureDate) : '-'}
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge border ${statusConf.bgClass}`}>
                        {statusConf.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 违约处置跟踪 */}
      {defaultBond && (
        <div className="page-card opacity-0 animate-slide-up stagger-4 border border-red-200">
          <div className="p-6 border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-risk-high animate-blink" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 font-serif">违约处置跟踪</h3>
                  <p className="text-sm text-slate-500">违约债券：{defaultBond.bondName}（{defaultBond.bondCode}）</p>
                </div>
              </div>
              <span className="status-badge bg-red-100 text-red-700 border border-red-200">
                <AlertTriangle className="w-3 h-3 mr-1" />
                实质违约
              </span>
            </div>
          </div>
          <div className="p-6">
            {/* 违约基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-600 font-medium">违约金额</span>
                </div>
                <div className="text-xl font-bold text-red-700">
                  {defaultPayments.length > 0 ? formatWanAmount(defaultPayments.reduce((sum, p) => sum + p.amount, 0)) : '0万元'}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-600 font-medium">违约日期</span>
                </div>
                <div className="text-xl font-bold text-red-700">
                  {defaultPayments.length > 0 ? formatDate(defaultPayments[0].payDate, 'cn') : '-'}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-600 font-medium">违约事项</span>
                </div>
                <div className="text-base font-bold text-red-700">
                  {defaultPayments.length > 0 ? '利息未能按期兑付' : '-'}
                </div>
                {defaultPayments[0]?.remark && (
                  <div className="text-xs text-red-500 mt-1">{defaultPayments[0].remark}</div>
                )}
              </div>
            </div>

            {/* 处置进展时间线 */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-600" />
                处置进展
              </h4>
              <div className="relative">
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                <div className="space-y-6">
                  {defaultProgress.map((step, index) => {
                    return (
                      <div key={index} className="flex gap-4 relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                          step.status === 'completed'
                            ? 'bg-emerald-500 text-white'
                            : step.status === 'processing'
                            ? 'bg-amber-500 text-white animate-pulse'
                            : 'bg-slate-200 text-slate-400'
                        }`}>
                          {step.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : step.status === 'processing' ? (
                            <Clock className="w-5 h-5" />
                          ) : (
                            <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                          )}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center gap-3">
                            <span className={`text-sm font-semibold ${
                              step.status === 'completed'
                                ? 'text-slate-800'
                                : step.status === 'processing'
                                ? 'text-amber-700'
                                : 'text-slate-400'
                            }`}>
                              {step.step}
                            </span>
                            {step.date && (
                              <span className="text-xs text-slate-400">{formatDate(step.date, 'cn')}</span>
                            )}
                            {step.status === 'processing' && (
                              <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700">进行中</span>
                            )}
                            {step.status === 'pending' && (
                              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500">待处理</span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-1">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Duration;
