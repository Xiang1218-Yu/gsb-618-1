import { create } from 'zustand';
import { mockUnderwritingProjects } from '@/data/mockBonds';
import { mockBonds } from '@/data/mockBonds';
import { mockFundUseRecords } from '@/data/mockFunds';
import type { UnderwritingProject } from '@/types/bond';
import type { Bond } from '@/types/bond';
import type { FundUseRecord } from '@/types/fund';

/**
 * 数据Store状态接口
 */
interface DataState {
  /** 承销项目列表 */
  underwritingProjects: UnderwritingProject[];
  /** 债券列表 */
  bonds: Bond[];
  /** 资金使用记录 */
  fundUseRecords: FundUseRecord[];
  /** 新增承销项目 */
  addUnderwritingProject: (project: Omit<UnderwritingProject, 'id'>) => void;
  /** 新增债券 */
  addBond: (bond: Omit<Bond, 'id'>) => void;
  /** 新增资金使用记录 */
  addFundUseRecord: (record: Omit<FundUseRecord, 'id'>) => void;
  /** 删除承销项目 */
  deleteUnderwritingProject: (id: string) => void;
  /** 删除资金使用记录 */
  deleteFundUseRecord: (id: string) => void;
  /** 标记预警已处理 */
  markWarningHandled: (type: string, id: string) => void;
}

/**
 * 生成唯一ID（驼峰命名）
 */
const generateId = (prefix: string): string => {
  return `${prefix}${Date.now().toString(36)}`;
};

/**
 * 动态数据全局状态管理
 * 用于本地新增/删除数据，支持页面操作后的数据持久化
 */
export const useDataStore = create<DataState>((set) => ({
  underwritingProjects: [...mockUnderwritingProjects],
  bonds: [...mockBonds],
  fundUseRecords: [...mockFundUseRecords],

  /**
   * 新增承销项目
   * @param project - 项目数据（不含ID，自动生成）
   */
  addUnderwritingProject: (project) =>
    set((state) => ({
      underwritingProjects: [
        ...state.underwritingProjects,
        { ...project, id: generateId('under') },
      ],
    })),

  /**
   * 新增债券
   * @param bond - 债券数据（不含ID，自动生成）
   */
  addBond: (bond) =>
    set((state) => ({
      bonds: [...state.bonds, { ...bond, id: generateId('bond') }],
    })),

  /**
   * 新增资金使用记录
   * @param record - 记录数据（不含ID，自动生成）
   */
  addFundUseRecord: (record) =>
    set((state) => ({
      fundUseRecords: [
        ...state.fundUseRecords,
        { ...record, id: generateId('fund') },
      ],
    })),

  /**
   * 删除承销项目
   * @param id - 项目ID
   */
  deleteUnderwritingProject: (id) =>
    set((state) => ({
      underwritingProjects: state.underwritingProjects.filter((p) => p.id !== id),
    })),

  /**
   * 删除资金使用记录
   * @param id - 记录ID
   */
  deleteFundUseRecord: (id) =>
    set((state) => ({
      fundUseRecords: state.fundUseRecords.filter((r) => r.id !== id),
    })),

  /**
   * 标记预警已处理（占位方法，用于按钮交互）
   */
  markWarningHandled: () => {
    // 实际项目中会更新数据，这里仅为交互响应
  },
}));
