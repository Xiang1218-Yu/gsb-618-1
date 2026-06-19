// 工具函数集合
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 合并 className 工具
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化金额（亿元）
export function formatAmount(value: number, fractionDigits = 2): string {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

// 状态颜色映射
export const statusColorMap = {
  safe: '#2E8B6B',
  warning: '#C9A96E',
  danger: '#D64545',
} as const;

// 信用评级颜色
export const ratingColorMap: Record<string, string> = {
  AAA: '#2E8B6B',
  'AA+': '#3FA383',
  AA: '#C9A96E',
  'AA-': '#C9A96E',
  'A+': '#D88A5A',
  A: '#D88A5A',
  BBB: '#D64545',
};

// 债券状态翻译
export const bondStatusLabel: Record<string, string> = {
  underwriting: '承销中',
  issuing: '发行中',
  duration: '存续期',
  matured: '已到期',
  defaulted: '已违约',
};

// 承销项目阶段翻译
export const stageLabel: Record<string, string> = {
  initiation: '立项',
  duediligence: '尽调',
  underwriting: '承销中',
  completed: '已完成',
};
