import type { ScoringResult } from './scoring';

/** 月龄组区间（天数，"月数×30+天数"归一化，闭区间） */
export interface AgeGroup {
  label: string;
  minDays: number;
  maxDays: number;
}

/**
 * 18 个月龄组。相邻组存在重叠日（如 90 = "2月30天" = "3月0天"），
 * 匹配采用顺序查找第一个命中 → 重叠日归属低月龄组。
 */
export const AGE_GROUPS: AgeGroup[] = [
  { label: '2月龄', minDays: 30, maxDays: 90 },
  { label: '4月龄', minDays: 90, maxDays: 150 },
  { label: '6月龄', minDays: 150, maxDays: 210 },
  { label: '8月龄', minDays: 210, maxDays: 270 },
  { label: '10月龄', minDays: 270, maxDays: 330 },
  { label: '12月龄', minDays: 330, maxDays: 390 },
  { label: '14月龄', minDays: 390, maxDays: 450 },
  { label: '16月龄', minDays: 450, maxDays: 510 },
  { label: '18月龄', minDays: 510, maxDays: 570 },
  { label: '20月龄', minDays: 570, maxDays: 630 },
  { label: '22月龄', minDays: 630, maxDays: 690 },
  { label: '24月龄', minDays: 690, maxDays: 900 },
  { label: '3岁', minDays: 900, maxDays: 1260 },
  { label: '4岁', minDays: 1260, maxDays: 1620 },
  { label: '5岁', minDays: 1620, maxDays: 1980 },
  { label: '6岁', minDays: 1980, maxDays: 2340 },
  { label: '7岁', minDays: 2340, maxDays: 2700 },
  { label: '8岁', minDays: 2700, maxDays: 3060 },
];

/** 矫正月龄 ≤0月30天(30) 或 ≥102月0天(3060) → 报错，不进入答题 */
export const MIN_VALID_DAYS = 30;
export const MAX_VALID_DAYS = 3060;

export const CDMM_DIMENSIONS = [
  '粗大动作', '精细动作', '自理能力', '认知/学业',
  '社会/情绪', '语言理解', '语言表达', '游戏和学习',
];

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 计算矫正年龄天数。
 * 足月：按实际出生日期；早产：按预产期（"预产期 − 出生日期"的天数差矫正）。
 */
export function calculateCorrectedAgeDays(
  birthDate: string,
  dueDate?: string,
  now: Date = new Date()
): number {
  const anchor = dueDate ? new Date(dueDate + 'T00:00:00') : new Date(birthDate + 'T00:00:00');
  return Math.floor((now.getTime() - anchor.getTime()) / DAY_MS);
}

/** 匹配月龄组；超出有效范围返回 null（调用方报错）。 */
export function matchAgeGroup(ageDays: number): AgeGroup | null {
  if (ageDays <= MIN_VALID_DAYS || ageDays >= MAX_VALID_DAYS) return null;
  return AGE_GROUPS.find((g) => ageDays >= g.minDays && ageDays <= g.maxDays) ?? null;
}

/** 展示年龄：天数 → "1岁6月3天" / "2月5天" / "9天" */
export function formatAgeDisplay(ageDays: number): string {
  const months = Math.floor(ageDays / 30);
  const days = ageDays % 30;
  const years = Math.floor(months / 12);
  const restMonths = months % 12;
  if (years > 0) return `${years}岁${restMonths}月${days}天`;
  if (months > 0) return `${months}月${days}天`;
  return `${days}天`;
}

export type DimensionColor = 'blue' | 'green' | 'yellow';

/** 每题所属维度与题型（由题目 meta/dimension 组装） */
export interface CDMMQuestionInfo {
  id: string;
  dimension: string;   // 能区名或 '警示标志'
  kind: 'milestone' | 'redflag';
}

export interface CDMMContext {
  childName: string;
  gender: '男' | '女';
  birthDate: string;
  isPremature: boolean;
  ageGroup: string;          // 匹配到的月龄组标签
  correctedAgeDays: number;
  ageDisplay: string;
  screeningDate: string;     // YYYY-MM-DD
  screeningNumber: string;
  provider: string;
}

