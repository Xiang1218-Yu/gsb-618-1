/**
 * 格式化金额显示（亿元）
 * @param amount 金额数值（亿元）
 * @returns 格式化后的金额字符串
 */
export const formatAmount = (amount: number): string => {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(2)}万亿`;
  }
  if (amount >= 100) {
    return `${amount.toFixed(0)}亿`;
  }
  return `${amount.toFixed(2)}亿`;
};

/**
 * 格式化万元金额显示
 * @param amount 金额（万元）
 * @returns 格式化后的金额字符串
 */
export const formatWanAmount = (amount: number): string => {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(2)}亿元`;
  }
  return `${amount.toLocaleString()}万元`;
};

/**
 * 格式化百分比
 * @param value 数值
 * @param decimals 小数位数
 * @returns 格式化后的百分比字符串
 */
export const formatPercent = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * 格式化利率
 * @param rate 利率（%）
 * @returns 格式化后的利率字符串
 */
export const formatRate = (rate: number): string => {
  return `${rate.toFixed(2)}%`;
};

/**
 * 格式化日期显示
 * @param dateStr 日期字符串
 * @param format 格式类型：'short' | 'long' | 'cn'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (dateStr: string, format: 'short' | 'long' | 'cn' = 'short'): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  switch (format) {
    case 'long':
      return `${year}-${month}-${day}`;
    case 'cn':
      return `${year}年${month}月${day}日`;
    default:
      return `${year}-${month}-${day}`;
  }
};

/**
 * 计算两个日期之间的天数差
 * @param date1 日期1
 * @param date2 日期2
 * @returns 天数差
 */
export const daysBetween = (date1: string, date2: string): number => {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  return Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
};

/**
 * 获取债券状态文本
 * @param status 债券状态枚举值
 * @returns 中文状态文本
 */
export const getBondStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    underwriting: '承销立项',
    approving: '发行审批中',
    issuing: '发行中',
    listed: '已上市',
    duration: '存续期',
    redeemed: '已兑付',
    default: '违约',
  };
  return statusMap[status] || status;
};

/**
 * 获取债券类型文本
 * @param type 债券类型枚举值
 * @returns 中文类型文本
 */
export const getBondTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    corporate: '公司债',
    enterprise: '企业债',
    mtn: '中期票据',
    cp: '短期融资券',
    ppn: '定向工具PPN',
    financial: '金融债',
  };
  return typeMap[type] || type;
};

/**
 * 获取风险等级颜色类名
 * @param level 风险等级
 * @returns Tailwind CSS类名
 */
export const getRiskLevelClass = (level: string): string => {
  const classMap: Record<string, string> = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-orange-100 text-orange-700 border-orange-200',
    low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    normal: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };
  return classMap[level] || 'bg-slate-100 text-slate-700 border-slate-200';
};

/**
 * 获取风险等级文本
 * @param level 风险等级枚举值
 * @returns 中文风险等级文本
 */
export const getRiskLevelText = (level: string): string => {
  const textMap: Record<string, string> = {
    high: '高风险',
    medium: '中风险',
    low: '低风险',
    normal: '正常',
  };
  return textMap[level] || level;
};

/**
 * 获取舆情情感倾向颜色类名
 * @param sentiment 情感类型
 * @returns Tailwind CSS类名
 */
export const getSentimentClass = (sentiment: string): string => {
  const classMap: Record<string, string> = {
    positive: 'bg-emerald-100 text-emerald-700',
    neutral: 'bg-slate-100 text-slate-600',
    negative: 'bg-red-100 text-red-700',
  };
  return classMap[sentiment] || 'bg-slate-100 text-slate-600';
};

/**
 * 获取舆情情感文本
 * @param sentiment 情感类型
 * @returns 中文文本
 */
export const getSentimentText = (sentiment: string): string => {
  const textMap: Record<string, string> = {
    positive: '正面',
    neutral: '中性',
    negative: '负面',
  };
  return textMap[sentiment] || sentiment;
};

/**
 * 获取资金用途类型文本
 * @param type 用途类型
 * @returns 中文文本
 */
export const getFundUsageTypeText = (type: string): string => {
  const textMap: Record<string, string> = {
    repay_loan: '偿还银行贷款',
    working_capital: '补充流动资金',
    project_invest: '项目投资',
    m_and_a: '并购重组',
    other: '其他用途',
  };
  return textMap[type] || type;
};

/**
 * 获取债券状态对应的颜色类名
 * @param status 债券状态
 * @returns Tailwind CSS类名
 */
export const getBondStatusClass = (status: string): string => {
  const classMap: Record<string, string> = {
    underwriting: 'bg-blue-100 text-blue-700',
    approving: 'bg-amber-100 text-amber-700',
    issuing: 'bg-purple-100 text-purple-700',
    listed: 'bg-cyan-100 text-cyan-700',
    duration: 'bg-emerald-100 text-emerald-700',
    redeemed: 'bg-slate-100 text-slate-600',
    default: 'bg-red-100 text-red-700 animate-blink',
  };
  return classMap[status] || 'bg-slate-100 text-slate-600';
};
