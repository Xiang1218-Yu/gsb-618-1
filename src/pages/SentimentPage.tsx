// 舆情监测页：实时舆情瀑布流 + 事件详情（含 CRUD）
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Smile, Meh, Frown, ExternalLink, Clock, Link2, AlertCircle, Plus, Pencil, Trash2 } from 'lucide-react';
import Panel from '@/components/Panel';
import Modal, { Field, inputClass } from '@/components/Modal';
import { usePlatformStore } from '@/store/usePlatformStore';
import type { SentimentEvent, SentimentType } from '@/types';

// 情感映射
const sentimentMap = {
  positive: { icon: Smile, color: '#2E8B6B', label: '正面' },
  neutral: { icon: Meh, color: '#C9A96E', label: '中性' },
  negative: { icon: Frown, color: '#D64545', label: '负面' },
} as const;

const impactMap = {
  high: { color: 'text-signal-red', label: '高' },
  medium: { color: 'text-gold-light', label: '中' },
  low: { color: 'text-signal-blue', label: '低' },
} as const;

// 构造空舆情事件表单
const buildEmptySentiment = (): SentimentEvent => ({
  eventId: `SE${Date.now().toString().slice(-9)}`,
  bondCode: '',
  bondName: '',
  title: '',
  summary: '',
  source: '',
  sentiment: 'neutral',
  sentimentScore: 0,
  impactLevel: 'medium',
  publishTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
  tags: [],
});

