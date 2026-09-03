# 靛蓝之家测评系统 - 会话交接文档

生成时间：2026-09-04（安全加固 + 工具链 + CI 会话，见第九节）
当前分支：main
最新 commit：e20d05d (fix(ci): convert jest.config.ts to .js so tests run on Node 20)
GitHub：已同步 origin/main，CI 绿灯（tsc + lint + jest + build）
生产环境：已部署 2026-09-04（42.121.164.189，含全部安全修复）

---

## 一、项目概况

- 技术栈：Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS
- 数据库：SQLite (sqlite3)，库文件 `./rating_sys.db`（可用 DB_PATH 覆盖）
- 认证：JWT + bcryptjs；后台管理员账号 admin@example.com（密码 admin123，仅本地开发用）
- 测试：Jest + ts-jest（234 个测试用例，含既有 28 量表 + CDMM + shenduo）+ GitHub Actions CI（tsc/lint/jest/build）
- 量表数量：29 种（27 种原有 + cdmm-scale + shenduo-scale）
- 服务器：阿里云 42.121.164.189，项目在 `/var/www/rating-sys`（pm2 `npm run start`，nginx 反代 80→3000，内存仅 1.6GB）。已 git 仓库化：HTTPS remote `origin/main`，`git pull` 即可更新代码

---

## 二、本次会话交接：CDMM 儿童发育里程碑核验量表

> 这是以"新增分支、不动旧逻辑"方式实现的第 28 个量表，可作为后续量表开发的模板。

### 1. 修改内容

**新增文件（7 个）**

| 文件 | 职责 |
|---|---|
| `src/lib/cdmm.ts` | CDMM 纯函数：矫正月龄 / 18 月龄组匹配 / 计分（可单测） |
| `tests/cdmm.test.ts` | 22 个测试：月龄组边界、矫正月龄、计分规则 |
| `src/lib/cdmm-import.ts` | xlsx 解析 + ◆ 题目清洗（纯函数，可单测） |
| `tests/cdmm-import.test.ts` | 清洗规则测试 |
| `scripts/import-cdmm.ts` | 读 xlsx → 幂等入库 → 校验报告（默认数据源 `/Users/hou/工作/5 里程碑定稿 2~8岁 20220217.xlsx`） |
| `src/components/cdmm/CDMMAssessment.tsx` | 答题页：儿童信息表单 + 一屏一能区分组答题 |
| `src/components/cdmm/CDMMResult.tsx` | 结果页：儿童信息卡 / 彩虹脚丫图 / 目标里程碑 / 小红灯 / 签字区 |

**修改文件（7 个）**

| 文件 | 改动 | 影响 |
|---|---|---|
| `src/lib/db.ts` | questions 表新增 `meta` 列（幂等 ALTER + dimension 列兼容） | 旧库无损 |
| `src/types/index.ts` | 新增 `QuestionMeta`、`CdmmChildInfo`；`Question.meta` 为可选字段 | 旧量表 meta=undefined，行为不变 |
| `src/app/api/scales/[id]/route.ts` | questions 映射透出 `meta` | 旧量表不变 |
| `src/app/api/assessments/route.ts` | POST 加 `scaleId === 'cdmm-scale'` 分支（提前 return） | 通用流程原样保留 |
| `src/app/assessment/[id]/page.tsx` | cdmm-scale 分支渲染 CDMMAssessment | 其他量表走原逐题逻辑 |
| `src/app/result/[id]/page.tsx` | cdmm-scale 分支渲染 CDMMResult | 同上 |
| `src/app/admin/page.tsx` | cdmm-scale 隐藏编辑/删除、题目弹窗只读，保留启停 | 其他量表按钮保留（`!isCdmm` 恒真） |

**新增依赖**：`xlsx`（解析数据源，必要）；`package.json` 新增脚本 `npm run import:cdmm`。

**影响范围**：既有 27 量表零功能改动。回归证据：218 测试全过、`npm run build` 成功、GAD-7 答题页与后台操作实测正常。

