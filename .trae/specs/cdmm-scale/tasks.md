# CDMM 儿童发育里程碑核验系统 - 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有量表系统上实现 CDMM 完整流程：儿童信息采集 → 矫正月龄匹配 18 个月龄组 → 按 8 大能区 + 警示标志分组答题 → 按 docx 样板展示 H5 结果报告。

**Architecture:** 复用现有 scales/questions/assessments 表与通用答题/结果路由，对 `cdmm-scale` 做分支渲染。新增 4 个文件承载 CDMM 专属逻辑：`src/lib/cdmm.ts`（纯函数：矫正年龄/月龄匹配/计分，可单测）、`src/lib/cdmm-import.ts`（xlsx 解析+清洗，纯函数可单测）、`src/components/cdmm/CDMMAssessment.tsx`（信息表单+分组答题）、`src/components/cdmm/CDMMResult.tsx`（H5 报告）。数据经 `scripts/import-cdmm.ts` 幂等入库，questions 表新增 `meta` 列存月龄组与题型。

**Tech Stack:** Next.js 14 + SQLite (sqlite3) + TypeScript + Tailwind + Jest；新增依赖 `xlsx`（解析数据源，必要依赖）。

---

## 数据源与关键事实（探查结论）

- **xlsx 数据源**: `/Users/hou/工作/5 里程碑定稿 2~8岁 20220217.xlsx`，单 sheet `Sheet1`，19 行 × 10 列。
  - 第 1 行表头：A=月龄组，B~I=8 大能区（粗大动作、精细动作、自理能力、认知/学业、社会/情绪、语言理解、语言表达、游戏和学习），J=警示标志。
  - 第 2~19 行 = 18 个月龄组（2月龄~8岁），每行一组。
  - 单元格内多条题目用 `◆` 分隔；存在换行、空格、纯括号注释（如 `（9~10月龄）`）需清洗。
  - 无警示标志的月龄组（J 列为空）：8月龄、14月龄、16月龄、20月龄、22月龄、7岁、8岁 —— 与 spec 一致。
  - **原始条目统计 826 题**（表头行不计），与 spec 声称的 **799 题** 不一致（差 27）。Task 3 的校验报告必须输出每月龄组/能区实际题数并与 799 对比；如确为数据源与 spec 版本差异，以 xlsx 为准并向用户确认。
- **规则文档**: `/Users/hou/工作/CDMM 量表规则简要.txt`（区间、能区计分、警示计分，与 spec 一致）。
- **结果样板**: `/Users/hou/工作/里程碑 结果输出样板_仅报告.docx`，结构 = 致家长信 → 儿童信息卡（姓名/出生日期/完成筛查年龄/完成筛查日期/筛查编号/提供筛查机构）→ 8 能区彩虹脚丫图（含图例：未做到/不熟练/很熟练）→ 发展目标里程碑（按能区列未做到/不熟练项）→ 小红灯区（命中项）→ 结束语+签字区。
- **答题界面示例**: `/Users/hou/工作/微信图片_20260803221258_529_57.png`（能区标签+三选项界面）。
- **现有架构**:
  - `questions` 表已有 `dimension` 字段，**无 `meta` 字段**（需新增）。
  - 通用流程：`/assessment/[id]` 逐题作答 → `POST /api/assessments` 调 `calculateScore` 入库 → `/result/[id]` 展示。
  - 量表列表页跳转 `/assessment/${scale.id}`；后台已有启停（`PATCH /api/admin/scales`）。
  - 项目计划文件约定存放于 `.trae/specs/<feature>/tasks.md`（本文件）。

---

## 文件结构

| 文件 | 操作 | 职责 |
|---|---|---|
| `src/lib/db.ts` | 修改 | questions 表新增 `meta` 列（新库建表 + 旧库 ALTER） |
| `src/types/index.ts` | 修改 | 新增 `QuestionMeta`、`CdmmChildInfo` 类型 |
| `src/lib/cdmm.ts` | 新建 | 矫正年龄、月龄组匹配、CDMM 计分（纯函数） |
| `tests/cdmm.test.ts` | 新建 | 年龄匹配 + 计分测试 |
| `src/lib/cdmm-import.ts` | 新建 | xlsx 解析 + ◆ 清洗（纯函数） |
| `tests/cdmm-import.test.ts` | 新建 | 清洗规则测试 |
| `scripts/import-cdmm.ts` | 新建 | 读 xlsx → 解析 → 幂等入库 → 校验报告 |
| `src/app/api/assessments/route.ts` | 修改 | POST 分支处理 cdmm-scale |
| `src/app/api/scales/[id]/route.ts` | 修改 | questions 映射补 `meta` 字段 |
| `src/components/cdmm/CDMMAssessment.tsx` | 新建 | 信息采集 + 分组答题 |
| `src/components/cdmm/CDMMResult.tsx` | 新建 | H5 报告 |
| `src/app/assessment/[id]/page.tsx` | 修改 | cdmm-scale 分支渲染答题组件 |
| `src/app/result/[id]/page.tsx` | 修改 | cdmm-scale 分支渲染结果组件 |
| `src/app/admin/page.tsx` | 修改 | cdmm-scale 只读（隐藏编辑/题目管理/删除） |
| `package.json` | 修改 | 新增依赖 `xlsx`、脚本 `import:cdmm` |

