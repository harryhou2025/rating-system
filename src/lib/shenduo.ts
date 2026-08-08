import type { ScoringResult } from './scoring';

/** 神经多样性特质自筛量表：汪星人(ADHD) / 喵星人(ASD) / 敏感星人(HSP) */

export interface ShenduoTrait {
  key: 'dog' | 'cat' | 'flower';
  emoji: string;
  name: string;
  trait: string;
  /** questions 表中 dimension 字段的存储值 */
  dimension: string;
  reference: string;
  description: string;
  interpretation: string;
  advice: string[];
  /** 结果页视觉主色 */
  color: string;
}

export const SHEINDUO_TRAITS: ShenduoTrait[] = [
  {
    key: 'dog',
    emoji: '🐕',
    name: '汪星人',
    trait: 'ADHD 特质',
    dimension: '汪星人',
    reference: '参考 WHO 成人 ADHD 自筛量表（ASRS）核心维度',
    description: '注意力波动大、精力旺盛、渴望新奇刺激、多线程思维。',
    interpretation:
      '汪星人比例高的人，大脑追求新奇与刺激，思维跳跃、精力旺盛。优势是创造力强、行动力快；挑战是容易分心、冲动。建议：利用"兴趣驱动"完成任务，拆分大目标为小步骤，必要时寻求专业评估。',
    advice: [
      '尝试番茄工作法（25分钟专注+5分钟休息）',
      '用"身体带动大脑"——边走边想、站着办公',
      '减少手机通知干扰，一次只开一个窗口',
      '如严重影响生活，可就诊精神科评估是否需药物辅助',
    ],
    color: '#f59e0b',
  },
  {
    key: 'cat',
    emoji: '🐱',
    name: '喵星人',
    trait: 'ASD 特质',
    dimension: '喵星人',
    reference: '参考 AQ 量表与 RAADS-R 设计',
    description: '社交偏好独特、对细节敏感、需要规律性、感官体验特殊、深度专注。',
    interpretation:
      '喵星人比例高的人，拥有独特的社交认知方式和深度专注力。优势是观察力敏锐、逻辑清晰、忠诚度极高；挑战是社交耗能大、对变化敏感。建议：尊重自己的社交节奏，创造可预测的环境，不必强迫自己"合群"。',
    advice: [
      '提前准备社交脚本，减少临场焦虑',
      '允许自己使用"社交能量配额"管理',
      '找到适合自己的表达方式和沟通节奏',
      '可通过专业机构进行 ASD 正式评估',
    ],
    color: '#14b8a6',
  },
  {
    key: 'flower',
    emoji: '🌸',
    name: '敏感星人',
    trait: 'HSP 特质',
    dimension: '敏感星人',
    reference: '参考 Elaine Aron 的 HSP 量表设计',
    description: '感官敏锐、情绪深刻、共情力强、易被过度刺激、内心世界丰富。',
    interpretation:
      '敏感星人比例高的人，神经系统对内外刺激的处理更深入。优势是共情力强、审美敏锐、思考深刻；挑战是容易过载、需要更多恢复时间。建议：主动管理刺激输入，建立"安静仪式"，将敏感转化为创造力和洞察力。',
    advice: [
      '每天预留"无刺激时间"（如冥想、散步）',
      '学会说"不"，保护自己的能量边界',
      '将敏感力转化为创作、咨询或疗愈工作',
      '阅读 Elaine Aron《高敏感是种天赋》',
    ],
    color: '#ec4899',
  },
];

export interface ShenduoLevel {
  level: string;
  percentRange: string;
}

/** 每部分满分 20，得分区间与占比分级（0-5 不明显 / 6-10 轻度 / 11-15 突出 / 16-20 显著） */
export function getLevel(score: number): ShenduoLevel {
  if (score <= 5) return { level: '不明显', percentRange: '0%-25%' };
  if (score <= 10) return { level: '轻度存在', percentRange: '30%-50%' };
  if (score <= 15) return { level: '较为突出', percentRange: '55%-75%' };
  return { level: '非常显著', percentRange: '80%-100%' };
}

export interface ShenduoQuestionInfo {
  id: string;
  dimension: string;
}

const COMBO_DEFS: Array<{
  a: string;
  b: string;
  emoji: string;
  title: string;
  text: string;
}> = [
  {
    a: '汪星人',
    b: '喵星人',
    emoji: '🐕🐱',
    title: '思维活跃但社交独特',
    text: '你既有旺盛的好奇心与跳跃的思维，又带着独特的社交节奏与深度专注力。',
  },
  {
    a: '喵星人',
    b: '敏感星人',
    emoji: '🐱🌸',
    title: '深度观察者型',
    text: '你拥有敏锐的感知与细致的观察力，能捕捉他人忽略的细节、情绪与美。',
  },
  {
    a: '汪星人',
    b: '敏感星人',
    emoji: '🐕🌸',
    title: '热情但容易内耗',
    text: '你热情、行动力强，同时对刺激敏感，容易在热闹之后感到疲惫与自我消耗。',
  },
];

