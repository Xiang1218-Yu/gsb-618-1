// 财务指标监控页：阈值仪表 + 历史趋势 + 阈值规则
import { useState } from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, ReferenceLine, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, ShieldCheck } from 'lucide-react';
import Panel from '@/components/Panel';
import { usePlatformStore } from '@/store/usePlatformStore';
import { statusColorMap } from '@/lib/utils';

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

export default function FinancialPage() {
  const { financials } = usePlatformStore();
  const [selectedId, setSelectedId] = useState(financials[0].metricId);
  const selected = financials.find((m) => m.metricId === selectedId)!;

  // 状态汇总
  const summary = {
    safe: financials.filter((m) => m.status === 'safe').length,
    warning: financials.filter((m) => m.status === 'warning').length,
    danger: financials.filter((m) => m.status === 'danger').length,
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
        <Panel index="01" title="发行人财务指标" subtitle="Issuer Financial Metrics" className="col-span-5">
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* 详情趋势图 */}
        <Panel
          index="02"
          title={selected.issuer}
          subtitle={`${selected.metricName} · Trend`}
          className="col-span-7"
          action={
            <span className={`tag ${
              selected.status === 'safe' ? 'text-signal-green' :
              selected.status === 'warning' ? 'text-gold-light' : 'text-signal-red'
            }`}>
              <AlertTriangle size={10} />
              {selected.status === 'safe' ? '安全' : selected.status === 'warning' ? '关注' : '高危'}
            </span>
          }
        >
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
        </Panel>
      </div>
    </div>
  );
}
