// 承销管理页：项目列表 + 流程节点 + 文档管理（含 CRUD）
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Users, FileCheck, ClipboardList, CheckCircle2, Clock, XCircle, Pencil, Trash2, Plus } from 'lucide-react';
import Panel from '@/components/Panel';
import Modal, { Field, inputClass } from '@/components/Modal';
import { usePlatformStore } from '@/store/usePlatformStore';
import { stageLabel } from '@/lib/utils';
import type { UnderwritingProject, UnderwritingStage } from '@/types';

// 阶段顺序，用于流程节点展示
const stageOrder: UnderwritingStage[] = ['initiation', 'duediligence', 'underwriting', 'completed'];

// 创建项目的初始空表单
const buildEmptyForm = (): UnderwritingProject => ({
  projectId: `UW${Date.now().toString().slice(-7)}`,
  projectName: '',
  bondCode: '',
  leadUnderwriter: '',
  syndicateMembers: [],
  stage: 'initiation',
  progress: 0,
  startDate: new Date().toISOString().slice(0, 10),
  expectedIssueDate: '',
  complianceScore: 80,
  documents: [],
});

export default function UnderwritingPage() {
  const { projects, addProject, updateProject, removeProject } = usePlatformStore();
  // 当前选中的项目
  const [selectedId, setSelectedId] = useState(projects[0]?.projectId ?? '');
  // 弹窗模式：null 关闭 / create 新建 / edit 编辑
  const [modalMode, setModalMode] = useState<null | 'create' | 'edit'>(null);
  // 表单数据
  const [form, setForm] = useState<UnderwritingProject>(buildEmptyForm());
  // 联席承销团成员的字符串编辑态（逗号分隔）
  const [syndicateInput, setSyndicateInput] = useState('');
  // 删除确认弹窗
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const selected = projects.find((p) => p.projectId === selectedId);

  // 当 projects 列表变化导致选中项失效时，自动选中首条
  useEffect(() => {
    if (!projects.find((p) => p.projectId === selectedId)) {
      setSelectedId(projects[0]?.projectId ?? '');
    }
  }, [projects, selectedId]);

  // 打开新建弹窗
  const handleOpenCreate = () => {
    const empty = buildEmptyForm();
    setForm(empty);
    setSyndicateInput('');
    setModalMode('create');
  };

  // 打开编辑弹窗
  const handleOpenEdit = (project: UnderwritingProject) => {
    setForm({ ...project });
    setSyndicateInput(project.syndicateMembers.join('、'));
    setModalMode('edit');
  };

  // 提交表单（新建或保存）
  const handleSubmit = () => {
    // 简单校验：项目名称必填
    if (!form.projectName.trim()) {
      alert('请填写项目名称');
      return;
    }
    const finalForm: UnderwritingProject = {
      ...form,
      syndicateMembers: syndicateInput
        .split(/[,，、\s]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    };
    if (modalMode === 'create') {
      addProject(finalForm);
      setSelectedId(finalForm.projectId);
    } else if (modalMode === 'edit') {
      updateProject(finalForm.projectId, finalForm);
    }
    setModalMode(null);
  };

  // 确认删除
  const handleConfirmDelete = () => {
    if (!deleteId) return;
    removeProject(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 p-8">
      <div className="grid grid-cols-12 gap-6">
        {/* 项目列表 */}
        <Panel
          index="01"
          title="承销项目"
          subtitle="Underwriting Projects"
          className="col-span-5"
          action={
            <button type="button" className="btn-gold flex items-center gap-1" onClick={handleOpenCreate}>
              <Plus size={12} /> 新建立项
            </button>
          }
        >
          <div className="space-y-3 max-h-[640px] overflow-auto pr-1">
            {projects.length === 0 && (
              <div className="border border-dashed border-line py-10 text-center text-[var(--color-text-muted)]">
                暂无项目，点击右上角 [新建立项] 创建
              </div>
            )}
            {projects.map((p, idx) => {
              const isActive = p.projectId === selectedId;
              return (
                <motion.div
                  key={p.projectId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
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
                        主承 · {p.leadUnderwriter || '—'} / 预计 {p.expectedIssueDate || '—'}
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col items-end gap-2">
                      <div className="text-right">
                        <div className="font-display text-2xl text-gold-light">{p.progress}<span className="text-xs">%</span></div>
                        <div className="font-mono text-[10px] text-[var(--color-text-faint)]">合规分 {p.complianceScore}</div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          className="border border-line/60 p-1 text-[var(--color-text-muted)] hover:border-gold-light hover:text-gold-light transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(p);
                          }}
                          title="编辑"
                        >
                          <Pencil size={11} />
                        </button>
                        <button
                          type="button"
                          className="border border-line/60 p-1 text-[var(--color-text-muted)] hover:border-signal-red hover:text-signal-red transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(p.projectId);
                          }}
                          title="删除"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
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
          title={selected?.projectName || '请选择项目'}
          subtitle={selected ? `Project · ${selected.projectId}` : 'No selection'}
          className="col-span-7"
          action={
            selected ? (
              <div className="flex gap-2">
                <button type="button" className="btn-gold !px-3 !py-1 !text-[10px]" onClick={() => handleOpenEdit(selected)}>
                  <Pencil size={10} className="inline mr-1" /> 编辑
                </button>
                <button
                  type="button"
                  className="btn-gold !px-3 !py-1 !text-[10px] !border-signal-red/60 !text-signal-red"
                  onClick={() => setDeleteId(selected.projectId)}
                >
                  <Trash2 size={10} className="inline mr-1" /> 删除
                </button>
              </div>
            ) : null
          }
        >
          {selected ? (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="border border-line p-3">
                  <div className="flex items-center gap-2 text-[var(--color-text-faint)]">
                    <Users size={14} strokeWidth={1.5} />
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase">承销团</span>
                  </div>
                  <div className="mt-2 font-display text-base text-[var(--color-text)]">{selected.leadUnderwriter || '—'}</div>
                  <div className="mt-1 text-[12px] text-[var(--color-text-muted)]">
                    联席：{selected.syndicateMembers.length ? selected.syndicateMembers.join(' · ') : '—'}
                  </div>
                </div>
                <div className="border border-line p-3">
                  <div className="flex items-center gap-2 text-[var(--color-text-faint)]">
                    <ClipboardList size={14} strokeWidth={1.5} />
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase">关键节点</span>
                  </div>
                  <div className="mt-2 font-display text-xl text-gold-light">{selected.startDate}</div>
                  <div className="mt-1 text-[12px] text-[var(--color-text-muted)]">至 {selected.expectedIssueDate || '—'}</div>
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
                  DOCUMENTS · 关键文档（{selected.documents.length}）
                </div>
                {selected.documents.length === 0 ? (
                  <div className="border border-dashed border-line/60 py-6 text-center text-[12px] text-[var(--color-text-muted)]">
                    暂无文档
                  </div>
                ) : (
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
                )}
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-[var(--color-text-muted)]">
              请在左侧列表中选择一个项目
            </div>
          )}
        </Panel>
      </div>

      {/* 新建/编辑弹窗 */}
      <Modal
        open={modalMode !== null}
        onClose={() => setModalMode(null)}
        title={modalMode === 'create' ? '新建承销项目' : '编辑承销项目'}
        subtitle={modalMode === 'create' ? 'Create Project' : 'Edit Project'}
        width={680}
        footer={
          <>
            <button type="button" className="btn-gold !border-line/70 !text-[var(--color-text-muted)]" onClick={() => setModalMode(null)}>
              取消
            </button>
            <button type="button" className="btn-gold" onClick={handleSubmit}>
              {modalMode === 'create' ? '创建项目' : '保存修改'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="项目编号">
            <input className={inputClass} value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} disabled={modalMode === 'edit'} />
          </Field>
          <Field label="关联债券代码">
            <input className={inputClass} value={form.bondCode} onChange={(e) => setForm({ ...form, bondCode: e.target.value })} placeholder="如 102681005" />
          </Field>
          <Field label="项目名称" span={2}>
            <input className={inputClass} value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} placeholder="请填写项目名称" />
          </Field>
          <Field label="主承销商">
            <input className={inputClass} value={form.leadUnderwriter} onChange={(e) => setForm({ ...form, leadUnderwriter: e.target.value })} placeholder="如 中信证券" />
          </Field>
          <Field label="联席承销团（多个用、分隔）">
            <input className={inputClass} value={syndicateInput} onChange={(e) => setSyndicateInput(e.target.value)} placeholder="如 国泰君安、海通证券" />
          </Field>
          <Field label="当前阶段">
            <select className={inputClass} value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value as UnderwritingStage })}>
              {stageOrder.map((s) => (
                <option key={s} value={s}>{stageLabel[s]}</option>
              ))}
            </select>
          </Field>
          <Field label="进度（%）">
            <input
              className={inputClass}
              type="number"
              min={0}
              max={100}
              value={form.progress}
              onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
            />
          </Field>
          <Field label="启动日期">
            <input className={inputClass} type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </Field>
          <Field label="预计发行日">
            <input className={inputClass} type="date" value={form.expectedIssueDate} onChange={(e) => setForm({ ...form, expectedIssueDate: e.target.value })} />
          </Field>
          <Field label="合规评分（0-100）" span={2}>
            <input
              className={inputClass}
              type="number"
              min={0}
              max={100}
              value={form.complianceScore}
              onChange={(e) => setForm({ ...form, complianceScore: Number(e.target.value) })}
            />
          </Field>
        </div>
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="确认删除"
        subtitle="Confirm Deletion"
        width={420}
        footer={
          <>
            <button type="button" className="btn-gold !border-line/70 !text-[var(--color-text-muted)]" onClick={() => setDeleteId(null)}>
              取消
            </button>
            <button type="button" className="btn-gold !border-signal-red/70 !text-signal-red" onClick={handleConfirmDelete}>
              确认删除
            </button>
          </>
        }
      >
        <p className="text-[13px] text-[var(--color-text-muted)]">
          确认删除项目 <span className="text-gold-light">{deleteId}</span> 吗？该操作不可撤销。
        </p>
      </Modal>
    </div>
  );
}
