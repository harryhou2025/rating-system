# CURRENT\_STATE.md — 项目当前状态唯一入口

> 本文是项目"当前状态"的唯一权威来源。其他文档（HANDOFF.md、.trae/specs/ 等）是历史记录，若与本文冲突，以本文为准。
> 更新约定：每次改变项目状态的任务（部署、修复 Critical 问题、schema 变更、新增量表）完成后，必须同步更新本文；重要变化登记到第 9 节。**只写已确认的信息**，无法确认的写 `UNKNOWN` / `NEEDS VERIFICATION`，禁止猜测。

最后核验日期：2026-09-04

***

## 1. 当前版本

| 项                 | 值                                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------- |
| 分支                | `main`（与 `origin/main` 同步）                                                                |
| 本地最新 commit       | 以 `git log -1` 为准（知识库文档自身提交会造成此行滞后，不逐 commit 维护）                |
| Git tag / release | 无（项目从未打 tag）                                                                              |
| 代码实际状态            | 工作区干净，无未提交改动                                                                              |
| 是否已部署             | 是（生产环境运行中，2026-09-04 部署）                                                                  |
| 生产环境对应 commit     | `e20d05d`（依据 HANDOFF.md 第七/九节部署记录；其后至今均为纯文档/知识库提交，功能无差异，未部署）                         |
| GitHub            | `harryhou2025/rating-system`，CI 绿灯（tsc + lint + jest + build，Node 20）                     |

## 2. 当前技术栈

以 `package.json` 与实际代码为准：

- **框架**: Next.js 14.2.13（App Router）+ React 18.3 + TypeScript 5

- **样式**: Tailwind CSS 3.4 + 自定义组件（`src/components/ui/`）

- **数据库**: SQLite（`sqlite3` 5.1.7 + `sqlite` 5.1.1 驱动），单文件 `./rating_sys.db`

- **认证**: JWT（jsonwebtoken，Bearer token，7 天有效期）+ bcryptjs 密码哈希

- **测试**: Jest 30 + ts-jest 29（纯逻辑单元测试，无组件/接口测试）

- **Lint**: ESLint 8 + eslint-config-next 14.2.13（next/core-web-vitals）

- **特殊依赖**: xlsx（CDMM 题目导入）、uuid、recharts（统计图表）、lucide-react（图标）

- **运行环境**: 本地 Node ≥ 20；CI 用 Node 20；生产 pm2 + nginx

## 3. 当前主要业务能力

以实际代码为准：

1. **量表浏览**：29 个心理测评量表（GAD-7、PHQ-9、SCL-90、SNAP-IV、CAARS、CDMM、shenduo 等），分类展示、搜索、详情页（`/scales`）
2. **在线测评**：匿名或登录用户逐题作答（`/assessment/[id]`），提交后即时计分
3. **结果报告**：得分 + 风险等级 + 解读建议（`/result/[id]`）；CDMM 提供儿童发育里程碑彩色报告（彩虹脚丫图、目标里程碑、红灯警示）
4. **用户系统**：注册 / 登录（`/register`、`/login`），JWT 鉴权
5. **管理后台**（`/admin`，admin 角色专属）：统计仪表盘、量表 CRUD 与启停、题目管理、测评记录查看、用户管理
6. **数据导入**：CDMM（xlsx 源）与 shenduo 量表通过幂等导入脚本入库

## 4. 当前核心模块