---

## Task 1: questions 表新增 meta 字段 + 类型定义

**Files:**
- Modify: `src/lib/db.ts`
- Modify: `src/types/index.ts`
- Modify: `src/app/api/scales/[id]/route.ts`

- [ ] **Step 1: db.ts 建表语句加 meta 列**

修改 `src/lib/db.ts` 中 questions 的 `CREATE TABLE IF NOT EXISTS`（约 L58-69），在 `dimension TEXT` 后追加：

```sql
        dimension TEXT,                      -- 维度
        meta TEXT                            -- 附加元数据（JSON，如月龄组与题型）
```

- [ ] **Step 2: 旧库 ALTER TABLE（幂等）**

`CREATE TABLE IF NOT EXISTS` 对已存在的旧库不生效，需在建表后检查列并补列。在 `initializeDatabase` 中 `CREATE INDEX` 语句之后追加：

```ts
    // 兼容旧库：questions 表补充 meta 列（幂等）
    const questionCols = await database.all('PRAGMA table_info(questions)');
    if (!questionCols.some((col: any) => col.name === 'meta')) {
      await database.exec('ALTER TABLE questions ADD COLUMN meta TEXT');
      console.log('已为 questions 表补充 meta 列');
    }
```

- [ ] **Step 3: types/index.ts 新增类型**

在 `src/types/index.ts` 的 `Question` interface 后追加：

```ts
export interface QuestionMeta {
  ageGroup: string;                 // 月龄组：'2月龄' | '4月龄' | ... | '8岁'
  kind: 'milestone' | 'redflag';    // 里程碑题 / 警示标志题
}

export interface CdmmChildInfo {
  name: string;
  gender: '男' | '女';
  birthDate: string;                // YYYY-MM-DD
  isPremature: boolean;
  dueDate?: string;                 // 早产时必填，YYYY-MM-DD（预产期）
}
```

- [ ] **Step 4: /api/scales/[id]/route.ts 透出 meta**

修改 `src/app/api/scales/[id]/route.ts` 的 `scaleQuestions.map`（约 L42-51），补 `meta`：

```ts
        scoringType: q.scoring_type,
        dimension: q.dimension,
        meta: q.meta ? JSON.parse(q.meta) : undefined,
```

- [ ] **Step 5: 验证**

Run: `npx tsc --noEmit`
Expected: 无类型错误。

---

## Task 2: CDMM 领域逻辑（矫正年龄 / 月龄匹配 / 计分）

**Files:**
- Create: `src/lib/cdmm.ts`
- Create: `tests/cdmm.test.ts`

- [ ] **Step 1: 写失败测试**

创建 `tests/cdmm.test.ts`：

