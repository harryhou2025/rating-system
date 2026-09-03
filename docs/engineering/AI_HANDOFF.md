# AI_HANDOFF.md — AI 接手项目流程

> 本文档面向**第一次接触本项目的 AI 编程工具**（Codex / Claude Code / Cursor / Gemini / 其他）或新程序员。
> 按顺序执行以下步骤，禁止跳步直接写代码。

## Step 1：阅读（顺序即优先级）

```text
README.md                          项目总览（面向人）
AGENTS.md                          AI 协作规则（必须遵守）
CURRENT_STATE.md                   当前状态唯一真相（版本/部署/风险）
PROJECT_CONTEXT.md                 业务背景（这个系统解决什么问题）
docs/architecture/ARCHITECTURE.md  技术架构（模块/数据流/依赖）
docs/engineering/CRITICAL_BUSINESS_RULES.md  不能破坏的业务规则
docs/engineering/CRITICAL_AREAS.md           危险区分级
```

然后只读与当前任务直接相关的代码。历史资料（`HANDOFF.md` 踩坑记录、`.trae/specs/` 功能 PRD）按需查阅，**不要当作当前规则**。

需求涉及重要技术选择（换库、改存储、改认证、改模块边界）时，先查 `docs/architecture/decisions/` 是否已有相关 ADR，避免推翻已论证过的决策。

## Step 2：确认环境

| 项 | 要求 |
|---|---|
| Node | ≥ 20（CI 用 20，本地 22 也可，注意 Node < 22.18 无法加载 TS 版 jest 配置——本项目已改用 jest.config.js 规避） |
| 包管理 | npm（用 `npm ci` / `npm install`，无 pnpm/yarn lock） |
| 依赖 | `npm install` |
| 环境变量 | 复制 `.env.example` 为 `.env`，设置 `JWT_SECRET`（`openssl rand -hex 32`）。`DB_PATH` 可选，默认 `./rating_sys.db`。**build 也需要 JWT_SECRET**（模块加载期校验） |
| 数据库 | 无需手动建——首次运行自动建表 + 灌 27 个种子量表 + 默认管理员（admin@example.com / admin123，仅本地） |
| 启动 | `npm run dev` → http://localhost:3000 |

特殊量表数据（本地库为空时需要）：`npm run import:cdmm`、`npm run import:shenduo`（幂等，可重复执行）。