| 模块          | 位置                                                     | 职责                                                            |
| ----------- | ------------------------------------------------------ | ------------------------------------------------------------- |
| 页面路由        | `src/app/**/page.tsx`                                  | 首页/量表/测评/结果/登录/注册/后台                                          |
| API 路由      | `src/app/api/**/route.ts`                              | 13 个路由文件：auth(2)、scales(3)、assessments(2)、user(1)、admin(5)    |
| 计分引擎        | `src/lib/scoring.ts`（1811 行）                           | `calculateScore(scaleId, answers)` 按 scaleId 分发到 27 个标准量表计分函数 |
| CDMM 专模块    | `src/lib/cdmm.ts` / `cdmm-import.ts`                   | 矫正月龄、月龄组匹配、CDMM 计分（纯函数，可单测）；xlsx 清洗                           |
| shenduo 专模块 | `src/lib/shenduo.ts` / `shenduo-questions.ts`          | 三维度（汪/喵/敏感星人）计分                                               |
| 数据库层        | `src/lib/db.ts`                                        | 单例连接 + 运行时建表 + 种子数据（详见第 5 节）                                  |
| 认证          | `src/lib/auth.ts` + `src/lib/middleware.ts`            | token 签发/校验；`withAuth`/`withAdminAuth` 包装器                    |
| 量表数据        | `src/data/real-scales.ts`（2189 行）                      | 27 个量表 + 题目的硬编码定义（种子源）                                        |
| 后台前端        | `src/app/admin/page.tsx`（1970 行）                       | 单文件管理后台（已知巨型文件，重构待议）                                          |
| 导入脚本        | `scripts/import-cdmm.ts`、`import-shenduo.ts`、`seed.ts` | 幂等数据导入                                                        |
| 部署脚本        | `scripts/deploy.sh`                                    | 本地 build → push → scp .next → 服务器 git pull + pm2 重启           |

## 5. 当前数据库状态

- **数据库**: SQLite 单文件，路径由 `DB_PATH` 控制（默认 `./rating_sys.db`）

- **无 migration 系统**：schema 由 `src/lib/db.ts` 的 `initializeDatabase()` 在首次连接时用 `CREATE TABLE IF NOT EXISTS` 创建；结构变更靠"PRAGMA table\_info 检查 + 幂等 ALTER"（目前仅 questions 表的 `meta`/`dimension` 两列用此方式补齐）

- **表结构**: `users`、`scales`、`questions`、`assessments`（4 张表，3 个索引）

- **种子数据行为**: 仅当 `scales` 表为空时灌入 real-scales.ts 的 27 个量表 + 题目 + 默认管理员（<admin@example.com> / admin123，仅本地开发用）

- **SQLite/JSON 关系**: `assessments.answers`、`assessments.result`、`questions.options`、`questions.meta` 均为 TEXT 列存 JSON 字符串，读写处手动 `JSON.parse/stringify`，无 ORM

- **量表数据双源**: 27 个标准量表来自 real-scales.ts（`npm run seed`）；cdmm/shenduo 来自导入脚本（`npm run import:cdmm` / `import:shenduo`），均幂等

- **已知数据库风险**:

  - SQLite `PRAGMA foreign_keys` 未启用，DDL 里声明的 `ON DELETE CASCADE` 实际无效（删除量表/用户会留下孤儿 assessments/questions）

  - 无 migration 版本管理，schema 演进依赖运行时补丁，旧库升级路径无记录

  - 本地仓库根目录有 3 个 0 字节 db 文件（data.db/database.db/db.sqlite）被 git 跟踪，属杂物

  - **真实用户数据库（4 用户 + 35 测评记录）曾在 2026-04 被提交并推送至公开 GitHub 历史**（详见第 8 节风险 #2）

## 6. 当前测试和质量门禁

| 命令                 | 内容                      | 当前结果（2026-09-04 本地实测）                                              |
| ------------------ | ----------------------- | ------------------------------------------------------------------ |
| `npm run lint`     | ESLint                  | ✅ 通过（1 个 warning：Navbar.tsx useEffect 依赖，非阻塞）                      |
| `npx tsc --noEmit` | 类型检查                    | ✅ 通过                                                               |
| `npm test`         | Jest 单测                 | ✅ 234/234 通过（4 套件：scoring / cdmm / cdmm-import / shenduo）          |
| `npm run build`    | 生产构建                    | ✅ 成功（注意：构建期会执行 SQLite 初始化与路由模块加载，需 JWT\_SECRET 环境变量，CI 里用 dummy 值） |
| CI（GitHub Actions） | push/PR 触发上述四项（Node 20） | ✅ 绿灯（`.github/workflows/ci.yml`）                                   |

