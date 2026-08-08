import { NextResponse } from 'next/server';
import getDB from '@/lib/db';
import { calculateScore } from '@/lib/scoring';
import {
  calculateCorrectedAgeDays,
  matchAgeGroup,
  formatAgeDisplay,
  calculateCDMM,
} from '@/lib/cdmm';
import { calculateShenduo } from '@/lib/shenduo';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { userId, scaleId, answers, ipAddress, childInfo } = await request.json();
    
    const db = await getDB();

    // CDMM 专用流程：需儿童信息 + 题目上下文计分
    if (scaleId === 'cdmm-scale') {
      if (!childInfo?.name || !childInfo?.gender || !childInfo?.birthDate) {
        return NextResponse.json({ error: '儿童信息不完整' }, { status: 400 });
      }
      if (childInfo.isPremature && !childInfo.dueDate) {
        return NextResponse.json({ error: '早产儿童需填写预产期' }, { status: 400 });
      }

      const ageDays = calculateCorrectedAgeDays(
        childInfo.birthDate,
        childInfo.isPremature ? childInfo.dueDate : undefined
      );
      const group = matchAgeGroup(ageDays);
      if (!group) {
        return NextResponse.json(
          { error: `矫正月龄超出可测评范围（须大于 1 个月且小于 102 个月），当前 ${formatAgeDisplay(ageDays)}，无法进入测评` },
          { status: 400 }
        );
      }

      const rows = await db.all(
        `SELECT id, content, dimension, meta FROM questions WHERE scale_id = ? ORDER BY "order" ASC`,
        [scaleId]
      );
      const questions = rows
        .filter((q: any) => {
          const meta = q.meta ? JSON.parse(q.meta) : null;
          return meta && meta.ageGroup === group.label;
        })
        .map((q: any) => {
          const meta = q.meta ? JSON.parse(q.meta) : null;
          return { id: q.id, dimension: q.dimension, kind: meta.kind };
        });
      const contentMap: Record<string, string> = {};
      for (const q of rows) contentMap[q.id] = q.content;

      const today = new Date();
      const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const compact = (d: Date) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
      const screeningDate = ymd(today);
      const birthCompact = childInfo.birthDate.replace(/-/g, '');
      const screeningNumber = `CDMM${birthCompact}${compact(today)}${Math.floor(10 + Math.random() * 90)}`;

      const result = calculateCDMM(answers, questions, contentMap, {
        childName: childInfo.name,
        gender: childInfo.gender,
        birthDate: childInfo.birthDate,
        isPremature: !!childInfo.isPremature,
        ageGroup: group.label,
        correctedAgeDays: ageDays,
        ageDisplay: formatAgeDisplay(ageDays),
        screeningDate,
        screeningNumber,
        provider: 'XXXXXXXX',
      });

      const assessmentId = uuidv4();
      await db.run(
        `INSERT INTO assessments (id, user_id, scale_id, answers, result, ip_address, status, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, 'completed', CURRENT_TIMESTAMP)`,
        [assessmentId, userId || null, scaleId, JSON.stringify(answers), JSON.stringify(result), ipAddress]
      );
      const assessment = await db.get('SELECT * FROM assessments WHERE id = ?', [assessmentId]);
      if (assessment.answers) assessment.answers = JSON.parse(assessment.answers);
      if (assessment.result) assessment.result = JSON.parse(assessment.result);
      return NextResponse.json(assessment);
    }

    // 神经多样性特质自筛量表：按 dimension（汪星人/喵星人/敏感星人）分组计分
    if (scaleId === 'shenduo-scale') {
      const rows = await db.all(
        `SELECT id, dimension FROM questions WHERE scale_id = ? ORDER BY "order" ASC`,
        [scaleId]
      );
      const orderByQid = new Map<string, number>();
      rows.forEach((r: any, i: number) => orderByQid.set(r.id, i + 1));

      const normalized: Record<string, number> = {};
      for (const [key, value] of Object.entries(answers ?? {})) {
        const v = value as number;
        if (orderByQid.has(key)) normalized[`q${orderByQid.get(key)}`] = v;
        else if (/^q\d+$/.test(key)) normalized[key] = v;
      }
      const questions = rows.map((_, i) => ({ id: `q${i + 1}`, dimension: rows[i].dimension }));
      const result = calculateShenduo(normalized, questions);

      const assessmentId = uuidv4();
      await db.run(
        `INSERT INTO assessments (id, user_id, scale_id, answers, result, ip_address, status, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, 'completed', CURRENT_TIMESTAMP)`,
        [assessmentId, userId || null, scaleId, JSON.stringify(answers), JSON.stringify(result), ipAddress]
      );
      const assessment = await db.get('SELECT * FROM assessments WHERE id = ?', [assessmentId]);
      if (assessment.answers) assessment.answers = JSON.parse(assessment.answers);
      if (assessment.result) assessment.result = JSON.parse(assessment.result);
      return NextResponse.json(assessment);
    }
    
    // 计算得分
    const result = calculateScore(scaleId, answers);
    
    const assessmentId = uuidv4();
    
    await db.run(
      `INSERT INTO assessments (id, user_id, scale_id, answers, result, ip_address, status, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, 'completed', CURRENT_TIMESTAMP)`,
      [
        assessmentId,
        userId || null,
        scaleId,
        JSON.stringify(answers),
        JSON.stringify(result),
        ipAddress
      ]
    );

    const assessment = await db.get(
      'SELECT * FROM assessments WHERE id = ?',
      [assessmentId]
    );

    if (assessment.answers) {
      assessment.answers = JSON.parse(assessment.answers);
    }
    if (assessment.result) {
      assessment.result = JSON.parse(assessment.result);
    }
    
    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error creating assessment:', error);
    return NextResponse.json(
      { error: '创建测评失败' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDB();
    
    const assessments = await db.all(
      `SELECT a.*, s.title as scale_title, u.name as user_name
       FROM assessments a
       LEFT JOIN scales s ON a.scale_id = s.id
       LEFT JOIN users u ON a.user_id = u.id
       ORDER BY a.started_at DESC
       LIMIT 100`
    );

    const parsedAssessments = assessments.map(a => ({
      ...a,
      answers: a.answers ? JSON.parse(a.answers) : null,
      result: a.result ? JSON.parse(a.result) : null,
    }));
    
    return NextResponse.json(parsedAssessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json(
      { error: '获取测评列表失败' },
      { status: 500 }
    );
  }
}
