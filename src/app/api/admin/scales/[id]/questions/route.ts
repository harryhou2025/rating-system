import { NextResponse } from 'next/server';
import getDB from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// 管理员权限中间件
function withAdminAuth(handler: Function) {
  return async (request: Request, { params }: { params: { id: string } }) => {
    try {
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: '未登录' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      
      if (!decoded || decoded.role !== 'admin') {
        return NextResponse.json(
          { error: '权限不足' },
          { status: 403 }
        );
      }

      return await handler(request, { params });
    } catch (error) {
      console.error('Auth error:', error);
      return NextResponse.json(
        { error: '认证失败' },
        { status: 401 }
      );
    }
  };
}

// 获取题目列表
async function getQuestions(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: scaleId } = params;
    const db = await getDB();
    
    const questions = await db.all(
      `SELECT * FROM questions
       WHERE scale_id = ?
       ORDER BY "order" ASC`,
      [scaleId]
    );
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: '获取题目列表失败' },
      { status: 500 }
    );
  }
}

// 添加题目
async function createQuestion(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: scaleId } = params;
    const { content, type, options, order } = await request.json();
    
    if (!content || !type) {
      return NextResponse.json(
        { error: '题目内容和类型不能为空' },
        { status: 400 }
      );
    }
    
    const db = await getDB();
    const id = crypto.randomUUID();
    
    await db.run(
      `INSERT INTO questions (id, scale_id, content, type, options, "order")
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, scaleId, content, type, options, order]
    );
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: '创建题目失败' },
      { status: 500 }
    );
  }
}

// 编辑题目
async function updateQuestion(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: scaleId } = params;
    const { questionId, content, type, options, order } = await request.json();
    
    if (!questionId || !content || !type) {
      return NextResponse.json(
        { error: '题目ID、内容和类型不能为空' },
        { status: 400 }
      );
    }
    
    const db = await getDB();
    
    await db.run(
      `UPDATE questions
       SET content = ?,
           type = ?,
           options = ?,
           "order" = ?
       WHERE id = ? AND scale_id = ?`,
      [content, type, options, order, questionId, scaleId]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { error: '编辑题目失败' },
      { status: 500 }
    );
  }
}

// 删除题目
async function deleteQuestion(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: scaleId } = params;
    const { questionId } = await request.json();
    
    if (!questionId) {
      return NextResponse.json(
        { error: '题目ID不能为空' },
        { status: 400 }
      );
    }
    
    const db = await getDB();
    
    // 删除题目
    await db.run(
      `DELETE FROM questions
       WHERE id = ? AND scale_id = ?`,
      [questionId, scaleId]
    );
    
    // 更新剩余题目的顺序
    const questions = await db.all(
      `SELECT id FROM questions
       WHERE scale_id = ?
       ORDER BY "order" ASC`,
      [scaleId]
    );
    
    for (let i = 0; i < questions.length; i++) {
      await db.run(
        `UPDATE questions
         SET "order" = ?
         WHERE id = ?`,
        [i + 1, questions[i].id]
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: '删除题目失败' },
      { status: 500 }
    );
  }
}

// 调整题目顺序
async function reorderQuestions(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: scaleId } = params;
    const { questions } = await request.json();
    
    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: '题目顺序数据无效' },
        { status: 400 }
      );
    }
    
    const db = await getDB();
    
    for (let i = 0; i < questions.length; i++) {
      await db.run(
        `UPDATE questions
         SET "order" = ?
         WHERE id = ? AND scale_id = ?`,
        [i + 1, questions[i].id, scaleId]
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering questions:', error);
    return NextResponse.json(
      { error: '调整题目顺序失败' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(getQuestions);
export const POST = withAdminAuth(createQuestion);
export const PUT = withAdminAuth(updateQuestion);
export const DELETE = withAdminAuth(deleteQuestion);
export const PATCH = withAdminAuth(reorderQuestions);