```ts
import {
  AGE_GROUPS,
  matchAgeGroup,
  calculateCorrectedAgeDays,
  formatAgeDisplay,
  calculateCDMM,
  MIN_VALID_DAYS,
  MAX_VALID_DAYS,
} from '@/lib/cdmm';
import type { CDMMQuestionInfo } from '@/lib/cdmm';

describe('月龄组区间定义（18 组）', () => {
  it('区间与规则文档一致', () => {
    expect(AGE_GROUPS).toHaveLength(18);
    expect(AGE_GROUPS[0]).toEqual({ label: '2月龄', minDays: 30, maxDays: 90 });
    expect(AGE_GROUPS[11]).toEqual({ label: '24月龄', minDays: 690, maxDays: 900 });
    expect(AGE_GROUPS[12]).toEqual({ label: '3岁', minDays: 900, maxDays: 1260 });
    expect(AGE_GROUPS[17]).toEqual({ label: '8岁', minDays: 2700, maxDays: 3060 });
  });
});

describe('matchAgeGroup 边界（最高优先级）', () => {
  it('超界报错：≤0月30天(30) 与 ≥102月0天(3060)', () => {
    expect(matchAgeGroup(30)).toBeNull();
    expect(matchAgeGroup(3060)).toBeNull();
    expect(matchAgeGroup(0)).toBeNull();
    expect(matchAgeGroup(-5)).toBeNull();
  });
  it('区间内边界命中（重叠日归属低月龄组，顺序匹配第一个）', () => {
    expect(matchAgeGroup(31)!.label).toBe('2月龄');
    expect(matchAgeGroup(90)!.label).toBe('2月龄');   // 2月龄上限 = 4月龄下限
    expect(matchAgeGroup(91)!.label).toBe('4月龄');
    expect(matchAgeGroup(150)!.label).toBe('4月龄');
    expect(matchAgeGroup(151)!.label).toBe('6月龄');
    expect(matchAgeGroup(690)!.label).toBe('22月龄');
    expect(matchAgeGroup(691)!.label).toBe('24月龄');
    expect(matchAgeGroup(900)!.label).toBe('24月龄');
    expect(matchAgeGroup(901)!.label).toBe('3岁');
    expect(matchAgeGroup(3059)!.label).toBe('8岁');
  });
  it('全区间顺序无空洞', () => {
    for (let d = 31; d < 3060; d++) {
      expect(matchAgeGroup(d)).not.toBeNull();
    }
  });
});

describe('calculateCorrectedAgeDays 矫正月龄（预产期法）', () => {
  it('足月按实际出生日期', () => {
    const days = calculateCorrectedAgeDays('2023-01-01', undefined, new Date('2024-01-01'));
    expect(days).toBe(365);
  });
  it('早产按预产期（提前 30 天 → 矫正年龄少 30 天）', () => {
    const days = calculateCorrectedAgeDays('2023-01-01', '2023-01-31', new Date('2024-01-01'));
    expect(days).toBe(335);
  });
  it('未到预产期返回负天数（属超界报错场景）', () => {
    const days = calculateCorrectedAgeDays('2023-06-01', '2023-09-01', new Date('2023-08-01'));
    expect(days).toBeLessThan(0);
  });
});

describe('formatAgeDisplay', () => {
  it('1岁6月3天', () => { expect(formatAgeDisplay(543)).toBe('1岁6月3天'); });
  it('2月5天', () => { expect(formatAgeDisplay(65)).toBe('2月5天'); });
  it('9天', () => { expect(formatAgeDisplay(9)).toBe('9天'); });
});

describe('calculateCDMM 计分规则', () => {
  const questions: CDMMQuestionInfo[] = [
    { id: 'q1', dimension: '粗大动作', kind: 'milestone' },
    { id: 'q2', dimension: '粗大动作', kind: 'milestone' },
    { id: 'q3', dimension: '精细动作', kind: 'milestone' },
    { id: 'q4', dimension: '精细动作', kind: 'milestone' },
    { id: 'q5', dimension: '警示标志', kind: 'redflag' },
    { id: 'q6', dimension: '警示标志', kind: 'redflag' },
  ];
  const contentMap: Record<string, string> = {
    q1: '能抬头', q2: '能翻身', q3: '能抓握', q4: '能搭积木', q5: '不注视移动物体', q6: '不会对人笑',
  };
  const base = {
    childName: '蓝大喵', gender: '女' as const, birthDate: '2023-01-01',
    isPremature: false, ageGroup: '2月龄', correctedAgeDays: 60,
    ageDisplay: '2月', screeningDate: '2024-01-01', screeningNumber: 'CDMM202301012024010112', provider: 'XXXXXXXX',
  };

  it('全很熟练(2) → 蓝色脚丫，无里程碑、无红灯', () => {
    const r = calculateCDMM({ q1: 2, q2: 2, q3: 2, q4: 2, q5: 0, q6: 0 }, questions, contentMap, base);
    expect(r.details!.dimensionResults['粗大动作'].color).toBe('blue');
    expect(r.details!.dimensionResults['精细动作'].color).toBe('blue');
    expect(r.details!.dimensionResults['粗大动作'].notDone).toHaveLength(0);
    expect(r.details!.redFlag.triggered).toBe(false);
  });

  it('有不熟练(1)无未做到(0) → 绿色脚丫', () => {
    const r = calculateCDMM({ q1: 1, q2: 2, q3: 2, q4: 2, q5: 0, q6: 0 }, questions, contentMap, base);
    expect(r.details!.dimensionResults['粗大动作'].color).toBe('green');
    expect(r.details!.dimensionResults['粗大动作'].notSkilled).toEqual(['能抬头']);
  });

  it('有未做到(0) → 黄色脚丫', () => {
    const r = calculateCDMM({ q1: 0, q2: 2, q3: 1, q4: 2, q5: 0, q6: 0 }, questions, contentMap, base);
    expect(r.details!.dimensionResults['粗大动作'].color).toBe('yellow');
    expect(r.details!.dimensionResults['粗大动作'].notDone).toEqual(['能抬头']);
  });

  it('警示有"有"(1) → 红灯亮且命中明细正确', () => {
    const r = calculateCDMM({ q1: 2, q2: 2, q3: 2, q4: 2, q5: 1, q6: 0 }, questions, contentMap, base);
    expect(r.details!.redFlag.triggered).toBe(true);
    expect(r.details!.redFlag.items).toEqual(['不注视移动物体']);
  });

  it('警示全"没有"(0) → 不亮红灯', () => {
    const r = calculateCDMM({ q1: 2, q2: 2, q3: 2, q4: 2, q5: 0, q6: 0 }, questions, contentMap, base);
    expect(r.details!.redFlag.triggered).toBe(false);
  });

  it('无警示题 → 红灯区不触发', () => {
    const r = calculateCDMM({ q1: 2, q2: 2, q3: 2, q4: 2 }, questions.slice(0, 4), contentMap, base);
    expect(r.details!.redFlag.triggered).toBe(false);
    expect(r.details!.redFlag.items).toHaveLength(0);
  });

  it('details 包含儿童信息/矫正月龄/能区颜色/红灯/目标里程碑', () => {
    const r = calculateCDMM({ q1: 0, q2: 1, q3: 2, q4: 2, q5: 1, q6: 0 }, questions, contentMap, base);
    const d = r.details!;
    expect(d.childName).toBe('蓝大喵');
    expect(d.ageGroup).toBe('2月龄');
    expect(d.correctedAgeDays).toBe(60);
    expect(d.screeningNumber).toBe('CDMM202301012024010112');
    expect(d.dimensionResults).toHaveProperty('粗大动作');
    expect(d.redFlag.triggered).toBe(true);
  });
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx jest tests/cdmm.test.ts`
Expected: FAIL（`@/lib/cdmm` 不存在）。

