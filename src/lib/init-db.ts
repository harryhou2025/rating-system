import getDB from './db';
import { v4 as uuidv4 } from 'uuid';

async function initializeDatabase() {
  const db = await getDB();
  try {
    await db.exec('BEGIN');

    console.log('开始初始化数据库...');

    // 创建用户表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建量表表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS scales (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        target_audience TEXT,
        estimated_time INTEGER,
        instructions TEXT,
        result_interpretation TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建题目表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        scale_id TEXT REFERENCES scales(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        options TEXT,
        "order" INTEGER NOT NULL
      )
    `);

    // 创建测评表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS assessments (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
        scale_id TEXT REFERENCES scales(id) ON DELETE CASCADE,
        status TEXT DEFAULT 'draft',
        answers TEXT,
        result TEXT,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        ip_address TEXT
      )
    `);

    // 创建索引
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_assessments_scale_id ON assessments(scale_id)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status)`);

    await db.exec('COMMIT');
    console.log('数据库初始化成功');
  } catch (error) {
    await db.exec('ROLLBACK');
    console.error('Error initializing database:', error);
    throw error;
  }
}

initializeDatabase().catch(console.error);
