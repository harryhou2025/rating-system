import { v4 as uuidv4 } from 'uuid';
import { SHEINDUO_QUESTIONS } from '../src/lib/shenduo-questions';
import { SHEINDUO_TRAITS } from '../src/lib/shenduo';
import getDB from '../src/lib/db';

const SCALE_ID = 'shenduo-scale';

const SCALE_RECORD = {
  id: SCALE_ID,
  title: '神经多样性特质自筛量表',
  description:
    '汪星人（ADHD 特质）、喵星人（ASD 特质）、敏感星人（HSP 特质）三大部分各 20 题，' +
    '共 60 题二选一作答，帮你探索自己大脑独特的"出厂设置"，' +
    '了解自身注意力模式、社交偏好与感官敏感度的天然组合。',
  category: '人格特质评估',
  targetAudience: '青少年及成人（自我探索）',
  estimatedTime: 12,
  instructions:
    '请根据近 6 个月以来的真实感受和行为作答，而非"理想中的自己"。' +
    '每题只有两个选项：「符合」（得 1 分）或「不符合」（得 0 分），没有"有时"选项——' +
    '如果犹豫，请选择更接近你日常状态的那一项。三大部分各 20 题，总计 60 题，大约需要 10-15 分钟。',
  resultInterpretation:
    '每部分满分 20 分，得分 ÷ 20 即为该特质占比。0-5 分（0%-25%）该特质不明显；' +
    '6-10 分（30%-50%）轻度存在；11-15 分（55%-75%）较为突出；16-20 分（80%-100%）非常显著。' +
    '三种特质可以同时共存，很多人在不同特质上各有高低。',
  isActive: 1,
};

const OPTIONS = [
  { value: 1, label: '符合' },
  { value: 0, label: '不符合' },
];

async function importShenduo() {
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
    for (const q of SHEINDUO_QUESTIONS) {
      await db.run(
        `INSERT INTO questions (id, scale_id, content, type, options, "order", dimension, meta)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          SCALE_ID,
          q.content,
          'choice',
          JSON.stringify(OPTIONS),
          order++,
          q.dimension,
          JSON.stringify({}),
        ]
      );
    }

    await db.exec('COMMIT');
    printReport();
  } catch (err) {
    await db.exec('ROLLBACK');
    throw err;
  }
}

function printReport() {
  console.log('\n===== 神经多样性特质自筛量表 导入报告 =====');
  console.log(`量表: ${SCALE_RECORD.title} (${SCALE_ID})`);
  for (const t of SHEINDUO_TRAITS) {
    const count = SHEINDUO_QUESTIONS.filter((q) => q.dimension === t.dimension).length;
    console.log(`${t.emoji} ${t.name}（${t.trait}）: ${count} 题`);
  }
  console.log(`总题数: ${SHEINDUO_QUESTIONS.length}（规格 60 题，差异 ${SHEINDUO_QUESTIONS.length - 60}）`);
  console.log('============================================');
}

importShenduo().catch((err) => {
  console.error('导入失败:', err);
  process.exit(1);
});
