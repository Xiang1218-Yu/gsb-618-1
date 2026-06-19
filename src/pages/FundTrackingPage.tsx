// 募集资金追踪页：账户监控 + Sankey 资金流向 + 用途合规校验
import { useEffect, useRef, useState } from 'react';
import * as d3Sankey from 'd3-sankey';
import { Wallet, Building2, AlertTriangle, ShieldCheck } from 'lucide-react';
import Panel from '@/components/Panel';
import { usePlatformStore } from '@/store/usePlatformStore';
import { formatAmount } from '@/lib/utils';

// Sankey 节点颜色映射（按用途分类）
const categoryColorMap: Record<string, string> = {
  主业经营: '#2E8B6B',
  偿还债务: '#4A8FB8',
  研发创新: '#C9A96E',
  流动资金: '#D88A5A',
  关联交易: '#D64545',
};

// Sankey 节点/连线的简化类型，使用 any 以便规避 d3-sankey 的复杂泛型
type SankeyNodeAny = d3Sankey.SankeyNode<Record<string, unknown>, Record<string, unknown>> & { name: string };

export default function FundTrackingPage() {
  const { accounts, fundFlows } = usePlatformStore();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredLink, setHoveredLink] = useState<{ source: string; target: string; amount: number } | null>(null);

  // 渲染 Sankey 图
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    // 清空旧内容
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const width = svg.clientWidth || 800;
    const height = 400;

    // 收集所有唯一节点
    const nodeNames = Array.from(new Set(fundFlows.flatMap((f) => [f.source, f.target])));
    const nameToIndex = new Map(nodeNames.map((n, i) => [n, i]));

    // 构造 Sankey 输入数据
    const sankeyInput = {
      nodes: nodeNames.map((name) => ({ name })),
      links: fundFlows.map((f) => ({
        source: nameToIndex.get(f.source)!,
        target: nameToIndex.get(f.target)!,
        value: f.amount,
        amount: f.amount,
        category: f.category,
        isCompliant: f.isCompliant,
      })),
    };

    const sankeyGen = d3Sankey
      .sankey()
      .nodeWidth(14)
      .nodePadding(18)
      .extent([
        [10, 10],
        [width - 10, height - 10],
      ]);

    // d3-sankey 的类型签名较为复杂，此处通过 any 桥接简化使用
    const graph = sankeyGen(sankeyInput as unknown as Parameters<typeof sankeyGen>[0]);

    const NS = 'http://www.w3.org/2000/svg';
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // 渐变定义
    const defs = document.createElementNS(NS, 'defs');
    graph.links.forEach((link, i) => {
      const linkAny = link as unknown as { source: SankeyNodeAny; target: SankeyNodeAny; amount: number; category: string; isCompliant: boolean; width?: number };
      const grad = document.createElementNS(NS, 'linearGradient');
      grad.setAttribute('id', `link-grad-${i}`);
      grad.setAttribute('gradientUnits', 'userSpaceOnUse');
      grad.setAttribute('x1', String(linkAny.source.x1 ?? 0));
      grad.setAttribute('x2', String(linkAny.target.x0 ?? 0));
      const color = categoryColorMap[linkAny.category] || '#5C7388';
      const stop1 = document.createElementNS(NS, 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', color);
      stop1.setAttribute('stop-opacity', linkAny.isCompliant ? '0.55' : '0.85');
      const stop2 = document.createElementNS(NS, 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', color);
      stop2.setAttribute('stop-opacity', linkAny.isCompliant ? '0.25' : '0.6');
      grad.appendChild(stop1);
      grad.appendChild(stop2);
      defs.appendChild(grad);
    });
    svg.appendChild(defs);

    // 绘制连线
    graph.links.forEach((link, i) => {
      const linkAny = link as unknown as { source: SankeyNodeAny; target: SankeyNodeAny; amount: number; isCompliant: boolean; width?: number };
      const path = document.createElementNS(NS, 'path');
      // d3-sankey 的 link path 生成器
      const linkPath = (d3Sankey.sankeyLinkHorizontal() as unknown as (l: unknown) => string)(link);
      path.setAttribute('d', linkPath || '');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', `url(#link-grad-${i})`);
      path.setAttribute('stroke-width', String(Math.max(1, linkAny.width || 1)));
      if (!linkAny.isCompliant) {
        path.setAttribute('stroke-dasharray', '6 4');
      }
      path.style.transition = 'opacity 0.2s';
      path.addEventListener('mouseenter', () => {
        setHoveredLink({
          source: linkAny.source.name,
          target: linkAny.target.name,
          amount: linkAny.amount,
        });
        path.style.opacity = '1';
      });
      path.addEventListener('mouseleave', () => {
        setHoveredLink(null);
        path.style.opacity = '';
      });
      svg.appendChild(path);
    });

    // 绘制节点
    graph.nodes.forEach((node) => {
      const nodeAny = node as unknown as SankeyNodeAny;
      const x0 = nodeAny.x0 ?? 0;
      const y0 = nodeAny.y0 ?? 0;
      const x1 = nodeAny.x1 ?? 0;
      const y1 = nodeAny.y1 ?? 0;
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', String(x0));
      rect.setAttribute('y', String(y0));
      rect.setAttribute('width', String(x1 - x0));
      rect.setAttribute('height', String(Math.max(1, y1 - y0)));
      rect.setAttribute('fill', '#C9A96E');
      svg.appendChild(rect);

      const text = document.createElementNS(NS, 'text');
      const isLeft = x0 < width / 2;
      text.setAttribute('x', String(isLeft ? x1 + 6 : x0 - 6));
      text.setAttribute('y', String((y0 + y1) / 2));
      text.setAttribute('dy', '0.35em');
      text.setAttribute('fill', '#E6EDF3');
      text.setAttribute('font-size', '11');
      text.setAttribute('font-family', 'IBM Plex Sans, sans-serif');
      text.setAttribute('text-anchor', isLeft ? 'start' : 'end');
      text.textContent = nodeAny.name;
      svg.appendChild(text);
    });
  }, [fundFlows]);

  // 不合规资金流（用于合规校验区）
  const nonCompliantFlows = fundFlows.filter((f) => !f.isCompliant);

  return (
    <div className="space-y-6 p-8">
      {/* 资金账户卡片 */}
      <section className="grid grid-cols-4 gap-4">
        {accounts.map((acc) => {
          const usedRatio = (acc.usedAmount / acc.raisedAmount) * 100;
          return (
            <div key={acc.accountId} className="panel panel-glow p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-text-faint)]">
                    {acc.accountId}
                  </div>
                  <div className="mt-1 truncate text-[14px] text-[var(--color-text)]">{acc.accountName}</div>
                  <div className="font-mono text-[11px] text-[var(--color-text-faint)]">{acc.bankName}</div>
                </div>
                <Wallet size={18} className="text-gold/60" strokeWidth={1.5} />
              </div>
              <div className="mt-4">
                <div className="font-display text-3xl text-gold-light">
                  {formatAmount(acc.balance)}<span className="text-base text-[var(--color-text-muted)]"> 亿</span>
                </div>
                <div className="font-mono text-[10px] text-[var(--color-text-faint)]">账户余额</div>
              </div>
              <div className="mt-3 h-1.5 bg-line/70">
                <div className="h-full bg-gradient-to-r from-gold/40 to-gold-light" style={{ width: `${usedRatio}%` }} />
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10px] text-[var(--color-text-muted)]">
                <span>已用 {acc.usedAmount} 亿</span>
                <span>{usedRatio.toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Sankey 资金流向 */}
      <Panel
        index="01"
        title="募集资金流向沙盘"
        subtitle="Fund Flow Sankey"
        action={
          <div className="flex gap-3 font-mono text-[10px]">
            {Object.entries(categoryColorMap).map(([cat, color]) => (
              <span key={cat} className="flex items-center gap-1.5">
                <span className="h-2 w-2" style={{ background: color }} />
                <span className="text-[var(--color-text-muted)]">{cat}</span>
              </span>
            ))}
          </div>
        }
      >
        <div className="relative">
          <svg ref={svgRef} width="100%" height="400" />
          {hoveredLink && (
            <div className="absolute top-2 right-2 panel px-3 py-2">
              <div className="font-mono text-[10px] text-[var(--color-text-faint)]">
                {hoveredLink.source} → {hoveredLink.target}
              </div>
              <div className="font-display text-2xl text-gold-light">
                {hoveredLink.amount.toFixed(2)} <span className="text-xs">亿</span>
              </div>
            </div>
          )}
        </div>
      </Panel>

      {/* 用途合规校验 */}
      <div className="grid grid-cols-12 gap-6">
        <Panel index="02" title="用途合规校验" subtitle="Usage Compliance" className="col-span-7">
          <div className="space-y-3">
            <div className="flex items-center justify-between border border-signal-green/40 bg-[rgba(46,139,107,0.06)] px-4 py-3">
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-signal-green" strokeWidth={1.5} />
                <div>
                  <div className="text-[14px]">合规资金占比</div>
                  <div className="font-mono text-[11px] text-[var(--color-text-faint)]">承诺用途 ↔ 实际用途</div>
                </div>
              </div>
              <div className="font-display text-3xl text-signal-green">94.2%</div>
            </div>
            {nonCompliantFlows.length > 0 ? (
              nonCompliantFlows.map((f, i) => (
                <div key={i} className="flex items-start gap-3 border border-signal-red/40 bg-[rgba(214,69,69,0.06)] px-4 py-3">
                  <AlertTriangle size={16} className="text-signal-red mt-0.5" strokeWidth={1.5} />
                  <div className="flex-1">
                    <div className="text-[14px] text-signal-red">疑似偏离承诺用途</div>
                    <div className="mt-1 font-mono text-[11px] text-[var(--color-text-muted)]">
                      {f.source} → {f.target} · 类别 [{f.category}] · 金额 {f.amount.toFixed(2)} 亿
                    </div>
                  </div>
                  <button className="btn-gold !px-3 !py-1 !text-[11px]">派单核查</button>
                </div>
              ))
            ) : (
              <div className="text-[var(--color-text-muted)] text-center py-8">无异常流向</div>
            )}
          </div>
        </Panel>

        <Panel index="03" title="募集说明书承诺用途" subtitle="Prospectus Commitment" className="col-span-5">
          <div className="space-y-3 text-[13px] text-[var(--color-text-muted)] leading-relaxed">
            <div className="flex items-start gap-3">
              <Building2 size={14} className="mt-1 text-gold-light" />
              <p>本期募集资金 30 亿元中，<span className="text-gold-light">60%</span> 用于主营业务投入，<span className="text-gold-light">25%</span> 用于债务置换，<span className="text-gold-light">10%</span> 用于研发创新，<span className="text-gold-light">5%</span> 用于补充流动资金。</p>
            </div>
            <div className="border-t border-line/60 pt-3 font-mono text-[11px]">
              <div className="flex justify-between"><span>承诺主业占比</span><span className="text-gold-light">≥ 60%</span></div>
              <div className="flex justify-between"><span>实际主业占比</span><span className="text-signal-green">62.0%</span></div>
              <div className="flex justify-between"><span>承诺关联交易</span><span className="text-gold-light">禁止</span></div>
              <div className="flex justify-between"><span>实际关联交易</span><span className="text-signal-red">1.6 亿（违规）</span></div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
