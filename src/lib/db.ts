/**
 * 数据库连接与初始化模块
 * 负责建立数据库连接、创建表结构、初始化数据
 */
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';
import { scales, questions } from '@/data/real-scales';

// 数据库连接实例
let db: Database | null = null;
// 数据库初始化状态
let isInitialized = false;

/**
 * 初始化数据库
 * @param database 数据库连接实例
 * @description 创建表结构、索引，并初始化量表数据和管理员用户
 */
async function initializeDatabase(database: Database) {
  try {
    // 开始事务
    await database.exec('BEGIN');

    console.log('开始初始化数据库...');

    // 创建用户表
    await database.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,                -- 用户ID
        email TEXT UNIQUE NOT NULL,         -- 邮箱（唯一）
        password TEXT,                      -- 密码（加密存储）
        name TEXT NOT NULL,                 -- 姓名
        role TEXT DEFAULT 'user',           -- 角色（user/admin）
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- 更新时间
      )
    `);

    // 创建量表表
    await database.exec(`
      CREATE TABLE IF NOT EXISTS scales (
        id TEXT PRIMARY KEY,                -- 量表ID
        title TEXT NOT NULL,                -- 标题
        description TEXT,                   -- 描述
        category TEXT NOT NULL,             -- 类别
        target_audience TEXT,               -- 适用人群
        estimated_time INTEGER,             -- 预计时长
        instructions TEXT,                  -- 指导语
        result_interpretation TEXT,         -- 结果解释
        is_active INTEGER DEFAULT 1,        -- 是否启用（1=启用，0=禁用）
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- 更新时间
      )
    `);

    // 创建题目表
    await database.exec(`
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,                -- 题目ID
        scale_id TEXT REFERENCES scales(id) ON DELETE CASCADE,  -- 关联的量表ID
        content TEXT NOT NULL,              -- 题目内容
        type TEXT NOT NULL,                 -- 题目类型
        options TEXT,                       -- 选项（JSON格式）
        "order" INTEGER NOT NULL,           -- 排序号
        scoring_type TEXT,                  -- 计分类型
        dimension TEXT                      -- 维度
      )
    `);

    // 创建测评表
    await database.exec(`
      CREATE TABLE IF NOT EXISTS assessments (
        id TEXT PRIMARY KEY,                -- 测评ID
        user_id TEXT REFERENCES users(id) ON DELETE SET NULL,  -- 用户ID（可为空，支持匿名）
        scale_id TEXT REFERENCES scales(id) ON DELETE CASCADE,  -- 量表ID
        status TEXT DEFAULT 'draft',        -- 状态（draft/completed/abandoned）
        answers TEXT,                       -- 答案（JSON格式）
        result TEXT,                        -- 结果（JSON格式）
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 开始时间
        completed_at TIMESTAMP,             -- 完成时间
        ip_address TEXT                     -- IP地址
      )
    `);

    // 创建索引，提高查询性能
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

      // 插入管理员用户（默认密码：admin123）
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

    // 提交事务
    await database.exec('COMMIT');
  } catch (error) {
    // 发生错误时回滚事务
    await database.exec('ROLLBACK');
    console.error('Error initializing database:', error);
    throw error;
  }
}

/**
 * 获取数据库连接
 * @returns 数据库连接实例
 * @description 单例模式，确保只创建一个数据库连接实例
 *              首次调用时会自动初始化数据库
 */
export async function getDB(): Promise<Database> {
  if (!db) {
    // 打开数据库连接
    db = await open({
      filename: './rating_sys.db',
      driver: sqlite3.Database,
    });
    
    // 自动初始化数据库（仅首次调用时）
    if (!isInitialized) {
      await initializeDatabase(db);
      isInitialized = true;
    }
  }
  return db;
}

export default getDB;
