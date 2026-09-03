# CRITICAL_BUSINESS_RULES.md — 业务不变量（绝对不能破坏的规则）

> 提取来源：当前代码、tests/、HANDOFF.md 踩坑记录、.trae/specs/ PRD、Git 历史。
> 每条规则标注了测试保护现状。**没有测试保护的规则，改动时必须先补测试。**

---

## 规则 1：计分正确性高于一切

- **规则**：每个量表的计分函数（`calculateGAD7` … 共 27 个 + `calculateCDMM` + `calculateShenduo`）必须与其量表学定义严格一致——总分、分级阈值、反向计分题、维度分。
- **为什么存在**：心理量表的分数解释依赖严格口径，错 1 分可能改变风险等级结论（如 PHQ-9 的 9/10 分界决定"中度/中重度"提示），直接影响用户决策。
- **影响模块**：`src/lib/scoring.ts`、`src/lib/cdmm.ts`、`src/lib/shenduo.ts`
- **违反后果**：所有后续测评报告结论错误；由于 result 是快照（规则 2），历史报告不受影响，但错误会持续产生新错误报告。
- **测试保护**：✅ `tests/scoring.test.ts`（28 量表边界值）、`tests/cdmm.test.ts`（22 例）、`tests/shenduo.test.ts`。改计分逻辑必须先补对应边界值测试。

## 规则 2：result 是提交时写定的快照，永不重算

- **规则**：`assessments.result` 在 POST 提交时由当时代码计算并写入；结果页（`/result/[id]`）只读取该 JSON，**任何路径都不根据 answers 重新计算结果**。
- **为什么存在**：用户拿到的报告必须可复现——半年后回看同一链接，结论不能变。这也是"改计分 bug 不影响历史报告"的保证。
- **影响模块**：`src/app/api/assessments/route.ts`（写入）、`src/app/api/assessments/[id]/route.ts`（读取）、`src/app/result/[id]/page.tsx`
- **违反后果**：历史报告随代码变动漂移，用户对系统的信任崩塌；且无法向机构解释"当时给出的结论"。
- **测试保护**：❌ 无（API 层零测试）。改动这两个 route 时必须手动验证：完成测评 → 改计分代码 → 旧结果页不变。

## 规则 3：匿名测评全流程必须始终可用

- **规则**：不注册、不登录即可 完成 选量表→答题→看结果→分享 全流程。`GET /api/assessments/[id]` 保持匿名可访问，凭 UUID（v4 随机、不可枚举）作为访问凭据。
- **为什么存在**：产品核心卖点（隐私敏感人群的心理筛查）。**这是有意设计，不是安全漏洞**——`src/app/api/assessments/[id]/route.ts` 内有注释说明，2026-09-04 安全审计时明确决定保留。
- **影响模块**：`POST/GET /api/assessments*`、答题页、结果页
- **违反后果**：好心加固（给结果接口加鉴权）会直接破坏匿名分享功能，且匿名测评记录将永远无法查看。
- **测试保护**：❌ 无。任何涉及 assessments 鉴权的改动，必须先确认不破坏匿名路径。

## 规则 4：量表/题目数据幂等入库

- **规则**：`npm run seed` 与 `npm run import:cdmm` / `import:shenduo` 可重复执行，不产生重复量表或题目。CDMM 导入 = 事务内 DELETE 该量表全部题目 + 重插。seed 仅在 scales 表为空时灌入。
- **为什么存在**：导入脚本会被反复运行（本地重建、生产补数据）；幂等性防数据翻倍。
- **影响模块**：`src/lib/db.ts`（种子逻辑）、`scripts/seed.ts`、`scripts/import-cdmm.ts`、`scripts/import-shenduo.ts`
- **违反后果**：题目翻倍 → 答题页出现重复题、计分错乱。
- **测试保护**：部分 ✅（`tests/cdmm-import.test.ts` 覆盖题目清洗；导入幂等性无测试，重跑脚本后需 `SELECT COUNT(*) FROM questions WHERE scale_id='xxx'` 验证）。

