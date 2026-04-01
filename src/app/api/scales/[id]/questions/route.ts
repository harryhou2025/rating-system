import { NextResponse } from 'next/server';
import getDB from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDB();
    
    const questions = await db.all(
      'SELECT * FROM questions WHERE scale_id = ? ORDER BY "order"',
      [id]
    );

    // 解析options字段
    const parsedQuestions = questions.map(q => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : null,
    }));

    return NextResponse.json(parsedQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: '获取题目失败' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content, type, options, order } = await request.json();
    
    const db = await getDB();
    
    const result = await db.run(
      `INSERT INTO questions (scale_id, content, type, options, "order")
       VALUES (?, ?, ?, ?, ?)`,
      [id, content, type, JSON.stringify(options), order]
    );

    const question = await db.get(
      'SELECT * FROM questions WHERE rowid = ?',
      [result.lastID]
    );

    // 解析options字段
    if (question.options) {
      question.options = JSON.parse(question.options);
    }
    
    return NextResponse.json(question);
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: '创建题目失败' },
      { status: 500 }
    );
  }
}