**测试盲区（已知）**：16 个 API 路由零测试（2026-09-04 的鉴权漏洞正因此漏网）；React 组件零测试。

**提交前最低要求**：`npm run lint && npx tsc --noEmit && npm test && npm run build`。

另有 `npm run check:docs`：文档漂移检查（改文档后运行，不属于提交四门禁，CI 未包含）。

## 7. 当前部署状态

| 项            | 值                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| 生产地址         | 阿里云 ECS `42.121.164.189`，nginx 反代 80→3000，pm2 运行 `next start`                                                                |
| 服务器目录        | `/var/www/rating-sys`（已 git 仓库化，HTTPS remote origin/main）                                                                    |
| 部署 commit    | `e20d05d`（2026-09-04，含全部安全修复）                                                                                                |
| 部署方式         | `./scripts/deploy.sh` 半自动（本地 build → push → scp `.next` → 服务器 git pull + 备份 db + pm2 重启 + 健康检查）                              |
| 回滚资产         | `/var/www/rating-sys-manual`（手工部署旧目录）、`/var/www/rating-sys.bak-20260808-225746`、`/var/www/rating_sys.db.bak-20260808-225746` |
| 服务器侧 git 外资产 | `.env`、`rating_sys.db`（真实数据）、CDMM 源 xlsx                                                                                     |

**服务器硬约束（违反会导致部署失败或数据丢失）**：

1. 服务器内存仅 1.6GB，**不能在服务器上 build**，必须本地构建后上传 `.next`
2. 服务器无 npm 官方源，安装依赖一律加 `--registry=https://registry.npmmirror.com`
3. **绝不能覆盖服务器上的** **`rating_sys.db`**（真实用户数据）
4. 服务器 `.env` 必须配置 `JWT_SECRET`（代码有启动校验，缺失直接 throw）

## 8. 当前已知风险

> 完整历史清单见 HANDOFF.md 第九节第 5 条。此处只列**当前仍然存在**的。

| #  | 级别           | 风险                                                                                                                                                                         | 状态  |
| -- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 1  | **Critical** | 生产 admin 密码仍为默认 `admin123`（实测可登录）。需人工登录后台修改，或服务器跑 `reset-admin-password.js`                                                                                                | 未处理 |
| 2  | **Critical** | Git 历史泄漏：含真实用户数据的 `rating_sys.db` 存在于 2026-04 历史 commit（如 825160f）且已推送公开 GitHub。处理需 `git filter-repo` 重写历史 + force push + 服务器重新 clone（backup-phase\* 分支也引用旧对象），或视为已泄漏仅轮换凭证 | 未处理 |
| 3  | High         | JWT\_SECRET 自 2026-04 起未轮换（与 #1/#2 一并处理；轮换后所有登录态失效，属预期）                                                                                                                    | 未处理 |
| 4  | Medium       | SQLite 外键约束未启用（见第 5 节）                                                                                                                                                     | 未处理 |
| 5  | Medium       | 巨型文件：`admin/page.tsx` 1970 行、`real-scales.ts` 2189 行、`scoring.ts` 1811 行                                                                                                   | 未处理 |
| 6  | Medium       | 特殊量表 4 处分支蔓延（无注册机制，漏一处即静默劣化），见 CRITICAL\_BUSINESS\_RULES.md 规则 6                                                                                                           | 未处理 |
| 7  | Medium       | 16 个 API 路由零测试、React 组件零测试                                                                                                                                                 | 未处理 |
| 8  | Medium       | cdmm/shenduo 的 admin **API 层**写接口无专用守卫（UI 层只读，但直接调 API 可改数据）                                                                                                               | 未处理 |
| 9  | Medium       | 死模块 5 个：`src/lib/{cache,rate-limit,encryption,export}.ts`、`src/data/sample-scales.ts`（无调用方）                                                                                | 未处理 |
| 10 | Low          | CDMM 答题页无"返回/重新填写"入口；`XXXXXXXX` 机构占位符；webhook 自动部署未做                                                                                                                       | 未处理 |

***