## 规则 5：CDMM 月龄计算统一走 cdmm.ts，日期解析防时区陷阱

- **规则**：
  1. 矫正月龄：早产儿按"今天 − 预产期"天数差；足月儿按"今天 − 出生日期"
  2. 日期字符串解析必须 `new Date(date + 'T00:00:00')`（本地午夜），**禁止** `new Date('YYYY-MM-DD')`（UTC 午夜解析，UTC+8 凌晨相减会少 1 天）
  3. 月龄组边界重叠日（90/150/210 天等同时是相邻组边界）：顺序匹配第一个命中 → 归属**低**月龄组
  4. 一切月龄计算复用 `src/lib/cdmm.ts` 的 `calculateCorrectedAgeDays`，前后端都不许手写
- **为什么存在**：CDMM 报告的正确性完全依赖月龄组匹配；差一天可能落入不同月龄组、答不同题目、出不同报告。时区陷阱是踩过并修复的真实 bug（见 HANDOFF.md 第二节）。
- **影响模块**：`src/lib/cdmm.ts`（前后端共用！）、`src/app/api/assessments/route.ts`、`src/components/cdmm/CDMMAssessment.tsx`
- **违反后果**：凌晨测评的儿童被分错月龄组 → 答错题目组 → 报告结论错误。
- **测试保护**：✅ `tests/cdmm.test.ts`（月龄组边界、矫正月龄、计分规则共 22 例，边界日归属被测试锁定）。业务口径变更必须同步改 `AGE_GROUPS` 与测试。

## 规则 6：特殊量表 4 处分支必须同步

- **规则**：cdmm-scale / shenduo-scale 是"特殊量表"，逻辑分散在 4 处，新增或修改特殊量表时必须同步：
  1. `src/app/api/assessments/route.ts`（POST 提交分支：专用计分 + 入库）
  2. `src/app/assessment/[id]/page.tsx`（答题页分支：渲染专用答题组件）
  3. `src/app/result/[id]/page.tsx`（结果页分支：渲染专用结果组件）
  4. `src/app/admin/page.tsx`（后台只读/启停处理，普通量表的编辑删除按钮要屏蔽）
- **为什么存在**：无注册机制/插件系统的历史设计；漏改任何一处不会报错，只会静默劣化（如新量表走了通用计分返回错误结果）。
- **违反后果**：新量表提交后报错或结果错乱；或后台误允许编辑导入型量表导致与导入脚本冲突。
- **测试保护**：❌ 无（正是审计中"分支蔓延"风险的来源）。开发时对照 CDMM 模式（HANDOFF.md 第二节有完整改动清单）逐处核对。

## 规则 7：CDMM 结果渲染的语义色规则

- **规则**：结果页中**未评估的能区必须渲染灰色"未评估"**，不能渲染成蓝色（蓝色=全部很熟练，会误导家长）；空答案 → severity='未完成评估'；非法选项值经白名单校验后跳过，**不能静默判为达标**。
- **为什么存在**：儿童发育报告直接被家长用来决策，视觉语义错误 = 实质误导。
- **影响模块**：`src/components/cdmm/CDMMResult.tsx`、`src/lib/cdmm.ts`
- **违反后果**：家长误以为孩子某能区发育正常/异常，引发不必要的焦虑或延误。
- **测试保护**：✅ 计分层有（空答案/非法值）；❌ 渲染层无（组件零测试）。

## 规则 8：结果仅供参考的免责边界

- **规则**：结果页与对外文案必须保留"仅供参考，不构成医学诊断"类免责声明；不得输出诊断性结论（如"您的孩子患有自闭症"）。
- **为什么存在**：产品与合规红线（README 注意事项、量表 result_interpretation 的措辞均遵循此口径）。
- **影响模块**：`src/data/real-scales.ts`（result_interpretation 文案）、`src/lib/scoring.ts`（建议文案）、结果组件
- **违反后果**：自评工具越界成为诊断行为，法律与伦理风险。
- **测试保护**：❌ 无（文案层）。新增量表的解读文案需人工审查口径。

