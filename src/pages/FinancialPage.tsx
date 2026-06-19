// 财务指标监控页：阈值仪表 + 历史趋势 + 阈值规则（含 CRUD）
import { useState, useEffect } from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, ReferenceLine, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, ShieldCheck, Plus, Pencil, Trash2 } from 'lucide-react';
import Panel from '@/components/Panel';
import Modal, { Field, inputClass } from '@/components/Modal';
import { usePlatformStore } from '@/store/usePlatformStore';
import { statusColorMap } from '@/lib/utils';
import type { FinancialMetric } from '@/types';

// 自定义 Tooltip
const ChartTooltip = (props: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  const { active, payload, label } = props;
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="panel px-3 py-2">
      <div className="font-mono text-[10px] text-[var(--color-text-faint)]">{label}</div>
      <div className="font-display text-lg text-gold-light">{payload[0].value}</div>
    </div>
  );
};

// 构造空指标表单
const buildEmptyMetric = (): FinancialMetric => ({
  metricId: `FM${Date.now().toString().slice(-9)}`,
  issuer: '',
  metricName: '',
  unit: '%',
  current: 0,
  threshold: 0,
  trend: 'stable',
  history: [],
  status: 'safe',
});

export default function FinancialPage() {
  const { financials, addFinancial, updateFinancial, removeFinancial } = usePlatformStore();
  const [selectedId, setSelectedId] = useState(financials[0]?.metricId ?? '');
  // CRUD 状态
  const [modalMode, setModalMode] = useState<null | 'create' | 'edit'>(null);
  const [form, setForm] = useState<FinancialMetric>(buildEmptyMetric());
  const [historyInput, setHistoryInput] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const selected = financials.find((m) => m.metricId === selectedId);

  // 列表变化后维护选中态
  useEffect(() => {
    if (!financials.find((m) => m.metricId === selectedId)) {
      setSelectedId(financials[0]?.metricId ?? '');
    }
  }, [financials, selectedId]);

  // 状态汇总
  const summary = {
    safe: financials.filter((m) => m.status === 'safe').length,
    warning: financials.filter((m) => m.status === 'warning').length,
    danger: financials.filter((m) => m.status === 'danger').length,
  };

  // 打开新建
  const handleOpenCreate = () => {
    setForm(buildEmptyMetric());
    setHistoryInput('');
    setModalMode('create');
  };
  // 打开编辑
  const handleOpenEdit = (m: FinancialMetric) => {
    setForm({ ...m });
    setHistoryInput(m.history.map((h) => `${h.period}:${h.value}`).join('，'));
    setModalMode('edit');
  };
  // 解析历史趋势字符串：格式 2024Q1:5.6，2024Q2:5.8
  const parseHistory = (raw: string): { period: string; value: number }[] => {
    return raw
      .split(/[,，;；\s]+/)
      .map((seg) => seg.trim())
      .filter(Boolean)
      .map((seg) => {
        const [period, val] = seg.split(/[:：]/);
        return { period: (period || '').trim(), value: Number(val) || 0 };
      })
      .filter((h) => h.period);
  };
  // 提交表单
  const handleSubmit = () => {
    if (!form.issuer.trim() || !form.metricName.trim()) {
      alert('请填写发行人与指标名称');
      return;
    }
    const finalForm: FinancialMetric = {
      ...form,
      history: parseHistory(historyInput),
    };
    if (modalMode === 'create') {
      addFinancial(finalForm);
      setSelectedId(finalForm.metricId);
    } else if (modalMode === 'edit') {
      updateFinancial(finalForm.metricId, finalForm);
    }
    setModalMode(null);
  };
  // 确认删除
  const handleConfirmDelete = () => {
    if (!deleteId) return;
    removeFinancial(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 p-8">
      {/* 状态汇总 */}
      <section className="grid grid-cols-4 gap-4">
        <div className="panel p-5">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-text-faint)]">监控指标总数</div>
          <div className="mt-2 font-display text-4xl text-gold-light">{financials.length}</div>
          <div className="mt-1 font-mono text-[11px] text-[var(--color-text-faint)]">覆盖 8 家发行人</div>
        </div>
        <div className="panel p-5 border-signal-green/40">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-signal-green">
            <ShieldCheck size={12} /> 安全
          </div>
          <div className="mt-2 font-display text-4xl text-signal-green">{summary.safe}</div>
        </div>
        <div className="panel p-5 border-gold/40">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-gold-light">
            <AlertTriangle size={12} /> 关注
          </div>
          <div className="mt-2 font-display text-4xl text-gold-light">{summary.warning}</div>
        </div>
        <div className="panel p-5 border-signal-red/40">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-signal-red">
            <AlertTriangle size={12} /> 高危
          </div>
          <div className="mt-2 font-display text-4xl text-signal-red">{summary.danger}</div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6">
        {/* 指标列表 */}
        <Panel
          index="01"
          title="发行人财务指标"
          subtitle="Issuer Financial Metrics"
          className="col-span-5"
          action={
            <button type="button" className="btn-gold flex items-center gap-1" onClick={handleOpenCreate}>
              <Plus size={12} /> 新增指标
            </button>
          }
        >
          <div className="space-y-2 max-h-[480px] overflow-auto pr-1">
            {financials.map((m) => {
              const isActive = m.metricId === selectedId;
              const TrendIcon = m.trend === 'up' ? TrendingUp : m.trend === 'down' ? TrendingDown : Minus;
              return (
                <div
                  key={m.metricId}
                  onClick={() => setSelectedId(m.metricId)}
                  className={`group cursor-pointer border p-3 transition-all ${
                    isActive ? 'border-gold-light bg-[rgba(201,169,110,0.06)]' : 'border-line hover:border-gold/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px]">{m.issuer}</div>
                      <div className="font-mono text-[10px] text-[var(--color-text-faint)]">{m.metricName}</div>
                    </div>
                    <div className="ml-3 flex items-center gap-3">
                      <TrendIcon size={14} style={{ color: statusColorMap[m.status] }} />
                      <div className="text-right">
                        <div className="font-display text-xl" style={{ color: statusColorMap[m.status] }}>
                          {m.current}{m.unit}
                        </div>
                        <div className="font-mono text-[10px] text-[var(--color-text-faint)]">阈值 {m.threshold}{m.unit}</div>
                      </div>
                      <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={(ev) => { ev.stopPropagation(); handleOpenEdit(m); }}
                          className="p-1 border border-line/70 hover:border-gold-light hover:text-gold-light text-[var(--color-text-muted)]"
                          title="编辑"
                        >
                          <Pencil size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={(ev) => { ev.stopPropagation(); setDeleteId(m.metricId); }}
                          className="p-1 border border-line/70 hover:border-signal-red hover:text-signal-red text-[var(--color-text-muted)]"
                          title="删除"
                        >
                          <Trash2 size={10} />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {financials.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-[var(--color-text-faint)]">
                <AlertTriangle size={24} className="mb-2 opacity-40" />
                <div className="text-[12px]">暂无财务指标</div>
              </div>
            )}
          </div>
        </Panel>

        {/* 详情趋势图 */}
        <Panel
          index="02"
          title={selected?.issuer ?? '指标详情'}
          subtitle={selected ? `${selected.metricName} · Trend` : 'Metric Trend'}
          className="col-span-7"
          action={
            selected ? (
              <div className="flex items-center gap-2">
                <span className={`tag ${
                  selected.status === 'safe' ? 'text-signal-green' :
                  selected.status === 'warning' ? 'text-gold-light' : 'text-signal-red'
                }`}>
                  <AlertTriangle size={10} />
                  {selected.status === 'safe' ? '安全' : selected.status === 'warning' ? '关注' : '高危'}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(selected)}
                  className="px-2 py-1 border border-line hover:border-gold-light hover:text-gold-light text-[10px] font-mono uppercase tracking-[0.15em] flex items-center gap-1"
                >
                  <Pencil size={10} /> 编辑
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(selected.metricId)}
                  className="px-2 py-1 border border-line hover:border-signal-red hover:text-signal-red text-[10px] font-mono uppercase tracking-[0.15em] flex items-center gap-1"
                >
                  <Trash2 size={10} /> 删除
                </button>
              </div>
            ) : null
          }
        >
          {selected ? (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="border border-line p-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">当前值</div>
                  <div className="mt-1 font-display text-3xl" style={{ color: statusColorMap[selected.status] }}>
                    {selected.current}{selected.unit}
                  </div>
                </div>
                <div className="border border-line p-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">阈值</div>
                  <div className="mt-1 font-display text-3xl text-gold-light">{selected.threshold}{selected.unit}</div>
                </div>
                <div className="border border-line p-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">偏离</div>
                  <div className="mt-1 font-display text-3xl" style={{ color: statusColorMap[selected.status] }}>
                    {selected.current > selected.threshold ? '+' : ''}
                    {(selected.current - selected.threshold).toFixed(2)}{selected.unit}
                  </div>
                </div>
              </div>

              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selected.history} margin={{ top: 10, right: 30, bottom: 10, left: 10 }}>
                    <XAxis dataKey="period" tick={{ fill: '#8AA1B8', fontSize: 11, fontFamily: 'JetBrains Mono' }} stroke="#1F3B55" />
                    <YAxis tick={{ fill: '#8AA1B8', fontSize: 11, fontFamily: 'JetBrains Mono' }} stroke="#1F3B55" />
                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#C9A96E', strokeDasharray: '4 4' }} />
                    <ReferenceLine
                      y={selected.threshold}
                      stroke="#D64545"
                      strokeDasharray="4 4"
                      label={{ value: '阈值', fill: '#D64545', fontSize: 10, position: 'right' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#C9A96E"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#C9A96E', stroke: '#0B1B2B', strokeWidth: 2 }}
                      activeDot={{ r: 5, fill: '#E2C18B' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* 阈值规则配置 */}
              <div className="mt-4 border-t border-line/60 pt-4">
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-faint)] mb-3">
                  ALERT RULES · 阈值规则
                </div>
                <div className="grid grid-cols-3 gap-3 text-[12px]">
                  <div className="flex justify-between border border-line/60 px-3 py-2">
                    <span className="text-[var(--color-text-muted)]">触发动作</span>
                    <span>派单至合规专员</span>
                  </div>
                  <div className="flex justify-between border border-line/60 px-3 py-2">
                    <span className="text-[var(--color-text-muted)]">通知渠道</span>
                    <span>站内 + 短信</span>
                  </div>
                  <div className="flex justify-between border border-line/60 px-3 py-2">
                    <span className="text-[var(--color-text-muted)]">监控频率</span>
                    <span>每季度财报</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-[var(--color-text-faint)]">
              <AlertTriangle size={28} className="mb-3 opacity-40" />
              <div className="text-[13px]">暂无指标，点击右上角「新增指标」开始监控</div>
              <button
                type="button"
                onClick={handleOpenCreate}
                className="mt-4 btn-gold flex items-center gap-1"
              >
                <Plus size={12} /> 新增指标
              </button>
            </div>
          )}
        </Panel>
      </div>

      {/* 创建/编辑 Modal */}
      <Modal
        open={modalMode !== null}
        onClose={() => setModalMode(null)}
        title={modalMode === 'create' ? '新增财务指标' : '编辑财务指标'}
        subtitle={modalMode === 'create' ? 'Create Financial Metric' : 'Edit Financial Metric'}
        width={720}
        footer={
          <>
            <button
              type="button"
              onClick={() => setModalMode(null)}
              className="px-4 py-2 border border-line text-[12px] text-[var(--color-text-muted)] hover:border-gold-light hover:text-gold-light"
            >
              取消
            </button>
            <button type="button" onClick={handleSubmit} className="btn-gold">
              {modalMode === 'create' ? '提交新增' : '保存修改'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="发行人">
            <input
              className={inputClass}
              value={form.issuer}
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
              placeholder="如 长江电力"
            />
          </Field>
          <Field label="指标名称">
            <input
              className={inputClass}
              value={form.metricName}
              onChange={(e) => setForm({ ...form, metricName: e.target.value })}
              placeholder="如 资产负债率"
            />
          </Field>
          <Field label="单位">
            <input
              className={inputClass}
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              placeholder="如 % / 亿元"
            />
          </Field>
          <Field label="当前值">
            <input
              type="number"
              step="0.01"
              className={inputClass}
              value={form.current}
              onChange={(e) => setForm({ ...form, current: Number(e.target.value) })}
            />
          </Field>
          <Field label="阈值">
            <input
              type="number"
              step="0.01"
              className={inputClass}
              value={form.threshold}
              onChange={(e) => setForm({ ...form, threshold: Number(e.target.value) })}
            />
          </Field>
          <Field label="趋势">
            <select
              className={inputClass}
              value={form.trend}
              onChange={(e) => setForm({ ...form, trend: e.target.value as 'up' | 'down' | 'stable' })}
            >
              <option value="up">上升</option>
              <option value="down">下降</option>
              <option value="stable">平稳</option>
            </select>
          </Field>
          <Field label="状态">
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'safe' | 'warning' | 'danger' })}
            >
              <option value="safe">安全</option>
              <option value="warning">关注</option>
              <option value="danger">高危</option>
            </select>
          </Field>
          <Field label="历史趋势（格式：周期:值，逗号分隔）" span={2}>
            <textarea
              className={`${inputClass} min-h-[70px] resize-none`}
              value={historyInput}
              onChange={(e) => setHistoryInput(e.target.value)}
              placeholder="例：2024Q1:55.2，2024Q2:56.1，2024Q3:57.3"
            />
          </Field>
        </div>
      </Modal>

      {/* 删除确认 Modal */}
      <Modal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="确认删除指标"
        subtitle="Confirm Delete"
        width={420}
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 border border-line text-[12px] text-[var(--color-text-muted)] hover:border-gold-light hover:text-gold-light"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4 py-2 border border-signal-red text-[12px] text-signal-red hover:bg-signal-red/10"
            >
              确认删除
            </button>
          </>
        }
      >
        <div className="text-[13px] text-[var(--color-text-muted)]">
          删除后无法恢复，确定要删除该财务指标吗？
        </div>
      </Modal>
    </div>
  );
}
