'use client';

import React from 'react';
import { useToast } from '@/components/ui/toast';
import { matchAgeGroup, formatAgeDisplay, calculateCorrectedAgeDays, CDMM_DIMENSIONS } from '@/lib/cdmm';

interface CdmmQuestion {
  id: string;
  content: string;
  options: Array<{ value: number; label: string }>;
  dimension: string;
  meta: { ageGroup: string; kind: 'milestone' | 'redflag' };
}

interface Props {
  scale: any;
  questions: CdmmQuestion[];
}

const CDMMAssessment: React.FC<Props> = ({ scale, questions }) => {
  const { toast } = useToast();

  // ---------- 阶段 1：儿童信息 ----------
  const [phase, setPhase] = React.useState<'form' | 'quiz'>('form');
  const [childInfo, setChildInfo] = React.useState({
    name: '',
    gender: '男' as '男' | '女',
    birthDate: '',
    isPremature: false,
    dueDate: '',
  });
  const [matchError, setMatchError] = React.useState<string | null>(null);
  const [matchedGroup, setMatchedGroup] = React.useState<string | null>(null);
  const [ageDisplay, setAgeDisplay] = React.useState('');

  // ---------- 阶段 2：分组答题 ----------
  const [groupQuestions, setGroupQuestions] = React.useState<CdmmQuestion[]>([]);
  const [groupNames, setGroupNames] = React.useState<string[]>([]);   // 8 能区 + 可选警示标志
  const [currentGroup, setCurrentGroup] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [submitting, setSubmitting] = React.useState(false);

  const handleMatch = () => {
    setMatchError(null);
    if (!childInfo.name.trim()) { toast('warning', '请填写儿童姓名'); return; }
    if (!childInfo.birthDate) { toast('warning', '请选择出生日期'); return; }
    if (childInfo.isPremature && !childInfo.dueDate) { toast('warning', '请填写预产期'); return; }

    const ageDays = calculateCorrectedAgeDays(
      childInfo.birthDate,
      childInfo.isPremature ? childInfo.dueDate : undefined
    );
    const group = matchAgeGroup(ageDays);
    if (!group) {
      setMatchError(`矫正月龄超出可测评范围（须大于 1 个月且小于 102 个月），当前为 ${formatAgeDisplay(ageDays)}，无法进入测评。`);
      return;
    }
    const filtered = questions.filter((q) => q.meta.ageGroup === group.label);
    const names = CDMM_DIMENSIONS.filter((d) => filtered.some((q) => q.dimension === d));
    const hasRed = filtered.some((q) => q.meta.kind === 'redflag');
    if (hasRed) names.push('警示标志');

    setMatchedGroup(group.label);
    setAgeDisplay(formatAgeDisplay(ageDays));
    setGroupQuestions(filtered);
    setGroupNames(names);
    setCurrentGroup(0);
    setPhase('quiz');
  };

  const handleSubmit = async () => {
    try {
      const unanswered = groupQuestions.filter((q) => answers[q.id] === undefined);
      if (unanswered.length > 0) {
        toast('warning', `还有 ${unanswered.length} 题未作答`);
        return;
      }
      setSubmitting(true);
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          scaleId: scale.id,
          answers,
          ipAddress: '127.0.0.1',
          childInfo: {
            name: childInfo.name.trim(),
            gender: childInfo.gender,
            birthDate: childInfo.birthDate,
            isPremature: childInfo.isPremature,
            dueDate: childInfo.isPremature ? childInfo.dueDate : undefined,
          },
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '提交失败');
      }
      const data = await res.json();
      window.location.href = `/result/${data.id}`;
    } catch (err) {
      toast('error', err instanceof Error ? err.message : '提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const curQuestions = groupQuestions.filter((q) => q.dimension === groupNames[currentGroup]);

  // ---------- 渲染 ----------
  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans">
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-2xl">
        {phase === 'form' ? (
          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-6">儿童信息</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-white/60 mb-1">儿童姓名</label>
                <input
                  value={childInfo.name}
                  onChange={(e) => setChildInfo({ ...childInfo, name: e.target.value })}
                  placeholder="请输入儿童姓名"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-teal-400"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">性别</label>
                <div className="flex gap-3">
                  {(['男', '女'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setChildInfo({ ...childInfo, gender: g })}
                      className={`flex-1 py-3 rounded-xl border transition-colors ${
                        childInfo.gender === g
                          ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">出生日期</label>
                <input
                  type="date"
                  value={childInfo.birthDate}
                  onChange={(e) => setChildInfo({ ...childInfo, birthDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-400 [color-scheme:dark]"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={childInfo.isPremature}
                  onChange={(e) => setChildInfo({ ...childInfo, isPremature: e.target.checked })}
                  className="h-4 w-4"
                />
                早产儿童（需填写预产期）
              </label>
              {childInfo.isPremature && (
                <div>
                  <label className="block text-sm text-white/60 mb-1">预产期</label>
                  <input
                    type="date"
                    value={childInfo.dueDate}
                    onChange={(e) => setChildInfo({ ...childInfo, dueDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-400 [color-scheme:dark]"
                  />
                </div>
              )}
              {matchError && <p className="text-sm text-red-400">{matchError}</p>}
              <button
                onClick={handleMatch}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold hover:opacity-90"
              >
                匹配月龄问卷
              </button>
              <p className="text-xs text-white/40 text-center">
                将根据矫正月龄匹配 2月龄~8岁 共 18 个月龄组问卷，请如实填写
              </p>
            </div>
          </section>
        ) : (
          <>
            {/* 头部：量表标题 + 儿童信息摘要 */}
            <div className="mb-6">
              <h2 className="text-xl font-bold">{scale.title}</h2>
              <p className="text-sm text-white/50">
                {childInfo.name}（{ageDisplay}）· 使用{matchedGroup}里程碑
              </p>
            </div>
            {/* 能区进度 */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-teal-300">{groupNames[currentGroup]}</span>
              <span className="text-xs text-white/50">{currentGroup + 1}/{groupNames.length}</span>
            </div>
            {/* 一屏一个能区 */}
            <div className="space-y-4">
              {curQuestions.map((q) => (
                <div key={q.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-sm text-white/90 mb-4 leading-relaxed">{q.content}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setAnswers({ ...answers, [q.id]: opt.value })}
                        className={`py-3 rounded-xl border text-sm transition-colors ${
                          answers[q.id] === opt.value
                            ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* 底部导航：上一能区 / 下一能区（最后一组为提交） */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentGroup((i) => Math.max(0, i - 1))}
                disabled={currentGroup === 0}
                className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 disabled:opacity-30"
              >
                上一能区
              </button>
              {currentGroup < groupNames.length - 1 ? (
                <button
                  onClick={() => setCurrentGroup((i) => Math.min(groupNames.length - 1, i + 1))}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold"
                >
                  下一能区
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold disabled:opacity-60"
                >
                  {submitting ? '提交中...' : '提交核验'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CDMMAssessment;