- [ ] **Step 3: 实现 `src/lib/cdmm.ts`**

```ts
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
  const anchor = dueDate ? new Date(dueDate) : new Date(birthDate);
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

  for (const q of questions) {
    const value = answers[q.id];
    if (value === undefined || value === null) continue;
    if (q.kind === 'redflag') {
      if (value === 1) redFlagItems.push(contentMap[q.id] ?? q.id);
    } else {
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

  let recommendation = `本次核验 ${context.ageGroup} 发育里程碑，8 大能区中 ${blueCount} 个能区全部达标。`;
  if (hasYellow) recommendation = `本次核验发现部分能区存在"未做到"的里程碑，建议咨询儿保医生并加强针对性练习。`;
  else if (hasGreen) recommendation = `本次核验整体良好，个别里程碑尚不熟练，建议持续练习并定期复测。`;

  return {
    totalScore: blueCount,
    severity: redFlag.triggered ? '存在警示信号' : hasYellow ? '需关注' : hasGreen ? '良好' : '优秀',
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
```

- [ ] **Step 4: 运行确认通过**

Run: `npx jest tests/cdmm.test.ts`
Expected: 全部 PASS。

- [ ] **Step 5: 提交**

```bash
git add src/lib/cdmm.ts tests/cdmm.test.ts
git commit -m "feat: add CDMM age matching and scoring logic"
```

---

## Task 3: xlsx 解析与幂等入库

**Files:**
- Create: `src/lib/cdmm-import.ts`
- Create: `tests/cdmm-import.test.ts`
- Create: `scripts/import-cdmm.ts`
- Modify: `package.json`

- [ ] **Step 1: 新增依赖**

```bash
npm install xlsx
```

确认写入 `package.json` dependencies（这是解析 xlsx 的必要依赖，spec 允许"确认必要依赖"）。

- [ ] **Step 2: 写失败测试（清洗规则）**

创建 `tests/cdmm-import.test.ts`：

```ts
import { parseCellItems } from '@/lib/cdmm-import';

describe('parseCellItems 单元格清洗', () => {
  it('按 ◆ 拆分多条', () => {
    expect(parseCellItems('◆能抬头\n◆ 能翻身')).toEqual(['能抬头', '能翻身']);
  });
  it('去除空项与首尾空白', () => {
    expect(parseCellItems('◆能抬头 ◆\n◆ 能翻身 ')).toEqual(['能抬头', '能翻身']);
  });
  it('清洗多余换行与连续空格', () => {
    expect(parseCellItems('◆能抬头\r\n能翻身　测试')).toEqual(['能抬头', '能翻身 测试']);
  });
  it('过滤纯括号注释项（如（9~10月龄））', () => {
    expect(parseCellItems('（9~10月龄）◆有支撑时腿部无法承重')).toEqual(['有支撑时腿部无法承重']);
  });
});
```

- [ ] **Step 3: 运行确认失败**

Run: `npx jest tests/cdmm-import.test.ts`
Expected: FAIL（`@/lib/cdmm-import` 不存在）。

- [ ] **Step 4: 实现 `src/lib/cdmm-import.ts`**

```ts
import * as XLSX from 'xlsx';

export interface CdmmParsedQuestion {
  ageGroup: string;             // 如 '2月龄'
  dimension: string;            // 8 能区名或 '警示标志'
  kind: 'milestone' | 'redflag';
  content: string;
}

/** 8 大能区列名（xlsx 表头 B~I 列，去英文注释） */
export const CDMM_DIMENSION_COLUMNS = [
  '粗大动作', '精细动作', '自理能力', '认知/学业',
  '社会/情绪', '语言理解', '语言表达', '游戏和学习',
];

/** 单元格内 ◆ 分隔多项，逐项清洗：去换行、合并空格、去空、去纯括号注释 */
export function parseCellItems(raw: string): string[] {
  return raw
    .split('◆')
    .map((s) => s.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim())
    .filter((s) => s.length > 0)
    .filter((s) => !/^（[^）]*）$/.test(s));   // 纯括号注释（如（9~10月龄））非题目
}

/** 解析工作簿 → 题目列表 + 校验统计 */
export function parseCdmmWorkbook(
  wb: XLSX.WorkBook
): { questions: CdmmParsedQuestion[]; stats: Record<string, Record<string, number>> } {
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' });
  const questions: CdmmParsedQuestion[] = [];
  const stats: Record<string, Record<string, number>> = {};

  for (const row of rows) {
    const ageGroup = String(row['月龄（Approximate age）'] ?? '').trim();
    if (!ageGroup || ageGroup === '月龄（Approximate age）') continue;
    stats[ageGroup] = {};
    for (let i = 0; i < 8; i++) {
      const dim = CDMM_DIMENSION_COLUMNS[i];
      const header = Object.keys(row)[i + 1];   // B~I 列
      const items = parseCellItems(String(row[header] ?? ''));
      stats[ageGroup][dim] = items.length;
      items.forEach((content) => questions.push({ ageGroup, dimension: dim, kind: 'milestone', content }));
    }
    // J 列 = 警示标志
    const headerJ = Object.keys(row)[9];
    const redItems = parseCellItems(String(row[headerJ] ?? ''));
    stats[ageGroup]['警示标志'] = redItems.length;
    redItems.forEach((content) => questions.push({ ageGroup, dimension: '警示标志', kind: 'redflag', content }));
  }
  return { questions, stats };
}
```

