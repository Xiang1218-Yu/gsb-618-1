// 存续期管理页：债券台账 + 兑付日历
import { useState, useMemo } from 'react';
import { CalendarClock, Coins, Gift, Repeat } from 'lucide-react';
import Panel from '@/components/Panel';
import { usePlatformStore } from '@/store/usePlatformStore';
import { bondStatusLabel, ratingColorMap, statusColorMap } from '@/lib/utils';
import type { CouponEventType } from '@/types';

// 兑付事件类型映射
const eventTypeMap: Record<CouponEventType, { label: string; color: string; icon: typeof Coins }> = {
  interest: { label: '付息', color: '#4A8FB8', icon: Coins },
  principal: { label: '兑本', color: '#C9A96E', icon: Gift },
  principalAndInterest: { label: '本息', color: '#D64545', icon: Gift },
  callable: { label: '回售', color: '#2E8B6B', icon: Repeat },
};

export default function DurationPage() {
  const { bonds, coupons } = usePlatformStore();
  const [filterRating, setFilterRating] = useState<string>('全部');

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

  return (
    <div className="space-y-6 p-8">
      {/* 债券台账 */}
      <Panel
        index="01"
        title="存续期债券台账"
        subtitle="Bond Ledger"
        action={
          <div className="flex gap-1">
            {allRatings.map((r) => (
              <button
                key={r}
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
              </tr>
            </thead>
            <tbody>
              {filteredBonds.map((b) => {
                const riskColor = b.riskScore > 70 ? statusColorMap.danger : b.riskScore > 40 ? statusColorMap.warning : statusColorMap.safe;
                return (
                  <tr key={b.bondCode} className="border-t border-line/50 hover:bg-white/[0.02] transition">
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
    </div>
  );
}
