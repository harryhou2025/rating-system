# AGENTS.md — AI 协作规则总入口

> 本文件是所有 AI 编程工具（Codex / Claude Code / Cursor / Gemini / 其他）与新程序员的**第一入口**。
> 完整接手流程见 `docs/engineering/AI_HANDOFF.md`。

## Project Overview

靛蓝之家在线心理测评系统：Next.js 14 (App Router) + React 18 + TypeScript + Tailwind + SQLite 的单体全栈应用。29 个心理测评量表（焦虑/抑郁/ASD/ADHD/发育里程碑等），支持匿名测评、即时计分报告、管理后台。业务背景见 `PROJECT_CONTEXT.md`。

## Current State

改任何代码前先读 **`CURRENT_STATE.md`**（项目状态唯一真相：版本、部署、数据库、已知风险）。历史文档（HANDOFF.md、.trae/specs/）只是记录，不是当前规则。

## Architecture

读 `docs/architecture/ARCHITECTURE.md`。一分钟版本：

- 页面 = `src/app/**/page.tsx`（全客户端组件）；API = `src/app/api/**/route.ts`（13 个路由）
- 计分引擎：`src/lib/scoring.ts`（27 标准量表，`calculateScore(scaleId, answers)` 分发）；cdmm/shenduo 有独立计分模块
- DB：SQLite 单文件，`src/lib/db.ts` 首次连接自动建表 + 灌种子；无 migration 系统
- 认证：JWT Bearer，`src/lib/middleware.ts` 提供 `withAuth` / `withAdminAuth`

## Development

```bash
npm install                # 依赖
cp .env.example .env       # 必须设置 JWT_SECRET（openssl rand -hex 32）
npm run dev                # 开发服务器 http://localhost:3000
npm run lint               # ESLint
npx tsc --noEmit           # 类型检查
npm test                   # Jest（234 个单测）
npm run build              # 生产构建（需要 JWT_SECRET，模块加载期校验）
npm run check:docs         # 文档漂移检查（改了文档后运行，不属于提交四门禁）
```

提交前最低要求：`npm run lint && npx tsc --noEmit && npm test && npm run build`（CI 跑同样四项）。

## Database

- SQLite 单文件 `./rating_sys.db`（`DB_PATH` 可覆盖）。首次运行**自动建表** + 灌 27 个种子量表 + 默认管理员（admin@example.com / admin123，仅本地）
- **无 migration 系统**：schema 变更 = 在 `src/lib/db.ts` 的 `initializeDatabase` 加幂等 ALTER（参考现有 `meta`/`dimension` 列的 PRAGMA 检查写法）
- 特殊量表数据：`npm run import:cdmm`、`npm run import:shenduo`（幂等，可重复跑）；标准量表改种子后跑 `npm run seed`
- 验证：`sqlite3 rating_sys.db ".tables"`、`SELECT COUNT(*) FROM questions WHERE scale_id='xxx'`
- 已知坑：SQLite 外键约束未启用（ON DELETE CASCADE 无效）

## Important Business Rules

完整清单（12 条，含违反后果与测试保护）见 `docs/engineering/CRITICAL_BUSINESS_RULES.md`。最重要的六条：

1. **计分正确性高于一切**——改计分必须先补边界值测试（`tests/` 是保护网）
2. **result 是提交时写定的快照**——结果页永不重算，历史报告不受未来代码改动影响
3. **匿名测评必须始终可用**——`GET /api/assessments/[id]` 匿名可访问是产品设计（UUID 即凭据），不是漏洞，不许"好心"加鉴权
4. **月龄计算只许复用** `src/lib/cdmm.ts` 的 `calculateCorrectedAgeDays`；日期解析必须 `new Date(date+'T00:00:00')`（时区陷阱）
5. **特殊量表 4 处同步**：API 提交、答题页、结果页、后台（漏一处静默劣化）
6. **量表数据幂等入库**；CDMM/shenduo 后台只读（权威源是导入脚本）

## Critical Areas

分级表见 `docs/engineering/CRITICAL_AREAS.md`。Critical 级（scoring.ts / cdmm.ts / db.ts / assessments route / deploy.sh）改前必须影响分析 + 全量验证。

## Testing Rules

- 改计分逻辑：**先写测试再改**（边界值：满分/零分/分级阈值两侧/反向计分题）
- 改任何 `src/` 文件：至少 `npm run lint && npx tsc --noEmit && npm test`
- 改 API 路由/鉴权：追加 `npm run build` + curl 实测（带/不带 token 两种）
- 测试只增不删；删除或跳过测试需要明确说明理由

## Knowledge Sync（开发即同步知识，不是额外任务）

- **Definition of Done 包含知识同步**：代码正确 + 测试通过 + 旧功能未破坏 + 项目知识没有失真。
- 每个任务在宣称完成前，执行 `docs/engineering/AI_HANDOFF.md` Step 8 的 Documentation Sync Check（10 问）；任一 Yes → 按其中的"变更 → 文档映射表"更新对应文档，全部 No → 不更新（不要制造虚假变化）。最终报告附 Knowledge Sync Summary。
- 重要技术决策（换库、改存储/认证/模块边界、改核心 API 设计等）建立 ADR：`docs/architecture/decisions/`（触发清单与模板见 AI_HANDOFF.md Step 8.6；不为普通小修改建 ADR）。
- 重大 Bug 修复后判断是否揭示了未记录的业务规则，是则补进 `docs/engineering/CRITICAL_BUSINESS_RULES.md`。
- 文档更新发生在功能完成后、最终提交之前（同一个 commit 记录代码 + 测试 + 知识变化）。改完文档跑 `npm run check:docs`。

## Do Not（禁止事项）

- **不要**擅自修改生产环境或生产数据库（部署只走 `./scripts/deploy.sh`，绝不直接 scp 覆盖服务器文件，尤其 `rating_sys.db`）
- **不要**修改 Git 历史（rebase/force-push/filter-repo 需用户明确指示——历史重写涉及已泄漏数据的处理，是用户级决策）
- **不要**删除测试来让检查通过；**不要**关闭 type check / lint 规则来绕过报错（关闭 `react/no-unescaped-entities` 是既有决策，保持现状）
- **不要**做与当前任务无关的"顺手重构"（已知巨型文件 admin/page.tsx 等的拆分是独立任务，需用户批准）
- **不要**给 `GET /api/assessments/[id]` 加鉴权（破坏匿名分享功能）
- **不要**删除 `GET /api/scales`、`/api/admin/statistics` 的 `force-dynamic`（生产数据会停止更新）
- **不要**在改计分/月龄逻辑时不跑对应测试套件
- **不要**手写日期/月龄计算（只许复用 cdmm.ts）
- **不要**在未建立基线（Step 3）前开始改代码
- **不要**在未执行 Knowledge Sync Check（`docs/engineering/AI_HANDOFF.md` Step 8）前宣称任务完成
- **不要**把 `.env`、密钥、token 写进代码或日志
