// 存续期管理页：债券台账（含 CRUD）+ 兑付日历
import { useState, useMemo, useEffect } from 'react';
import { CalendarClock, Coins, Gift, Repeat, Pencil, Trash2, Plus } from 'lucide-react';
import Panel from '@/components/Panel';
import Modal, { Field, inputClass } from '@/components/Modal';
import { usePlatformStore } from '@/store/usePlatformStore';
import { bondStatusLabel, ratingColorMap, statusColorMap } from '@/lib/utils';
import type { BondInfo, BondStatus, CouponEventType, CreditRating } from '@/types';

// 兑付事件类型映射
const eventTypeMap: Record<CouponEventType, { label: string; color: string; icon: typeof Coins }> = {
  interest: { label: '付息', color: '#4A8FB8', icon: Coins },
  principal: { label: '兑本', color: '#C9A96E', icon: Gift },
  principalAndInterest: { label: '本息', color: '#D64545', icon: Gift },
  callable: { label: '回售', color: '#2E8B6B', icon: Repeat },
};

// 信用评级与状态选项
const ratingOptions: CreditRating[] = ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'BBB'];
const statusOptions: BondStatus[] = ['underwriting', 'issuing', 'duration', 'matured', 'defaulted'];

// 构造空债券表单
const buildEmptyBond = (): BondInfo => {
  const today = new Date().toISOString().slice(0, 10);
  return {
    bondCode: `1026${Date.now().toString().slice(-5)}`,
    bondName: '',
    issuer: '',
    industry: '其他',
    region: '华东',
    issueScale: 10,
    couponRate: 3.5,
    creditRating: 'AA',
    issueDate: today,
    maturityDate: today,
    status: 'duration',
    remainingDays: 365,
    riskScore: 30,
  };
};

