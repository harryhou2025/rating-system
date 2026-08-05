'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { CDMM_DIMENSIONS } from '@/lib/cdmm';

interface Props {
  assessment: any;
  scale: any;
}

const COLOR_META: Record<string, { label: string; fill: string; stroke: string }> = {
  blue: { label: '全部很熟练', fill: '#60a5fa', stroke: '#3b82f6' },
  green: { label: '存在不熟练', fill: '#34d399', stroke: '#10b981' },
  yellow: { label: '存在未做到', fill: '#fbbf24', stroke: '#f59e0b' },
};

/** 脚丫 SVG：简单脚印形状，颜色随状态 */
const Footprint: React.FC<{ color: 'blue' | 'green' | 'yellow' }> = ({ color }) => {
  const c = COLOR_META[color];
  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12">
      <ellipse cx="18" cy="14" rx="6" ry="8" fill={c.fill} stroke={c.stroke} strokeWidth="1.5" />
      <ellipse cx="30" cy="14" rx="6" ry="8" fill={c.fill} stroke={c.stroke} strokeWidth="1.5" />
      <path d="M16 26 q8 8 16 0 q-2 14 -8 16 q-6 -2 -8 -16z" fill={c.fill} stroke={c.stroke} strokeWidth="1.5" />
    </svg>
  );
};

const CDMMResult: React.FC<Props> = ({ assessment, scale }) => {
  const details = assessment.result?.details ?? {};
  const dimResults = details.dimensionResults ?? {};
  const redFlag = details.redFlag ?? { triggered: false, items: [] };
  const milestones = details.milestoneItems ?? {};

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

      {/* 头部：logo + 返回按钮 + 标题 */}
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-2xl">
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
            <h1 className="text-xl font-bold text-white">CDMM 儿童发育里程碑核验报告</h1>
          </div>
          <Link
            href="/scales"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            返回量表列表
          </Link>
        </div>

        {/* 1. 儿童信息卡（与样板表格 0 对应） */}
        <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">儿童信息</h2>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-white/60">儿童姓名：{details.childName ?? '-'}</span>
            <span className="text-white/60">性别：{details.gender ?? '-'}</span>
            <span className="text-white/60">出生日期：{details.birthDate ?? '-'}</span>
            <span className="text-white/60">完成筛查年龄：{details.ageDisplay ?? '-'}</span>
            <span className="text-white/60">完成筛查日期：{details.screeningDate ?? '-'}</span>
            <span className="text-white/60">筛查编号：{details.screeningNumber ?? '-'}</span>
            <span className="col-span-2 text-white/60">提供筛查机构：{details.provider ?? 'XXXXXXXX'}</span>
          </div>
        </section>

        {/* 2. 彩虹脚丫图（与样板表格 1 对应）：8 能区 + 图例 */}
        <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 mb-8">
          <h2 className="text-lg font-bold mb-2">儿童发育里程碑彩虹图脚印</h2>
          <p className="text-sm text-white/50 mb-4">使用{details.ageGroup ?? ''}里程碑</p>
          <div className="flex gap-4 mb-6 text-xs text-white/60">
            {Object.entries(COLOR_META).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ background: v.fill }} />
                {v.label}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CDMM_DIMENSIONS.map((dim) => {
              const r = dimResults[dim];
              return (
                <div key={dim} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10">
                  {r ? <Footprint color={r.color} /> : <Footprint color="blue" />}
                  <span className="text-xs text-white/70 text-center leading-tight">{dim}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. 发展目标里程碑（与样板表格 2 对应）：按能区列未做到/不熟练 */}
        <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">发展目标里程碑</h2>
          <p className="text-sm text-white/50 mb-4">孩子目前阶段需要努力实现的里程碑包括：</p>
          {Object.entries(milestones).map(([dim, items]) => {
            const list = (items as string[]) ?? [];
            if (list.length === 0) return null;
            return (
              <div key={dim} className="mb-5">
                <h3 className="text-sm font-semibold text-teal-400 mb-2">{dim}能区</h3>
                <ul className="space-y-1.5">
                  {list.map((item, i) => (
                    <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                      <span className="text-white/40">·</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          {Object.values(milestones).every((v) => (v as string[]).length === 0) && (
            <p className="text-sm text-white/60">全部里程碑均达标，继续保持！</p>
          )}
        </section>

        {/* 4. 小红灯区（与样板表格 3 对应） */}
        <section className={`bg-gradient-to-br border rounded-3xl p-6 mb-8 ${
          redFlag.triggered
            ? 'from-red-500/15 to-red-500/[0.03] border-red-500/30'
            : 'from-white/5 to-white/[0.02] border-white/10'
        }`}>
          <h2 className="text-lg font-bold mb-4">发育里程碑小红灯</h2>
          {redFlag.triggered ? (
            <>
              <p className="text-sm text-red-400 mb-3">孩子在本月龄出现了需要爸爸妈妈密切关注的里程碑小红灯：</p>
              <ul className="space-y-2">
                {(redFlag.items as string[]).map((item, i) => (
                  <li key={i} className="text-sm text-white/90 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-white/50 mt-4">建议尽快咨询儿保医生或专业发育评估机构。</p>
            </>
          ) : (
            <p className="text-sm text-white/60">未发现红灯，孩子目前未出现警示标志。</p>
          )}
        </section>

        {/* 5. 结束语与签字区（样板段落 18-20） */}
        <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 mb-8">
          <p className="text-sm text-white/70 mb-6 leading-relaxed">
            儿童的全面发展需要爸爸妈妈的持续支持，请根据我们提供的各项建议积极与孩子进行游戏，
            充分利用每一次亲子互动促进孩子全面发展。祝好！
          </p>
          <div className="flex justify-between text-sm text-white/70">
            <span>签字：____________</span>
            <span>日期：____________</span>
          </div>
        </section>

        <Link href="/scales" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 rounded-xl">
          <ArrowLeft className="h-4 w-4" /> 返回量表列表
        </Link>
      </div>
    </div>
  );
};

export default CDMMResult;
