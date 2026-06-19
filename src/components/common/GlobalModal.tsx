import { useState } from 'react';
import { X, FileCheck, FileBarChart, FileText, AlertTriangle, Eye, User, Lock, Save } from 'lucide-react';
import { useAppStore } from '@/store';
import type { ModalType } from '@/store';

/**
 * 报告图标映射
 */
const reportIconMap: Record<string, { icon: typeof FileCheck; color: string; bg: string }> = {
  'report-001': { icon: FileCheck, color: 'text-primary-600', bg: 'bg-primary-50' },
  'report-002': { icon: FileBarChart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'report-003': { icon: FileText, color: 'text-gold-600', bg: 'bg-gold-50' },
  'report-004': { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
};

/**
 * 全局Modal弹窗组件
 * 处理报告预览、个人设置、修改密码等弹窗
 */
const GlobalModal = () => {
  const activeModal = useAppStore((state) => state.activeModal);
  const previewReportId = useAppStore((state) => state.previewReportId);
  const closeModal = useAppStore((state) => state.closeModal);
  const showToast = useAppStore((state) => state.showToast);
  const reportTemplates = useAppStore((state) => state.reportTemplates);
  const bonds = useAppStore((state) => state.bonds);
  const complianceChecks = useAppStore((state) => state.complianceChecks);
  const riskAlerts = useAppStore((state) => state.riskAlerts);

  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [profileForm, setProfileForm] = useState({ name: '合规管理员', department: '风险管理部', phone: '138****8888', email: 'compliance@company.com' });
  const [saving, setSaving] = useState(false);

  /** 获取预览的报告 */
  const previewReport = reportTemplates.find((r) => r.id === previewReportId);

  /** 关闭弹窗 */
  if (activeModal === 'none') return null;

  /**
   * 处理保存个人设置
   */
  const handleSaveProfile = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      closeModal();
      showToast('success', '个人设置保存成功');
    }, 800);
  };

  /**
   * 处理修改密码
   */
  const handleChangePassword = () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showToast('warning', '请填写完整密码信息');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('error', '两次输入的新密码不一致');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('warning', '新密码长度至少6位');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      closeModal();
      showToast('success', '密码修改成功，请妥善保管');
    }, 800);
  };

  /**
   * 报告预览内容
   */
  const renderReportPreview = () => {
    if (!previewReport) return null;
    const iconConf = reportIconMap[previewReport.id] || { icon: FileText, color: 'text-primary-600', bg: 'bg-primary-50' };
    const Icon = iconConf.icon;
    const compliantCount = complianceChecks.filter((c) => c.isCompliant).length;
    const highRiskCount = riskAlerts.filter((r) => r.riskLevel === 'high').length;

    return (
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${iconConf.bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${iconConf.color}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{previewReport.title}</h3>
              <p className="text-primary-200 text-sm">报告预览 · 生成日期：{new Date().toLocaleDateString('zh-CN')}</p>
            </div>
          </div>
          <button onClick={closeModal} className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto max-h-[calc(85vh-80px)]">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800 font-serif mb-2">{previewReport.title}</h1>
            <p className="text-slate-500 text-sm">报告期间：2024年第二季度 | 受托管理人：XX证券股份有限公司</p>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-4"></div>
          </div>
          <div className="prose prose-slate max-w-none">
            <h2 className="text-lg font-semibold text-slate-800 border-l-4 border-primary-600 pl-3 mb-4">一、基本情况</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              截至本报告出具日，本机构作为受托管理人共管理在期债券 <span className="font-bold text-primary-700">{bonds.length}</span> 只，
              债券余额合计 <span className="font-bold text-gold-600">{bonds.reduce((sum, b) => sum + b.issueAmount, 0).toFixed(2)}亿元</span>，
              涉及发行人 <span className="font-bold text-primary-700">{new Set(bonds.map(b => b.issuerId)).size}</span> 家。
            </p>

            <h2 className="text-lg font-semibold text-slate-800 border-l-4 border-primary-600 pl-3 mb-4 mt-8">二、合规管理情况</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-emerald-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-emerald-700">{compliantCount}</div>
                <div className="text-xs text-emerald-600 mt-1">合规检查项</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-amber-700">{complianceChecks.length - compliantCount}</div>
                <div className="text-xs text-amber-600 mt-1">不合规项</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-700">{highRiskCount}</div>
                <div className="text-xs text-red-600 mt-1">高风险预警</div>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-slate-800 border-l-4 border-primary-600 pl-3 mb-4 mt-8">三、风险提示</h2>
            {highRiskCount > 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  高风险事项提示
                </div>
                <ul className="text-sm text-red-600 space-y-1 list-disc list-inside">
                  {riskAlerts.filter(r => r.riskLevel === 'high').slice(0, 3).map(alert => (
                    <li key={alert.id}>{alert.title}：{alert.description}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-emerald-600 bg-emerald-50 p-4 rounded-lg">
                报告期内未发现重大风险事项，债券整体风险可控。
              </p>
            )}

            <p className="text-slate-400 text-xs mt-8 text-center">
              — 报告正文结束 —<br />
              XX证券股份有限公司 · 风险管理部<br />
              {new Date().toLocaleDateString('zh-CN')}
            </p>
          </div>
        </div>
        <div className="sticky bottom-0 bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
          <button onClick={closeModal} className="btn-secondary px-6">关闭</button>
          <button
            onClick={() => {
              closeModal();
              showToast('success', `${previewReport.title}下载已开始`);
            }}
            className="btn-primary px-6 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            下载PDF
          </button>
        </div>
      </div>
    );
  };

  /**
   * 个人设置弹窗
   */
  const renderProfileSettings = () => (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
      <div className="sticky top-0 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">个人设置</h3>
        </div>
        <button onClick={closeModal} className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">姓名</label>
          <input
            type="text"
            value={profileForm.name}
            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">所属部门</label>
          <input
            type="text"
            value={profileForm.department}
            onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">联系电话</label>
          <input
            type="text"
            value={profileForm.phone}
            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">邮箱</label>
          <input
            type="email"
            value={profileForm.email}
            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            className="input-field"
          />
        </div>
      </div>
      <div className="sticky bottom-0 bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
        <button onClick={closeModal} className="btn-secondary px-6">取消</button>
        <button onClick={handleSaveProfile} disabled={saving} className="btn-primary px-6 flex items-center gap-2 disabled:opacity-60">
          {saving ? (
            <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>保存中...</>
          ) : (
            <><Save className="w-4 h-4" />保存</>
          )}
        </button>
      </div>
    </div>
  );

  /**
   * 修改密码弹窗
   */
  const renderChangePassword = () => (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
      <div className="sticky top-0 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">修改密码</h3>
        </div>
        <button onClick={closeModal} className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">原密码</label>
          <input
            type="password"
            value={passwordForm.oldPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
            placeholder="请输入当前密码"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">新密码</label>
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            placeholder="请输入新密码（至少6位）"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">确认新密码</label>
          <input
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            placeholder="请再次输入新密码"
            className="input-field"
          />
        </div>
      </div>
      <div className="sticky bottom-0 bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
        <button onClick={closeModal} className="btn-secondary px-6">取消</button>
        <button onClick={handleChangePassword} disabled={saving} className="btn-primary px-6 flex items-center gap-2 disabled:opacity-60">
          {saving ? (
            <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>提交中...</>
          ) : (
            <><Lock className="w-4 h-4" />确认修改</>
          )}
        </button>
      </div>
    </div>
  );

  /** 渲染对应弹窗内容 */
  const renderContent = () => {
    switch (activeModal) {
      case 'previewReport': return renderReportPreview();
      case 'profileSettings': return renderProfileSettings();
      case 'changePassword': return renderChangePassword();
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] p-4 animate-fade-in" onClick={closeModal}>
      <div onClick={(e) => e.stopPropagation()}>{renderContent()}</div>
    </div>
  );
};

export default GlobalModal;
