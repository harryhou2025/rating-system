# 在线心理测评系统

一个功能完整的在线心理测评网站，提供ASD、ADHD、情绪评估等多种标准化心理测评工具，支持用户测评、结果分析和后台管理。

## 项目概览

本项目旨在提供一个专业、易用的心理测评平台，帮助用户了解自己的心理健康状况，同时为专业人士提供评估工具。系统集成了多种国际标准化量表，支持自动化计分和结果分析，为用户提供专业的心理健康参考。

## 功能特性

### 1. 测评量表管理系统
- 集成多种标准化心理测评量表
- 支持分类展示（心理状态、发展障碍、情绪评估等）
- 每个量表包含专业说明、适用人群、测评时长及结果解释

### 2. 用户测评流程
- 支持匿名测评与注册用户测评两种模式
- 直观的量表选择界面，提供量表筛选和搜索功能
- 流畅的测评作答界面，支持分页展示题目、进度保存
- 自动化结果分析与报告生成系统

### 3. 后台管理系统
- 管理员后台，支持用户管理、量表管理、数据统计
- 完善的数据统计与分析模块
- 支持数据导出功能（Excel/CSV格式）

### 4. 技术与安全
- 响应式设计，支持PC端和移动端
- 数据加密存储，保障用户隐私
- 完善的权限管理系统
- 系统稳定性和可扩展性

## 技术栈

- **前端框架**: Next.js 15 + React 19 + TypeScript
- **UI组件**: Tailwind CSS + 自定义组件
- **后端**: Next.js API Routes
- **数据库**: PostgreSQL
- **认证**: JWT + bcryptjs
- **图标**: Lucide React

## 快速开始

### 1. 安装依赖