- [ ] **Step 5: 运行确认通过**

Run: `npx jest tests/cdmm-import.test.ts`
Expected: 全部 PASS。

- [ ] **Step 6: 实现导入脚本 `scripts/import-cdmm.ts`**

```ts
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { parseCdmmWorkbook, CDMM_DIMENSION_COLUMNS } from '../src/lib/cdmm-import';
import getDB from '../src/lib/db';

const DEFAULT_XLSX = '/Users/hou/工作/5 里程碑定稿 2~8岁 20220217.xlsx';
const SCALE_ID = 'cdmm-scale';

const SCALE_RECORD = {
  id: SCALE_ID,
  title: 'CDMM 儿童发育里程碑核验',
  description:
    'CDMM（儿童发育里程碑核验）按矫正月龄匹配 2月龄~8岁 共 18 个月龄组问卷，' +
    '覆盖粗大动作、精细动作、自理能力、认知/学业、社会/情绪、语言理解、语言表达、游戏和学习 8 大能区，' +
    '并核验发育警示标志，帮助家长监测儿童发育里程碑是否步入正轨。',
  category: '发展障碍',
  targetAudience: '2月龄~8岁儿童',
  estimatedTime: 15,
  instructions:
    '请根据孩子近期的实际表现作答：里程碑题选择"未做到 / 不熟练 / 很熟练"，' +
    '警示标志题选择"有 / 没有"。如某项不确定，请咨询专业儿保人员。',
  resultInterpretation:
    '8 大能区分别给出蓝（全部很熟练）/ 绿（存在不熟练）/ 黄（存在未做到）脚丫；' +
    '警示标志出现"有"即触发红灯，建议尽快咨询专业医生。',
  isActive: 1,
};

const MILESTONE_OPTIONS = [
  { value: 0, label: '未做到' },
  { value: 1, label: '不熟练' },
  { value: 2, label: '很熟练' },
];
const REDFLAG_OPTIONS = [
  { value: 0, label: '没有' },
  { value: 1, label: '有' },
];

async function importCdmm(xlsxPath: string) {
  const wb = XLSX.readFile(xlsxPath);
  const { questions, stats } = parseCdmmWorkbook(wb);

  const db = await getDB();
  await db.exec('BEGIN');
  try {
    // 幂等：UPSERT 量表
    await db.run(
      `INSERT INTO scales (id, title, description, category, target_audience, estimated_time, instructions, result_interpretation, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title, description = excluded.description,
         category = excluded.category, target_audience = excluded.target_audience,
         estimated_time = excluded.estimated_time, instructions = excluded.instructions,
         result_interpretation = excluded.result_interpretation, is_active = excluded.is_active`,
      [SCALE_RECORD.id, SCALE_RECORD.title, SCALE_RECORD.description, SCALE_RECORD.category,
       SCALE_RECORD.targetAudience, SCALE_RECORD.estimatedTime, SCALE_RECORD.instructions,
       SCALE_RECORD.resultInterpretation, SCALE_RECORD.isActive]
    );

    // 幂等：清空该量表旧题再插入
    await db.run('DELETE FROM questions WHERE scale_id = ?', [SCALE_ID]);

    let order = 1;
    for (const q of questions) {
      await db.run(
        `INSERT INTO questions (id, scale_id, content, type, options, "order", dimension, meta)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          SCALE_ID,
          q.content,
          'choice',
          JSON.stringify(q.kind === 'redflag' ? REDFLAG_OPTIONS : MILESTONE_OPTIONS),
          order++,
          q.dimension,
          JSON.stringify({ ageGroup: q.ageGroup, kind: q.kind }),
        ]
      );
    }

    await db.exec('COMMIT');
    printReport(stats, questions.length);
  } catch (err) {
    await db.exec('ROLLBACK');
    throw err;
  }
}

