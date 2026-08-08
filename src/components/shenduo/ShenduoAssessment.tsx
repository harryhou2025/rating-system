'use client';

import React from 'react';
import { useToast } from '@/components/ui/toast';
import { SHEINDUO_TRAITS } from '@/lib/shenduo';

interface ShenduoQuestion {
  id: string;
  content: string;
  options: Array<{ value: number; label: string }>;
  dimension: string;
}

interface Props {
  scale: any;
  questions: ShenduoQuestion[];
}

const LEVEL_ROWS = [
  { range: '0-5 分', percent: '0%-25%', level: '不明显' },
  { range: '6-10 分', percent: '30%-50%', level: '轻度存在' },
  { range: '11-15 分', percent: '55%-75%', level: '较为突出' },
  { range: '16-20 分', percent: '80%-100%', level: '非常显著' },
];

const ShenduoAssessment: React.FC<Props> = ({ scale, questions }) => {
  const { toast } = useToast();

  const [phase, setPhase] = React.useState<'intro' | 'quiz'>('intro');
  const [partIndex, setPartIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [submitting, setSubmitting] = React.useState(false);

  const parts = SHEINDUO_TRAITS.map((t) => ({
    ...t,
    questions: questions.filter((q) => q.dimension === t.dimension),
  }));
  const part = parts[partIndex];
  const partAnswered = part.questions.filter((q) => answers[q.id] !== undefined).length;

  const goNext = () => {
    const unanswered = part.questions.filter((q) => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      toast('warning', `还有 ${unanswered.length} 题未作答，请先完成本部分`);
      return;
    }
    setPartIndex((i) => Math.min(parts.length - 1, i + 1));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    const unanswered = part.questions.filter((q) => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      toast('warning', `还有 ${unanswered.length} 题未作答`);
      return;
    }
    try {
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

  // ---------- 使用说明 ----------
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans">
        <div className="relative z-10 container mx-auto px-4 py-12 max-w-2xl">
          <div className="text-center mb-10">
            <div className="text-5xl mb-3">🐕 🐱 🌸</div>
            <h1 className="text-2xl font-bold">{scale.title}</h1>
            <p className="text-sm text-white/50 mt-2">
              每个人都有独特的神经类型——有人像汪星人一样热情冲动，
              有人像喵星人一样独立思考，有人像敏感星人一样细腻深刻。
              本量表帮你探索自己大脑的独特「出厂设置」。
            </p>
          </div>

          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 mb-6">
            <h2 className="text-lg font-bold mb-3">🧠 什么是神经多样性？</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              神经多样性（Neurodiversity）指人类大脑功能和行为的自然变异。ADHD、自闭症谱系（ASD）、
              高敏感（HSP）并非"疾病"，而是不同的神经类型——就像有人天生擅长长跑，
              有人天生擅长画画一样自然。
            </p>
            <div className="grid gap-3 mt-4">
              {SHEINDUO_TRAITS.map((t) => (
                <div key={t.key} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4">
                  <div className="text-3xl shrink-0 leading-none mt-1">{t.emoji}</div>
                  <div>
                    <p className="font-semibold">
                      {t.name} <span className="text-xs text-white/40">= {t.trait}</span>
                    </p>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">{t.description}</p>
                    <p className="text-[11px] text-white/35 mt-1">{t.reference}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 mb-6">
            <h2 className="text-lg font-bold mb-3">✍️ 如何作答</h2>
            <ul className="text-sm text-white/80 space-y-2 leading-relaxed">
              <li>• 请根据近 6 个月以来的真实感受和行为作答，而非"理想中的自己"。</li>
              <li>• 每题只有两个选项：「符合」（得 1 分）或「不符合」（得 0 分）。</li>
              <li>• 没有"有时"选项——如果犹豫，请选择更接近你日常状态的那一项。</li>
              <li>• 三大部分各 20 题，总计 60 题，大约需要 10-15 分钟完成。</li>
            </ul>
          </section>

          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 mb-6">
            <h2 className="text-lg font-bold mb-3">📊 评分与结果解读</h2>
            <p className="text-sm text-white/70 mb-3">
              每部分满分 20 分，将得分除以 20 即为该特质的占比百分比。三种特质可以同时共存。
            </p>
            <div className="overflow-hidden rounded-xl border border-white/10">
              {LEVEL_ROWS.map((r, i) => (
                <div key={i} className={`flex text-sm ${i % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`}>
                  <span className="flex-1 px-4 py-2.5 text-white/80">{r.range}（{r.percent}）</span>
                  <span className="flex-1 px-4 py-2.5 text-white/50">{r.level}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-8">
            <p className="text-xs text-amber-200/90 leading-relaxed">
              ⚠️ 重要提示：本量表参考 ASRS（WHO）、AQ（Baron-Cohen）、RAADS-R 和 HSPS（Aron）
              等国际公认量表的核心维度改编，但已简化为「符合/不符合」二选一格式，
              仅供自我探索与科普参考，不构成医学诊断。如需专业评估，请前往正规医院精神科或心理科就诊。
            </p>
          </section>

          <button
            onClick={() => setPhase('quiz')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold text-lg hover:opacity-90 transition-opacity"
          >
            开始测评
          </button>
        </div>
      </div>
    );
  }

  // ---------- 答题 ----------
  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans">
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-2xl">
        {/* 头部 */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">{scale.title}</h2>
          <p className="text-sm text-white/50">
            {scale.description?.slice(0, 40) || ''}
          </p>
        </div>

        {/* 部分进度 */}
        <div className="flex items-center justify-between mb-6">
          <span className="font-semibold" style={{ color: part.color }}>
            {part.emoji} 第{partIndex + 1}部分：{part.name}指数
          </span>
          <span className="text-xs text-white/50">
            {partIndex + 1}/{parts.length} · 已完成 {partAnswered}/{part.questions.length} 题
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 mb-6 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(partAnswered / part.questions.length) * 100}%`, background: part.color }}
          />
        </div>

        <div className="space-y-4">
          {part.questions.map((q, i) => (
            <div key={q.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-sm text-white/90 mb-4 leading-relaxed">
                <span className="text-white/35 mr-2">{i + 1}.</span>
                {q.content}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.value }))}
                      className="py-3 rounded-xl border text-sm transition-colors"
                      style={
                        selected
                          ? { borderColor: part.color, background: `${part.color}26`, color: part.color }
                          : { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' }
                      }
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 底部导航 */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setPartIndex((i) => Math.max(0, i - 1))}
            disabled={partIndex === 0}
            className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            上一部分
          </button>
          {partIndex < parts.length - 1 ? (
            <button
              onClick={goNext}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              下一部分
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {submitting ? '提交中...' : '提交测评'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShenduoAssessment;
