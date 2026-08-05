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
  console.log(['月龄组', ...CDMM_DIMENSION_COLUMNS, '警示标志', '合计'].join('\t'));
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
