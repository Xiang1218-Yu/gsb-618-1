// 簿记建档 Mock 数据
import type { BookbuildingRecord } from '@/types';

export const bookbuildingRecords: BookbuildingRecord[] = [
  { investorId: 'INV001', investorName: '工商银行金融市场部', investorType: '银行', subscribePrice: 99.85, subscribeAmount: 5.0, allotment: 4.2 },
  { investorId: 'INV002', investorName: '中国人寿保险', investorType: '保险', subscribePrice: 99.92, subscribeAmount: 3.8, allotment: 3.5 },
  { investorId: 'INV003', investorName: '易方达基金固收部', investorType: '基金', subscribePrice: 100.05, subscribeAmount: 2.5, allotment: 2.5 },
  { investorId: 'INV004', investorName: '广发证券资管', investorType: '券商', subscribePrice: 99.78, subscribeAmount: 1.8, allotment: 1.0 },
  { investorId: 'INV005', investorName: '建设银行同业部', investorType: '银行', subscribePrice: 99.95, subscribeAmount: 4.0, allotment: 3.8 },
  { investorId: 'INV006', investorName: '太平洋保险资管', investorType: '保险', subscribePrice: 100.10, subscribeAmount: 2.0, allotment: 2.0 },
  { investorId: 'INV007', investorName: '南方基金', investorType: '基金', subscribePrice: 99.88, subscribeAmount: 1.5, allotment: 1.2 },
  { investorId: 'INV008', investorName: '中信资管', investorType: '券商', subscribePrice: 99.70, subscribeAmount: 0.8, allotment: 0.0 },
  { investorId: 'INV009', investorName: '招商银行私行', investorType: '银行', subscribePrice: 100.00, subscribeAmount: 3.2, allotment: 3.0 },
  { investorId: 'INV010', investorName: '泰康资产', investorType: '保险', subscribePrice: 99.98, subscribeAmount: 2.8, allotment: 2.6 },
];