### 2. 注意哪些坑

**配置项变更**
- 无新增环境变量（JWT_SECRET / ENCRYPTION_KEY / DB_PATH 沿用，见第三节）
- 新增 `xlsx` 依赖需 `npm install` 后再 build

**数据兼容风险**
- questions 表 `meta` / `dimension` 列均为幂等 ALTER（`PRAGMA table_info` 检查后才补），旧库无影响
- cdmm-scale 的 798 道题由导入脚本维护（DELETE+重插，事务包裹），后台仅 UI 层只读——**API 层 admin 写接口未加守卫**，纵深防御可选后续补
- 题数说明：xlsx 清洗后 798 题 vs spec 声称 799，唯一差异是被过滤的纯括号注释 `（9~10月龄）`（正是 spec 要求删除的项），以 xlsx 为准

**依赖服务顺序**
- **必须先跑 `npm run import:cdmm` 导入数据**，cdmm-scale 才可用（scales 记录 + questions 都靠它）
- 幂等：重复执行不产生重复题
- 其余开发流程无启动顺序要求

**关键坑（踩过并已修复，后续不要重蹈）**
1. **时区陷阱**：`new Date('YYYY-MM-DD')` 是 UTC 午夜解析，UTC+8 凌晨相减会少 1 天。必须用 `new Date(date + 'T00:00:00')` 本地午夜。矫正年龄计算已封装在 `calculateCorrectedAgeDays`，前端/后端都必须复用它，禁止手写日期计算
2. **request.body 只能消费一次**：`request.json()` 只能调用一次，childInfo 必须首次解构时一并取出
3. **月龄组边界重叠日**（90/150/210… 同时是相邻组边界）：策略为"顺序匹配第一个命中 → 归属低月龄组"，测试已锁定，业务口径变更需同步改 `AGE_GROUPS` 与测试
4. **未评估能区渲染**：dimensionResults 中无数据的能区必须渲染为灰色"未评估"，不能渲染成蓝色（图例蓝色=全部很熟练，会误导家长）
5. **空答案/非法值**：空 answers 时 severity='未完成评估'；非法选项值（如 3）白名单校验后跳过，不能静默判为达标

### 3. 将要准备做

**遗留待办**
- webhook 自动部署未做（git 仓库化 + `scripts/deploy.sh` 半自动流程已落地，见第八节；webhook 可后置）
- ~~`.trae/specs/` 与 HANDOFF.md 等文档未纳入 git~~（已于 2026-09-04 提交，见第九节）
- 结果页红灯区：无警示数据的月龄组（8/14/16/20/22月龄、7岁、8岁）仍显示"未发现红灯"区块；若需严格按 spec 隐藏，需计分层对无警示组输出 `redFlag: null`，再由 UI 整块隐藏（当前行为与计划一致，可接受）
- 答题页 quiz 阶段无"返回/重新填写"入口（审查 Minor，填写错需刷新重来）
- 提供筛查机构为占位符 `XXXXXXXX`（spec Open Question 默认）

**后续计划（下一个量表开发套路）**
- 按 CDMM 模式复用：数据解析纯函数（可单测）→ 幂等导入脚本 → API 分支 → 答题页 → 结果页 → 后台只读
- 若新量表含"按条件分组/匹配"逻辑，可直接参考 `src/lib/cdmm.ts` 的结构与测试方式
- 新量表数据入库后记得验证：`SELECT COUNT(*) FROM questions WHERE scale_id='xxx'` + 后台启停测试

**需外部确认**
- 题数口径：798 vs spec 799（已按 xlsx 为准，如 spec 需更新请告知）
- 矫正月龄算法（早产按"今天 − 预产期"天数差）与 `XXXXXXXX` 占位是否需替换为真实机构名
- 生产数据库备份策略：服务器 `rating_sys.db.bak-20260808-225746` 为部署时备份，日常是否需要定时备份

---

## 三、服务器上必须确保的环境变量

