'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { SHEINDUO_TRAITS } from '@/lib/shenduo';

interface Props {
  assessment: any;
  scale: any;
}

const ShenduoResult: React.FC<Props> = ({ assessment }) => {
  const result = assessment.result ?? {};
  const details = result.details ?? {};
  const dimensionResults = (details.dimensionResults ?? {}) as Record<string, any>;
  const combos = (details.combos ?? []) as Array<{ traits: string; emoji: string; title: string; text: string }>;
  const resources = details.resources ?? {};
  const notableTraits = SHEINDUO_TRAITS.filter((t) => dimensionResults[t.dimension]?.score >= 6);

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans">
      {/* 背景 */}
      <div className="fixed inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-teal-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-purple-500/10 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-2xl">
        {/* 头部 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 rounded-full p-1.5">
              <Image
                src="/logo.png"
                alt="靛蓝之家"
                fill
                className="object-contain rounded-full"
              />
            </div>
            <h1 className="text-xl font-bold text-white">你的神经多样性报告</h1>
          </div>
          <Link
            href="/scales"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            返回量表列表
          </Link>
        </div>

        {/* 0. 综合星象解读 */}
        <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 mb-8">
          <h2 className="text-lg font-bold mb-1">🔮 综合星象解读</h2>
          <p className="text-sm text-white/50 mb-4">三种特质并非互斥——你可能是多种星人的独特组合。</p>
          {result.recommendation && (
            <p className="text-sm text-white/90 leading-relaxed mb-4">{result.recommendation}</p>
          )}
          {combos.length > 0 && (
            <div className="space-y-3">
              {combos.map((c) => (
                <div key={c.traits} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="font-semibold text-sm">
                    {c.emoji} {c.traits} 组合 = <span className="text-teal-300">{c.title}</span>
                  </p>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 1. 三特质比例卡 */}
        <div className="space-y-6 mb-8">
          {SHEINDUO_TRAITS.map((t) => {
            const d = dimensionResults[t.dimension];
            if (!d) return null;
            return (
              <section
                key={t.key}
                className="rounded-3xl p-6 border"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))', borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: `${d.color}26` }}
                    >
                      {d.emoji}
                    </div>
                    <div>
                      <p className="font-bold">
                        {d.name} <span className="text-xs font-normal text-white/45">（{d.trait}）</span>
                      </p>
                      <p className="text-[11px] text-white/40">{d.reference}</p>
                    </div>
                  </div>
                  <span
                    className="text-xs px-3 py-1 rounded-full border"
                    style={{ color: d.color, borderColor: `${d.color}55`, background: `${d.color}1a` }}
                  >
                    {d.level}
                  </span>
                </div>

                <div className="flex items-end gap-2 my-4">
                  <span className="text-3xl font-bold" style={{ color: d.color }}>{d.percent}%</span>
                  <span className="text-sm text-white/50 mb-1">{d.score} / 20 分 · {d.percentRange}</span>
                </div>

                <div className="h-3 rounded-full bg-white/10 overflow-hidden mb-5">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(d.percent, 2)}%`, background: `linear-gradient(90deg, ${d.color}, ${d.color}99)` }}
                  />
                </div>

                <p className="text-sm text-white/80 leading-relaxed">{d.interpretation}</p>
              </section>
            );
          })}
        </div>

        {/* 2. 高分建议 */}
        {notableTraits.length > 0 && (
          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 mb-8">
            <h2 className="text-lg font-bold mb-1">💡 高分特质小建议</h2>
            <p className="text-sm text-white/50 mb-4">如果你在某项特质上得分较高，这里有一些建议和资源。</p>
            <div className="space-y-4">
              {notableTraits.map((t) => (
                <div key={t.key} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="font-semibold text-sm mb-2">
                    {t.emoji} {t.name}高分建议
                  </p>
                  <ul className="space-y-1.5">
                    {(t.advice ?? []).map((a, i) => (
                      <li key={i} className="text-sm text-white/75 flex items-start gap-2">
                        <span className="text-white/40">·</span>{a}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. 附录资源 */}
        <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 mb-8">
          <h2 className="text-lg font-bold mb-1">📚 附录：深入了解与求助资源</h2>
          <p className="text-sm text-white/50 mb-4">如果你在某项特质上得分较高，这里有一些建议和资源。</p>
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-teal-400 mb-2">📖 推荐阅读</h3>
            <ul className="space-y-1.5">
              {((resources.books ?? []) as string[]).map((b, i) => (
                <li key={i} className="text-sm text-white/75 flex items-start gap-2">
                  <span className="text-white/40">·</span>{b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-teal-400 mb-2">🏥 如需专业帮助</h3>
            <ul className="space-y-1.5">
              {((resources.help ?? []) as string[]).map((h, i) => (
                <li key={i} className="text-sm text-white/75 flex items-start gap-2">
                  <span className="text-white/40">·</span>{h}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. 写在最后 + 免责声明 */}
        <section className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 mb-8">
          <p className="text-sm text-white/85 leading-relaxed mb-3">
            神经多样性不是缺陷，而是人类认知光谱的自然延展。就像自然界需要不同的物种来维持生态平衡，
            社会也需要不同神经类型的人来推动创新、深度思考和温情关怀。
            了解自己，接纳自己，然后——做最舒服的自己。
          </p>
          <p className="text-xs text-amber-200/80">
            ⚠️ {details.disclaimer ?? '本量表仅供自我探索与科普参考，不能替代专业医学诊断。'}
          </p>
        </section>

        <Link href="/scales" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 rounded-xl">
          <ArrowLeft className="h-4 w-4" /> 返回量表列表
        </Link>
      </div>
    </div>
  );
};

export default ShenduoResult;
