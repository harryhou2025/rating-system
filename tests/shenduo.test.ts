import { calculateShenduo, getLevel, SHEINDUO_TRAITS } from '@/lib/shenduo';

interface Q {
  id: string;
  dimension: string;
}

function buildQuestions(): Q[] {
  const questions: Q[] = [];
  const ranges: Array<[string, [number, number]]> = [
    ['汪星人', [1, 20]],
    ['喵星人', [21, 40]],
    ['敏感星人', [41, 60]],
  ];
  for (const [dimension, [start, end]] of ranges) {
    for (let i = start; i <= end; i++) {
      questions.push({ id: `q${i}`, dimension });
    }
  }
  return questions;
}

function answersFor(pred: (i: number) => boolean): Record<string, number> {
  const answers: Record<string, number> = {};
  for (let i = 1; i <= 60; i++) answers[`q${i}`] = pred(i) ? 1 : 0;
  return answers;
}

describe('getLevel', () => {
  test.each([
    [0, '不明显'],
    [5, '不明显'],
    [6, '轻度存在'],
    [10, '轻度存在'],
    [11, '较为突出'],
    [15, '较为突出'],
    [16, '非常显著'],
    [20, '非常显著'],
  ])('%i 分 → %s', (score, level) => {
    expect(getLevel(score).level).toBe(level);
  });
});

describe('SHEINDUO_TRAITS', () => {
  it('包含汪星人、喵星人、敏感星人三个特质', () => {
    expect(SHEINDUO_TRAITS).toHaveLength(3);
    expect(SHEINDUO_TRAITS.map((t) => t.dimension)).toEqual(['汪星人', '喵星人', '敏感星人']);
  });
});

describe('calculateShenduo', () => {
  const questions = buildQuestions();

  it('全部不符合时三个维度均为 0 分', () => {
    const r = calculateShenduo(answersFor(() => false), questions);
    expect(r.totalScore).toBe(0);
    expect(r.severity).toBe('特质均不明显');
    const d = r.details!.dimensionResults;
    expect(d['汪星人'].score).toBe(0);
    expect(d['喵星人'].score).toBe(0);
    expect(d['敏感星人'].score).toBe(0);
    expect(d['汪星人'].percent).toBe(0);
    expect(d['汪星人'].level).toBe('不明显');
  });

  it('全部符合时三个维度均为 20 分（100%）且非常显著', () => {
    const r = calculateShenduo(answersFor(() => true), questions);
    expect(r.totalScore).toBe(60);
    expect(r.severity).toBe('汪星人特质非常显著');
    for (const name of ['汪星人', '喵星人', '敏感星人']) {
      expect(r.details!.dimensionResults[name].score).toBe(20);
      expect(r.details!.dimensionResults[name].percent).toBe(100);
      expect(r.details!.dimensionResults[name].level).toBe('非常显著');
    }
  });

  it('混合作答：汪 11、喵 6、敏感 0，并给出汪+喵组合解读', () => {
    const answers = answersFor(() => false);
    for (let i = 1; i <= 11; i++) answers[`q${i}`] = 1; // 汪星人 11
    for (let i = 21; i <= 26; i++) answers[`q${i}`] = 1; // 喵星人 6
    const r = calculateShenduo(answers, questions);
    const d = r.details!.dimensionResults;
    expect(d['汪星人'].score).toBe(11);
    expect(d['汪星人'].level).toBe('较为突出');
    expect(d['喵星人'].score).toBe(6);
    expect(d['喵星人'].level).toBe('轻度存在');
    expect(d['敏感星人'].score).toBe(0);
    expect(r.severity).toBe('汪星人特质较为突出');
    const combo = r.details!.combos.find(
      (c: any) => c.traits.includes('汪星人') && c.traits.includes('喵星人')
    );
    expect(combo).toBeTruthy();
  });

  it('非法作答值（非 0/1）不计入得分', () => {
    const answers = answersFor(() => false);
    answers['q1'] = 5;
    const r = calculateShenduo(answers, questions);
    expect(r.details!.dimensionResults['汪星人'].score).toBe(0);
    expect(r.details!.answeredCount).toBe(59);
  });

  it('无有效作答时提示未完成评估', () => {
    const r = calculateShenduo({}, questions);
    expect(r.severity).toBe('未完成评估');
    expect(r.details!.answeredCount).toBe(0);
  });

  it('未匹配维度的题目被忽略，不拉高总分', () => {
    const qs = [...questions, { id: 'q61', dimension: '外星人' }];
    const answers = answersFor(() => true);
    const r = calculateShenduo(answers, qs);
    expect(r.totalScore).toBe(60);
  });

  it('recommendation 提及最突出特质并附带免责声明', () => {
    const answers = answersFor(() => false);
    for (let i = 1; i <= 16; i++) answers[`q${i}`] = 1;
    const r = calculateShenduo(answers, questions);
    expect(r.recommendation).toContain('汪星人');
    expect(r.recommendation).toContain('不构成医学诊断');
  });
});