JWT_SECRET 不能为空（代码有启动校验），DB_PATH 可选。ENCRYPTION_KEY 仅被 `src/lib/encryption.ts`（当前无任何调用方的死模块）校验，生产已配置则保留即可，未配置也不影响运行。

```
JWT_SECRET=<至少32位随机字符串>
DB_PATH=./rating_sys.db
```

---

## 四、部署步骤概览

1. SSH 到阿里云服务器，确认当前运行方式
2. 不要覆盖 .db 数据库文件
3. 本地 npm run build 确认无错误
4. 打包上传（排除 node_modules、.db、.next/cache）
5. 服务器端：停服务 -> 解压覆盖 -> npm install -> 重启

---

## 五、本地命令速查

- `npm run dev`          -> http://localhost:3000
- `npm test` / `npx jest` -> 234 tests（全量）
- `npm run build`        -> 构建检查
- `npm run lint`         -> ESLint（2026-09-04 起可用，.eslintrc.json 已补）
- `npm run import:cdmm`  -> 重新导入 CDMM 题目（幂等）
- `npx tsc --noEmit`     -> 类型检查
- 提交前三件套：`npm run lint && npx tsc --noEmit && npm test && npm run build`（CI 会自动跑同样的检查）

---

## 六、备份分支

- backup-phase0-before-changes
- backup-phase1-bugfix
- backup-phase2-before-security

---

## 七、部署记录（2026-08-08，42.121.164.189）

**部署内容**：17 个 commit 一次性上线（安全加固 + 质量提升 + Toast + CDMM + shenduo），29 个量表。

**部署方式**（无 git，打包上传）：
1. 本地 `npm run build` → tar 打包源码+配置+`.next`（排除 node_modules/db/env）
2. scp 上传 → 服务器停 pm2 → 备份旧目录+db → 解压 → 恢复 db、复用旧 node_modules
3. 写 `.env`（JWT_SECRET/ENCRYPTION_KEY 取自本地 .env，NODE_ENV=production）
4. `npm install --omit=dev --registry=https://registry.npmmirror.com`（补 xlsx）
5. `npm run import:cdmm` + `import:shenduo` 导入新量表数据
6. pm2 restart + 健康检查（登录/CDMM 提交链路全通过）

**关键约束（再次部署必读）**：
- 服务器**无 npm 官方源**（超时），一律用 `--registry=https://registry.npmmirror.com`
- 服务器**内存 1.6GB**，不能 `npm run build`，必须本地构建后上传 `.next`
- 服务器 `npm install --omit=dev` 后**没有 tsx**，跑导入脚本前需 `npm install --no-save tsx --registry=...`
- CDMM 数据源 xlsx 已上传至 `/var/www/rating-sys/`，导入时用 `npx tsx scripts/import-cdmm.ts "./5 里程碑定稿 2~8岁 20220217.xlsx"`
- **绝不能覆盖** `/var/www/rating-sys/rating_sys.db`（真实数据）
- 登录密码 admin123 仅本地；生产 admin 密码未改（注意安全）

**服务器现状**：
- `/var/www/rating-sys`（运行中，**已 git 仓库化**：`git pull` 即可更新代码，HEAD=e20d05d，remote origin/main，git 身份已配置 harryhou2025；2026-09-04 部署含全部安全修复）
- `/var/www/rating-sys-manual`（手工部署旧目录备份，含完整 node_modules/.next，可回滚）
- `/var/www/rating-sys.bak-20260808-225746`（部署前备份，可清理）
- `/var/www/rating_sys.db.bak-20260808-225746`（部署前数据库备份，可清理）
- 服务器侧资产在 git 之外：`.env`、`rating_sys.db`、`5 里程碑定稿 2~8岁 20220217.xlsx`（xlsx 已加入 `.git/info/exclude`，不污染 git status）

**验证结果**：29 量表、CDMM 798 题、shenduo 60 题、admin 登录 OK、CDMM 提交链路 OK、pm2 stable（unstable restarts 0）。

