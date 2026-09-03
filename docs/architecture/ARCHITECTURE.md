# ARCHITECTURE.md — 技术架构

> 目标：新 AI 不需要先读几千行代码，就能知道项目整体怎么运行。业务背景见 `PROJECT_CONTEXT.md`，当前状态见 `CURRENT_STATE.md`。

## 1. 系统整体架构

单体全栈应用，无独立后端服务、无队列、无外部中间件。Next.js App Router 同时承载前端页面和 API：

```text
Browser（React 18 客户端组件，Tailwind）
   ↓ fetch / 导航
Next.js 14 App Router（单一 Node 进程，pm2 托管）
   ├── src/app/**/page.tsx        页面（全部 'use client' 客户端组件）
   └── src/app/api/**/route.ts    13 个 API 路由文件
        ↓
   src/lib/middleware.ts          withAuth / withAdminAuth（JWT Bearer 校验）
        ↓
   src/lib/scoring.ts | cdmm.ts | shenduo.ts    计分引擎（纯函数）
        ↓
   src/lib/db.ts                  getDB() 单例连接 + 运行时建表/种子
        ↓
   SQLite 单文件（./rating_sys.db，TEXT 列存 JSON）
```

nginx（生产）反代 80→3000。无 SSR 数据获取——页面都是客户端组件，数据靠 fetch API 路由。

## 2. 前端结构

### 页面（`src/app/`）

| 路由 | 文件 | 说明 |
|---|---|---|
| `/` | `page.tsx` | 首页（营销 + 量表入口） |
| `/scales` | `scales/page.tsx` | 量表列表（分类筛选、搜索） |
| `/assessment/[id]` | `assessment/[id]/page.tsx` | 答题页；**id 是 scaleId**；按 scaleId 分支：cdmm→CDMMAssessment、shenduo→ShenduoAssessment、其余→通用逐题组件 |
| `/result/[id]` | `result/[id]/page.tsx` | 结果页；**id 是 assessmentId**；同样按 scaleId 分支到专用结果组件 |
| `/login`、`/register` | — | 用户认证 |
| `/admin-login` | — | 管理员登录（独立入口） |
| `/admin` | `admin/page.tsx` | 管理后台（**1970 行单文件**，37 个 useState，统计/量表/题目/记录/用户五个标签页） |
| `/profile` | — | 个人中心（历史测评） |
| `/experts` | — | 专家团队介绍（静态营销页） |

### 组件（`src/components/`）

- `ui/`：基础组件（button/card/input/toast 等，shadcn 风格）
- `cdmm/CDMMAssessment.tsx` + `CDMMResult.tsx`：CDMM 专用答题/结果组件
- `shenduo/ShenduoAssessment.tsx` + `ShenduoResult.tsx`：shenduo 专用组件
- `Navbar.tsx`：全局导航（登录态检测）
- `charts.tsx`：后台统计图表（recharts）

**页面间关系**：首页/量表列表 → 答题页（scaleId）→ POST 提交 → 跳结果页（assessmentId）。结果页是"凭 UUID 回看"的永久入口，匿名用户依赖它分享报告。

## 3. 后端结构（API 路由）

### 路由与鉴权全景（13 个 route.ts）

| 路由 | 方法 | 鉴权 | 说明 |
|---|---|---|---|
| `/api/auth/login`、`/api/auth/register` | POST | 公开 | 签发 JWT（7 天） |
| `/api/scales` | GET | 公开 | 量表列表（仅启用的）；`force-dynamic` |
| `/api/scales/[id]` | GET | 公开 | 量表详情 + 题目 |
| `/api/scales/[id]/questions` | GET | 公开 | 题目列表 |
| `/api/assessments` | POST | 公开* | **提交测评**（核心入口，见下） |
| `/api/assessments` | GET | admin | 测评列表（含用户姓名） |
| `/api/assessments/[id]` | GET | 公开（有意） | 单条结果；匿名测评凭 UUID 访问，**不是漏洞**，代码有注释 |
| `/api/assessments/[id]` | DELETE | 本人或 admin | 删除测评 |
| `/api/user/assessments` | GET | withAuth | 当前用户历史测评 |
| `/api/admin/scales` | GET/POST/PATCH/PUT/DELETE | withAdminAuth | 量表 CRUD |
| `/api/admin/scales/[id]/questions` | GET/POST/PUT/DELETE/PATCH | withAdminAuth | 题目管理 |
| `/api/admin/assessments` | GET | withAdminAuth | 全部测评记录 |
| `/api/admin/statistics` | GET | withAdminAuth | 统计数据；`force-dynamic` |
| `/api/admin/users` | GET | withAdminAuth | 用户管理 |

*POST /api/assessments 是公开的因为要支持匿名测评；userId 由前端传入（登录用户才带）。

### 提交测评的核心逻辑（`src/app/api/assessments/route.ts` POST）

```text
POST body: { userId?, scaleId, answers, ipAddress?, childInfo? }
  ├── scaleId === 'cdmm-scale'     → 校验 childInfo → 算矫正月龄 → 匹配月龄组
  │                                    → 取该组题目 → calculateCDMM() → 入库
  ├── scaleId === 'shenduo-scale'  → 取题目维度映射 → calculateShenduo() → 入库
  └── 其余 27 个量表               → calculateScore(scaleId, answers) → 入库
入库内容：assessments 表一行，answers（原始答案 JSON）+ result（计分结果快照 JSON），
status='completed'，completed_at=now。result 一次写定，之后永不重算。
```

