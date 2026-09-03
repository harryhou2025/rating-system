# 神经多样性特质自筛量表（shenduo-scale）- 实施计划

> **For agentic workers:** 本计划为**实施完成后的补记文档**（2026-08-08），下述任务均已实现并通过验证（`npx jest` 全量 234 用例 PASS、`npx tsc --noEmit` 干净、`npm run build` 成功、浏览器端到端冒烟通过）。checkbox 用 `- [x]` 标记已完成。如需复现流程，按各 Task 中列出的命令执行即可。

**Goal:** 在现有量表系统上实现神经多样性特质自筛量表：使用说明 → 三部分顺序答题（每部分 20 题二选一）→ 结果报告（三特质比例卡 + 组合解读 + 高分建议 + 附录资源）。

**Architecture:** 复用现有 scales/questions/assessments 表与通用答题/结果路由，对 `shenduo-scale` 做分支渲染。新增 2 个 lib 文件 + 2 个组件 + 1 个导入脚本承载专属逻辑：`src/lib/shenduo.ts`（纯函数：分级 + 计分，可单测）、`src/lib/shenduo-questions.ts`（60 题数据源）、`src/components/shenduo/ShenduoAssessment.tsx`（说明页 + 分组答题）、`src/components/shenduo/ShenduoResult.tsx`（趣味报告）。数据经 `scripts/import-shenduo.ts` 幂等入库（UPSERT 量表 + DELETE/INSERT 题目）。

**Tech Stack:** Next.js 14 + SQLite (sqlite3) + TypeScript + Tailwind + Jest；无新增依赖（题目数据为 PDF 人工转写的 TS 常量，无需解析库）。

---

## 数据源与关键事实（探查结论）

- **PDF 数据源**: `/Users/hou/工作/神多特质趣味筛查.pdf`（10 页，PyMuPDF 提取文本）。
  - 第 1 页：封面（标题：神经多样性特质自筛量表）。
  - 第 2 页：使用说明（什么是神经多样性、如何作答、评分与结果解读表、重要提示）。
  - 第 3-4 页：汪星人（ADHD 特质）20 题。
  - 第 5-6 页：喵星人（ASD 特质）20 题。
  - 第 7-8 页：敏感星人（HSP 特质）20 题。
  - 第 9 页：计分规则（0-5 不明显 / 6-10 轻度存在 / 11-15 较为突出 / 16-20 非常显著）+ 三特质结果解读 + 组合解读。
  - 第 10 页：高分建议 + 附录（推荐阅读 / 专业帮助）。
  - 部分页面为图片版式，题目文字经逐题人工核对转写（引号沿用 PDF 原文的中文引号）。
- **现有架构**:
  - `questions` 表已有 `dimension` 字段（本量表直接用于存储"汪星人/喵星人/敏感星人"，无需新增列）。
  - 通用流程：`/assessment/[id]` 逐题作答 → `POST /api/assessments` 调 `calculateScore` 入库 → `/result/[id]` 展示。
  - CDMM 已建立"专属量表分支 + 只读后台"模式：`src/app/api/assessments/route.ts` 按 `scaleId` 分支、`src/app/admin/page.tsx` 用只读量表集合隐藏编辑入口。
  - 项目计划文件约定存放于 `.trae/specs/<feature>/tasks.md`（本文件）。

---

## 文件结构

