# PROJECT_CONTEXT.md — 业务背景（写给完全不了解本项目的人）

> 本文讲"这个系统在解决什么业务问题"。技术实现见 `docs/architecture/ARCHITECTURE.md`，当前状态见 `CURRENT_STATE.md`。
> 本项目**没有**多机构/多租户概念（无 Organization/Consultation/Quota 等对象），实际业务对象以下方第 3 节为准。

## 1. 业务背景

这是"靛蓝之家"在线心理测评系统（项目代号 rating-sys）：一个面向儿童神经多样性（自闭症 ASD、多动症 ADHD、发育协调障碍等）与情绪健康（焦虑、抑郁）筛查的**自评式测评网站**。

要解决的问题：

- 家长/成人/教师需要便捷地完成**国际标准化心理量表**（GAD-7、PHQ-9、M-CHAT、CARS、SNAP-IV、CAARS、CDMM 等 29 个），并立即得到**专业口径的计分与解读**
- 心理筛查机构需要一个轻量工具收集测评数据、管理量表，而不必采购重型评估平台
- 测评者往往对隐私敏感，系统支持**完全匿名**测评（不注册、不留个人信息也能完成全流程并拿到报告）

定位边界：**结果仅供参考，不构成医学诊断**——所有结果页和文档都强调这一点，这是产品而非技术的红线。

## 2. 核心用户角色

| 角色 | 入口 | 能做什么 |
|---|---|---|
| **匿名测评者** | 无需登录 | 选量表 → 答题 → 看/分享结果报告（凭测评 UUID 访问） |
| **注册用户** | `/login`、`/register` | 同上，额外可查看自己的历史测评记录 |
| **管理员（admin）** | `/admin`（admin@example.com，本地默认密码 admin123） | 统计仪表盘、量表 CRUD 与启停、题目管理、查看全部测评记录、用户管理 |

角色存储：`users.role` 字段，仅 `user` / `admin` 两级，无更细粒度权限。

## 3. 核心业务对象

以数据库表和代码类型为准（`src/types/index.ts`、`src/lib/db.ts`）：

| 对象 | 存储 | 说明 |
|---|---|---|
| **User** | `users` 表 | 注册用户。email 唯一、bcrypt 密码哈希、role（user/admin） |
| **Scale（量表）** | `scales` 表 | 一个测评量表（如 GAD-7）。含标题/描述/分类/适用人群/指导语/结果解释/is_active 启停 |
| **Question（题目）** | `questions` 表 | 属于某个量表。含选项 JSON、排序、计分类型、dimension 维度、meta 附加元数据（CDMM 的月龄组/题型） |
| **Assessment（测评记录）** | `assessments` 表 | 一次答题的完整记录：user_id（可空=匿名）、scale_id、status、**answers（原始答案 JSON）**、**result（计分结果快照 JSON）**、时间、IP |
| **childInfo（儿童信息）** | 无独立表，嵌在 CDMM 测评的 answers/result 中 | CDMM 专用：姓名/性别/出生日期/是否早产/预产期，用于矫正月龄计算 |

## 4. 核心业务流程

### 标准量表流程（27 个量表）

```text
用户（匿名或登录）
↓
浏览量表列表 /scales（分类、搜索、详情）
↓
开始测评 /assessment/[scaleId]（逐题作答、进度条、前后导航）
↓
POST /api/assessments（提交全部答案）
↓
calculateScore(scaleId, answers) 即时计分（scoring.ts 按 scaleId 分发）
↓
写入 assessments 表：answers + result（结果快照，一次写定）
↓
结果页 /result/[assessmentId]（得分、风险等级、解读、建议）
↓
匿名用户凭 assessmentId（UUID v4，随机不可枚举）随时回看/分享
```

### 特殊量表流程（CDMM 儿童发育里程碑，shenduo 神经多样性特质）

与标准流程的差别在"提交"和"渲染"两步：

```text
答题页先收集儿童信息（出生日期、是否早产、预产期）
↓
按矫正月龄匹配月龄组（如 6 月龄组、2 岁组……共 17 组）
↓
只作答该月龄组的题目（CDMM 全库 798 题，单次只答对应组）
↓
提交时用儿童信息 + 题目上下文计分（cdmm.ts / shenduo.ts 独立模块，不走 calculateScore）
↓
结果页为专用组件（彩虹脚丫图、目标里程碑、红灯警示；shenduo 为三颗星人比例卡）
```

### 管理后台流程

```text
admin 登录 → /admin
├── 统计仪表盘（用户数/测评数/每日趋势/量表参与度，实时数据）
├── 量表管理（CRUD、启停；cdmm/shenduo 在 UI 层只读，仅可启停）
├── 题目管理（普通量表可增删改排序）
└── 测评记录 / 用户管理
```

## 5. 数据可见性边界

本项目是**单机构系统**（无多租户），隔离规则如下：

| 数据 | 谁能看 | 实现方式 |
|---|---|---|
| 量表列表/详情/题目 | 所有人（含匿名） | `GET /api/scales*` 无鉴权（启用中的量表） |
| 单条测评结果 | **任何持有 assessmentId 的人**（有意设计：匿名测评依赖 UUID 作访问凭据） | `GET /api/assessments/[id]` 无鉴权，代码内有注释说明 |
| 测评列表（含用户姓名） | 仅 admin | `GET /api/assessments` 包 `withAdminAuth` |
| 自己的历史测评 | 本人（登录态） | `GET /api/user/assessments` 包 `withAuth` |
| 全部测评记录/统计/用户管理 | 仅 admin | `/api/admin/*` 全部包 `withAdminAuth` |
| 删除测评 | 本人或 admin（匿名测评仅 admin） | `DELETE /api/assessments/[id]` 鉴权判断 |

密码哈希、JWT token 任何时候不出现在 API 响应中。

## 6. 业务中最重要的"不变量"

无论以后开发什么功能，都不能破坏以下规则（完整版含违反后果与测试保护方式见 `docs/engineering/CRITICAL_BUSINESS_RULES.md`）：

1. **计分正确性高于一切**——每个量表的计分函数必须与其量表学定义严格一致，234 个单测是保护网，改计分必须先补测试
2. **result 是提交时写定的快照**——结果页读取 `assessments.result`，永不重算；改计分逻辑不能追溯影响历史报告
3. **匿名测评必须始终可用**——不注册即可完成全流程；`GET /api/assessments/[id]` 保持匿名可访问（UUID 即凭据）是有意的产品设计，不是安全漏洞
4. **量表题目幂等入库**——seed 与 import 脚本重复执行不能产生重复数据；CDMM 导入是事务内 DELETE+重插
5. **CDMM 矫正月龄算法统一**——早产儿按"今天−预产期"计算；日期解析必须用 `new Date(date+'T00:00:00')` 本地午夜；一切月龄计算必须复用 `src/lib/cdmm.ts` 的 `calculateCorrectedAgeDays`，禁止手写日期减法
6. **特殊量表 4 处同步**——cdmm/shenduo 的提交分支、答题页、结果页、后台只读逻辑分散在 4 个文件，新增/修改特殊量表必须 4 处同步
7. **结果仅供参考，不构成诊断**——免责声明文案不能从结果页移除
8. **生产数据库不可覆盖**——部署流程中服务器上的 `rating_sys.db` 是真实用户数据，任何操作前先备份