## Step 3：建立基线（改代码之前必须做）

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build
```

当前基线（2026-09-04）：lint ✅（1 个 warning：Navbar.tsx useEffect 依赖）、tsc ✅、234/234 测试 ✅、build ✅。

**规则：如果基线本身是红的，先报告并修复基线或明确记录，禁止在未知基线状态时提交改动。禁止为了让检查通过而绕过检查。**

## Step 4：修改前必答的 7 个问题

开始写代码之前，必须能回答（写进你的工作记录/commit 说明）：

```text
1. 我要修改什么？
2. 为什么这里是正确的位置？（参考 ARCHITECTURE.md 的依赖关系）
3. 哪些模块依赖它？（rg 搜索 import）
4. 哪些历史功能可能受到影响？（特殊量表？匿名测评？历史报告？）
5. 哪些测试已经覆盖？（tests/ 下 4 个套件）
6. 哪些测试需要新增？（计分变更必须有边界值测试）
7. 修改之后如何证明没有回归？（跑哪些命令/手动验证哪个页面）
```

**无法回答 → 继续调查，不要动手。** 对照 `docs/engineering/CRITICAL_AREAS.md` 确认你要动的文件属于 Critical / High Risk / Normal 哪一级，执行对应要求。

## Step 5：修改

- 只修改完成任务所需的最小范围
- 特殊量表相关改动：记住 4 处同步（API 提交 `src/app/api/assessments/route.ts`、答题页 `src/app/assessment/[id]/page.tsx`、结果页 `src/app/result/[id]/page.tsx`、后台 `src/app/admin/page.tsx`）
- 涉及月龄/日期计算：只允许复用 `src/lib/cdmm.ts` 的 `calculateCorrectedAgeDays`，禁止手写日期减法
- `request.json()` 只能调用一次，需要的字段首次解构时全部取出
- 不修改业务代码也能完成的任务（纯文档、纯脚本），不要碰 `src/`

## Step 6：验证

最低要求（任何 src/ 改动）：

```bash
npm run lint && npx tsc --noEmit && npm test
```

按风险追加：

| 改动类型 | 追加验证 |
|---|---|
| 计分逻辑 | 先在 `tests/` 补边界值测试，再实现；全量 `npm test` |
| API 路由 / 鉴权 | `npm run build` + 启动 dev 用 curl 实测（带/不带 token） |
| 页面 / 组件 | `npm run build` + 浏览器手动走一遍相关流程 |
| db.ts / schema | 删本地测试库验证建表路径 + 用旧结构库验证幂等 ALTER 路径 |
| 部署相关 | 只允许通过 `./scripts/deploy.sh`，绝不直接 scp 覆盖服务器文件 |

## Step 7：总结

任务结束时说明：

1. 改了什么、为什么
2. 修改了哪些文件
3. 运行了哪些检查/测试，结果如何
4. 是否存在未解决风险（若有，登记到 CURRENT_STATE.md 第 8 节）
5. 若改变了项目状态（部署、schema、新增量表、修复 Critical），**同步更新 CURRENT_STATE.md**
6. 按 Step 8 执行 Documentation Sync Check，并在最终报告末尾附 **Knowledge Sync Summary**

## Step 8：知识同步（Documentation Sync，宣称"完成"前的最后一道工序）

> Definition of Done = 代码正确 + 测试通过 + 旧功能未破坏 + **项目知识没有失真**。
> 文档更新发生在功能完成后、最终提交之前——让同一个 commit 同时记录代码、测试与知识变化，而不是让文档永远滞后几个版本。

### 8.1 原则

- **代码是事实，文档是事实的结构化表达**。两者冲突时，以经过验证的代码和测试结果为准，然后修正文档；禁止为了"让代码符合文档"而擅自修改正确的业务代码。
- **不是所有修改都要更新文档**。拼写修复、CSS/普通 UI 微调、不改变行为的重构、无架构变化的性能优化、纯内部实现调整、普通测试补充 → 通常不更新核心文档。但只要它们改变了对外行为/架构/数据结构/业务规则/技术栈/开发流程/部署流程/安全策略/AI 接手方式，就必须更新。
- **不要制造虚假变化**。答案为 No 的项不更新；禁止为"保持同步"而机械改文档。

### 8.2 Knowledge Change Detection（变更类别 → 检查文档）

先判断本次修改落入哪些类别（可多选）：

| 类别 | 触发例子（本项目实际） | 检查文档 |
|---|---|---|
| A 业务变化 | 新量表、新角色、新业务流程、新业务状态、新权限规则 | `PROJECT_CONTEXT.md` |
| B 架构变化 | 新模块、模块边界/数据流变化、API 层变化、新基础设施 | `docs/architecture/ARCHITECTURE.md` |
| C 当前状态变化 | 功能上线、技术栈/Node/依赖变化、DB 实现变化、测试门禁/CI/部署变化 | `CURRENT_STATE.md` |
| D 核心业务规则变化 | 新不变量、权限/数据隔离/快照/兼容规则变化 | `docs/engineering/CRITICAL_BUSINESS_RULES.md` |
| E 修改风险变化 | 模块进入/退出 Critical、成为关键共享入口、新依赖影响多系统 | `docs/engineering/CRITICAL_AREAS.md` |
| F AI 接手方式变化 | 新命令/环境变量/数据库启动方法/部署前置条件/新的"不能这样改"约束 | `AI_HANDOFF.md` + `AGENTS.md` |
| G 项目对外认知变化 | 产品能力、支持的业务、版本重大变化 | `README.md` |

### 8.3 变更 → 文档映射表

| 变更类型 | 必须检查的文档 |
|---|---|
| 新量表（标准计分） | PROJECT_CONTEXT + CURRENT_STATE + ARCHITECTURE + README 量表清单（引入新计分规则时 + CRITICAL_BUSINESS_RULES） |
| 新量表（特殊，走导入脚本） | 上述全部 + CRITICAL_BUSINESS_RULES 规则 6（4 处同步清单）+ CRITICAL_AREAS |
| 新 API / API 行为改变 | ARCHITECTURE + AI_HANDOFF（涉及鉴权时 + CRITICAL_BUSINESS_RULES 规则 10） |
| 数据库 schema 变更（幂等 ALTER） | CURRENT_STATE 第 5 节 + ARCHITECTURE 第 6 节 |
| 新业务规则 / 权限规则变化 | CRITICAL_BUSINESS_RULES（数据可见性变化时 + PROJECT_CONTEXT 第 5 节） |
| 新技术依赖 | CURRENT_STATE 第 2 节 + README 技术栈（重要选择时建 ADR） |
| Node / npm / 构建 / 测试命令变化 | CURRENT_STATE + AGENTS + AI_HANDOFF |
| CI / 部署方式变化 | CURRENT_STATE 第 7 节 + AI_HANDOFF + CRITICAL_BUSINESS_RULES 规则 9 |
| Critical Area 分级变化 | CRITICAL_AREAS |
| 重要架构决策 | ADR（`docs/architecture/decisions/`） |
| 普通 Bug 修复 / UI 微调 / 不改行为的重构 | 通常无需更新核心文档 |

### 8.4 Documentation Sync Check（宣称"任务完成"前必答）

```text
1. 本次修改是否改变了项目当前状态？        Yes / No
2. 本次修改是否改变了业务上下文？          Yes / No
3. 本次修改是否改变了架构？                Yes / No
4. 本次修改是否新增或改变核心业务规则？    Yes / No
5. 本次修改是否改变了 Critical Area？      Yes / No
6. 本次修改是否改变 AI / 程序员接手方式？  Yes / No
7. 本次修改是否改变技术栈、依赖或开发环境？Yes / No
8. 本次修改是否改变测试、CI、构建或部署？  Yes / No
9. 本次修改是否产生需要长期记住的技术决策？Yes / No
10. 本次修改是否需要更新 README？          Yes / No
```

任一 Yes → 按 8.2/8.3 更新对应文档；全部 No → 不更新。重大状态变化（部署、schema、新增量表、修复 Critical）追加记录到 CURRENT_STATE.md 的 Recent Important Changes 一节。

### 8.5 Knowledge Sync Summary（最终报告必含）

```text
Knowledge Sync Summary
项目知识是否发生变化：Yes / No
更新的文档：-（列出文件与改动要点）
新增 ADR：-（无则留空）
新增业务规则：-
新增技术变化：-
新增接手要求：-
无需更新的文档：-
原因：一句话
```

没有任何知识变化时，明确写：`Knowledge Sync: No documentation changes required.` 不要假装更新。

### 8.6 ADR（Architecture Decision Records）

**位置**：`docs/architecture/decisions/`，命名 `NNNN-short-title.md`（四位序号递增），模板见 `docs/architecture/decisions/TEMPLATE.md`（含 Status / Context / Decision / Why / Consequences / Alternatives 六节）。

**出现以下情况必须考虑建立 ADR**：更换技术栈或核心框架、改变数据库架构/存储策略、改变模块边界、改变认证或权限模型、改变核心 API 设计、改变报告或数据快照策略、删除重大旧架构、为兼容历史系统采取的重要设计，以及任何未来开发者很可能问"为什么当初要这样做"的决策。

**不要**为普通小修改、bug 修复、常规依赖升级建 ADR。

### 8.7 Bug 修复与新技术引入的知识沉淀

- **重大 Bug**：Fix → 回归测试 → 判断它是否揭示了此前未记录的业务规则 → 是则写入 CRITICAL_BUSINESS_RULES.md（必要时建 ADR）。每次重大 Bug 都应让项目"变聪明一点"。
- **引入新技术**（npm 包/服务/工具/框架/构建方式）前自问：为什么引入？解决什么问题？对项目有什么影响？有没有新的运行要求？有没有新的安全风险？对新 AI 接手有什么影响？重要选择建 ADR。

### 8.8 文档漂移检查（Documentation Drift Check）

改完文档后运行：

```bash
npm run check:docs
```

自动检查（可靠、零依赖）：当前文档中反引号引用的 src/ scripts/ tests/ docs/ 路径是否存在、文档中出现的 npm run 命令是否存在于 package.json、package.json 中 npx tsx 类脚本的目标文件是否存在。

**无法可靠自动化的部分**（保持人工/AI 判断）：README 功能声明是否与真实代码一致、文档中的数字口径（测试数、量表数）、生产环境实际状态。因此 CURRENT_STATE.md 只写**已确认**的信息；无法确认的写 `UNKNOWN` 或 `NEEDS VERIFICATION`，**禁止猜测**。

## 附：快速参考

- 常用命令：`dev` / `build` / `start` / `lint` / `test` / `seed` / `import:cdmm` / `import:shenduo` / `check:docs`（文档漂移检查）
- CI：push/PR 到 main 自动跑 tsc + lint + jest + build（Node 20）
- 部署：`export RS_SERVER_PASSWORD='...' && ./scripts/deploy.sh`（详见 CURRENT_STATE.md 第 7 节的服务器硬约束）
- 提交规范：conventional commits（`fix:` / `feat:` / `docs:` / `chore:` / `fix(ci):` 等既有风格）