| 文件 | 操作 | 职责 |
|---|---|---|
| `src/lib/shenduo.ts` | 新建 | 三特质定义 + `getLevel` 分级 + `calculateShenduo` 计分（纯函数） |
| `tests/shenduo.test.ts` | 新建 | 分级边界 + 计分 + 组合解读测试 |
| `src/lib/shenduo-questions.ts` | 新建 | 60 题数据源（维度 + 题目文案） |
| `scripts/import-shenduo.ts` | 新建 | 幂等入库（UPSERT 量表 + DELETE/INSERT 题目）+ 导入报告 |
| `src/app/api/assessments/route.ts` | 修改 | POST 分支处理 shenduo-scale |
| `src/components/shenduo/ShenduoAssessment.tsx` | 新建 | 使用说明 + 三部分顺序答题 |
| `src/components/shenduo/ShenduoResult.tsx` | 新建 | 趣味结果报告 |
| `src/app/assessment/[id]/page.tsx` | 修改 | shenduo-scale 分支渲染答题组件 |
| `src/app/result/[id]/page.tsx` | 修改 | shenduo-scale 分支渲染结果组件 |
| `src/app/admin/page.tsx` | 修改 | 只读量表集合加入 shenduo-scale（隐藏编辑/删除/题目增删改） |
| `package.json` | 修改 | 新增脚本 `import:shenduo` |

---

## Task 1: 领域逻辑（分级 + 计分）与单测

**Files:**
- Create: `src/lib/shenduo.ts`
- Create: `tests/shenduo.test.ts`

- [x] **Step 1: 写测试 `tests/shenduo.test.ts`**
  - `getLevel` 边界用例：0/5→不明显，6/10→轻度存在，11/15→较为突出，16/20→非常显著。
  - `SHEINDUO_TRAITS` 含 3 特质，维度名 = 汪星人/喵星人/敏感星人。
  - `calculateShenduo`：全部不符合→三维度 0 分；全部符合→各 20 分（100%）非常显著；混合（汪 11/喵 6/敏感 0）→ 等级正确且生成"汪星人 + 喵星人"组合；非法作答值（非 0/1）不计分；无有效作答→"未完成评估"；未匹配维度题目被忽略；recommendation 提及最突出特质并含免责声明。

- [x] **Step 2: 实现 `src/lib/shenduo.ts`**
  - `SHEINDUO_TRAITS`：每特质含 key/emoji/name/trait/dimension/reference/description/interpretation/advice/color（🐕 琥珀 #f59e0b、🐱 青绿 #14b8a6、🌸 玫红 #ec4899）。
  - `getLevel(score)`：0-5 不明显 / 6-10 轻度存在 / 11-15 较为突出 / 16-20 非常显著，附 `percentRange`。
  - `calculateShenduo(answers, questions)`：按 dimension 汇总 符合(1) 计数 → 每部分 score + percent（score×5）+ level；作答值白名单 0/1，其余忽略；`answeredCount===0` → severity"未完成评估"；组合解读在双方得分 ≥6 时输出并按合计排序；severity = 最高特质"X特质Y级"；recommendation = 最突出特质摘要 + 免责声明。

- [x] **Step 3: 验证**
  - Run: `npx jest tests/shenduo.test.ts` → 全部 PASS（16 用例）。

---

## Task 2: 60 题数据源 + 幂等导入

**Files:**
- Create: `src/lib/shenduo-questions.ts`
- Create: `scripts/import-shenduo.ts`
- Modify: `package.json`

- [x] **Step 1: 数据源 `src/lib/shenduo-questions.ts`**
  - `SHEINDUO_QUESTIONS: ShenduoQuestionDraft[]`，60 条（汪星人 1-20 / 喵星人 21-40 / 敏感星人 41-60），内容逐题转写自 PDF 第 3-8 页。

- [x] **Step 2: 导入脚本 `scripts/import-shenduo.ts`**
  - `SCALE_RECORD`：id=shenduo-scale、title=神经多样性特质自筛量表、category=人格特质评估、targetAudience=青少年及成人（自我探索）、estimatedTime=12、instructions/resultInterpretation 按 PDF 使用说明与计分规则撰写。
  - 选项：`[{value:1,label:'符合'},{value:0,label:'不符合'}]`。
  - 幂等：`INSERT ... ON CONFLICT(id) DO UPDATE` 更新量表；`DELETE FROM questions WHERE scale_id=?` 后重建 60 题（order 1-60，dimension 写维度名）。
  - 事务包裹（BEGIN/COMMIT/ROLLBACK），完成后输出导入报告（三部分题数 + 总题数对照规格 60）。

