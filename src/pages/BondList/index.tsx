import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Plus, Eye, ChevronDown, FileText, Building2, X, Check } from 'lucide-react';
import { useAppStore } from '@/store';
import type { BondFormData } from '@/store';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const bonds = useAppStore((state) => state.bonds);
  const issuers = useAppStore((state) => state.issuers);
  const addBond = useAppStore((state) => state.addBond);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  /** 新增债券表单初始值 */
  const initialFormData: BondFormData = {
    bondName: '',
    bondCode: '',
    issuerId: '',
    bondType: BondType.Corporate,
    issueAmount: 10,
    issueRate: 3.5,
    issueDate: new Date().toISOString().split('T')[0],
    maturityDate: '',
    termYears: 3,
    trustee: '',
  };
  const [formData, setFormData] = useState<BondFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  /** 从URL参数读取搜索关键词 */
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchKeyword(urlSearch);
    }
  }, [searchParams]);

  /**
   * 过滤债券列表
   */
  const filteredBonds = bonds.filter((bond) => {
    const matchKeyword =
      !searchKeyword ||
      bond.bondName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      bond.bondCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      bond.issuer?.issuerName.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchStatus = statusFilter === 'all' || bond.status === statusFilter;
    const matchType = typeFilter === 'all' || bond.bondType === typeFilter;
    return matchKeyword && matchStatus && matchType;
  });

  /**
   * 验证表单
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.bondName.trim()) errors.bondName = '请输入债券名称';
    if (!formData.bondCode.trim()) errors.bondCode = '请输入债券代码';
    if (!formData.issuerId) errors.issuerId = '请选择发行人';
    if (!formData.issueAmount || formData.issueAmount <= 0) errors.issueAmount = '请输入有效的发行规模';
    if (!formData.issueRate || formData.issueRate <= 0) errors.issueRate = '请输入有效的票面利率';
    if (!formData.issueDate) errors.issueDate = '请选择发行日期';
    if (!formData.maturityDate) errors.maturityDate = '请选择到期日期';
    if (formData.issueDate && formData.maturityDate && formData.issueDate >= formData.maturityDate) {
      errors.maturityDate = '到期日期必须晚于发行日期';
    }
    if (!formData.termYears || formData.termYears <= 0) errors.termYears = '请输入有效的债券期限';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * 提交新增债券
   */
  const handleSubmitAdd = () => {
    if (!validateForm()) return;
    addBond(formData);
    setFormData(initialFormData);
    setShowAddModal(false);
    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 3000);
  };

  /**
   * 关闭弹窗重置表单
   */
  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData(initialFormData);
    setFormErrors({});
  };

  /**
   * 根据发行日期和期限自动计算到期日期
   */
  useEffect(() => {
    if (formData.issueDate && formData.termYears) {
      const issueDate = new Date(formData.issueDate);
      issueDate.setFullYear(issueDate.getFullYear() + formData.termYears);
      setFormData((prev) => ({
        ...prev,
        maturityDate: issueDate.toISOString().split('T')[0],
      }));
    }
  }, [formData.issueDate, formData.termYears]);

  return (
    <div className="p-6 space-y-6">
      {/* 添加成功提示 */}
      {addSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in-right">
          <Check className="w-5 h-5" />
          <span>债券项目创建成功！</span>
        </div>
      )}

      {/* 页面头部 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-serif">债券项目管理</h1>
          <p className="text-slate-500 text-sm mt-1">管理所有在管债券项目，从承销立项到存续期全流程跟踪</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 w-fit"
        >
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
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                if (searchParams.get('search')) {
                  setSearchParams({});
                }
              }}
              className="bg-transparent flex-1 outline-none text-slate-700 placeholder:text-slate-400"
            />
            {searchKeyword && (
              <button
                onClick={() => {
                  setSearchKeyword('');
                  setSearchParams({});
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
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
        {(statusFilter !== 'all' || typeFilter !== 'all' || searchKeyword) && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 flex-wrap">
            {searchKeyword && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                搜索: {searchKeyword}
                <button onClick={() => { setSearchKeyword(''); setSearchParams({}); }} className="hover:text-primary-900">×</button>
              </span>
            )}
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

      {/* 新增债券弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">新增债券项目</h3>
                <p className="text-primary-100 text-sm mt-0.5">录入新债券基础信息，创建承销立项</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 债券名称 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    债券名称 <span className="text-risk-high">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bondName}
                    onChange={(e) => setFormData({ ...formData, bondName: e.target.value })}
                    placeholder="如：24华信03"
                    className={`input-field ${formErrors.bondName ? 'border-risk-high focus:border-risk-high' : ''}`}
                  />
                  {formErrors.bondName && <p className="text-xs text-risk-high mt-1">{formErrors.bondName}</p>}
                </div>
                {/* 债券代码 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    债券代码 <span className="text-risk-high">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bondCode}
                    onChange={(e) => setFormData({ ...formData, bondCode: e.target.value })}
                    placeholder="如：112348"
                    className={`input-field ${formErrors.bondCode ? 'border-risk-high focus:border-risk-high' : ''}`}
                  />
                  {formErrors.bondCode && <p className="text-xs text-risk-high mt-1">{formErrors.bondCode}</p>}
                </div>
                {/* 发行人 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    发行人 <span className="text-risk-high">*</span>
                  </label>
                  <select
                    value={formData.issuerId}
                    onChange={(e) => setFormData({ ...formData, issuerId: e.target.value })}
                    className={`input-field ${formErrors.issuerId ? 'border-risk-high focus:border-risk-high' : ''}`}
                  >
                    <option value="">请选择发行人</option>
                    {issuers.map((issuer) => (
                      <option key={issuer.id} value={issuer.id}>{issuer.issuerName}</option>
                    ))}
                  </select>
                  {formErrors.issuerId && <p className="text-xs text-risk-high mt-1">{formErrors.issuerId}</p>}
                </div>
                {/* 债券类型 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    债券类型 <span className="text-risk-high">*</span>
                  </label>
                  <select
                    value={formData.bondType}
                    onChange={(e) => setFormData({ ...formData, bondType: e.target.value as BondType })}
                    className="input-field"
                  >
                    {Object.entries(BondType).map(([key, value]) => (
                      <option key={key} value={value}>{getBondTypeText(value)}</option>
                    ))}
                  </select>
                </div>
                {/* 发行规模 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    发行规模（亿元） <span className="text-risk-high">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.issueAmount}
                    onChange={(e) => setFormData({ ...formData, issueAmount: parseFloat(e.target.value) || 0 })}
                    className={`input-field ${formErrors.issueAmount ? 'border-risk-high focus:border-risk-high' : ''}`}
                  />
                  {formErrors.issueAmount && <p className="text-xs text-risk-high mt-1">{formErrors.issueAmount}</p>}
                </div>
                {/* 票面利率 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    票面利率（%） <span className="text-risk-high">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.issueRate}
                    onChange={(e) => setFormData({ ...formData, issueRate: parseFloat(e.target.value) || 0 })}
                    className={`input-field ${formErrors.issueRate ? 'border-risk-high focus:border-risk-high' : ''}`}
                  />
                  {formErrors.issueRate && <p className="text-xs text-risk-high mt-1">{formErrors.issueRate}</p>}
                </div>
                {/* 发行日期 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    发行日期 <span className="text-risk-high">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className={`input-field ${formErrors.issueDate ? 'border-risk-high focus:border-risk-high' : ''}`}
                  />
                  {formErrors.issueDate && <p className="text-xs text-risk-high mt-1">{formErrors.issueDate}</p>}
                </div>
                {/* 债券期限 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    债券期限（年） <span className="text-risk-high">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={formData.termYears}
                    onChange={(e) => setFormData({ ...formData, termYears: parseFloat(e.target.value) || 0 })}
                    className={`input-field ${formErrors.termYears ? 'border-risk-high focus:border-risk-high' : ''}`}
                  />
                  {formErrors.termYears && <p className="text-xs text-risk-high mt-1">{formErrors.termYears}</p>}
                </div>
                {/* 到期日期 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    到期日期 <span className="text-risk-high">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.maturityDate}
                    onChange={(e) => setFormData({ ...formData, maturityDate: e.target.value })}
                    className={`input-field ${formErrors.maturityDate ? 'border-risk-high focus:border-risk-high' : ''}`}
                  />
                  {formErrors.maturityDate && <p className="text-xs text-risk-high mt-1">{formErrors.maturityDate}</p>}
                  <p className="text-xs text-slate-400 mt-1">根据发行日期和期限自动计算，可手动修改</p>
                </div>
                {/* 受托管理人 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">受托管理人</label>
                  <input
                    type="text"
                    value={formData.trustee}
                    onChange={(e) => setFormData({ ...formData, trustee: e.target.value })}
                    placeholder="如：中国工商银行"
                    className="input-field"
                  />
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                onClick={handleCloseModal}
                className="btn-secondary px-6"
              >
                取消
              </button>
              <button
                onClick={handleSubmitAdd}
                className="btn-primary px-6 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                创建债券项目
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BondList;