export default function DurationPage() {
  const { bonds, coupons, addBond, updateBond, removeBond } = usePlatformStore();
  const [filterRating, setFilterRating] = useState<string>('全部');
  // CRUD 弹窗状态
  const [modalMode, setModalMode] = useState<null | 'create' | 'edit'>(null);
  const [form, setForm] = useState<BondInfo>(buildEmptyBond());
  const [deleteCode, setDeleteCode] = useState<string | null>(null);

  const allRatings = ['全部', 'AAA', 'AA+', 'AA', 'AA-', 'BBB'];
  const filteredBonds = bonds.filter((b) =>
    filterRating === '全部' ? true : b.creditRating === filterRating,
  );

  // 简化日历：使用 2026 年 6/7 月份生成两个月格子
  const calendarMonths = useMemo(() => {
    return [
      { year: 2026, month: 6, label: '2026 · 06' },
      { year: 2026, month: 7, label: '2026 · 07' },
    ].map(({ year, month, label }) => {
      const days: (number | null)[] = [];
      const firstDay = new Date(year, month - 1, 1).getDay();
      const dayCount = new Date(year, month, 0).getDate();
      for (let i = 0; i < firstDay; i++) days.push(null);
      for (let d = 1; d <= dayCount; d++) days.push(d);
      return { year, month, label, days };
    });
  }, []);

  // 按日期获取事件
  const getEventsByDate = (year: number, month: number, day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return coupons.filter((e) => e.eventDate === dateStr);
  };

  // 当债券列表变化（如删除）后清理可能失效的删除目标
  useEffect(() => {
    if (deleteCode && !bonds.find((b) => b.bondCode === deleteCode)) {
      setDeleteCode(null);
    }
  }, [bonds, deleteCode]);

  // 打开新建弹窗
  const handleOpenCreate = () => {
    setForm(buildEmptyBond());
    setModalMode('create');
  };

  // 打开编辑弹窗
  const handleOpenEdit = (bond: BondInfo) => {
    setForm({ ...bond });
    setModalMode('edit');
  };

  // 提交表单
  const handleSubmit = () => {
    if (!form.bondName.trim() || !form.issuer.trim()) {
      alert('请填写债券简称与发行人');
      return;
    }
    if (modalMode === 'create') addBond(form);
    else if (modalMode === 'edit') updateBond(form.bondCode, form);
    setModalMode(null);
  };

  // 确认删除
  const handleConfirmDelete = () => {
    if (!deleteCode) return;
    removeBond(deleteCode);
    setDeleteCode(null);
  };

  return (
    <div className="space-y-6 p-8">
      {/* 债券台账 */}
      <Panel
        index="01"
        title="存续期债券台账"
        subtitle="Bond Ledger"
        action={
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {allRatings.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFilterRating(r)}
                  className={`px-2 py-1 font-mono text-[11px] border transition ${
                    filterRating === r
                      ? 'border-gold-light text-gold-light bg-[rgba(201,169,110,0.08)]'
                      : 'border-line text-[var(--color-text-muted)] hover:border-gold/50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button type="button" className="btn-gold flex items-center gap-1" onClick={handleOpenCreate}>
              <Plus size={12} /> 录入债券
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-faint)]">
                <th className="pb-3 font-normal">代码</th>
                <th className="pb-3 font-normal">债券简称 / 发行人</th>
                <th className="pb-3 font-normal">行业 / 区域</th>
                <th className="pb-3 font-normal text-right">规模(亿)</th>
                <th className="pb-3 font-normal text-right">票面利率</th>
                <th className="pb-3 font-normal text-center">评级</th>
                <th className="pb-3 font-normal text-right">剩余天数</th>
                <th className="pb-3 font-normal text-right">风险分</th>
                <th className="pb-3 font-normal text-right">状态</th>
                <th className="pb-3 font-normal text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredBonds.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-[var(--color-text-muted)]">
                    暂无符合条件的债券
                  </td>
                </tr>
              )}
              {filteredBonds.map((b) => {
                const riskColor = b.riskScore > 70 ? statusColorMap.danger : b.riskScore > 40 ? statusColorMap.warning : statusColorMap.safe;
                return (
                  <tr key={b.bondCode} className="group border-t border-line/50 hover:bg-white/[0.02] transition">
                    <td className="py-3 font-mono text-[var(--color-text-muted)]">{b.bondCode}</td>
                    <td className="py-3">
                      <div>{b.bondName}</div>
                      <div className="font-mono text-[10px] text-[var(--color-text-faint)] truncate max-w-[260px]">{b.issuer}</div>
                    </td>
                    <td className="py-3 text-[var(--color-text-muted)]">{b.industry} · {b.region}</td>
                    <td className="py-3 text-right font-mono">{b.issueScale.toFixed(1)}</td>
                    <td className="py-3 text-right font-mono">{b.couponRate.toFixed(2)}%</td>
                    <td className="py-3 text-center">
                      <span className="tag" style={{ color: ratingColorMap[b.creditRating] }}>
                        {b.creditRating}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono">
                      {b.remainingDays > 0 ? b.remainingDays : <span className="text-signal-red">已逾期</span>}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-mono" style={{ color: riskColor }}>{b.riskScore}</span>
                        <div className="w-12 h-1 bg-line/70">
                          <div className="h-full" style={{ width: `${b.riskScore}%`, background: riskColor }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`tag ${
                        b.status === 'duration' ? 'text-signal-green' :
                        b.status === 'defaulted' ? 'text-signal-red' :
                        b.status === 'issuing' ? 'text-gold-light' : 'text-[var(--color-text-muted)]'
                      }`}>
                        {bondStatusLabel[b.status]}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(b)}
                          className="border border-line/60 p-1 text-[var(--color-text-muted)] hover:border-gold-light hover:text-gold-light transition"
                          title="编辑"
                        >
                          <Pencil size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteCode(b.bondCode)}
                          className="border border-line/60 p-1 text-[var(--color-text-muted)] hover:border-signal-red hover:text-signal-red transition"
                          title="删除"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* 兑付日历 */}
      <Panel
        index="02"
        title="兑付与付息日历"
        subtitle="Coupon Calendar"
        action={
          <div className="flex gap-3 font-mono text-[10px]">
            {Object.entries(eventTypeMap).map(([key, v]) => (
              <span key={key} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: v.color }} />
                <span className="text-[var(--color-text-muted)]">{v.label}</span>
              </span>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-6">
          {calendarMonths.map(({ year, month, label, days }) => (
            <div key={label}>
              <div className="mb-3 flex items-center justify-between">
                <div className="font-display text-2xl text-gold-light flex items-center gap-2">
                  <CalendarClock size={18} />
                  {label}
                </div>
                <div className="font-mono text-[10px] text-[var(--color-text-faint)]">
                  {coupons.filter((e) => e.eventDate.startsWith(`${year}-${String(month).padStart(2, '0')}`)).length} 项事件
                </div>
              </div>
              {/* 周标题 */}
              <div className="grid grid-cols-7 gap-1 mb-1 font-mono text-[10px] tracking-[0.15em] text-[var(--color-text-faint)]">
                {['日', '一', '二', '三', '四', '五', '六'].map((w) => (
                  <div key={w} className="text-center">{w}</div>
                ))}
              </div>
              {/* 日历格子 */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((d, i) => {
                  if (d === null) return <div key={i} className="aspect-square" />;
                  const events = getEventsByDate(year, month, d);
                  const hasOverdue = events.some((e) => e.status === 'overdue');
                  const hasUpcoming = events.some((e) => e.status === 'upcoming');
                  return (
                    <div
                      key={i}
                      className={`relative aspect-square border border-line/60 p-1 transition hover:border-gold-light ${
                        events.length > 0 ? 'bg-[rgba(201,169,110,0.04)]' : ''
                      }`}
                    >
                      <div className={`text-[11px] font-mono ${hasOverdue ? 'text-signal-red' : 'text-[var(--color-text-muted)]'}`}>
                        {d}
                      </div>
                      {events.length > 0 && (
                        <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-0.5">
                          {events.slice(0, 3).map((e) => (
                            <span
                              key={e.eventId}
                              title={`${e.bondName} · ${eventTypeMap[e.eventType].label} · ${e.amount}亿`}
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ background: eventTypeMap[e.eventType].color }}
                            />
                          ))}
                        </div>
                      )}
                      {hasUpcoming && !hasOverdue && (
                        <span className="absolute top-1 right-1 h-1 w-1 rounded-full bg-gold-light shimmer" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 临近事件 */}
        <div className="mt-6">
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-faint)] mb-3">
            UPCOMING · 临近事件
          </div>
          <div className="space-y-2">
            {coupons
              .filter((e) => e.status !== 'paid')
              .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
              .slice(0, 5)
              .map((e) => {
                const v = eventTypeMap[e.eventType];
                const Icon = v.icon;
                return (
                  <div key={e.eventId} className="flex items-center gap-3 border-l-2 px-3 py-2 transition hover:bg-white/[0.02]" style={{ borderColor: v.color }}>
                    <Icon size={14} style={{ color: v.color }} strokeWidth={1.5} />
                    <span className="font-mono text-[var(--color-text-faint)] text-[11px] w-24">{e.eventDate}</span>
                    <span className="flex-1">{e.bondName}</span>
                    <span className="tag" style={{ color: v.color }}>{v.label}</span>
                    <span className="font-mono text-gold-light w-20 text-right">{e.amount.toFixed(2)} 亿</span>
                    <span className={`font-mono text-[10px] w-16 text-right ${
                      e.status === 'overdue' ? 'text-signal-red' : 'text-[var(--color-text-muted)]'
                    }`}>
                      {e.status === 'overdue' ? '已逾期' : '待执行'}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </Panel>

      {/* 债券新建/编辑弹窗 */}
      <Modal
        open={modalMode !== null}
        onClose={() => setModalMode(null)}
        title={modalMode === 'create' ? '录入存续债券' : '编辑债券信息'}
        subtitle={modalMode === 'create' ? 'Add Bond' : 'Edit Bond'}
        width={680}
        footer={
          <>
            <button type="button" className="btn-gold !border-line/70 !text-[var(--color-text-muted)]" onClick={() => setModalMode(null)}>
              取消
            </button>
            <button type="button" className="btn-gold" onClick={handleSubmit}>
              {modalMode === 'create' ? '创建' : '保存修改'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="债券代码">
            <input className={inputClass} value={form.bondCode} onChange={(e) => setForm({ ...form, bondCode: e.target.value })} disabled={modalMode === 'edit'} />
          </Field>
          <Field label="债券简称">
            <input className={inputClass} value={form.bondName} onChange={(e) => setForm({ ...form, bondName: e.target.value })} placeholder="如 26北辰汽车SCP005" />
          </Field>
          <Field label="发行人" span={2}>
            <input className={inputClass} value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="完整发行人名称" />
          </Field>
          <Field label="行业">
            <input className={inputClass} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
          </Field>
          <Field label="区域">
            <input className={inputClass} value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
          </Field>
          <Field label="发行规模 (亿元)">
            <input
              className={inputClass}
              type="number"
              step="0.1"
              value={form.issueScale}
              onChange={(e) => setForm({ ...form, issueScale: Number(e.target.value) })}
            />
          </Field>
          <Field label="票面利率 (%)">
            <input
              className={inputClass}
              type="number"
              step="0.01"
              value={form.couponRate}
              onChange={(e) => setForm({ ...form, couponRate: Number(e.target.value) })}
            />
          </Field>
          <Field label="信用评级">
            <select className={inputClass} value={form.creditRating} onChange={(e) => setForm({ ...form, creditRating: e.target.value as CreditRating })}>
              {ratingOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </Field>
          <Field label="状态">
            <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BondStatus })}>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{bondStatusLabel[s]}</option>
              ))}
            </select>
          </Field>
          <Field label="发行日期">
            <input className={inputClass} type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} />
          </Field>
          <Field label="到期日期">
            <input className={inputClass} type="date" value={form.maturityDate} onChange={(e) => setForm({ ...form, maturityDate: e.target.value })} />
          </Field>
          <Field label="剩余天数">
            <input
              className={inputClass}
              type="number"
              value={form.remainingDays}
              onChange={(e) => setForm({ ...form, remainingDays: Number(e.target.value) })}
            />
          </Field>
          <Field label="风险分 (0-100)">
            <input
              className={inputClass}
              type="number"
              min={0}
              max={100}
              value={form.riskScore}
              onChange={(e) => setForm({ ...form, riskScore: Number(e.target.value) })}
            />
          </Field>
        </div>
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal
        open={deleteCode !== null}
        onClose={() => setDeleteCode(null)}
        title="确认删除债券"
        subtitle="Confirm Deletion"
        width={420}
        footer={
          <>
            <button type="button" className="btn-gold !border-line/70 !text-[var(--color-text-muted)]" onClick={() => setDeleteCode(null)}>
              取消
            </button>
            <button type="button" className="btn-gold !border-signal-red/70 !text-signal-red" onClick={handleConfirmDelete}>
              确认删除
            </button>
          </>
        }
      >
        <p className="text-[13px] text-[var(--color-text-muted)]">
          确认从台账中移除债券 <span className="text-gold-light">{deleteCode}</span> 吗？
        </p>
      </Modal>
    </div>
  );
}