- [x] **Step 3: package.json 加脚本**
  - `"import:shenduo": "npx tsx scripts/import-shenduo.ts"`

- [x] **Step 4: 运行导入并核对**
  - Run: `npm run import:shenduo` → 报告输出：汪星人 20 / 喵星人 20 / 敏感星人 20，总 60（差异 0）。再次运行不产生重复题（幂等）。

---

## Task 3: 答题 API 支持 shenduo-scale

**Files:**
- Modify: `src/app/api/assessments/route.ts`

- [x] **Step 1: POST 分支处理 shenduo-scale**
  - 在 CDMM 分支之后、`calculateScore` 之前插入分支（提前 return，不进通用计分）：
  - 从 DB 加载 `SELECT id, dimension FROM questions WHERE scale_id=? ORDER BY "order" ASC`；
  - 归一化 answers（支持 UUID key → `q{order}`，兼容 `q{n}` 直接传入）；
  - `calculateShenduo(normalized, questions)` 计分 → 插入 assessments 表 → 返回含 result 的记录。
  - 顶部 import `calculateShenduo`。

- [x] **Step 2: 验证**
  - Run: `npx tsc --noEmit` → 无类型错误。
  - 手动（`npm run dev` + curl 提交 60 题答案）→ 返回 severity/recommendation/dimensionResults/combos 正确。

---

## Task 4: 答题页（使用说明 + 三部分顺序答题）

**Files:**
- Create: `src/components/shenduo/ShenduoAssessment.tsx`
- Modify: `src/app/assessment/[id]/page.tsx`

- [x] **Step 1: assessment/[id]/page.tsx 分支渲染**
  - `if (!scale || questions.length === 0)` 之后插入 `if (scale.id === 'shenduo-scale') return <ShenduoAssessment scale={scale} questions={questions} />;`
  - 顶部 import `ShenduoAssessment`。

- [x] **Step 2: 实现 `ShenduoAssessment.tsx`**
  - 阶段 intro：标题 + 神经多样性科普 + 三特质卡片（emoji/description/reference）+ 如何作答 4 条 + 评分分级表 + 重要提示（免责声明）+ 「开始测评」按钮。
  - 阶段 quiz：按 `SHEINDUO_TRAITS` 顺序分 3 部分，每部分 20 题卡片（内容 + 符合/不符合二选一，选中态用该特质主题色高亮）；部分级进度条 + "第 X/3 部分 · 已完成 N/20 题"；底部导航「上一部分 / 下一部分 / 提交」，跨部分前校验本部分已全部作答（toast 提示未答数）。
  - 提交：与现有答题页一致（localStorage 取 user、POST /api/assessments、跳转 `/result/{id}`）。

- [x] **Step 3: 验证**
  - Run: `npx tsc --noEmit` → 无类型错误。
  - 浏览器：说明页各区块渲染正常；点「开始测评」进入汪星人部分（20 题）；未作答点「下一部分」弹"还有 20 题未作答"。

---

## Task 5: 结果页（趣味报告）

**Files:**
- Create: `src/components/shenduo/ShenduoResult.tsx`
- Modify: `src/app/result/[id]/page.tsx`

- [x] **Step 1: result/[id]/page.tsx 分支渲染**
  - CDMM 分支旁插入 `if (scale.id === 'shenduo-scale') return <ShenduoResult assessment={assessment} scale={scale} />;`
  - 顶部 import `ShenduoResult`。

- [x] **Step 2: 实现 `ShenduoResult.tsx`**
  - 背景渐变 + logo + 标题「你的神经多样性报告」+ 返回列表按钮。
  - 🔮 综合星象解读：recommendation + 组合解读卡（emoji + 特质组合 + 标题 + 文案）。
  - 三张特质比例卡：emoji 圆标（主题色底）+ 特质名/参考量表 + 分级徽章 + 大号百分比 + 得分/20 与占比区间 + 主题色进度条 + 各特质解读。
  - 💡 高分特质小建议：得分 ≥6 的特质展示 advice 清单。
  - 📚 附录：推荐阅读 + 专业帮助 + 免责声明（amber 警示卡）。

