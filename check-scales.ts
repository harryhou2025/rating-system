import getDB from './src/lib/db';

async function checkScales() {
  const db = await getDB();
  
  console.log('查询量表列表...');
  const scales = await db.all('SELECT id, title FROM scales ORDER BY created_at');
  
  console.log('量表列表:');
  scales.forEach((scale: any, index: number) => {
    console.log(`${index + 1}. ${scale.title} (ID: ${scale.id})`);
  });
  
  console.log('\n检查DCD-Q量表的题目...');
  const dcdqQuestions = await db.all('SELECT id, content FROM questions WHERE scale_id = ?', ['dcdq-scale']);
  console.log(`DCD-Q量表题目数量: ${dcdqQuestions.length}`);
  dcdqQuestions.forEach((q: any, index: number) => {
    console.log(`${index + 1}. ${q.content}`);
  });
  
  await db.close();
}

checkScales().catch(console.error);
