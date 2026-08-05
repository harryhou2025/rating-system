import * as XLSX from 'xlsx';

export interface CdmmParsedQuestion {
  ageGroup: string;
  dimension: string;            // 8 能区名或 '警示标志'
  kind: 'milestone' | 'redflag';
  content: string;
}

/** 8 大能区（顺序对应 xlsx B~I 列） */
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
    .filter((s) => !/^（[^）]*）$/.test(s));
}

/** 解析工作簿 → 题目列表 + 分月龄组分能区统计（供校验报告用） */
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
    // B~I 列：8 大能区（以 Step 0 探查到的实际 key 为准）
    const keys = Object.keys(row);
    for (let i = 0; i < 8; i++) {
      const dim = CDMM_DIMENSION_COLUMNS[i];
      const header = keys[i + 1]; // 第 2~9 列
      const items = parseCellItems(String(row[header] ?? ''));
      stats[ageGroup][dim] = items.length;
      items.forEach((content) => questions.push({ ageGroup, dimension: dim, kind: 'milestone', content }));
    }
    // J 列：警示标志（第 10 列，若存在）
    const headerJ = keys[9];
    if (headerJ !== undefined) {
      const redItems = parseCellItems(String(row[headerJ] ?? ''));
      stats[ageGroup]['警示标志'] = redItems.length;
      redItems.forEach((content) => questions.push({ ageGroup, dimension: '警示标志', kind: 'redflag', content }));
    } else {
      stats[ageGroup]['警示标志'] = 0;
    }
  }
  return { questions, stats };
}
