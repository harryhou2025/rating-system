import getDB from '../src/lib/db';
import { scales, questions } from '../src/data/real-scales';

async function seedDatabase() {
  const db = await getDB();
  try {
    await db.exec('BEGIN');

    console.log('开始插入真实量表数据...');

    // 插入量表
    for (const scale of scales) {
      await db.run(
        `INSERT INTO scales (id, title, description, category, target_audience, estimated_time, instructions, result_interpretation, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           title = excluded.title,
           description = excluded.description,
           category = excluded.category,
           target_audience = excluded.target_audience,
           estimated_time = excluded.estimated_time,
           instructions = excluded.instructions,
           result_interpretation = excluded.result_interpretation,
           is_active = excluded.is_active`,
        [
          scale.id,
          scale.title,
          scale.description,
          scale.category,
          scale.targetAudience,
          scale.estimatedTime,
          scale.instructions,
          scale.resultInterpretation,
          scale.isActive ? 1 : 0,
        ]
      );
      console.log(`✓ 插入量表: ${scale.title}`);
    }

    // 清空题目表
    await db.run('DELETE FROM questions');
    
    // 插入题目
    let questionCount = 0;
    for (const question of questions) {
      await db.run(
        `INSERT INTO questions (id, scale_id, content, type, options, "order")
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          question.id,
          question.scaleId,
          question.content,
          question.type,
          JSON.stringify(question.options),
          question.order,
        ]
      );
      questionCount++;
    }
    console.log(`✓ 插入题目: ${questionCount} 题`);

    // 插入管理员用户
    await db.run(
      `INSERT INTO users (id, email, password, name, role)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(email) DO NOTHING`,
      ['admin-user', 'admin@example.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '管理员', 'admin']
    );
    console.log('✓ 插入管理员用户 (admin@example.com / 123456)');

    await db.exec('COMMIT');
    console.log('\n✅ 真实量表数据插入成功！');
    console.log('\n📊 已导入的量表：');
    scales.forEach((scale, index) => {
      console.log(`   ${index + 1}. ${scale.title}`);
    });
  } catch (error) {
    await db.exec('ROLLBACK');
    console.error('❌ 插入数据失败:', error);
    throw error;
  }
}

seedDatabase().catch(console.error);
