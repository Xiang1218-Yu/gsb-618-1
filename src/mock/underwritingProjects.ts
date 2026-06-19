// 承销项目 Mock 数据
import type { UnderwritingProject } from '@/types';

export const underwritingProjects: UnderwritingProject[] = [
  {
    projectId: 'UW2026001',
    projectName: '北辰汽车2026年第一期超短期融资券',
    bondCode: '102681005',
    leadUnderwriter: '招商证券',
    syndicateMembers: ['中信证券', '国泰君安', '海通证券'],
    stage: 'underwriting',
    progress: 65,
    startDate: '2025-11-08',
    expectedIssueDate: '2026-02-01',
    complianceScore: 92,
    documents: [
      { documentId: 'D-001', documentName: '募集说明书 v2.3', uploadDate: '2025-12-01', reviewer: '风控部-王晨', status: 'approved' },
      { documentId: 'D-002', documentName: '法律意见书', uploadDate: '2025-12-10', reviewer: '法律部-李婧', status: 'approved' },
      { documentId: 'D-003', documentName: '审计报告', uploadDate: '2025-12-15', reviewer: '风控部-王晨', status: 'pending' },
      { documentId: 'D-004', documentName: '信用评级报告', uploadDate: '2025-12-18', reviewer: '风控部-周亮', status: 'approved' },
    ],
  },
  {
    projectId: 'UW2025014',
    projectName: '蓝海科技2025年第二期中期票据',
    bondCode: '102581004',
    leadUnderwriter: '中信建投',
    syndicateMembers: ['国泰君安', '光大证券'],
    stage: 'duediligence',
    progress: 42,
    startDate: '2025-09-22',
    expectedIssueDate: '2026-04-15',
    complianceScore: 88,
    documents: [
      { documentId: 'D-101', documentName: '尽调底稿汇编', uploadDate: '2025-11-12', reviewer: '风控部-赵敏', status: 'pending' },
      { documentId: 'D-102', documentName: '财务核查报告', uploadDate: '2025-11-25', reviewer: '风控部-王晨', status: 'pending' },
    ],
  },
  {
    projectId: 'UW2025021',
    projectName: '中铁建基础设施债03期',
    bondCode: '102581003',
    leadUnderwriter: '中信证券',
    syndicateMembers: ['中金公司', '国信证券', '广发证券'],
    stage: 'completed',
    progress: 100,
    startDate: '2024-08-15',
    expectedIssueDate: '2025-01-08',
    complianceScore: 96,
    documents: [
      { documentId: 'D-201', documentName: '发行批复', uploadDate: '2024-12-28', reviewer: '合规部-陈宇', status: 'approved' },
    ],
  },
  {
    projectId: 'UW2026003',
    projectName: '南海港务2026年小公募',
    bondCode: '-',
    leadUnderwriter: '海通证券',
    syndicateMembers: ['平安证券'],
    stage: 'initiation',
    progress: 12,
    startDate: '2025-12-15',
    expectedIssueDate: '2026-08-01',
    complianceScore: 75,
    documents: [
      { documentId: 'D-301', documentName: '立项申请书', uploadDate: '2025-12-15', reviewer: '投行部-林峰', status: 'pending' },
    ],
  },
];