export default function SentimentPage() {
  const { sentiments, addSentiment, updateSentiment, removeSentiment } = usePlatformStore();
  const [selectedId, setSelectedId] = useState(sentiments[0]?.eventId ?? '');
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  // CRUD 状态
  const [modalMode, setModalMode] = useState<null | 'create' | 'edit'>(null);
  const [form, setForm] = useState<SentimentEvent>(buildEmptySentiment());
  const [tagsInput, setTagsInput] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const selected = sentiments.find((s) => s.eventId === selectedId);
  const filtered = filterSentiment === 'all' ? sentiments : sentiments.filter((s) => s.sentiment === filterSentiment);

  // 列表变化后自动维护选中态
  useEffect(() => {
    if (!sentiments.find((s) => s.eventId === selectedId)) {
      setSelectedId(sentiments[0]?.eventId ?? '');
    }
  }, [sentiments, selectedId]);

  // 情感统计
  const sentimentStats = {
    positive: sentiments.filter((s) => s.sentiment === 'positive').length,
    neutral: sentiments.filter((s) => s.sentiment === 'neutral').length,
    negative: sentiments.filter((s) => s.sentiment === 'negative').length,
  };
  const total = sentiments.length || 1;

  // 打开新建
  const handleOpenCreate = () => {
    setForm(buildEmptySentiment());
    setTagsInput('');
    setModalMode('create');
  };
  // 打开编辑
  const handleOpenEdit = (e: SentimentEvent) => {
    setForm({ ...e });
    setTagsInput(e.tags.join('、'));
    setModalMode('edit');
  };
  // 提交表单
  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert('请填写舆情标题');
      return;
    }
    const finalForm: SentimentEvent = {
      ...form,
      tags: tagsInput.split(/[,，、\s]+/).map((t) => t.trim()).filter(Boolean),
    };
    if (modalMode === 'create') {
      addSentiment(finalForm);
      setSelectedId(finalForm.eventId);
    } else if (modalMode === 'edit') {
      updateSentiment(finalForm.eventId, finalForm);
    }
    setModalMode(null);
  };
  // 确认删除
  const handleConfirmDelete = () => {
    if (!deleteId) return;
    removeSentiment(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 p-8">
      {/* 情感分布统计条 */}
      <div className="panel p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-gold-light" />
            <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-text-faint)]">
              SENTIMENT DISTRIBUTION · 情感分布
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-signal-red">
            <span className="h-1.5 w-1.5 animate-pulse bg-signal-red" />
            实时 · 24h 内 {total} 条
          </div>
        </div>
        <div className="flex h-3">
          <div className="flex-none bg-signal-green" style={{ width: `${(sentimentStats.positive / total) * 100}%` }} />
          <div className="flex-none bg-gold" style={{ width: `${(sentimentStats.neutral / total) * 100}%` }} />
          <div className="flex-none bg-signal-red" style={{ width: `${(sentimentStats.negative / total) * 100}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
          <span className="text-signal-green">正面 · {sentimentStats.positive}</span>
          <span className="text-gold-light">中性 · {sentimentStats.neutral}</span>
          <span className="text-signal-red">负面 · {sentimentStats.negative}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 舆情瀑布流 */}
        <Panel
          index="01"
          title="实时舆情流"
          subtitle="Live Sentiment Feed"
          className="col-span-7"
          action={
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {(['all', 'positive', 'neutral', 'negative'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilterSentiment(f)}
                    className={`px-2 py-1 font-mono text-[10px] uppercase border transition tracking-[0.15em] ${
                      filterSentiment === f
                        ? 'border-gold-light text-gold-light bg-[rgba(201,169,110,0.08)]'
                        : 'border-line text-[var(--color-text-muted)] hover:border-gold/50'
                    }`}
                  >
                    {f === 'all' ? '全部' : sentimentMap[f].label}
                  </button>
                ))}
              </div>
              <button type="button" className="btn-gold flex items-center gap-1" onClick={handleOpenCreate}>
                <Plus size={12} /> 录入
              </button>
            </div>
          }
        >
          <div className="space-y-3 max-h-[600px] overflow-auto pr-1">
            {filtered.map((s, idx) => {
              const sm = sentimentMap[s.sentiment];
              const Icon = sm.icon;
              const isActive = s.eventId === selectedId;
              return (
                <motion.div
                  key={s.eventId}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedId(s.eventId)}
                  className={`group cursor-pointer border-l-4 bg-[rgba(15,35,53,0.6)] p-4 transition-all ${
                    isActive ? 'bg-[rgba(201,169,110,0.06)] shadow-[0_0_0_1px_rgba(201,169,110,0.4)]' : 'hover:bg-[rgba(15,35,53,0.9)]'
                  }`}
                  style={{ borderLeftColor: sm.color }}
                >
                  <div className="flex items-start gap-3">
                    <Icon size={16} style={{ color: sm.color }} strokeWidth={1.5} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] text-[var(--color-text-faint)]">{s.bondCode}</span>
                        <span className="font-mono text-[10px] text-gold/70">{s.bondName}</span>
                        <span className={`tag ${impactMap[s.impactLevel].color}`}>
                          影响 {impactMap[s.impactLevel].label}
                        </span>
                        <span className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            type="button"
                            onClick={(ev) => { ev.stopPropagation(); handleOpenEdit(s); }}
                            className="p-1 border border-line/70 hover:border-gold-light hover:text-gold-light text-[var(--color-text-muted)]"
                            title="编辑"
                          >
                            <Pencil size={10} />
                          </button>
                          <button
                            type="button"
                            onClick={(ev) => { ev.stopPropagation(); setDeleteId(s.eventId); }}
                            className="p-1 border border-line/70 hover:border-signal-red hover:text-signal-red text-[var(--color-text-muted)]"
                            title="删除"
                          >
                            <Trash2 size={10} />
                          </button>
                        </span>
                      </div>
                      <div className="text-[14px] leading-snug">{s.title}</div>
                      <div className="mt-1 text-[12px] text-[var(--color-text-muted)] line-clamp-2">{s.summary}</div>
                      <div className="mt-2 flex items-center gap-3 font-mono text-[10px] text-[var(--color-text-faint)]">
                        <span className="flex items-center gap-1"><Clock size={10} />{s.publishTime}</span>
                        <span className="flex items-center gap-1"><Link2 size={10} />{s.source}</span>
                        <span style={{ color: sm.color }}>分值 {s.sentimentScore.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Panel>

        {/* 事件详情 */}
        <Panel
          index="02"
          title="事件详情"
          subtitle="Event Detail"
          className="col-span-5"
          action={
            selected ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(selected)}
                  className="px-2 py-1 border border-line hover:border-gold-light hover:text-gold-light text-[10px] font-mono uppercase tracking-[0.15em] flex items-center gap-1"
                >
                  <Pencil size={10} /> 编辑
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(selected.eventId)}
                  className="px-2 py-1 border border-line hover:border-signal-red hover:text-signal-red text-[10px] font-mono uppercase tracking-[0.15em] flex items-center gap-1"
                >
                  <Trash2 size={10} /> 删除
                </button>
              </div>
            ) : null
          }
        >
          {selected ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`tag ${impactMap[selected.impactLevel].color}`}>
                    <AlertCircle size={10} />
                    影响 {impactMap[selected.impactLevel].label}
                  </span>
                  <span className="tag" style={{ color: sentimentMap[selected.sentiment].color }}>
                    {sentimentMap[selected.sentiment].label}
                  </span>
                </div>
                <div className="font-display text-2xl text-[var(--color-text)] leading-tight">{selected.title}</div>
              </div>

              <div className="border border-line/60 bg-[rgba(15,35,53,0.5)] p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-2">
                  摘要
                </div>
                <div className="text-[13px] leading-relaxed text-[var(--color-text-muted)]">{selected.summary}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div className="border border-line/60 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">关联债券</div>
                  <div className="mt-1 text-gold-light">{selected.bondName}</div>
                  <div className="font-mono text-[10px] text-[var(--color-text-faint)]">{selected.bondCode}</div>
                </div>
                <div className="border border-line/60 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">情感分</div>
                  <div className="mt-1 font-display text-2xl" style={{ color: sentimentMap[selected.sentiment].color }}>
                    {selected.sentimentScore.toFixed(2)}
                  </div>
                </div>
                <div className="border border-line/60 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">来源</div>
                  <div className="mt-1 flex items-center gap-1.5"><ExternalLink size={12} className="text-gold-light" />{selected.source}</div>
                </div>
                <div className="border border-line/60 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">发布时间</div>
                  <div className="mt-1 font-mono">{selected.publishTime}</div>
                </div>
              </div>

              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-2">
                  标签
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((t) => (
                    <span key={t} className="tag text-gold-light">#{t}</span>
                  ))}
                </div>
              </div>

              {/* 处置进度 */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-2">
                  处置进度
                </div>
                <div className="space-y-1.5">
                  {[
                    { name: '舆情捕获', done: true },
                    { name: '影响评估', done: selected.impactLevel === 'high' },
                    { name: '派单合规', done: selected.sentiment === 'negative' },
                    { name: '处置完成', done: false },
                  ].map((step) => (
                    <div key={step.name} className="flex items-center gap-3 text-[12px]">
                      <span className={`h-2 w-2 ${step.done ? 'bg-signal-green' : 'bg-line'}`} />
                      <span className={step.done ? 'text-[var(--color-text)]' : 'text-[var(--color-text-faint)]'}>{step.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--color-text-faint)]">
                <AlertCircle size={28} className="mb-3 opacity-40" />
                <div className="text-[13px]">暂无舆情事件</div>
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="mt-4 btn-gold flex items-center gap-1"
                >
                  <Plus size={12} /> 录入第一条
                </button>
            </div>
          )}
        </Panel>
      </div>

      {/* 创建/编辑 Modal */}
      <Modal
        open={modalMode !== null}
        onClose={() => setModalMode(null)}
        title={modalMode === 'create' ? '录入舆情事件' : '编辑舆情事件'}
        subtitle={modalMode === 'create' ? 'Create Sentiment Event' : 'Edit Sentiment Event'}
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
              {modalMode === 'create' ? '提交录入' : '保存修改'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="关联债券代码">
            <input
              className={inputClass}
              value={form.bondCode}
              onChange={(e) => setForm({ ...form, bondCode: e.target.value })}
              placeholder="如 240301.IB"
            />
          </Field>
          <Field label="关联债券简称">
            <input
              className={inputClass}
              value={form.bondName}
              onChange={(e) => setForm({ ...form, bondName: e.target.value })}
              placeholder="如 24长江电力MTN001"
            />
          </Field>
          <Field label="标题" span={2}>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="舆情事件标题"
            />
          </Field>
          <Field label="摘要" span={2}>
            <textarea
              className={`${inputClass} min-h-[80px] resize-none`}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="事件摘要"
            />
          </Field>
          <Field label="来源">
            <input
              className={inputClass}
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              placeholder="如 Wind 资讯"
            />
          </Field>
          <Field label="发布时间">
            <input
              className={inputClass}
              value={form.publishTime}
              onChange={(e) => setForm({ ...form, publishTime: e.target.value })}
              placeholder="YYYY-MM-DD HH:mm"
            />
          </Field>
          <Field label="情感">
            <select
              className={inputClass}
              value={form.sentiment}
              onChange={(e) => setForm({ ...form, sentiment: e.target.value as SentimentType })}
            >
              <option value="positive">正面</option>
              <option value="neutral">中性</option>
              <option value="negative">负面</option>
            </select>
          </Field>
          <Field label="影响等级">
            <select
              className={inputClass}
              value={form.impactLevel}
              onChange={(e) => setForm({ ...form, impactLevel: e.target.value as 'high' | 'medium' | 'low' })}
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </Field>
          <Field label="情感分（-1 ~ 1）">
            <input
              type="number"
              step="0.01"
              min={-1}
              max={1}
              className={inputClass}
              value={form.sentimentScore}
              onChange={(e) => setForm({ ...form, sentimentScore: Number(e.target.value) })}
            />
          </Field>
          <Field label="标签（逗号/顿号分隔）">
            <input
              className={inputClass}
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="如 业绩、利好"
            />
          </Field>
        </div>
      </Modal>

      {/* 删除确认 Modal */}
      <Modal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="确认删除舆情"
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
          删除后无法恢复，确定要删除该舆情事件吗？
        </div>
      </Modal>
    </div>
  );
}