function printReport(stats: Record<string, Record<string, number>>, total: number) {
  console.log('\n===== CDMM 导入校验报告 =====');
  console.log('每月龄组 × 能区题数（B~I 列 + J 列警示标志）：');
  const header = ['月龄组', ...CDMM_DIMENSION_COLUMNS, '警示标志', '合计'];
  console.log(header.join('\t'));
  let grandTotal = 0;
  for (const [group, dims] of Object.entries(stats)) {
    const row = [group];
    let sum = 0;
    for (const dim of CDMM_DIMENSION_COLUMNS) { row.push(String(dims[dim] ?? 0)); sum += dims[dim] ?? 0; }
    row.push(String(dims['警示标志'] ?? 0));
    row.push(String(sum + (dims['警示标志'] ?? 0)));
    console.log(row.join('\t'));
    grandTotal += sum + (dims['警示标志'] ?? 0);
  }
  console.log(`\n解析题数总计: ${total}（合计列累计: ${grandTotal}）`);
  console.log(`spec 目标: 799 题 —— 差异 ${total - 799}，请与 spec/数据源核对，以 xlsx 为准`);
  const noRed = Object.entries(stats).filter(([, d]) => (d['警示标志'] ?? 0) === 0).map(([g]) => g);
  console.log(`无警示标志数据的月龄组: ${noRed.join('、') || '（无）'}`);
  console.log('==============================');
}

const xlsxPath = process.argv[2] ?? DEFAULT_XLSX;
importCdmm(xlsxPath).catch((err) => {
  console.error('导入失败:', err);
  process.exit(1);
});
```

- [ ] **Step 7: package.json 加脚本**

```json
"import:cdmm": "npx tsx scripts/import-cdmm.ts"
```

- [ ] **Step 8: 运行导入并核对**

Run: `npm run import:cdmm`
Expected: 校验报告输出；量表 `cdmm-scale` 与题目入库；再次运行不产生重复题（幂等）。

Run: `npx tsx check-scales.ts`（或 `npx tsx -e "..."` 查 `SELECT COUNT(*) FROM questions WHERE scale_id='cdmm-scale'`）
Expected: 与报告一致。

- [ ] **Step 9: 提交**

```bash
git add src/lib/cdmm-import.ts tests/cdmm-import.test.ts scripts/import-cdmm.ts package.json package-lock.json
git commit -m "feat: add CDMM xlsx import script with idempotent seeding"
```

---

## Task 4: 答题 API 支持 CDMM

**Files:**
- Modify: `src/app/api/assessments/route.ts`

- [ ] **Step 1: POST 分支处理 cdmm-scale**

在 `src/app/api/assessments/route.ts` 的 `POST` 中，`const result = calculateScore(scaleId, answers)` 之前插入 CDMM 分支（提前 return，CDMM 不进通用计分）：

```ts
import { calculateCorrectedAgeDays, matchAgeGroup, formatAgeDisplay, calculateCDMM } from '@/lib/cdmm';
```

```ts
    // 注意：childInfo 需在第一次 json() 解构时取出（body 只能消费一次）
    const { userId, scaleId, answers, ipAddress, childInfo } = await request.json();

    const db = await getDB();

    // CDMM 专用流程：需儿童信息 + 题目上下文计分
    if (scaleId === 'cdmm-scale') {
      if (!childInfo?.name || !childInfo?.gender || !childInfo?.birthDate) {
        return NextResponse.json({ error: '儿童信息不完整' }, { status: 400 });
      }
      if (childInfo.isPremature && !childInfo.dueDate) {
        return NextResponse.json({ error: '早产儿童需填写预产期' }, { status: 400 });
      }

      const ageDays = calculateCorrectedAgeDays(
        childInfo.birthDate,
        childInfo.isPremature ? childInfo.dueDate : undefined
      );
      const group = matchAgeGroup(ageDays);
      if (!group) {
        return NextResponse.json(
          { error: `矫正月龄超出可测评范围（须大于 1 个月且小于 102 个月），当前 ${formatAgeDisplay(ageDays)}，无法进入测评` },
          { status: 400 }
        );
      }

      const rows = await db.all(
        `SELECT id, content, dimension, meta FROM questions WHERE scale_id = ? ORDER BY "order" ASC`,
        [scaleId]
      );
      const questions = rows
        .filter((q: any) => {
          const meta = q.meta ? JSON.parse(q.meta) : null;
          return meta && meta.ageGroup === group.label;
        })
        .map((q: any) => {
          const meta = q.meta ? JSON.parse(q.meta) : null;
          return { id: q.id, dimension: q.dimension, kind: meta.kind };
        });
      const contentMap: Record<string, string> = {};
      for (const q of rows) contentMap[q.id] = q.content;

      const today = new Date();
      const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const compact = (d: Date) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
      const screeningDate = ymd(today);
      const birthCompact = childInfo.birthDate.replace(/-/g, '');
      const screeningNumber = `CDMM${birthCompact}${compact(today)}${Math.floor(10 + Math.random() * 90)}`;

      const result = calculateCDMM(answers, questions, contentMap, {
        childName: childInfo.name,
        gender: childInfo.gender,
        birthDate: childInfo.birthDate,
        isPremature: !!childInfo.isPremature,
        ageGroup: group.label,
        correctedAgeDays: ageDays,
        ageDisplay: formatAgeDisplay(ageDays),
        screeningDate,
        screeningNumber,
        provider: 'XXXXXXXX',
      });

      const assessmentId = uuidv4();
      await db.run(
        `INSERT INTO assessments (id, user_id, scale_id, answers, result, ip_address, status, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, 'completed', CURRENT_TIMESTAMP)`,
        [assessmentId, userId || null, scaleId, JSON.stringify(answers), JSON.stringify(result), ipAddress]
      );
      const assessment = await db.get('SELECT * FROM assessments WHERE id = ?', [assessmentId]);
      if (assessment.answers) assessment.answers = JSON.parse(assessment.answers);
      if (assessment.result) assessment.result = JSON.parse(assessment.result);
      return NextResponse.json(assessment);
    }

    // 以下为原有通用流程
    const result = calculateScore(scaleId, answers);