---

## 八、后续部署方案建议（git + webhook）

值得做，但受两个硬约束影响设计：
1. **服务器 1.6GB 内存无法 build** → 构建必须留在本地/CI，服务器只 `next start`
2. **数据库/`.env`/xlsx 是服务器侧资产** → 不能整目录覆盖

推荐方案（由简到全）：
- **方案 A（已完成 2026-08-08）：git 仓库 + 半自动部署脚本**。服务器已 clone 仓库（`/var/www/rating-sys`，HTTPS pull）；`scripts/deploy.sh` 已就绪：本地 build → push → 打包 `.next` → scp → 服务器执行 停服/备份 db/git pull/解压/restart/健康检查。用法：`export RS_SERVER_PASSWORD='...' && ./scripts/deploy.sh`。比 webhook 简单，保留手动确认。
- **方案 B：GitHub Actions 构建产物 + webhook**。push 到 main 触发 Action 在云端 build 产物 → 推送到服务器（需暴露 webhook 或服务器定时拉取）。自动化程度最高，但对个人项目略重，且 Action 也依赖服务器可达性。
- **方案 C：完整 CI/CD**（Action build + SSH 部署 + 数据库迁移检查）。收益有限，暂不推荐。

结论：**git 仓库化已完成**（版本可回溯、diff 可审、与本项目已有 GitHub 同步），webhook 可后置。日常发版流程：本地 `./scripts/deploy.sh` 一键半自动部署。

---

## 九、2026-09-04 会话记录：工程健康审计 + Critical/High 修复 + CI + 部署

> 背景：对项目做了一次完整工程健康审计（只读），随后按优先级修复全部 Critical/High 问题，建立 CI，并部署到生产。审计结论：代码中等偏上，但核心知识（HANDOFF/specs）未入库、README 失真（声称 PostgreSQL/Next 15，实际 SQLite/Next 14）、存在多个无鉴权 API。

### 1. 安全修复（commit 8692cf5，已上线生产并实测验证）

| 接口 | 修复内容 | 生产实测 |
|---|---|---|
| `GET /api/assessments` | 列表含用户姓名，加 `withAdminAuth`（前端本无调用方） | 无 token → 401 ✅ |
| `DELETE /api/assessments/[id]` | 加本人或管理员鉴权；匿名测评仅管理员可删 | 无 token → 401 ✅ |
| `GET /api/admin/statistics` | 补 `withAdminAuth`（原为唯一未鉴权的 admin 路由） | 无 token → 401 ✅ |
| `GET /api/scales`、`/api/admin/statistics` | 加 `export const dynamic = 'force-dynamic'`，修复**构建期静态预渲染**导致后台启停/统计数据在生产不更新的 bug | statistics 带 token 返回实时数据（4 用户/64 测评）✅ |
| `src/app/api/user/assessments/route.ts` | 清除打印 JWT token 与完整用户数据的 console.log（泄漏进 pm2 日志） | 已清零 ✅ |

**设计决策（后续维护者必知）**：
- `GET /api/assessments/[id]` **有意保留匿名访问**：匿名测评的结果页/分享链接依赖 UUID（v4 随机，不可枚举）作为访问凭据，加鉴权会破坏产品功能。代码内有注释说明。
- `react/no-unescaped-entities` 规则被关闭：36 处全是中文文案里的英文引号，逐个转义会大面积改动用户可见文本。
- jwt 相关：JWT_SECRET 未轮换，已登录用户不受本次部署影响。

### 2. 工具链（commit 26a951f + e20d05d）

- `.eslintrc.json`（next/core-web-vitals）：`npm run lint` 由交互式卡死变为可用
- `eslint-config-next` 15.1.6 → **14.2.13**（15.x 需 ESLint 9，与项目 ESLint 8/Next 14 不匹配）
- **GitHub Actions CI**（`.github/workflows/ci.yml`）：push/PR 触发 tsc + lint + jest + build，首跑即抓出一个被本地 Node 22 掩盖的坑：
  - **jest.config.ts → jest.config.js**（e20d05d）：Jest 30 在 Node < 22.18 加载 TS 配置需要 ts-node（项目未安装）。本地 Node 22 原生 type stripping 掩盖了问题，CI（node 20）失败。改为纯 JS 后全版本通吃。
