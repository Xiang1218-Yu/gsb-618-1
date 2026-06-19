// 驾驶舱首页：核心 KPI、风险热力图、待办告警流、合规健康度仪表
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, ChevronRight, Wallet, Radio, FileWarning, LineChart as LineIcon } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, RadialBar, RadialBarChart, PolarAngleAxis } from 'recharts';
import Panel from '@/components/Panel';
import { usePlatformStore } from '@/store/usePlatformStore';
import { formatAmount, statusColorMap } from '@/lib/utils';

// 不同告警类别的图标映射
const alertIconMap = {
  fund: Wallet,
  financial: LineIcon,
  sentiment: Radio,
  document: FileWarning,
} as const;

export default function DashboardPage() {
  const { kpis, alerts, bonds, financials } = usePlatformStore();

  // 计算合规健康度（基于债券风险分加权平均）
  const complianceHealth = Math.round(
    100 - bonds.reduce((acc, b) => acc + b.riskScore, 0) / bonds.length,
  );

  // 行业风险分布（用于热力图）
  const industryRiskMap = bonds.reduce<Record<string, { total: number; count: number }>>((acc, b) => {
    if (!acc[b.industry]) acc[b.industry] = { total: 0, count: 0 };
    acc[b.industry].total += b.riskScore;
    acc[b.industry].count += 1;
    return acc;
  }, {});
  const industryRisks = Object.entries(industryRiskMap)
    .map(([industry, { total, count }]) => ({ industry, avg: Math.round(total / count) }))
    .sort((a, b) => b.avg - a.avg);

  return (
    <div className="space-y-6 p-8">
      {/* KPI 卡片组 */}
      <section className="grid grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.5, ease: 'easeOut' }}
            className="panel panel-glow p-5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-text-faint)]">
                {String(idx + 1).padStart(2, '0')} · {kpi.label}
              </span>
              <span
                className={`flex items-center gap-1 font-mono text-[11px] ${
                  kpi.delta >= 0 ? 'text-signal-green' : 'text-signal-red'
                }`}
              >
                {kpi.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {kpi.delta > 0 ? '+' : ''}
                {kpi.delta}%
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-4xl text-gold-light animate-ticker">
                {formatAmount(kpi.value, kpi.value < 100 ? 1 : 0)}
              </span>
              <span className="font-mono text-xs text-[var(--color-text-muted)]">{kpi.unit}</span>
            </div>
            <div className="mt-3 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpi.spark.map((v, i) => ({ idx: i, v }))}>
                  <defs>
                    <linearGradient id={`spark-${idx}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C9A96E" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#C9A96E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#C9A96E" strokeWidth={1.5} fill={`url(#spark-${idx})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </section>

      {/* 主区域：合规健康度 + 行业风险热力图 + 待办告警 */}
      <div className="grid grid-cols-12 gap-6">
        {/* 合规健康度仪表 */}
        <Panel index="01" title="合规健康度" subtitle="Compliance Health" className="col-span-3">
          <div className="relative h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                data={[{ name: 'health', value: complianceHealth, fill: '#C9A96E' }]}
                startAngle={210}
                endAngle={-30}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background={{ fill: 'rgba(31,59,85,0.5)' }} dataKey="value" cornerRadius={0} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-5xl text-gold-light">{complianceHealth}</span>
              <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--color-text-faint)]">/ 100</span>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="font-mono text-[10px] text-[var(--color-text-faint)]">SAFE</div>
              <div className="font-display text-xl text-signal-green">
                {bonds.filter((b) => b.riskScore < 40).length}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-[var(--color-text-faint)]">WATCH</div>
              <div className="font-display text-xl text-gold-light">
                {bonds.filter((b) => b.riskScore >= 40 && b.riskScore < 70).length}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-[var(--color-text-faint)]">RISK</div>
              <div className="font-display text-xl text-signal-red">
                {bonds.filter((b) => b.riskScore >= 70).length}
              </div>
            </div>
          </div>
        </Panel>

        {/* 行业风险热力图 */}
        <Panel index="02" title="行业风险热力" subtitle="Industry Risk Heatmap" className="col-span-5">
          <div className="grid grid-cols-4 gap-2">
            {industryRisks.map((it) => {
              // 风险等级映射颜色透明度
              const intensity = Math.min(it.avg / 100, 1);
              const fill = it.avg > 70
                ? `rgba(214, 69, 69, ${0.25 + intensity * 0.6})`
                : it.avg > 40
                  ? `rgba(201, 169, 110, ${0.25 + intensity * 0.5})`
                  : `rgba(46, 139, 107, ${0.25 + intensity * 0.5})`;
              return (
                <div
                  key={it.industry}
                  className="group relative aspect-square flex flex-col items-center justify-center border border-line cursor-pointer transition-transform hover:scale-105"
                  style={{ background: fill }}
                >
                  <span className="font-display text-2xl text-white">{it.avg}</span>
                  <span className="font-mono text-[10px] tracking-[0.15em] text-white/80">{it.industry}</span>
                  <div className="pointer-events-none absolute inset-0 border border-gold/0 group-hover:border-gold/60 transition" />
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-3 text-[10px] font-mono text-[var(--color-text-faint)]">
            <span>风险分</span>
            <div className="flex h-1.5 flex-1">
              <div className="flex-1 bg-signal-green/60" />
              <div className="flex-1 bg-gold/60" />
              <div className="flex-1 bg-signal-red/60" />
            </div>
            <span>0 — 50 — 100</span>
          </div>
        </Panel>

        {/* 待办告警流 */}
        <Panel
          index="03"
          title="实时告警与待办"
          subtitle="Real-time Alerts"
          className="col-span-4"
          action={
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.25em] text-signal-red">
              <span className="h-1.5 w-1.5 animate-pulse bg-signal-red" />
              LIVE
            </span>
          }
        >
          <div className="space-y-2 max-h-[260px] overflow-auto pr-1">
            {alerts.map((alert, idx) => {
              const Icon = alertIconMap[alert.category];
              const sevColor =
                alert.severity === 'high' ? 'text-signal-red' : alert.severity === 'medium' ? 'text-gold-light' : 'text-signal-blue';
              return (
                <motion.div
                  key={alert.alertId}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.06 }}
                  className="group flex items-start gap-3 border-l-2 border-line bg-[rgba(15,35,53,0.5)] p-3 hover:border-gold-light cursor-pointer transition"
                >
                  <Icon size={14} className={sevColor} strokeWidth={1.5} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`tag ${sevColor}`}>{alert.severity}</span>
                      <span className="font-mono text-[10px] text-[var(--color-text-faint)]">{alert.bondCode}</span>
                    </div>
                    <div className="mt-1 truncate text-[13px] text-[var(--color-text)]">{alert.title}</div>
                    <div className="mt-1 font-mono text-[10px] text-[var(--color-text-faint)]">{alert.createdAt}</div>
                  </div>
                  <ChevronRight size={14} className="text-gold/0 group-hover:text-gold transition" />
                </motion.div>
              );
            })}
          </div>
        </Panel>

        {/* 高危发行人列表 */}
        <Panel index="04" title="重点关注发行人" subtitle="Issuers Under Watch" className="col-span-7">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-faint)]">
                <th className="pb-3 font-normal">发行人 / Issuer</th>
                <th className="pb-3 font-normal">指标</th>
                <th className="pb-3 font-normal text-right">当前值</th>
                <th className="pb-3 font-normal text-right">阈值</th>
                <th className="pb-3 font-normal text-right">状态</th>
              </tr>
            </thead>
            <tbody>
              {financials
                .filter((m) => m.status !== 'safe')
                .slice(0, 5)
                .map((m) => (
                  <tr key={m.metricId} className="border-t border-line/50 hover:bg-white/[0.02] transition">
                    <td className="py-3 max-w-[260px] truncate">{m.issuer}</td>
                    <td className="py-3 text-[var(--color-text-muted)]">{m.metricName}</td>
                    <td className="py-3 text-right font-mono" style={{ color: statusColorMap[m.status] }}>
                      {m.current}
                      {m.unit}
                    </td>
                    <td className="py-3 text-right font-mono text-[var(--color-text-muted)]">
                      {m.threshold}
                      {m.unit}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`tag ${m.status === 'danger' ? 'text-signal-red' : 'text-gold-light'}`}>
                        <AlertTriangle size={10} />
                        {m.status === 'danger' ? '高危' : '关注'}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Panel>

        {/* 资金合规快讯 */}
        <Panel index="05" title="资金合规快讯" subtitle="Fund Compliance" className="col-span-5">
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[var(--color-text-muted)]">本月合规资金占比</span>
              <span className="font-display text-3xl text-signal-green">
                94.2<span className="text-base text-[var(--color-text-muted)]"> %</span>
              </span>
            </div>
            <div className="h-2 bg-[rgba(31,59,85,0.6)]">
              <div className="h-full bg-gradient-to-r from-signal-green via-gold to-gold-light" style={{ width: '94.2%' }} />
            </div>
            <div className="grid grid-cols-3 pt-2">
              <div>
                <div className="font-mono text-[10px] text-[var(--color-text-faint)]">已使用</div>
                <div className="font-display text-2xl text-gold-light">98.6<span className="text-xs text-[var(--color-text-muted)]"> 亿</span></div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-[var(--color-text-faint)]">异常用途</div>
                <div className="font-display text-2xl text-signal-red">1.6<span className="text-xs text-[var(--color-text-muted)]"> 亿</span></div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-[var(--color-text-faint)]">待审批</div>
                <div className="font-display text-2xl text-gold-light">3<span className="text-xs text-[var(--color-text-muted)]"> 项</span></div>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