### 计分引擎（`src/lib/scoring.ts`，1811 行）

- 入口：`calculateScore(scaleId, answers)` —— 先 `normalizeAnswers` 归一化，再 `switch(scaleId)` 分发到 27 个 `calculateXxx()` 函数（gad7/phq9/sas/sds/scl90/mchat/cars/aq/dcdq/rcads/scared/…）
- 每个函数纯函数、无 IO，返回统一 `ScoringResult`（总分/等级/解读/建议）
- cdmm / shenduo **不走这个入口**，各有独立计分模块（`src/lib/cdmm.ts`、`src/lib/shenduo.ts`），因为需要题目上下文和儿童信息
- 依赖方向：route → scoring/cdmm/shenduo → 无（纯函数，这是它们可被 234 个单测覆盖的原因）

### 认证（`src/lib/auth.ts` + `middleware.ts`）

- 登录成功 → `generateToken(userId, role)` 签发 JWT（HS256，7 天过期），前端存 localStorage，请求带 `Authorization: Bearer <token>`
- `withAuth(handler)`：校验 token 后注入 `(req, userId, role)`；`withAdminAuth(handler)`：再校验 `role === 'admin'`，否则 403
- `JWT_SECRET` 环境变量必填，缺失时模块加载即 throw（**build 也需要**，CI 用 dummy 值）

## 4. 数据流（典型请求：匿名用户完成一次 GAD-7）

```text
1. GET /api/scales                     → scales 表（is_active=1）
2. GET /api/scales/gad7-scale          → scales + questions 表
3. 用户逐题作答（纯前端状态）
4. POST /api/assessments
   body: { scaleId: 'gad7-scale', answers: {q1:2, q2:1, ...} }
   服务端：calculateScore('gad7-scale', answers)
   → INSERT INTO assessments (id=uuid, answers=JSON, result=JSON, status='completed')
   → 返回完整 assessment（answers/result 已 JSON.parse）
5. 前端跳转 /result/<assessmentId>
6. GET /api/assessments/<id>           → 读该行，parse JSON，返回
   （此后任何时间凭同一 URL 都能回看——result 是快照，与未来计分逻辑改动无关）
```

管理链路：`/admin` 页面 → localStorage token → `/api/admin/*`（withAdminAuth）→ 同一套表。

## 5. 关键依赖关系

```text
src/data/real-scales.ts（27 量表硬编码，2189 行）
  ↑ 被 import
src/lib/db.ts（建表 + 种子灌入：仅 scales 表为空时）
  ↑ 被 import（getDB）
所有 API route + scripts/seed.ts

src/lib/scoring.ts ← api/assessments/route.ts（POST）
src/lib/cdmm.ts    ← api/assessments/route.ts + components/cdmm/*（前后端共用矫正月龄！）
src/lib/shenduo.ts ← api/assessments/route.ts

src/lib/auth.ts ← api/auth/* + middleware.ts ← 所有需要鉴权的 route
src/types/index.ts ← 全局共享类型
```

值得注意：**`src/lib/cdmm.ts` 被前端和后端同时引用**（答题页也用 `calculateCorrectedAgeDays` 做预校验），改它必须考虑两端。

## 6. 构建与部署架构的特殊点

1. **build 期会执行模块顶层代码**：`auth.ts` 顶层读 JWT_SECRET（缺失 throw）；部分 API 路由 build 期会做静态预渲染并触发 SQLite 初始化。因此 build 必须有 JWT_SECRET；`/api/scales` 和 `/api/admin/statistics` 显式 `export const dynamic = 'force-dynamic'`（否则生产环境统计数据不更新——2026-09-04 修复的真实 bug，勿删）
2. **部署拓扑**：本地 build → scp `.next` → 服务器 `next start`（pm2）。服务器 1.6GB 内存不能 build；服务器 `.env`/db/xlsx 在 git 之外（详见 CURRENT_STATE.md 第 7 节）
3. **数据库 schema 就地演化**：无 migration 文件，`db.ts` 首次连接时 `CREATE TABLE IF NOT EXISTS` + 幂等 `ALTER`（PRAGMA 检查列存在）。新列加入 = 在 `initializeDatabase` 里加一段幂等 ALTER

## 7. Critical Areas（详见 docs/engineering/CRITICAL_AREAS.md）

按当前代码实际判断（本项目没有 engine/config/http-server 等目录，以下为真实危险区）：

| 区域 | 为什么危险 |
|---|---|
| `src/lib/scoring.ts` | 27 个量表的计分口径全集；一处改动影响数万历史报告的可信度 |
| `src/lib/cdmm.ts` | 前后端共用；矫正月龄/月龄组边界被测试锁定 |
| `src/lib/db.ts` | 建表 + 种子逻辑；改错会导致新库结构漂移或旧库损坏 |
| `src/app/api/assessments/route.ts` | 三条计分路径的汇合点；request.body 只能消费一次 |
| `src/app/assessment/[id]/page.tsx` + `result/[id]/page.tsx` | 特殊量表分支所在；漏分支=静默劣化 |
| `src/app/admin/page.tsx` | 1970 行巨型文件，牵一发动全身 |
| `src/data/real-scales.ts` | 种子数据源；改题目必须跑 `npm run seed` 才生效 |
| `scripts/deploy.sh` | 唯一部署通道；错误操作可能覆盖生产数据库 |
