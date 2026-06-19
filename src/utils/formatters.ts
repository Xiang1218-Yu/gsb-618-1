// 格式化工具函数

/**
 * 格式化金额（万元/亿元）
 */
export const formatAmount = (amount: number, unit: 'wan' | 'yi' = 'yi'): string => {
  if (unit === 'yi') {
    return `${amount.toFixed(2)}亿`;
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(2)}亿`;
  }
  return `${amount.toFixed(2)}万`;
};

/**
 * 格式化百分比
 */
export const formatPercent = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * 格式化日期
 */
export const formatDate = (dateStr: string, format: 'short' | 'long' = 'short'): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  if (format === 'long') {
    return `${year}年${month}月${day}日`;
  }
  return `${year}-${month}-${day}`;
};

/**
 * 格式化日期时间
 */
export const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * 获取预警等级对应的颜色类名
 */
export const getWarningLevelColor = (level: string): { bg: string; text: string; border: string } => {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    normal: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    attention: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    danger: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };
  return colorMap[level] || colorMap.normal;
};

/**
 * 获取预警等级中文名称
 */
export const getWarningLevelName = (level: string): string => {
  const nameMap: Record<string, string> = {
    normal: '正常',
    attention: '关注',
    warning: '预警',
    danger: '危险',
  };
  return nameMap[level] || '未知';
};

/**
 * 获取债券状态中文名称
 */
export const getBondStatusName = (status: string): string => {
  const nameMap: Record<string, string> = {
    underwriting: '承销中',
    issuing: '发行中',
    duration: '存续期',
    matured: '已到期',
    defaulted: '违约',
  };
  return nameMap[status] || '未知';
};

/**
 * 获取债券状态颜色
 */
export const getBondStatusColor = (status: string): { bg: string; text: string } => {
  const colorMap: Record<string, { bg: string; text: string }> = {
    underwriting: { bg: 'bg-blue-100', text: 'text-blue-800' },
    issuing: { bg: 'bg-purple-100', text: 'text-purple-800' },
    duration: { bg: 'bg-green-100', text: 'text-green-800' },
    matured: { bg: 'bg-gray-100', text: 'text-gray-800' },
    defaulted: { bg: 'bg-red-100', text: 'text-red-800' },
  };
  return colorMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
};

/**
 * 获取情感倾向中文名称
 */
export const getSentimentName = (sentiment: string): string => {
  const nameMap: Record<string, string> = {
    positive: '正面',
    neutral: '中性',
    negative: '负面',
  };
  return nameMap[sentiment] || '未知';
};

/**
 * 获取情感倾向颜色
 */
export const getSentimentColor = (sentiment: string): { bg: string; text: string } => {
  const colorMap: Record<string, { bg: string; text: string }> = {
    positive: { bg: 'bg-green-100', text: 'text-green-700' },
    neutral: { bg: 'bg-gray-100', text: 'text-gray-700' },
    negative: { bg: 'bg-red-100', text: 'text-red-700' },
  };
  return colorMap[sentiment] || { bg: 'bg-gray-100', text: 'text-gray-700' };
};

/**
 * 计算剩余天数
 */
export const calculateRemainingDays = (targetDate: string): number => {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * 数字千分位格式化
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};
