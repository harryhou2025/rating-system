'use client';

import React, { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { CDMM_DIMENSIONS } from '@/lib/cdmm';

interface Props {
  assessment: any;
  scale: any;
}

/** 能区英文名（对齐样板：中文（English）） */
const DIMENSION_LABELS: Record<string, string> = {
  '粗大动作': 'Gross Motor',
  '精细动作': 'Fine Motor',
  '自理能力': 'Self-help',
  '认知/学业': 'Cognitive/Academic',
  '社会/情绪': 'Social/Emotional',
  '语言理解': 'Receptive Language',
  '语言表达': 'Expressive Language',
  '游戏和学习': 'Play and Learning',
};

/** 脚印图片（对齐样板 docx 内嵌图：未做到=金色 / 不熟练=绿色 / 很熟练=蓝色） */
const FOOT_IMAGES: Record<string, string> = {
  yellow: '/footprints/footprint-gold.png',
  green: '/footprints/footprint-green.png',
  blue: '/footprints/footprint-blue.png',
};

/** 未评估脚印颜色（样板无此状态，沿用灰色 SVG 脚印） */
const FOOT_COLORS: Record<string, { fill: string; stroke: string }> = {
  gray: { fill: '#94a3b8', stroke: '#64748b' },
};

/** 小红灯表格红色边框（样板 #C00000） */
const RED_FLAG_BORDER = '#C00000';

/** 脚印：优先使用样板真实脚印图片；未评估（gray）回退为灰色 SVG 脚印 */
const Footprint: React.FC<{ color: string }> = ({ color }) => {
  const src = FOOT_IMAGES[color];
  if (src) {
    return <Image src={src} alt="里程碑脚印" width={28} height={28} className="inline-block align-middle" />;
  }
  const c = FOOT_COLORS[color] ?? FOOT_COLORS.gray;
  return (
    <svg viewBox="0 0 48 48" className="w-7 h-7 inline-block align-middle">
      <ellipse cx="18" cy="14" rx="5.5" ry="7.5" fill={c.fill} stroke={c.stroke} strokeWidth="1.2" />
      <ellipse cx="30" cy="14" rx="5.5" ry="7.5" fill={c.fill} stroke={c.stroke} strokeWidth="1.2" />
      <path d="M16 26 q8 8 16 0 q-2 14 -8 16 q-6 -2 -8 -16z" fill={c.fill} stroke={c.stroke} strokeWidth="1.2" />
    </svg>
  );
};

/** ISO 日期 → 中文格式（2026-08-09 → 2026年8月9日） */
function formatCnDate(iso?: string): string {
  if (!iso) return '-';
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return `${m[1]}年${Number(m[2])}月${Number(m[3])}日`;
}

const CDMMResult: React.FC<Props> = ({ assessment, scale }) => {
  const details = assessment.result?.details ?? {};
  const dimResults = details.dimensionResults ?? {};
  const redFlag = details.redFlag ?? { triggered: false, items: [] };

  const childName = details.childName ?? '-';
  const gender = details.gender ?? '-';
  const birthDate = details.birthDate ?? '-';
  const ageGroup = details.ageGroup ?? '';
  const ageDisplay = details.ageDisplay ?? '-';
  const screeningDate = details.screeningDate ?? '-';

  /** 单元格通用样式：深色系表格 */
  const cell = 'border border-white/15 px-4 py-2 text-[13px] text-white/85';
  /** 标题行通用样式 */
  const headCell = 'border border-white/15 bg-white/10 font-semibold text-center px-4 py-2 text-[13px] text-white';
  /** 表头行（次一级） */
  const subHeadCell = 'border border-white/15 bg-white/5 font-semibold px-4 py-2 text-[13px] text-white';

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans">
      {/* 背景光晕（与其他量表结果页统一色系） */}
      <div className="fixed inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-teal-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-purple-500/10 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-3xl">
        {/* 头部（与其他量表一致） */}
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

        {/* 报告主体（玻璃卡片） */}
        <article className="bg-white/5 border border-white/10 rounded-3xl p-8">
          {/* 顶部装饰：三色脚印 */}
          <div className="flex justify-center gap-2 mb-6">
            <Footprint color="yellow" />
            <Footprint color="green" />
            <Footprint color="blue" />
          </div>

          {/* 抬头与引言（样板段落 3-7） */}
          <p className="text-sm leading-[1.9] mb-4 text-white font-semibold">尊敬的{childName}的父母/监护人：</p>
          <p className="text-sm leading-[1.9] mb-4 text-white/80">
            每一个孩子都值得我们给予人生中最好的礼物——一个充满潜力的大脑！
          </p>
          <p className="text-sm leading-[1.9] mb-4 text-white/80">
            儿童5岁之前是发育最快也是大脑潜力发展的关键时期，涵盖儿童运动、语言、行为、认知、情绪等各种能力完好发展，以及良好的生活习惯、行为习惯的养成。和之后的学业表现、社会适应以及未来成就密切相关
          </p>
          <p className="text-sm leading-[1.9] mb-4 text-white/80">
            发育里程碑（也就是孩子如何抬头翻身走跑跳、说话、玩耍、学习、等）是大多数孩子在一定年龄可以做的事情。所有0-5岁的孩子都需要进行发育监测，以帮助爸妈、其他养育人、孩子的医生、老师等知道你的孩子的大脑发育是否步入正轨。
          </p>
          <p className="text-sm leading-[1.9] mb-5 text-white/80">
            跟踪孩子大脑发展的最佳人选就是您！您就是孩子最好的发育行为教练！
          </p>
          <p className="text-sm leading-[1.9] mb-5 text-white">
            恭喜完成了{ageGroup}的里程碑核验！快来看看你的里程碑彩虹图脚印吧！
          </p>

          {/* 表格 1：儿童信息（隐藏筛查编号/提供筛查机构） */}
          <table className="w-full border-collapse mb-5">
            <tbody>
              <tr>
                <td className={cell}>儿童姓名：{childName}</td>
                <td className={cell}>完成筛查日期：{formatCnDate(screeningDate)}</td>
              </tr>
              <tr>
                <td className={cell}>儿童出生日期：{formatCnDate(birthDate)}</td>
                <td className={cell}>完成筛查年龄：{ageDisplay}</td>
              </tr>
            </tbody>
          </table>

          {/* 结束语（样板段落 12） */}
          <p className="text-sm leading-[1.9] mb-5 text-white/80">
            儿童的全面发展需要爸爸妈妈的持续支持，请根据我们提供的各项建议积极与孩子进行游戏，充分利用每一次亲自互动促进孩子全面发展。
          </p>

          {/* 表格 2：儿童发育里程碑彩虹图脚印（样板表格 2） */}
          <table className="w-full border-collapse mb-5">
            <tbody>
              <tr>
                <td colSpan={4} className={headCell}>
                  儿童发育里程碑彩虹图脚印　使用{ageGroup}里程碑
                </td>
              </tr>
              <tr>
                <td colSpan={2} className={cell}>儿童姓名：{childName}</td>
                <td colSpan={2} className={cell}>完成筛查月龄：{ageDisplay}</td>
              </tr>
              <tr>
                <td colSpan={2} className={cell}>儿童性别：{gender}</td>
                <td colSpan={2} className={cell}>完成筛查日期：{formatCnDate(screeningDate)}</td>
              </tr>
              <tr>
                <td className={`${cell} text-center`}>图例</td>
                <td className={`${cell} text-center`}>
                  <Footprint color="yellow" />
                  <span className="ml-1.5">未做到</span>
                </td>
                <td className={`${cell} text-center`}>
                  <Footprint color="green" />
                  <span className="ml-1.5">不熟练</span>
                </td>
                <td className={`${cell} text-center`}>
                  <Footprint color="blue" />
                  <span className="ml-1.5">很熟练</span>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className={subHeadCell + ' text-center'}>能区</td>
                <td colSpan={2} className={subHeadCell + ' text-center'}>筛查结果</td>
              </tr>
              {CDMM_DIMENSIONS.map((dim) => {
                const r = dimResults[dim];
                return (
                  <tr key={dim}>
                    <td colSpan={2} className={cell}>{dim}（{DIMENSION_LABELS[dim]}）</td>
                    <td colSpan={2} className={`${cell} text-center`}>
                      <Footprint color={r ? r.color : 'gray'} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* 导语（样板段落 13） */}
          <p className="text-sm leading-[1.9] mb-4 text-white">孩子目前阶段需要努力实现的里程碑包括：</p>

          {/* 表格 3：发展目标里程碑（样板表格 3，按能区区分"未做到/不熟练"） */}
          <table className="w-full border-collapse mb-5">
            <tbody>
              <tr>
                <td colSpan={3} className={headCell}>发展目标里程碑</td>
              </tr>
              <tr>
                <td colSpan={2} className={cell}>儿童姓名：{childName}</td>
                <td className={cell}>完成筛查月龄：{ageDisplay}</td>
              </tr>
              <tr>
                <td colSpan={2} className={cell}>儿童性别：{gender}</td>
                <td className={cell}>完成筛查日期：{formatCnDate(screeningDate)}</td>
              </tr>
              {CDMM_DIMENSIONS.map((dim) => {
                const d = dimResults[dim];
                const items = [
                  ...(d?.notDone ?? []).map((t: string) => ({ t, status: '未做到' })),
                  ...(d?.notSkilled ?? []).map((t: string) => ({ t, status: '不熟练' })),
                ];
                if (items.length === 0) return null;
                return (
                  <Fragment key={dim}>
                    <tr>
                      <td colSpan={2} className={subHeadCell}>{dim}（{DIMENSION_LABELS[dim]}）能区</td>
                      <td className={`${subHeadCell} text-center`}>目前水平</td>
                    </tr>
                    {items.map((it, i) => (
                      <tr key={i}>
                        <td className={`${cell} text-center w-10`}>{i + 1}</td>
                        <td className={cell}>{it.t}</td>
                        <td className={`${cell} text-center`}>{it.status}</td>
                      </tr>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>

          {/* 导语（样板段落 16） */}
          <p className="text-sm leading-[1.9] mb-4 text-white">孩子在本月龄出现了需要爸爸妈妈密切关注的里程碑小红灯：</p>

          {/* 表格 4：发育里程碑小红灯（样板表格 4，红色边框 #C00000） */}
          <table
            className="w-full border-collapse mb-5"
            style={{ border: `2px solid ${RED_FLAG_BORDER}` }}
          >
            <tbody>
              <tr>
                <td
                  colSpan={2}
                  className="font-semibold text-center px-4 py-2 text-[13px] text-red-300"
                  style={{ borderBottom: `1px solid ${RED_FLAG_BORDER}`, background: 'rgba(192,0,0,0.15)' }}
                >
                  发育里程碑小红灯
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-[13px] text-white/85" style={{ borderRight: `1px solid ${RED_FLAG_BORDER}` }}>儿童姓名：{childName}</td>
                <td className="px-4 py-2 text-[13px] text-white/85">完成筛查月龄：{ageDisplay}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-[13px] text-white/85" style={{ borderTop: `1px solid ${RED_FLAG_BORDER}`, borderRight: `1px solid ${RED_FLAG_BORDER}` }}>儿童性别：{gender}</td>
                <td className="px-4 py-2 text-[13px] text-white/85" style={{ borderTop: `1px solid ${RED_FLAG_BORDER}` }}>完成筛查日期：{formatCnDate(screeningDate)}</td>
              </tr>
              {redFlag.triggered ? (
                ((redFlag.items as string[]) ?? []).map((item, i) => (
                  <tr key={i}>
                    <td
                      colSpan={2}
                      className="px-4 py-2 text-[13px] text-white/85"
                      style={{ borderTop: `1px solid ${RED_FLAG_BORDER}` }}
                    >
                      {item}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-2 text-[13px] text-white/85"
                    style={{ borderTop: `1px solid ${RED_FLAG_BORDER}` }}
                  >
                    本次核验未发现需要特别关注的警示标志。
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 结束（样板段落 18；签字/日期按需求不显示） */}
          <p className="text-sm leading-[1.9] text-white/85">祝好！</p>
        </article>
      </div>
    </div>
  );
};

export default CDMMResult;
