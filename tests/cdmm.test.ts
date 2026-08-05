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
