import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';
import { scales, questions } from '@/data/real-scales';

let db: Database | null = null;
let isInitialized = false;

async function initializeDatabase(database: Database) {
  try {
    await database.exec('BEGIN');

    console.log('开始初始化数据库...');

    // 创建用户表
    await database.exec(`
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
    await database.exec(`
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
    await database.exec(`
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        scale_id TEXT REFERENCES scales(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        options TEXT,
        "order" INTEGER NOT NULL,
        scoring_type TEXT,
        dimension TEXT
      )
    `);

    // 创建测评表
    await database.exec(`
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
    await database.exec(`CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id)`);
    await database.exec(`CREATE INDEX IF NOT EXISTS idx_assessments_scale_id ON assessments(scale_id)`);
    await database.exec(`CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status)`);

    // 检查是否已有量表数据
    const existingScales = await database.all('SELECT COUNT(*) as count FROM scales');
    if (existingScales[0].count === 0) {
      console.log('插入真实量表数据...');

      // 插入量表
      for (const scale of scales) {
        await database.run(
          `INSERT INTO scales (id, title, description, category, target_audience, estimated_time, instructions, result_interpretation, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      }

      // 插入题目
      for (const question of questions) {
        await database.run(
          `INSERT INTO questions (id, scale_id, content, type, options, "order", scoring_type, dimension)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            question.id,
            question.scaleId,
            question.content,
            question.type,
            JSON.stringify(question.options),
            question.order,
            question.scoringType,
            question.dimension,
          ]
        );
      }

      // 插入管理员用户
      await database.run(
        `INSERT INTO users (id, email, password, name, role)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(email) DO NOTHING`,
        ['admin-user', 'admin@example.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '管理员', 'admin']
      );

      console.log('数据库初始化成功！');
    } else {
      console.log('数据库已存在，跳过初始化');
    }

    await database.exec('COMMIT');
  } catch (error) {
    await database.exec('ROLLBACK');
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function getDB(): Promise<Database> {
  if (!db) {
    db = await open({
      filename: './rating_sys.db',
      driver: sqlite3.Database,
    });
    
    // 自动初始化数据库
    if (!isInitialized) {
      await initializeDatabase(db);
      isInitialized = true;
    }
  }
  return db;
}

export default getDB;
