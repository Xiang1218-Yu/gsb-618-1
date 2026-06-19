// 兑付事件 Mock 数据
import type { CouponEvent } from '@/types';

export const couponEvents: CouponEvent[] = [
  { eventId: 'CE001', bondCode: '102481001', bondName: '24晨曦能源MTN001', eventDate: '2026-06-25', eventType: 'interest', amount: 0.518, status: 'upcoming' },
  { eventId: 'CE002', bondCode: '102581003', bondName: '25铁建基础设施债03', eventDate: '2026-06-28', eventType: 'interest', amount: 0.745, status: 'upcoming' },
  { eventId: 'CE003', bondCode: '102481002', bondName: '24远洋地产PPN002', eventDate: '2026-07-03', eventType: 'interest', amount: 0.527, status: 'upcoming' },
  { eventId: 'CE004', bondCode: '102481006', bondName: '24长河制药MTN006', eventDate: '2026-07-12', eventType: 'interest', amount: 0.416, status: 'upcoming' },
  { eventId: 'CE005', bondCode: '102381007', bondName: '23金穗农业MTN007', eventDate: '2026-06-22', eventType: 'principalAndInterest', amount: 1.6, status: 'upcoming' },
  { eventId: 'CE006', bondCode: '102281008', bondName: '22星辉文旅PPN008', eventDate: '2026-06-10', eventType: 'principalAndInterest', amount: 6.39, status: 'overdue' },
  { eventId: 'CE007', bondCode: '102481001', bondName: '24晨曦能源MTN001', eventDate: '2026-06-05', eventType: 'interest', amount: 0.518, status: 'paid' },
  { eventId: 'CE008', bondCode: '102581004', bondName: '25蓝海科技MTN004', eventDate: '2026-07-20', eventType: 'callable', amount: 12, status: 'upcoming' },
];

export const alertList = [
  { alertId: 'AL001', category: 'sentiment' as const, severity: 'high' as const, title: '星辉文旅触发交叉违约预警', bondCode: '102281008', createdAt: '2026-06-19 09:15' },
  { alertId: 'AL002', category: 'fund' as const, severity: 'medium' as const, title: '远洋地产专户资金流向异常', bondCode: '102481002', createdAt: '2026-06-19 08:42' },
  { alertId: 'AL003', category: 'financial' as const, severity: 'medium' as const, title: '北辰汽车经营性现金流低于阈值', bondCode: '102681005', createdAt: '2026-06-18 22:11' },
  { alertId: 'AL004', category: 'document' as const, severity: 'low' as const, title: '蓝海科技审计报告待审阅', bondCode: '102581004', createdAt: '2026-06-18 17:20' },
  { alertId: 'AL005', category: 'sentiment' as const, severity: 'high' as const, title: '金穗农业子公司被列入失信名单', bondCode: '102381007', createdAt: '2026-06-16 20:35' },
];

export const kpiCards = [
  { label: '在管债券', value: 128, unit: '只', delta: 4.2, trend: 'up' as const, spark: [110, 112, 116, 118, 122, 124, 128] },
  { label: '存续规模', value: 942.6, unit: '亿元', delta: 6.8, trend: 'up' as const, spark: [820, 850, 870, 880, 905, 920, 942] },
  { label: '高风险预警', value: 14, unit: '项', delta: 16.7, trend: 'up' as const, spark: [9, 10, 8, 11, 12, 13, 14] },
  { label: '合规率', value: 96.4, unit: '%', delta: -0.6, trend: 'down' as const, spark: [97.5, 97.2, 97.0, 96.8, 96.6, 96.5, 96.4] },
];
