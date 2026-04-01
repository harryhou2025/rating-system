# 在线心理测评系统

一个功能完整的在线心理测评网站，提供ASD、ADHD等多种标准化心理测评工具。

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

### 测评流程
- 用户选择量表后进入测评页面
- 逐题作答，显示进度条
- 支持上一题/下一题导航
- 自动保存答题进度
- 完成后自动计算结果

### 结果展示
- 显示测评得分和风险等级
- 提供专业的结果解读
- 给出针对性的建议
- 支持下载报告和分享链接

### 管理后台
- 查看系统统计数据
- 查看各量表的参与情况
- 查看每日趋势
- 导出统计报告

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

\`\`\`bash
docker-compose up -d
\`\`\`

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
