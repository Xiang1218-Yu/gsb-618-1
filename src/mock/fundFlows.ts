// 募集资金流向 Mock 数据
import type { FundFlowLink, FundAccount } from '@/types';

// 资金账户
export const fundAccounts: FundAccount[] = [
  { accountId: 'ACC001', accountName: '24晨曦能源募集资金专户', bankName: '中国工商银行', balance: 3.6, raisedAmount: 30, usedAmount: 26.4 },
  { accountId: 'ACC002', accountName: '25铁建基础设施债专户', bankName: '中国建设银行', balance: 11.2, raisedAmount: 50, usedAmount: 38.8 },
  { accountId: 'ACC003', accountName: '24长河制药募集资金专户', bankName: '招商银行', balance: 5.8, raisedAmount: 22, usedAmount: 16.2 },
  { accountId: 'ACC004', accountName: '24远洋地产PPN专户', bankName: '中国银行', balance: 0.8, raisedAmount: 18, usedAmount: 17.2 },
];

// 资金流向（用于 Sankey 图）
export const fundFlowLinks: FundFlowLink[] = [
  { source: '募集资金专户', target: '主营业务投入', amount: 18, isCompliant: true, category: '主业经营' },
  { source: '募集资金专户', target: '债务置换', amount: 8, isCompliant: true, category: '偿还债务' },
  { source: '募集资金专户', target: '研发投入', amount: 4, isCompliant: true, category: '研发创新' },
  { source: '募集资金专户', target: '补充流动资金', amount: 6, isCompliant: true, category: '流动资金' },
  { source: '募集资金专户', target: '关联方拆借', amount: 1.6, isCompliant: false, category: '关联交易' },
  { source: '主营业务投入', target: '采购原材料', amount: 12, isCompliant: true, category: '主业经营' },
  { source: '主营业务投入', target: '设备升级', amount: 6, isCompliant: true, category: '主业经营' },
  { source: '债务置换', target: '银行贷款偿还', amount: 5, isCompliant: true, category: '偿还债务' },
  { source: '债务置换', target: '存量债券回购', amount: 3, isCompliant: true, category: '偿还债务' },
  { source: '研发投入', target: '新产品研发', amount: 2.8, isCompliant: true, category: '研发创新' },
  { source: '研发投入', target: '专利申请', amount: 1.2, isCompliant: true, category: '研发创新' },
];
