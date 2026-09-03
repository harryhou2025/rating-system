# CRITICAL_AREAS.md — 危险区分级（哪里不能随便改）

> 修改前先查此表。分级含义：
> - **Critical**：改前必须做影响分析 + 运行完整测试套件（`lint && tsc && test && build`），涉及业务口径的必须先补测试
> - **High Risk**：改时必须检查表中列出的关联模块，跑相关测试 + build
> - **Normal**：可正常开发，遵循 AI_HANDOFF.md Step 4-6 即可

## Critical（改前必须完整分析 + 全量验证）

| 文件/目录 | 为什么危险 | 关联模块（改它必须查这些） |
|---|---|---|
| `src/lib/scoring.ts` | 27 个量表计分口径全集（1811 行）。一处笔误 → 所有新测评结论错误 | `tests/scoring.test.ts`（保护网）、`api/assessments/route.ts`、全部量表结果页 |
| `src/lib/cdmm.ts` | 矫正月龄/月龄组匹配/CDMM 计分，**前后端共用**；边界日归属被测试锁定 | `tests/cdmm.test.ts`、`api/assessments/route.ts`、`components/cdmm/*`（答题页用它做预校验） |
| `src/lib/shenduo.ts` | shenduo 三维度计分口径 | `tests/shenduo.test.ts`、`api/assessments/route.ts`、`components/shenduo/*` |
| `src/lib/db.ts` | 建表 + 幂等 ALTER + 种子逻辑。改错 → 新库结构漂移、旧库损坏、种子重复灌入 | 所有 API route、`scripts/seed.ts`、生产库结构 |
| `scripts/deploy.sh` | 唯一生产部署通道。错误 = 覆盖真实用户数据库 / 停机 | 生产环境全部（见 CURRENT_STATE.md 第 7 节硬约束） |
| `src/app/api/assessments/route.ts` | 三条计分路径汇合点（cdmm/shenduo/标准）；`request.json()` 只能消费一次 | 三套计分模块、规则 2（快照）、规则 3（匿名）、规则 6（4 处分支之一） |

## High Risk（改时必须检查关联模块）

| 文件/目录 | 风险点 | 关联模块 |
|---|---|---|
| `src/data/real-scales.ts` | 27 量表种子数据源（2189 行）。改后必须 `npm run seed`，否则改动不生效；scaleId 是全系统外键 | `db.ts` 种子逻辑、`scoring.ts` 的 switch（scaleId 必须匹配）、答题/结果页 |
| `src/app/assessment/[id]/page.tsx` | 特殊量表分支点之一（答题页）。漏分支 = 新量表走通用逻辑静默劣化 | `components/cdmm/*`、`components/shenduo/*`、规则 6 其余 3 处 |
| `src/app/result/[id]/page.tsx` | 特殊量表分支点之二（结果页）；result 快照的展示端 | 同上 |
| `src/app/admin/page.tsx` | 1970 行巨型单文件、37 个 useState，后台五标签页全在这。牵一发动全身 | 规则 6 之四（只读逻辑）、`/api/admin/*` 全部接口 |
| `src/app/api/scales/route.ts` | `force-dynamic` 不可删（规则 12：删掉生产启停失效） | `api/admin/statistics`（同规则）、后台启停功能 |
| `src/app/api/assessments/[id]/route.ts` | 匿名访问是有意设计（规则 3）；DELETE 的本人/管理员判断 | 规则 3、规则 10 |
| `src/lib/middleware.ts` / `src/lib/auth.ts` | 全部鉴权边界。JWT_SECRET 加载期校验（build 也依赖） | 规则 10 全部接口、CI（build 需要 dummy secret） |
| `src/app/api/admin/**`（其余） | admin 接口必须保持 `withAdminAuth` 包裹（规则 10） | `middleware.ts` |
| `scripts/import-cdmm.ts` / `import-shenduo.ts` | CDMM 权威数据源（DELETE+重插覆盖 DB）。后台手改会被它清掉 | `src/lib/cdmm-import.ts`、`tests/cdmm-import.test.ts`、规则 11 |

## Normal（正常开发）

| 文件/目录 | 说明 |
|---|---|
| `src/components/ui/**` | 基础 UI 组件（button/card/toast 等） |
| `src/components/Navbar.tsx`、`charts.tsx` | 导航、图表（注意 lint 既有 warning：useEffect 依赖） |
| `src/app/page.tsx`、`/scales`、`/login`、`/register`、`/profile`、`/experts`、`/admin-login` | 常规页面 |
| `src/types/index.ts` | 类型定义（新增字段注意向后兼容：如 Question.meta 是可选的） |
| `src/lib/utils.ts` | 通用工具 |
| `tests/**` | 测试本身（只增不删，见 AGENTS.md Do Not） |
| `docs/**`、根目录各 .md | 文档 |

## 特殊说明：看似普通但影响面大的文件

1. **`src/lib/scoring.ts` 里的 `normalizeAnswers`**：所有标准量表提交的答案都先过它（qid 归一化）。它看着是"工具函数"，实际影响 27 个量表的输入口径。
2. **`src/types/index.ts` 的可选字段**：`Question.meta`、`dimension` 对 27 个旧量表是 undefined，任何"顺手"改成必填会破坏旧数据兼容。
3. **`questions` 表的 `meta` 列 JSON**：CDMM 的月龄组匹配全靠它（`meta.ageGroup`）。改 meta 结构 = CDMM 全部失效，且导入脚本、答题页、提交接口三处要同步。
4. **根目录的 5 个死模块**（`src/lib/{cache,rate-limit,encryption,export}.ts`、`sample-scales.ts`）：**当前无调用方，但删除前必须 rg 确认**（尤其 encryption.ts 有 ENCRYPTION_KEY 加载校验——确认生产 .env 已配置则不影响）。清理属独立任务，不要顺手做。
5. **`jest.config.js` 必须保持 .js**：改成 .ts 在 Node < 22.18 会因缺 ts-node 失败（2026-09-04 CI 修复的教训，commit e20d05d）。