/**
 * CDMM 计分：
 * - 里程碑题（选项 0/1/2 = 未做到/不熟练/很熟练）：
 *   每能区独立：全 2 → blue；有 1 无 0 → green；有 0 → yellow。
 * - 警示题（选项 0/1 = 没有/有）：任一 1 → 红灯亮。
 * - 目标里程碑 = 各能区 notDone（未做到）+ notSkilled（不熟练）。
 */
export function calculateCDMM(
  answers: Record<string, number>,
  questions: CDMMQuestionInfo[],
  contentMap: Record<string, string>,
  context: CDMMContext
): ScoringResult {
  const milestoneByDim: Record<string, { values: number[]; contents: string[] }> = {};
  for (const dim of CDMM_DIMENSIONS) milestoneByDim[dim] = { values: [], contents: [] };

  const redFlagItems: string[] = [];
  let validAnswerCount = 0;

  for (const q of questions) {
    const value = answers[q.id];
    if (value === undefined || value === null) continue;
    if (q.kind === 'redflag') {
      // 警示题：仅 0/1 合法，其余值跳过
      if (value !== 0 && value !== 1) continue;
      validAnswerCount++;
      if (value === 1) redFlagItems.push(contentMap[q.id] ?? q.id);
    } else {
      // 里程碑题：仅 0/1/2 合法，其余值跳过（避免非法值被静默计为 blue）
      if (value !== 0 && value !== 1 && value !== 2) continue;
      validAnswerCount++;
      const bucket = milestoneByDim[q.dimension];
      if (!bucket) continue;
      bucket.values.push(value);
      bucket.contents.push(contentMap[q.id] ?? q.id);
    }
  }

  const dimensionResults: Record<string, { color: DimensionColor; notDone: string[]; notSkilled: string[] }> = {};
  for (const dim of CDMM_DIMENSIONS) {
    const { values, contents } = milestoneByDim[dim];
    if (values.length === 0) continue;
    const color: DimensionColor = values.includes(0) ? 'yellow' : values.includes(1) ? 'green' : 'blue';
    dimensionResults[dim] = {
      color,
      notDone: contents.filter((_, i) => values[i] === 0),
      notSkilled: contents.filter((_, i) => values[i] === 1),
    };
  }

  const blueCount = Object.values(dimensionResults).filter((d) => d.color === 'blue').length;

  const redFlag = { triggered: redFlagItems.length > 0, items: redFlagItems };
  const hasYellow = Object.values(dimensionResults).some((d) => d.color === 'yellow');
  const hasGreen = Object.values(dimensionResults).some((d) => d.color === 'green');

  let severity: string;
  let recommendation: string;
  if (validAnswerCount === 0) {
    severity = '未完成评估';
    recommendation = '本次核验无有效作答，请重新完成测评。';
  } else if (redFlag.triggered) {
    severity = '存在警示信号';
    recommendation = '本次核验发现警示标志（红灯），建议尽快咨询儿保医生或专业发育评估机构。';
  } else if (hasYellow) {
    severity = '需关注';
    recommendation = `本次核验发现部分能区存在"未做到"的里程碑，建议咨询儿保医生并加强针对性练习。`;
  } else if (hasGreen) {
    severity = '良好';
    recommendation = `本次核验整体良好，个别里程碑尚不熟练，建议持续练习并定期复测。`;
  } else {
    severity = '优秀';
    recommendation = `本次核验 ${context.ageGroup} 发育里程碑，8 大能区中 ${blueCount} 个能区全部达标。`;
  }

  return {
    totalScore: blueCount, // 蓝色（全部达标）能区数，非原始分
    severity,
    recommendation,
    details: {
      ...context,
      dimensionResults,
      redFlag,
      milestoneItems: Object.fromEntries(
        Object.entries(dimensionResults).map(([dim, d]) => [dim, [...d.notDone, ...d.notSkilled]])
      ),
    },
  };
}
