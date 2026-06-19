// 承销管理页：项目列表 + 流程节点 + 文档管理
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Users, FileCheck, ClipboardList, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Panel from '@/components/Panel';
import { usePlatformStore } from '@/store/usePlatformStore';
import { stageLabel } from '@/lib/utils';

// 阶段顺序，用于流程节点展示
const stageOrder = ['initiation', 'duediligence', 'underwriting', 'completed'] as const;

export default function UnderwritingPage() {
  const { projects } = usePlatformStore();
  // 当前选中的项目
  const [selectedId, setSelectedId] = useState(projects[0].projectId);
  const selected = projects.find((p) => p.projectId === selectedId)!;

  return (
    <div className="space-y-6 p-8">
      <div className="grid grid-cols-12 gap-6">
        {/* 项目列表 */}
        <Panel
          index="01"
          title="承销项目"
          subtitle="Underwriting Projects"
          className="col-span-5"
          action={<button className="btn-gold">+ 新建立项</button>}
        >
          <div className="space-y-3">
            {projects.map((p, idx) => {
              const isActive = p.projectId === selectedId;
              return (
                <motion.div
                  key={p.projectId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  onClick={() => setSelectedId(p.projectId)}
                  className={`group cursor-pointer border p-4 transition-all ${
                    isActive
                      ? 'border-gold-light bg-[rgba(201,169,110,0.06)]'
                      : 'border-line hover:border-gold/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-text-faint)]">
                          {p.projectId}
                        </span>
                        <span className={`tag ${
                          p.stage === 'completed' ? 'text-signal-green' :
                          p.stage === 'underwriting' ? 'text-gold-light' :
                          p.stage === 'duediligence' ? 'text-signal-blue' : 'text-[var(--color-text-muted)]'
                        }`}>
                          {stageLabel[p.stage]}
                        </span>
                      </div>
                      <div className="mt-2 truncate text-[15px] text-[var(--color-text)]">{p.projectName}</div>
                      <div className="mt-1 font-mono text-[11px] text-[var(--color-text-faint)]">
                        主承 · {p.leadUnderwriter} / 预计 {p.expectedIssueDate}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="font-display text-2xl text-gold-light">{p.progress}<span className="text-xs">%</span></div>
                      <div className="font-mono text-[10px] text-[var(--color-text-faint)]">合规分 {p.complianceScore}</div>
                    </div>
                  </div>
                  {/* 进度条 */}
                  <div className="mt-3 h-[2px] w-full bg-line/70">
                    <div
                      className="h-full bg-gradient-to-r from-gold/40 to-gold-light"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Panel>

        {/* 流程节点时间线 */}
        <Panel
          index="02"
          title={selected.projectName}
          subtitle={`Project · ${selected.projectId}`}
          className="col-span-7"
        >
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="border border-line p-3">
              <div className="flex items-center gap-2 text-[var(--color-text-faint)]">
                <Users size={14} strokeWidth={1.5} />
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase">承销团</span>
              </div>
              <div className="mt-2 font-display text-base text-[var(--color-text)]">{selected.leadUnderwriter}</div>
              <div className="mt-1 text-[12px] text-[var(--color-text-muted)]">
                联席：{selected.syndicateMembers.join(' · ')}
              </div>
            </div>
            <div className="border border-line p-3">
              <div className="flex items-center gap-2 text-[var(--color-text-faint)]">
                <ClipboardList size={14} strokeWidth={1.5} />
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase">关键节点</span>
              </div>
              <div className="mt-2 font-display text-xl text-gold-light">{selected.startDate}</div>
              <div className="mt-1 text-[12px] text-[var(--color-text-muted)]">至 {selected.expectedIssueDate}</div>
            </div>
            <div className="border border-line p-3">
              <div className="flex items-center gap-2 text-[var(--color-text-faint)]">
                <FileCheck size={14} strokeWidth={1.5} />
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase">合规评分</span>
              </div>
              <div className="mt-2 font-display text-3xl text-gold-light">{selected.complianceScore}</div>
              <div className="mt-1 h-1 bg-line/70">
                <div className="h-full bg-gradient-to-r from-gold/40 to-gold-light" style={{ width: `${selected.complianceScore}%` }} />
              </div>
            </div>
          </div>

          {/* 流程时间线 */}
          <div className="mb-6">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-faint)] mb-3">
              FLOW · 流程节点
            </div>
            <div className="relative flex items-center justify-between">
              <div className="absolute top-3 left-0 right-0 h-[1px] bg-line" />
              {stageOrder.map((stage, idx) => {
                const reached = stageOrder.indexOf(selected.stage) >= idx;
                const isCurrent = selected.stage === stage;
                return (
                  <div key={stage} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`h-6 w-6 border-2 transition ${
                        isCurrent
                          ? 'border-gold-light bg-gold-light shadow-[0_0_12px_rgba(201,169,110,0.6)]'
                          : reached
                            ? 'border-signal-green bg-signal-green'
                            : 'border-line bg-[var(--color-bg)]'
                      }`}
                    />
                    <div className={`mt-2 text-[12px] ${isCurrent ? 'text-gold-light' : reached ? 'text-[var(--color-text)]' : 'text-[var(--color-text-faint)]'}`}>
                      {stageLabel[stage]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 文档清单 */}
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-faint)] mb-3">
              DOCUMENTS · 关键文档
            </div>
            <div className="space-y-2">
              {selected.documents.map((doc) => {
                const StatusIcon = doc.status === 'approved' ? CheckCircle2 : doc.status === 'pending' ? Clock : XCircle;
                const statusColor =
                  doc.status === 'approved' ? 'text-signal-green' : doc.status === 'pending' ? 'text-gold-light' : 'text-signal-red';
                return (
                  <div key={doc.documentId} className="flex items-center gap-3 border border-line/50 px-3 py-2 hover:border-gold/40 transition">
                    <StatusIcon size={14} className={statusColor} strokeWidth={1.5} />
                    <span className="font-mono text-[10px] text-[var(--color-text-faint)]">{doc.documentId}</span>
                    <span className="flex-1 truncate text-[13px]">{doc.documentName}</span>
                    <span className="text-[12px] text-[var(--color-text-muted)]">{doc.reviewer}</span>
                    <span className="font-mono text-[11px] text-[var(--color-text-faint)]">{doc.uploadDate}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