## 9. Recent Important Changes（最近重要变化）

> 只记重要变化（新功能上线、schema 变更、安全修复、部署、技术栈/机制变化），普通小修复不记录。新条目加在最上面；条目过多时将旧内容移入历史归档目录（建立时在下方文档地图登记）。让新 AI 不必翻几十个 commit 就知道最近发生了什么。

**2026-09-04（第三阶段，知识同步机制）**

- 建立知识同步机制：Knowledge Change Detection + 变更 → 文档映射表 + Documentation Sync Check + Knowledge Sync Summary（`docs/engineering/AI_HANDOFF.md` Step 8）
- 建立 ADR 机制：`docs/architecture/decisions/`（TEMPLATE.md + 触发清单）
- 建立文档漂移检查：`npm run check:docs`（scripts/check-docs.js，零依赖静态检查）
- 移除坏的 init-db script（指向从未存在的 src/lib/init-db.ts；重新灌入种子数据用 `npm run seed`）
- 修正 README 若干与代码不符的功能声明（导出功能为占位、无进度保存、无字段级加密、SQLite 单例连接而非连接池）

**2026-09-04（安全与工具修复，commit e20d05d，已部署）**

- 修复 3 个无鉴权 API（assessments 列表、DELETE、admin statistics）→ 规则 10
- 修复生产 statistics 静态预渲染不更新 bug（force-dynamic）→ 规则 12
- jest.config.ts → jest.config.js，修复 Node 20 CI

**2026-09-04（第二阶段，项目知识体系）**

- 建立核心文档 8 份：AGENTS / CURRENT_STATE / PROJECT_CONTEXT / ARCHITECTURE / AI_HANDOFF / CRITICAL_BUSINESS_RULES / CRITICAL_AREAS，README 增加知识入口表；HANDOFF.md、PERFORMANCE.md 标记为历史

**2026-08-08**

- 首次部署迁移为 git 仓库化 + `./scripts/deploy.sh` 半自动部署（踩坑细节见 HANDOFF.md 第七节）

***

## 附：文档地图（哪些是"当前"，哪些是"历史"）

| 文档                                            | 状态                 | 说明                                                              |
| --------------------------------------------- | ------------------ | --------------------------------------------------------------- |
| `README.md`                                   | **当前**             | 面向人的项目总览（技术栈/启动/部署）                                             |
| `AGENTS.md`                                   | **当前**             | AI 协作规则总入口（所有 AI 工具先读这个）                                        |
| `CLAUDE.md`                                   | **当前**             | 指向 AGENTS.md 的薄指针（Claude Code 自动读取用）                            |
| `CURRENT_STATE.md`                            | **当前**             | 本文                                                              |
| `PROJECT_CONTEXT.md`                          | **当前**             | 业务背景（给完全不了解项目的人）                                                |
| `docs/architecture/ARCHITECTURE.md`           | **当前**             | 技术架构                                                            |
| `docs/engineering/AI_HANDOFF.md`              | **当前**             | AI 接手项目流程                                                       |
| `docs/engineering/CRITICAL_BUSINESS_RULES.md` | **当前**             | 业务不变量                                                           |
| `docs/engineering/CRITICAL_AREAS.md`          | **当前**             | 危险区分级                                                            |
| `docs/architecture/decisions/`                | **当前**             | ADR 架构决策档案（TEMPLATE.md + 各决策记录，见 AI_HANDOFF.md Step 8.6）        |
| `HANDOFF.md`                                  | **历史**             | 2026-09-04 前的会话交接记录（踩坑细节/部署流水账），现状以 CURRENT\_STATE.md 为准        |
| `PERFORMANCE.md`                              | **历史（未实施）**        | 早期愿景稿，描述的缓存/CDN 策略均未实现                                          |
| `docs/agents/*.md`                            | **历史（通用模板）**       | 技能框架的通用模板，非本项目实际约定                                              |
| `.trae/specs/*/`                              | **历史（已实现的功能 PRD）** | cdmm-scale、shenduo-scale、dcd-q-scale、scale-management 四个功能的设计文档 |