\`\`\`bash
npm install
\`\`\`

### 2. 配置数据库

确保已安装PostgreSQL，然后创建数据库：

\`\`\`sql
CREATE DATABASE rating_sys;
\`\`\`

复制环境变量配置文件：

\`\`\`bash
cp .env.example .env
\`\`\`

编辑 `.env` 文件，配置数据库连接信息：

\`\`\`env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rating_sys
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your-secret-key-change-in-production
\`\`\`

### 3. 初始化数据库

\`\`\`bash
npm run init-db
\`\`\`

### 4. 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

\`\`\`
rating-sys/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API路由
│   │   │   ├── auth/          # 认证相关API
│   │   │   ├── scales/        # 量表管理API
│   │   │   ├── assessments/   # 测评管理API
│   │   │   └── admin/         # 管理后台API
│   │   ├── assessment/        # 测评页面
│   │   ├── scales/            # 量表列表页面
│   │   ├── result/            # 结果展示页面
│   │   ├── admin/             # 管理后台页面
│   │   ├── login/             # 登录页面
│   │   ├── register/          # 注册页面
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 首页
│   │   └── globals.css        # 全局样式
│   ├── components/            # React组件
│   │   └── ui/               # UI组件库
│   ├── lib/                  # 工具函数
│   │   ├── db.ts            # 数据库连接
│   │   ├── auth.ts          # 认证工具
│   │   └── utils.ts         # 通用工具
│   ├── types/               # TypeScript类型定义
│   └── data/                # 示例数据
├── public/                   # 静态资源
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
\`\`\`

## 主要功能说明

### 量表列表
- 展示所有可用的心理测评量表
- 支持按类别筛选和搜索
- 显示量表的基本信息（标题、描述、适用人群、预计时长）
- 提供量表详情页，包含完整的量表说明和指导语

### 测评流程
- 用户选择量表后进入测评页面
- 逐题作答，显示进度条
- 支持上一题/下一题导航
- 自动保存答题进度
- 完成后自动计算结果
- 支持匿名测评和注册用户测评

### 结果展示
- 显示测评得分和风险等级
- 提供专业的结果解读
- 给出针对性的建议
- 支持下载报告和分享链接
- 注册用户可查看历史测评记录

### 管理后台
- 查看系统统计数据
- 查看各量表的参与情况
- 查看每日趋势
- 导出统计报告
- 管理用户账户
- 管理量表信息（添加、编辑、禁用）
- 查看详细的测评记录

## API 接口说明

### 公共接口
- `GET /api/scales` - 获取量表列表
- `GET /api/scales/[id]` - 获取量表详情
- `POST /api/assessments` - 创建测评
- `GET /api/assessments/[id]` - 获取测评结果

### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

### 管理后台接口
- `GET /api/admin/scales` - 获取所有量表（包括禁用的）
- `POST /api/admin/scales` - 创建新量表
- `PATCH /api/admin/scales` - 更新量表信息
- `DELETE /api/admin/scales` - 删除量表
- `GET /api/admin/assessments` - 获取所有测评记录
- `GET /api/admin/statistics` - 获取系统统计数据

## 已集成量表

### 情绪评估
- GAD-7 焦虑筛查量表
- PHQ-9 抑郁筛查量表
- SAS 焦虑自评量表
- SDS 抑郁自评量表
- SCL-90 症状自评量表

### 发展障碍
- M-CHAT 自闭症筛查量表
- CARS 儿童自闭症评定量表
- AQ 自闭症谱系商数量表
- DCD-Q 发育协调障碍筛查问卷
- RCADS 儿童焦虑抑郁综合评估量表
- SCARED 儿童焦虑筛查量表

### 注意力缺陷多动障碍
- SNAP-IV 注意缺陷多动障碍症状评估量表（家长版）
- VANDERBILT 范德比尔特ADHD筛查量表
- Conners3-父母版注意缺陷多动障碍评定量表
- Conners3-教师版注意缺陷多动障碍评定量表
- Brown 成人注意力缺陷多动障碍量表
- ADHD-RS-IV ADHD评定量表第四版
- CAARS-Conners成人ADHD评定量表-简版
- CAARS-Conners成人ADHD评定量表-完整版

### 其他量表
- 成人阅读障碍检查表-DAC
- IDA成人阅读障碍自测题
- HSPS-27高敏感者量表
- PSI-SF 家长养育压力量表简版

## 数据库设计

### users 表
- id: 用户ID
- email: 邮箱
- password: 密码（加密）
- name: 姓名
- role: 角色（user/admin）
- created_at: 创建时间
- updated_at: 更新时间

### scales 表
- id: 量表ID
- title: 标题
- description: 描述
- category: 类别
- target_audience: 适用人群
- estimated_time: 预计时长
- instructions: 说明
- result_interpretation: 结果解释
- is_active: 是否启用
- created_at: 创建时间
- updated_at: 更新时间

### questions 表
- id: 题目ID
- scale_id: 量表ID
- content: 题目内容
- type: 题目类型
- options: 选项
- order: 排序

### assessments 表
- id: 测评ID
- user_id: 用户ID（可为空，支持匿名）
- scale_id: 量表ID
- status: 状态（draft/completed/abandoned）
- answers: 答案（JSON）
- result: 结果（JSON）
- started_at: 开始时间
- completed_at: 完成时间
- ip_address: IP地址

## 安全说明

- 所有密码使用bcrypt加密存储
- 使用JWT进行用户认证
- 支持匿名测评，保护用户隐私
- 数据库连接使用连接池，防止SQL注入
- API接口进行参数验证

## 部署

### 使用Vercel部署

1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 配置环境变量
4. 部署PostgreSQL数据库（推荐使用Supabase或Neon）
5. 运行数据库初始化脚本

### 使用Docker部署

```bash
docker-compose up -d
```

### 阿里云服务器部署

1. 购买阿里云ECS实例（推荐2核4G以上配置）
2. 安装Node.js 18+和PostgreSQL
3. 克隆代码到服务器
4. 安装依赖：`npm install`
5. 配置环境变量
6. 初始化数据库：`npm run init-db`
7. 构建项目：`npm run build`
8. 使用PM2运行：`pm2 start npm -- start`
9. 配置Nginx反向代理
10. 配置SSL证书

## 日常维护

### 安全维护
- 定期更新系统和依赖包：`npm update`
- 配置防火墙，只开放必要端口
- 使用SSH密钥登录，禁用密码登录
- 定期备份数据库

### 数据维护
- 定期备份数据库：`pg_dump -U postgres rating_sys > backup.sql`
- 监控系统性能和数据库状态
- 清理过期的测评数据

### 功能维护
- 定期添加新的量表
- 更新量表内容和计分逻辑
- 优化系统性能
- 修复bug和安全漏洞

## 开发指南

### 如何添加新量表

1. 在 `src/data/real-scales.ts` 中添加量表信息和题目
2. 在 `src/lib/scoring.ts` 中实现计分逻辑
3. 运行 `npx tsx scripts/seed.ts` 导入量表到数据库
4. 验证量表是否在前台显示

### 如何修改量表

1. 在 `src/data/real-scales.ts` 中修改量表信息或题目
2. 运行 `npx tsx scripts/seed.ts` 更新数据库
3. 验证修改是否生效

### 如何调试

- 开发模式：`npm run dev`
- 查看API响应：`curl http://localhost:3001/api/scales`
- 检查数据库：`sqlite3 rating_sys.db ".tables"`
- 查看日志：`pm2 logs`（生产环境）

## 注意事项

1. 本系统提供的测评结果仅供参考，不作为医学诊断依据
2. 如测评结果显示存在风险，建议咨询专业医生
3. 请勿自行诊断或治疗
4. 系统需要遵守相关法律法规，特别是用户隐私保护

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交Issue
- 发送邮件

---

**免责声明**: 本系统仅供心理健康评估参考使用，不能替代专业医疗诊断。如有需要，请咨询专业心理健康服务提供者。
