// 舆情监测页：实时舆情瀑布流 + 事件详情
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Smile, Meh, Frown, ExternalLink, Clock, Link2, AlertCircle } from 'lucide-react';
import Panel from '@/components/Panel';
import { usePlatformStore } from '@/store/usePlatformStore';

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

export default function SentimentPage() {
  const { sentiments } = usePlatformStore();
  const [selectedId, setSelectedId] = useState(sentiments[0].eventId);
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const selected = sentiments.find((s) => s.eventId === selectedId)!;

  const filtered = filterSentiment === 'all' ? sentiments : sentiments.filter((s) => s.sentiment === filterSentiment);

  // 情感统计
  const sentimentStats = {
    positive: sentiments.filter((s) => s.sentiment === 'positive').length,
    neutral: sentiments.filter((s) => s.sentiment === 'neutral').length,
    negative: sentiments.filter((s) => s.sentiment === 'negative').length,
  };
  const total = sentiments.length;

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
            <div className="flex gap-1">
              {(['all', 'positive', 'neutral', 'negative'] as const).map((f) => (
                <button
                  key={f}
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
          action={<button className="btn-gold !px-3 !py-1 !text-[10px]">创建处置工单</button>}
        >
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
        </Panel>
      </div>
    </div>
  );
}