- CI 状态：run #2 全绿（https://github.com/harryhou2025/rating-system/actions）

### 3. 知识入库（commit 179cc75）

- 提交：HANDOFF.md、CLAUDE.md（重写为真实命令/架构/部署约束）、docs/agents/、`.trae/specs/cdmm-scale/`、`.trae/specs/shenduo-scale/`
- README 修正：技术栈改为真实状态（Next 14 + React 18 + SQLite）、部署章节改为 deploy.sh 实际流程、补 29 量表清单与特殊量表导入说明
- `.env.example` 修正：真实必需变量（JWT_SECRET/DB_PATH），删除 PostgreSQL 变量
- `.gitignore` 增补：`.claude/`、`update*.tar.gz`

### 4. 部署记录（2026-09-04，42.121.164.189）

- 4 个 commit（8692cf5 → e20d05d）经 deploy.sh 上线：git pull Fast-forward（24 files）、db 自动备份、pm2 restart、健康检查 200
- 验证：29 量表在线、无 token 三接口全部 401、公开接口 200、admin 链路正常、用户数据完好（零 schema 变更）

### 5. 遗留问题（按优先级，未处理）

**Critical（安全，需人工操作）**
1. **生产 admin 密码仍为 admin123**：实测可登录。修改方式：登录后台改，或服务器跑 `node reset-admin-password.js` 类脚本（根目录有 reset-password.js/reset-admin-password.js 可参考）。改完 JWT_SECRET 一并轮换的话所有用户需重新登录。
2. **Git 历史泄漏**：`rating_sys.db`（4 个真实用户邮箱 + bcrypt 哈希 + 35 条测评记录）存在于 2026-04 历史 commit（如 825160f）且**已推送公开 GitHub**。处理选项：(a) `git filter-repo` 重写全部历史 + force push + 服务器重新 clone + 删除/过滤 3 个 backup-phase* 分支（它们仍引用旧对象）；(b) 仅轮换凭证当作已泄漏；(c) 两者都做。注意：force push 后 GitHub 缓存的旧 commit 仍可短期通过 SHA 访问，需联系 GitHub Support 清除。

**High（建议尽快）**
3. **JWT_SECRET 自 2026-04 起未轮换**：与 #1/#2 一并处理（轮换后已登录用户被登出，属预期）。

**Medium（择机）**
4. 无 migration 系统：schema 靠 `src/lib/db.ts` 运行时幂等补丁（PRAGMA table_info + ALTER）；SQLite 外键约束未启用（`PRAGMA foreign_keys` 未开，声明的 ON DELETE CASCADE 实际无效）。
5. 巨型文件：`src/app/admin/page.tsx` 1970 行（37 个 useState）、`src/data/real-scales.ts` 2189 行、`src/lib/scoring.ts` 1811 行。
6. 新增特殊量表的 4 处分支蔓延（API 提交/答题页/结果页/后台），无注册机制，漏一处即静默劣化。
7. 死模块 5 个未清理：`src/lib/{cache,rate-limit,encryption,export}.ts`、`src/data/sample-scales.ts`（其中 rate-limit 若接入登录/注册接口可顺手解决暴力破解面）。
8. 测试盲区：16 个 API 路由零测试（本次的鉴权漏洞正因此漏网）；React 组件零测试。
9. 根目录杂物：3 个 0 字节 db（data.db/database.db/db.sqlite，已被 git 跟踪）、13 个量表 txt 源、一次性脚本（reset-password.js 等）、update*.tar.gz。

**Low**
10. CDMM 答题页无"返回/重新填写"入口；`XXXXXXXX` 机构占位符；webhook 自动部署未做。