/**
 * 神经多样性特质计分：每题 符合=1 / 不符合=0，
 * 按 dimension 汇总三个特质得分（每特质满分 20），百分比 = 得分 × 5。
 * 作答值白名单为 0/1，其余值忽略。
 */
export function calculateShenduo(
  answers: Record<string, number>,
  questions: ShenduoQuestionInfo[]
): ScoringResult {
  const dimScores: Record<string, number> = {};
  for (const t of SHEINDUO_TRAITS) dimScores[t.dimension] = 0;

  let answeredCount = 0;
  for (const q of questions) {
    const v = answers[q.id];
    if (v === undefined || v === null) continue;
    if (v !== 0 && v !== 1) continue;
    answeredCount++;
    if (dimScores[q.dimension] !== undefined) dimScores[q.dimension] += v;
  }

  const dimensionResults: Record<string, any> = {};
  for (const t of SHEINDUO_TRAITS) {
    const score = dimScores[t.dimension];
    const lv = getLevel(score);
    dimensionResults[t.dimension] = {
      key: t.key,
      emoji: t.emoji,
      name: t.name,
      trait: t.trait,
      reference: t.reference,
      score,
      percent: score * 5,
      level: lv.level,
      percentRange: lv.percentRange,
      interpretation: t.interpretation,
      advice: t.advice,
      color: t.color,
    };
  }

  const combos = COMBO_DEFS.filter((c) => dimScores[c.a] >= 6 && dimScores[c.b] >= 6)
    .map((c) => ({
      traits: `${c.a} + ${c.b}`,
      emoji: c.emoji,
      title: c.title,
      text: c.text,
      total: dimScores[c.a] + dimScores[c.b],
    }))
    .sort((x, y) => y.total - x.total);

  let severity: string;
  let recommendation: string;

  if (answeredCount === 0) {
    severity = '未完成评估';
    recommendation = '本次测评没有有效的作答记录，请返回重新完成测评。';
  } else {
    const maxTrait = SHEINDUO_TRAITS.reduce((max, t) =>
      dimScores[t.dimension] > dimScores[max.dimension] ? t : max
    );
    const notable = SHEINDUO_TRAITS.filter((t) => dimScores[t.dimension] >= 6).sort(
      (a, b) => dimScores[b.dimension] - dimScores[a.dimension]
    );

    if (notable.length === 0) {
      severity = '特质均不明显';
      recommendation =
        '三种特质均不明显，你的神经类型较为均衡稳定。本量表仅供自我探索参考，不构成医学诊断。';
    } else {
      const maxLevel = getLevel(dimScores[maxTrait.dimension]).level;
      severity = `${maxTrait.name}特质${maxLevel}`;
      const top = notable[0];
      const topRes = dimensionResults[top.dimension];
      recommendation = `你最突出的是「${top.emoji}${top.name}」特质（${topRes.score}/20，${topRes.percent}%），属于「${topRes.level}」。`;
      if (notable.length > 1) {
        recommendation +=
          ' 此外 ' +
          notable
            .slice(1)
            .map((t) => `「${t.name}」(${dimensionResults[t.dimension].score}/20)`)
            .join('、') +
          ' 也具有一定倾向。';
      }
      recommendation += ' 结合下方各特质解读与建议，把特点变成优势。本量表仅供自我探索参考，不构成医学诊断。';
    }
  }

  return {
    totalScore: answeredCount === 0 ? 0 : Object.values(dimScores).reduce((a, b) => a + b, 0),
    severity,
    recommendation,
    details: {
      dimensionResults,
      combos,
      genericCombo: '三种特质并非互斥——你可能是多种星人的独特组合。了解自己，接纳自己，然后——做最舒服的自己。',
      answeredCount,
      resources: {
        books: [
          '《高敏感是种天赋》— Elaine Aron 著（HSP 经典入门）',
          '《分心不是我的错》— Edward Hallowell 著（ADHD 科普）',
          '《自闭症生存指南》— 自闭症人士自述合集',
          '《神经多样性宣言》— Judy Singer 著（理论奠基）',
        ],
        help: [
          '前往三甲医院精神科/心理科进行正式评估',
          '成人 ADHD 可咨询：各地精神卫生中心成人 ADHD 门诊',
          'ASD 评估可联系：具有成人 ASD 诊断资质的心理机构',
          '心理援助热线：北京心理危机研究与干预中心 010-82951332',
        ],
      },
      disclaimer: '本量表仅供自我探索与科普参考，不能替代专业医学诊断。',
    },
  };
}
