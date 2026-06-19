import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Eye, ChevronDown, FileText, Building2 } from 'lucide-react';
import { useAppStore } from '@/store';
import {
  getBondStatusText,
  getBondStatusClass,
  getBondTypeText,
  formatAmount,
  formatRate,
  formatDate,
} from '@/utils/formatters';
import { BondStatus, BondType } from '@/types';

/**
 * 债券项目列表页面
 */
const BondList = () => {
  const bonds = useAppStore((state) => state.bonds);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  /**
   * 过滤债券列表
   */
  const filteredBonds = bonds.filter((bond) => {
    const matchKeyword =
      !searchKeyword ||
      bond.bondName.includes(searchKeyword) ||
      bond.bondCode.includes(searchKeyword) ||
      bond.issuer?.issuerName.includes(searchKeyword);
    const matchStatus = statusFilter === 'all' || bond.status === statusFilter;
    const matchType = typeFilter === 'all' || bond.bondType === typeFilter;
    return matchKeyword && matchStatus && matchType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-serif">债券项目管理</h1>
          <p className="text-slate-500 text-sm mt-1">管理所有在管债券项目，从承销立项到存续期全流程跟踪</p>
        </div>
        <button className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" />
          新增债券项目
        </button>
      </div>

      {/* 搜索和筛选栏 */}
      <div className="page-card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 flex items-center bg-slate-50 rounded-lg px-4 py-2 gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索债券名称、代码或发行人..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="bg-transparent flex-1 outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                筛选
                <ChevronDown className="w-4 h-4" />
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-10 animate-fade-in">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">债券状态</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field"
                      >
                        <option value="all">全部状态</option>
                        {Object.entries(BondStatus).map(([key, value]) => (
                          <option key={key} value={value}>{getBondStatusText(value)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">债券类型</label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="input-field"
                      >
                        <option value="all">全部类型</option>
                        {Object.entries(BondType).map(([key, value]) => (
                          <option key={key} value={value}>{getBondTypeText(value)}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        setStatusFilter('all');
                        setTypeFilter('all');
                        setShowFilterDropdown(false);
                      }}
                      className="w-full btn-secondary text-sm"
                    >
                      重置筛选
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 筛选标签 */}
        {(statusFilter !== 'all' || typeFilter !== 'all') && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                {getBondStatusText(statusFilter)}
                <button onClick={() => setStatusFilter('all')} className="hover:text-primary-900">×</button>
              </span>
            )}
            {typeFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                {getBondTypeText(typeFilter)}
                <button onClick={() => setTypeFilter('all')} className="hover:text-primary-900">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {Object.entries(BondStatus).map(([key, value]) => {
          const count = bonds.filter((b) => b.status === value).length;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === value ? 'all' : value)}
              className={`stat-card p-4 text-center ${statusFilter === value ? 'ring-2 ring-primary-500' : ''}`}
            >
              <p className="text-2xl font-bold text-slate-800">{count}</p>
              <p className="text-xs text-slate-500 mt-1">{getBondStatusText(value)}</p>
            </button>
          );
        })}
      </div>

      {/* 债券列表表格 */}
      <div className="page-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">债券名称</th>
                <th className="table-header">发行人</th>
                <th className="table-header">债券类型</th>
                <th className="table-header">发行规模</th>
                <th className="table-header">票面利率</th>
                <th className="table-header">发行日期</th>
                <th className="table-header">到期日期</th>
                <th className="table-header">状态</th>
                <th className="table-header">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBonds.map((bond) => (
                <tr key={bond.id} className="hover:bg-slate-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-700" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{bond.bondName}</p>
                        <p className="text-xs text-slate-500">{bond.bondCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{bond.issuer?.issuerName}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-slate-600">{getBondTypeText(bond.bondType)}</span>
                  </td>
                  <td className="table-cell">
                    <span className="font-medium text-slate-800">{formatAmount(bond.issueAmount)}</span>
                  </td>
                  <td className="table-cell">
                    <span className="text-gold-600 font-medium">{formatRate(bond.issueRate)}</span>
                  </td>
                  <td className="table-cell text-slate-600">{formatDate(bond.issueDate)}</td>
                  <td className="table-cell text-slate-600">{formatDate(bond.maturityDate)}</td>
                  <td className="table-cell">
                    <span className={`status-badge ${getBondStatusClass(bond.status)}`}>
                      {getBondStatusText(bond.status)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <Link
                      to={`/bonds/${bond.id}`}
                      className="inline-flex items-center gap-1 text-primary-700 hover:text-primary-800 font-medium text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      详情
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBonds.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">暂无符合条件的债券项目</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BondList;
