import { NextResponse } from 'next/server';
import getDB from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// 管理员权限中间件
function withAdminAuth(handler: Function) {
  return async (request: Request) => {
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

      return await handler(request);
    } catch (error) {
      console.error('Auth error:', error);
      return NextResponse.json(
        { error: '认证失败' },
        { status: 401 }
      );
    }
  };
}

// 获取量表列表
async function getScales(request: Request) {
  try {
    const db = await getDB();
    
    const scales = await db.all(
      `SELECT * FROM scales
       ORDER BY created_at DESC`
    );
    
    return NextResponse.json(scales);
  } catch (error) {
    console.error('Error fetching scales:', error);
    return NextResponse.json(
      { error: '获取量表列表失败' },
      { status: 500 }
    );
  }
}

// 启用/禁用量表
async function toggleScaleStatus(request: Request) {
  try {
    const { id, isActive } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: '量表ID不能为空' },
        { status: 400 }
      );
    }
    
    const db = await getDB();
    
    await db.run(
      `UPDATE scales
       SET is_active = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [isActive ? 1 : 0, id]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling scale status:', error);
    return NextResponse.json(
      { error: '更新量表状态失败' },
      { status: 500 }
    );
  }
}

// 创建量表
async function createScale(request: Request) {
  try {
    const { title, description, category, targetAudience, estimatedTime, instructions, resultInterpretation, isActive } = await request.json();
    
    if (!title || !category) {
      return NextResponse.json(
        { error: '量表名称和分类不能为空' },
        { status: 400 }
      );
    }
    
    const db = await getDB();
    const id = crypto.randomUUID();
    
    await db.run(
      `INSERT INTO scales (id, title, description, category, target_audience, estimated_time, instructions, result_interpretation, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [id, title, description, category, targetAudience, estimatedTime, instructions, resultInterpretation, isActive ? 1 : 0]
    );
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error creating scale:', error);
    return NextResponse.json(
      { error: '创建量表失败' },
      { status: 500 }
    );
  }
}

// 编辑量表
async function updateScale(request: Request) {
  try {
    const { id, title, description, category, targetAudience, estimatedTime, instructions, resultInterpretation, isActive } = await request.json();
    
    if (!id || !title || !category) {
      return NextResponse.json(
        { error: '量表ID、名称和分类不能为空' },
        { status: 400 }
      );
    }
    
    const db = await getDB();
    
    await db.run(
      `UPDATE scales
       SET title = ?,
           description = ?,
           category = ?,
           target_audience = ?,
           estimated_time = ?,
           instructions = ?,
           result_interpretation = ?,
           is_active = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, description, category, targetAudience, estimatedTime, instructions, resultInterpretation, isActive ? 1 : 0, id]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating scale:', error);
    return NextResponse.json(
      { error: '编辑量表失败' },
      { status: 500 }
    );
  }
}

// 删除量表
async function deleteScale(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: '量表ID不能为空' },
        { status: 400 }
      );
    }
    
    const db = await getDB();
    
    // 检查量表是否已被使用
    const assessmentCount = await db.get(
      `SELECT COUNT(*) as count FROM assessments WHERE scale_id = ?`,
      [id]
    );
    
    if (assessmentCount.count > 0) {
      return NextResponse.json(
        { error: '该量表已被使用，无法删除' },
        { status: 400 }
      );
    }
    
    // 删除量表
    await db.run(
      `DELETE FROM scales WHERE id = ?`,
      [id]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting scale:', error);
    return NextResponse.json(
      { error: '删除量表失败' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(getScales);
export const POST = withAdminAuth(createScale);
export const PATCH = withAdminAuth(toggleScaleStatus);
export const PUT = withAdminAuth(updateScale);
export const DELETE = withAdminAuth(deleteScale);
