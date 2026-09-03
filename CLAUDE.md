# CLAUDE.md - Rating-sys 项目指令

## 项目概况

靛蓝之家在线心理测评系统：Next.js 14 (App Router) + React 18 + TypeScript + Tailwind + SQLite。29 个量表，支持匿名测评、结果报告、管理后台。

## 必读文档（改动前先读）

- `HANDOFF.md` — 项目交接全貌：架构、部署约束、踩坑记录、待办
- `.trae/specs/<scale>/spec.md` — 量表业务规则 PRD（cdmm-scale、shenduo-scale 较完整）

## 常用命令

- `npm run dev` — 开发服务器（http://localhost:3000）
- `npm test` — 单元测试（计分逻辑是核心回归保护网）
- `npm run lint` / `npx tsc --noEmit` / `npm run build` — 提交前三件套
- `npm run import:cdmm` / `npm run import:shenduo` — 导入特殊量表数据（幂等）

## 架构关键点

- 量表数据：27 个硬编码于 `src/data/real-scales.ts`（经 `npm run seed` 入库）；cdmm/shenduo 由 scripts/import-*.ts 导入
- 计分：`src/lib/scoring.ts` 的 `calculateScore(scaleId, answers)` 按 scaleId 分发；cdmm/shenduo 有独立计分模块
- 新增特殊量表需同步改 4 处：`src/app/api/assessments/route.ts`、`src/app/assessment/[id]/page.tsx`、`src/app/result/[id]/page.tsx`、`src/app/admin/page.tsx`
- DB：SQLite，无 migration 系统，schema 在 `src/lib/db.ts`，首次连接自动建表 + 灌种子数据
- 认证：JWT + bcrypt，`src/lib/middleware.ts` 提供 withAuth / withAdminAuth；匿名测评的结果页依赖 UUID 作为访问凭据

## 部署

`./scripts/deploy.sh`（本地 build → push → scp .next → 服务器 git pull + pm2 重启）。服务器硬约束见 HANDOFF.md 第七/八节：1.6GB 内存不能 build、npm 一律用 npmmirror 源、绝不能覆盖服务器 rating_sys.db。