- [x] **Step 3: 验证**
  - Run: `npx tsc --noEmit` → 无类型错误。
  - 浏览器访问已提交测评的 `/result/{id}`：三卡百分比/等级/进度条与计分一致，组合解读与建议区正确。

---

## Task 6: 后台管理（只读）

**Files:**
- Modify: `src/app/admin/page.tsx`

- [x] **Step 1: 只读量表集合扩展**
  - 新增模块级常量：`READONLY_SCALE_IDS = ['cdmm-scale', 'shenduo-scale']` 与 `isReadonlyScaleId(id)`。
  - 量表列表：编辑/删除按钮以 `!isReadonlyScaleId(scale.id)` 隐藏。
  - 题目弹窗：头部提示"该量表数据由导入脚本维护，后台只读"；「添加题目」与每题编辑/删除按钮以同条件隐藏；保留查看 + 启停开关。

- [x] **Step 2: 验证**
  - Run: `npx tsc --noEmit` → 无类型错误。

---

## Task 7: 端到端回归验证

**Files:** 无（验证为主）

- [x] **Step 1: 全量单测** — Run: `npx jest` → 4 suites / 234 用例全 PASS（既有 28 量表 + shenduo 新增）。
- [x] **Step 2: 类型检查** — Run: `npx tsc --noEmit` → 无错误。
- [x] **Step 3: 构建** — Run: `npm run build` → 成功。
- [x] **Step 4: 端到端冒烟**（`npm run dev` + Chrome 控制）
  - `/api/scales` 列表含 shenduo-scale（title/category 正确）；
  - `/api/scales/shenduo-scale` 返回 60 题（dimension/options 正确）；
  - POST 混合答案（汪 11/喵 6/敏感 20）→ severity=敏感星人特质非常显著、totalScore=37、三卡百分比与等级正确、3 个组合全部生成、recommendation 含免责声明；
  - `/assessment/shenduo-scale` 说明页/答题页渲染正常、未答校验 toast 生效；
  - `/result/{id}` 结果页渲染完整（解读卡/比例卡/建议/附录）；
  - `/scales`、`/admin` 均 200。

---

## 验收对照（spec ↔ Task）

| AC | 验收点 | 覆盖 Task |
|---|---|---|
| AC-1 | 60 题入库（3×20）、幂等可重导 | Task 2 |
| AC-2 | 计分 100% 准确（得分×5%、0-5/6-10/11-15/16-20 分级） | Task 1（边界全覆盖）+ Task 3 |
| AC-3 | 答题完整、答案保存、结果跳转 | Task 3 + Task 4 |
| AC-4 | 结果报告按趣味配色与结构展示 | Task 5（human-judgment） |
| AC-5 | 组合解读与高分建议按得分动态展示 | Task 1（阈值逻辑）+ Task 5 |
| AC-6 | 后台只读 + 启停 | Task 6 |

## 风险与待确认

1. **题目文字转写**：PDF 部分页面为图片版式，60 题文字由人工逐题核对转写，可能与图片原始排版存在极细微差异（标点/引号）。如需 100% 校对，需提供文字版源文件。
2. **组合解读阈值**：采用"双方得分 ≥6（轻度及以上）"展示组合解读；如产品上想改为"≥11（较为突出及以上）"才展示，仅需调整 `calculateShenduo` 中 `COMBO_DEFS` 的过滤阈值与对应测试。
3. **参考量表版权口径**：题目为"参考 ASRS/AQ/RAADS-R/HSPS 核心维度简化改编"，非原表原文，结果页已注明改编来源；如需商用授权评估，需另行确认。
4. **新增依赖**：无（数据为 TS 常量，未引入解析库）。