## 规则 9：生产数据库与部署硬约束

- **规则**：
  1. **绝不能覆盖服务器 `/var/www/rating-sys/rating_sys.db`**（真实用户数据）
  2. 服务器 1.6GB 内存，不能在服务器 build；npm 一律 `--registry=https://registry.npmmirror.com`
  3. 部署只走 `./scripts/deploy.sh`（内含自动备份 db + git pull + pm2 重启 + 健康检查）
  4. 服务器侧 git 外资产（`.env`、db、CDMM 源 xlsx）不属于代码仓库，不可删除
- **为什么存在**：服务器是唯一生产环境，db 是唯一真实数据；deploy.sh 的流程固化了 2026-08-08 手工部署踩坑的全部教训。
- **影响模块**：`scripts/deploy.sh`
- **违反后果**：用户数据永久丢失（db 覆盖无回滚）；或部署失败导致停机。
- **测试保护**：N/A（运维流程）。部署后按 deploy.sh 的健康检查输出确认。

## 规则 10：鉴权边界（2026-09-04 加固后的现状，不可回退）

- **规则**：
  - `/api/admin/**` 全部路由必须包 `withAdminAuth`
  - `GET /api/assessments`（列表，含用户姓名）必须 `withAdminAuth`
  - `DELETE /api/assessments/[id]` 必须本人或 admin
  - `GET /api/user/assessments` 必须 `withAuth`
  - 唯一例外：规则 3 的 `GET /api/assessments/[id]` 匿名可访问
  - 新增 admin 类路由时**默认包 withAdminAuth**，除非有明确产品理由并记录
- **为什么存在**：2026-09-04 审计发现 3 个无鉴权接口（assessments 列表、DELETE、admin/statistics）已修复上线；此规则防止回归。
- **影响模块**：`src/lib/middleware.ts`、所有 API route
- **违反后果**：用户姓名/测评数据泄漏给任意匿名访问者。
- **测试保护**：❌ 无（16 个 API 路由零测试，这是最高优先的测试补课方向）。

## 规则 11：量表数据双源的真实性

- **规则**：27 个标准量表的**唯一权威源**是 `src/data/real-scales.ts`（改后需 `npm run seed` 才生效）；cdmm/shenduo 的权威源是导入脚本 + xlsx/PDF 源材料（`scripts/import-*.ts`，题库在 DB 中由脚本维护）。**后台 UI 对 cdmm/shenduo 只读**（UI 层实现；API 层守卫是已知缺口，见 CURRENT_STATE.md 风险 #8）。
- **为什么存在**：CDMM 798 题来自 xlsx 清洗（含 ◆ 标记处理、纯括号注释过滤），手工在后台改题会与下次导入冲突，改动会被 DELETE+重插覆盖。
- **影响模块**：`src/data/real-scales.ts`、`scripts/import-*.ts`、`src/app/admin/page.tsx`
- **违反后果**：在后台手改 CDMM 题目 → 下次导入静默还原；或改 real-scales.ts 不跑 seed → 改动"看起来没生效"。
- **测试保护**：❌ 无。改量表数据的验证方式：`SELECT COUNT(*) FROM questions WHERE scale_id='xxx'` + 前台/后台双端目测。

## 规则 12：构建期行为约束

- **规则**：
  1. `JWT_SECRET` 在模块加载期被校验（缺失即 throw），因此 **build 也必须提供**（CI 用 dummy 值）
  2. `GET /api/scales` 与 `GET /api/admin/statistics` 的 `export const dynamic = 'force-dynamic'` **不可删除**——删掉会恢复"构建期静态预渲染"bug：生产环境量表启停和统计数据不更新
- **为什么存在**：2026-09-04 修复的真实生产 bug（statistics 曾返回 build 时的旧数据）。
- **影响模块**：`src/lib/auth.ts`、两个 route 文件
- **违反后果**：build 失败（无 JWT_SECRET）或生产数据不更新（删 force-dynamic）。
- **测试保护**：❌ 无（需要生产验证：启停量表后列表即时变化）。
