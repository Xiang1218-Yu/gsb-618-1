// 舆情相关类型定义

import type { SentimentType, WarningLevel } from './common';

/**
 * 舆情新闻条目
 */
export interface SentimentNews {
  id: string;
  title: string;
  content: string;
  summary: string;
  source: string;
  author?: string;
  publishDate: string;
  url?: string;
  sentiment: SentimentType;
  sentimentName: string;
  riskLevel: WarningLevel;
  riskLevelName: string;
  relatedBondIds: string[];
  relatedBondNames: string[];
  keywords: string[];
  readCount: number;
  repostCount: number;
  commentCount: number;
  isHandled: boolean;
  handler?: string;
  handleNote?: string;
  impactAnalysis?: string;
}

/**
 * 舆情统计数据
 */
export interface SentimentStats {
  totalCount: number;
  todayCount: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  dangerCount: number;
  warningCount: number;
  trendData: {
    date: string;
    positive: number;
    neutral: number;
    negative: number;
  }[];
}

/**
 * 舆情来源分布
 */
export interface SentimentSourceDist {
  source: string;
  count: number;
}