```

- [ ] **Step 2: 验证**

Run: `npx tsc --noEmit`
Expected: 无类型错误。

手动验证（需先完成 Task 3 数据导入）：
Run: `npm run dev`，用 curl 提交 CDMM 测评：

```bash
curl -s -X POST http://localhost:3000/api/assessments \
  -H 'Content-Type: application/json' \
  -d '{"scaleId":"cdmm-scale","answers":{"<里程碑题id>":2},"childInfo":{"name":"测试宝宝","gender":"男","birthDate":"2023-06-01","isPremature":false}}' | head -c 800
```

Expected: 返回含 `result.details.dimensionResults` 与 `redFlag` 的 assessment。

- [ ] **Step 3: 提交**

```bash
git add src/app/api/assessments/route.ts
git commit -m "feat: support CDMM assessment submission in API"
```

---

## Task 5: CDMM 答题页（信息采集 + 分组答题）

**Files:**
- Create: `src/components/cdmm/CDMMAssessment.tsx`
- Modify: `src/app/assessment/[id]/page.tsx`

- [ ] **Step 1: assessment/[id]/page.tsx 分支渲染**

在 `src/app/assessment/[id]/page.tsx` 的 `if (!scale || questions.length === 0)` 判断之后、`const currentQ = questions[currentQuestion];` 之前插入：

```tsx
  if (scale.id === 'cdmm-scale') {
    return <CDMMAssessment scale={scale} questions={questions} />;
  }
```

文件顶部 import：

```tsx
import CDMMAssessment from '@/components/cdmm/CDMMAssessment';
```

- [ ] **Step 2: 实现 `src/components/cdmm/CDMMAssessment.tsx`**

组件职责与结构（样式沿用现有深色渐变 + 卡片风格，参考 `/Users/hou/工作/微信图片_20260803221258_529_57.png` 的能区标签界面）：

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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

  // ---------- 渲染：阶段 2 分组答题核心（信息表单按现有答题页样式渲染） ----------
  // phase === 'form' → 信息表单（姓名/性别/出生日期/是否早产/预产期）+ 匹配按钮 + matchError 红字提示
  // phase === 'quiz' → 一屏一能区，题卡 + 单选选项，底部导航
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
```

> 实现说明：完整 JSX 按上述状态机填充即可。三选项/两选项单选交互与现有答题页一致（`answers[q.id] === option.value` 高亮）；题目选项来自 `questions[].options`（Task 3 已入库为 `[{value,label}]`）。此界面按示例图保持移动端友好（卡片式一屏一能区）。

- [ ] **Step 3: 验证**

Run: `npx tsc --noEmit`
Expected: 无类型错误。

Run: `npm run dev`，浏览器访问 `http://localhost:3000/scales` → 进入 CDMM：
1. 空表单提交 → 提示补全信息；
2. 出生日期设为今天 → 矫正月龄超界报错（不进入答题）；
3. 正常出生日期 → 显示匹配月龄组，进入分组答题；
4. 完成一屏能区作答 → 下一能区；警示组为最后一屏（如有）；
5. 全部作答 → 提交 → 跳转结果页（Task 6 完成后验证）。

- [ ] **Step 4: 提交**

```bash
git add src/components/cdmm/CDMMAssessment.tsx src/app/assessment/[id]/page.tsx
git commit -m "feat: add CDMM grouped assessment page"
```

---

## Task 6: CDMM 结果页（H5 报告）

**Files:**
- Create: `src/components/cdmm/CDMMResult.tsx`
- Modify: `src/app/result/[id]/page.tsx`

- [ ] **Step 1: result/[id]/page.tsx 分支渲染**

在 `src/app/result/[id]/page.tsx` 的 `const result = assessment.result || {};` 之后、`return (` 之前插入：

```tsx
  if (scale.id === 'cdmm-scale') {
    return <CDMMResult assessment={assessment} scale={scale} />;
  }
```

文件顶部 import：

```tsx
import CDMMResult from '@/components/cdmm/CDMMResult';
```

- [ ] **Step 2: 实现 `src/components/cdmm/CDMMResult.tsx`**

按 docx 样板结构组织（`/Users/hou/工作/里程碑 结果输出样板_仅报告.docx`），深色底白字 H5，脚丫用 SVG 绘制：

```tsx
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
      {/* 背景与头部：复用 result/[id] 页面的背景渐变 + logo + 返回按钮 + 标题
          "CDMM 儿童发育里程碑核验报告" */}
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-2xl">
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
```

