// 发行管理页：发行计划 + 簿记建档可视化
import { Bar, BarChart, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis, ZAxis, CartesianGrid, Cell } from 'recharts';
import Panel from '@/components/Panel';
import { usePlatformStore } from '@/store/usePlatformStore';
import { formatAmount } from '@/lib/utils';

// 投资人类型颜色映射
const investorColorMap: Record<string, string> = {
  银行: '#4A8FB8',
  保险: '#C9A96E',
  基金: '#2E8B6B',
  券商: '#D88A5A',
  其他: '#5C7388',
};

export default function IssuancePage() {
  const { bookbuilding } = usePlatformStore();

  // 总申购金额
  const totalSubscribe = bookbuilding.reduce((acc, r) => acc + r.subscribeAmount, 0);
  const totalAllotment = bookbuilding.reduce((acc, r) => acc + r.allotment, 0);
  const oversubscribeRatio = (totalSubscribe / totalAllotment).toFixed(2);

  // 价格分布（簿记建档散点）
  const priceDistribution = bookbuilding.map((r) => ({
    price: r.subscribePrice,
    amount: r.subscribeAmount,
    type: r.investorType,
    name: r.investorName,
  }));

  // 投资人类型聚合
  const typeAggregation = bookbuilding.reduce<Record<string, number>>((acc, r) => {
    acc[r.investorType] = (acc[r.investorType] || 0) + r.allotment;
    return acc;
  }, {});
  const typeData = Object.entries(typeAggregation).map(([type, value]) => ({ type, value }));

  return (
    <div className="space-y-6 p-8">
      {/* 顶部摘要 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="panel p-5">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-text-faint)]">发行规模</div>
          <div className="mt-2 font-display text-4xl text-gold-light">12.0<span className="text-base text-[var(--color-text-muted)]"> 亿</span></div>
          <div className="mt-1 font-mono text-[11px] text-[var(--color-text-faint)]">25蓝海科技MTN004</div>
        </div>
        <div className="panel p-5">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-text-faint)]">申购总额</div>
          <div className="mt-2 font-display text-4xl text-signal-green">{formatAmount(totalSubscribe)}</div>
          <div className="mt-1 font-mono text-[11px] text-[var(--color-text-faint)]">10 家机构</div>
        </div>
        <div className="panel p-5">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-text-faint)]">认购倍数</div>
          <div className="mt-2 font-display text-4xl text-gold-light">{oversubscribeRatio}<span className="text-base text-[var(--color-text-muted)]"> ×</span></div>
          <div className="mt-1 font-mono text-[11px] text-[var(--color-text-faint)]">市场反应良好</div>
        </div>
        <div className="panel p-5">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-text-faint)]">中标利率</div>
          <div className="mt-2 font-display text-4xl text-gold-light">4.20<span className="text-base text-[var(--color-text-muted)]"> %</span></div>
          <div className="mt-1 font-mono text-[11px] text-signal-green">↓ 18bp 较簿记下限</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 簿记建档价格-数量散点 */}
        <Panel index="01" title="簿记建档价量分布" subtitle="Bookbuilding Price × Quantity" className="col-span-7">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(31,59,85,0.5)" />
                <XAxis
                  type="number"
                  dataKey="price"
                  domain={[99.5, 100.2]}
                  tick={{ fill: '#8AA1B8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  label={{ value: '申购价格 (元)', position: 'insideBottom', offset: -8, fill: '#8AA1B8', fontSize: 11 }}
                  stroke="#1F3B55"
                />
                <YAxis
                  type="number"
                  dataKey="amount"
                  tick={{ fill: '#8AA1B8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  label={{ value: '金额 (亿)', angle: -90, position: 'insideLeft', fill: '#8AA1B8', fontSize: 11 }}
                  stroke="#1F3B55"
                />
                <ZAxis range={[80, 320]} />
                <Scatter data={priceDistribution}>
                  {priceDistribution.map((entry, i) => (
                    <Cell key={i} fill={investorColorMap[entry.type]} fillOpacity={0.75} stroke={investorColorMap[entry.type]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-center gap-5 font-mono text-[10px]">
            {Object.entries(investorColorMap).map(([type, color]) => (
              <span key={type} className="flex items-center gap-1.5">
                <span className="h-2 w-2" style={{ background: color }} />
                <span className="text-[var(--color-text-muted)]">{type}</span>
              </span>
            ))}
          </div>
        </Panel>

        {/* 投资人类型聚合 */}
        <Panel index="02" title="投资人结构" subtitle="Investor Composition" className="col-span-5">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} layout="vertical" margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <CartesianGrid horizontal={false} stroke="rgba(31,59,85,0.4)" />
                <XAxis type="number" tick={{ fill: '#8AA1B8', fontSize: 11, fontFamily: 'JetBrains Mono' }} stroke="#1F3B55" />
                <YAxis type="category" dataKey="type" tick={{ fill: '#E6EDF3', fontSize: 12 }} stroke="#1F3B55" />
                <Bar dataKey="value" radius={[0, 0, 0, 0]}>
                  {typeData.map((d, i) => (
                    <Cell key={i} fill={investorColorMap[d.type]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* 申购明细表 */}
        <Panel index="03" title="申购明细" subtitle="Subscription Details" className="col-span-12">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-faint)]">
                  <th className="pb-3 font-normal">编号</th>
                  <th className="pb-3 font-normal">投资人</th>
                  <th className="pb-3 font-normal">类型</th>
                  <th className="pb-3 font-normal text-right">申购价</th>
                  <th className="pb-3 font-normal text-right">申购金额(亿)</th>
                  <th className="pb-3 font-normal text-right">配售(亿)</th>
                  <th className="pb-3 font-normal text-right">中签率</th>
                </tr>
              </thead>
              <tbody>
                {bookbuilding.map((r) => (
                  <tr key={r.investorId} className="border-t border-line/50 hover:bg-white/[0.02] transition">
                    <td className="py-3 font-mono text-[var(--color-text-faint)]">{r.investorId}</td>
                    <td className="py-3">{r.investorName}</td>
                    <td className="py-3">
                      <span className="tag" style={{ color: investorColorMap[r.investorType] }}>
                        {r.investorType}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono">{r.subscribePrice}</td>
                    <td className="py-3 text-right font-mono">{r.subscribeAmount.toFixed(1)}</td>
                    <td className="py-3 text-right font-mono text-gold-light">{r.allotment.toFixed(1)}</td>
                    <td className="py-3 text-right font-mono text-[var(--color-text-muted)]">
                      {r.subscribeAmount === 0 ? '—' : `${((r.allotment / r.subscribeAmount) * 100).toFixed(0)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