> 说明：`Footprint` 为简化脚丫 SVG（8 个脚丫一排，颜色随计分）。实现时可对照 docx 样板微调形状，验收标准 AC-4 为 human-judgment。

- [ ] **Step 3: 验证**

Run: `npx tsc --noEmit`
Expected: 无类型错误。

Run: `npm run dev`，完成一次 CDMM 测评后访问 `/result/{id}`：
1. 儿童信息卡字段完整（姓名/性别/出生日期/筛查日期/编号/机构）；
2. 8 个脚丫颜色与计分一致，图例正确；
3. 里程碑区列出未做到/不熟练项；红灯区命中/未命中两种状态正确；
4. 移动端（窄屏）排版正常。

- [ ] **Step 4: 提交**

```bash
git add src/components/cdmm/CDMMResult.tsx src/app/result/[id]/page.tsx
git commit -m "feat: add CDMM H5 result report"
```

---

## Task 7: 后台管理（只读 + 启停）

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: 为 cdmm-scale 屏蔽编辑/题目管理/删除**

在 `src/app/admin/page.tsx` 中，找到量表列表渲染与操作按钮（含"编辑""删除""查看题目/管理题目"触发点），以 `scale.id === 'cdmm-scale'` 为条件隐藏编辑、删除、题目增删改入口，仅保留：
- 查看量表信息（只读）
- 查看题目列表（只读，不显示"添加题目/编辑/删除"按钮）
- 启用/禁用开关（复用现有 `PATCH /api/admin/scales` 启停逻辑）

具体改点（实现时按实际 JSX 结构调整）：
```tsx
const isCdmm = scale.id === 'cdmm-scale';
// 编辑按钮: {!isCdmm && <button onClick={...}>编辑</button>}
// 删除按钮: {!isCdmm && <button onClick={...}>删除</button>}
// 题目弹窗: 隐藏"添加题目"与每题的编辑/删除，头部提示"CDMM 数据由导入脚本维护，后台只读"
```

- [ ] **Step 2: 验证**

Run: `npx tsc --noEmit`
Expected: 无类型错误。

Run: `npm run dev`，管理员登录后台：
1. 量表列表可见 `cdmm-scale`；
2. 该量表无编辑/删除入口，题目弹窗只读；
3. 切换启停立即生效（前台量表列表随之显示/隐藏）。

- [ ] **Step 3: 提交**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: make CDMM scale read-only in admin"
```

---

## Task 8: 端到端回归验证

**Files:** 无（验证为主）

- [ ] **Step 1: 全量单测**

Run: `npx jest`
Expected: 既有 27 量表计分测试 + 新增 cdmm 测试全部 PASS（回归）。

- [ ] **Step 2: 构建**

Run: `npm run build`
Expected: 构建成功，无错误。

- [ ] **Step 3: 完整流程人工验证**

Run: `npm run dev`
1. 首页/量表列表出现 CDMM 量表；
2. 进入 → 信息表单（含早产分支）→ 超界报错 → 正常匹配 → 分组答题（进度、往返修改、警示组）→ 提交；
3. 结果页 5 大区块与 docx 样板一致（对照 `/Users/hou/工作/里程碑 结果输出样板_仅报告.docx`）；
4. 早产儿场景：预产期法矫正年龄正确；
5. 已有 27 个量表答题/结果流程不受影响；
6. 数据持久化：刷新后测评记录仍在。

- [ ] **Step 4: 提交（如有修复）**

```bash
git add -A
git commit -m "fix: resolve CDMM integration issues"
```

---

## 验收对照（spec AC ↔ Task）

| AC | 验收点 | 覆盖 Task |
|---|---|---|
| AC-1 | 年龄匹配正确、超界报错 | Task 2（测试覆盖 31/90/150/690/900/3060 边界）|
| AC-2 | 分组答题完整、答案保存 | Task 4 + Task 5 |
| AC-3 | 计分 100% 准确 | Task 2（全蓝/绿/黄/混合/红灯触发/不触发）|
| AC-4 | 结果报告按样板展示 | Task 6（human-judgment）|
| AC-5 | 799 题入库、无重复 | Task 3（校验报告对比，差异向用户确认）|
| AC-6 | 后台只读 + 启停 | Task 7 |

## 风险与待确认

1. **题数差异**：xlsx 原始统计 826 题 vs spec 的 799 题。Task 3 校验报告会给出分月龄组分能区明细；若清洗后仍 ≠799，以 xlsx 为准，需与用户确认 spec 口径。
2. **边界重叠日归属**：90/150/210… 等日同时是相邻两组边界（如"2月30天"="3月0天"）。本计划采用"顺序匹配第一个命中 → 归属低月龄组"，已写入测试；如业务口径不同，仅需调整 `AGE_GROUPS` 边界与对应测试。
3. **矫正月龄算法**：早产采用"今天 − 预产期"天数差（等价于 spec assumption 的"预产期−出生日期"矫正）。
4. **新增依赖**：`xlsx`（解析数据源，必要依赖）。
5. **提供筛查机构**：默认占位 `XXXXXXXX`（spec Open Question 默认处理）。
