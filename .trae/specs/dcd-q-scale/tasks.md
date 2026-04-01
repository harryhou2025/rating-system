# DCD-Q发育协调障碍筛查问卷 - 实现计划

## [ ] Task 1: 分析DCD-Q量表内容和定义数据结构
- **Priority**: P0
- **Depends On**: 获得DCD-Q量表的具体内容（题目、计分规则等）
- **Description**: 
  - 从docx文件中提取DCD-Q量表的所有信息
  - 定义量表基本信息：标题、描述、分类、目标人群、预计时间、说明、结果解释等
  - 定义所有题目：内容、类型、选项、顺序
  - 明确计分规则：每题分值、总分计算、分级标准、结果建议
- **Acceptance Criteria Addressed**: FR-1, FR-2, FR-5
- **Test Requirements**:
  - `programmatic` TR-1.1: 量表信息完整且符合标准
  - `programmatic` TR-1.2: 题目数据结构正确
  - `programmatic` TR-1.3: 计分规则文档化
- **Notes**: 这是后续所有工作的基础，必须先完成

## [ ] Task 2: 在数据库中添加DCD-Q量表和题目数据
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 创建数据库seed脚本，插入DCD-Q量表记录
  - 插入所有题目记录，确保顺序正确
  - 设置量表为启用状态
- **Acceptance Criteria Addressed**: FR-1, FR-4
- **Test Requirements**:
  - `programmatic` TR-2.1: 量表成功插入scales表
  - `programmatic` TR-2.2: 所有题目成功插入questions表
  - `programmatic` TR-2.3: 量表可以通过API正常获取
- **Notes**: 使用现有seed脚本的模式

## [ ] Task 3: 实现DCD-Q量表的计分规则函数
- **Priority**: P0（最高优先级）
- **Depends On**: Task 1
- **Description**: 
  - 在src/lib/scoring.ts中添加calculateDCDQ函数
  - 严格按照标准实现计分逻辑
  - 支持边界情况处理
  - 添加详细的注释说明计分规则
- **Acceptance Criteria Addressed**: FR-3, FR-5
- **Test Requirements**:
  - `programmatic` TR-3.1: 计分函数实现完整
  - `programmatic` TR-3.2: 边界情况测试通过
  - `programmatic` TR-3.3: 所有测试用例返回正确结果
  - `human-judgement` TR-3.4: 代码有清晰的注释说明计分规则
- **Notes**: 这是最重要的任务，必须100%准确

## [ ] Task 4: 集成DCD-Q计分规则到calculateScore函数
- **Priority**: P0
- **Depends On**: Task 3
- **Description**: 
  - 在calculateScore函数中添加DCD-Q量表的case分支
  - 确保能正确调用calculateDCDQ函数
- **Acceptance Criteria Addressed**: FR-3, FR-5
- **Test Requirements**:
  - `programmatic` TR-4.1: calculateScore能正确处理dcdq-scale
  - `programmatic` TR-4.2: 集成测试通过

## [ ] Task 5: 验证DCD-Q量表在用户端的展示
- **Priority**: P1
- **Depends On**: Task 2
- **Description**: 
  - 验证量表列表页面能正常显示DCD-Q量表
  - 验证量表详情页面能正确展示所有信息
  - 验证量表信息可以正常加载
- **Acceptance Criteria Addressed**: FR-1
- **Test Requirements**:
  - `human-judgement` TR-5.1: 量表在列表中正常显示
  - `human-judgement` TR-5.2: 量表详情信息完整
  - `programmatic` TR-5.3: API返回正确的量表数据

## [ ] Task 6: 验证DCD-Q量表的答题流程
- **Priority**: P1
- **Depends On**: Task 2
- **Description**: 
  - 验证用户可以开始DCD-Q量表测评
  - 验证题目按顺序展示
  - 验证用户可以选择答案
  - 验证上一题/下一题功能正常
  - 验证答题进度显示正确
  - 验证用户可以提交答案
- **Acceptance Criteria Addressed**: FR-2
- **Test Requirements**:
  - `human-judgement` TR-6.1: 答题流程完整流畅
  - `programmatic` TR-6.2: 答案可以正常提交和保存
  - `programmatic` TR-6.3: 测评记录正确创建

## [ ] Task 7: 验证DCD-Q量表的结果展示
- **Priority**: P1
- **Depends On**: Task 4, Task 6
- **Description**: 
  - 验证结果页面能正确显示DCD-Q测评结果
  - 验证总分计算正确
  - 验证严重程度/风险等级判断正确
  - 验证结果解释和建议显示正确
- **Acceptance Criteria Addressed**: FR-3, FR-5
- **Test Requirements**:
  - `human-judgement` TR-7.1: 结果展示清晰易懂
  - `programmatic` TR-7.2: 计分结果正确显示
  - `programmatic` TR-7.3: 严重程度判断正确

## [ ] Task 8: 验证DCD-Q量表的后台管理功能
- **Priority**: P1
- **Depends On**: Task 2
- **Description**: 
  - 验证管理员可以查看DCD-Q量表信息
  - 验证管理员可以编辑量表基本信息
  - 验证管理员可以管理题目（添加、编辑、删除、调整顺序）
  - 验证管理员可以启用/禁用量表
  - 验证变更立即生效
- **Acceptance Criteria Addressed**: FR-4, FR-6
- **Test Requirements**:
  - `human-judgement` TR-8.1: 后台管理界面完整可用
  - `programmatic` TR-8.2: 量表信息可以编辑和保存
  - `programmatic` TR-8.3: 题目可以正常管理
  - `programmatic` TR-8.4: 量表状态可以切换

## [ ] Task 9: 编写DCD-Q量表计分规则的测试用例
- **Priority**: P0（最高优先级）
- **Depends On**: Task 1, Task 3
- **Description**: 
  - 编写多个测试用例，覆盖不同得分范围
  - 包括边界情况测试（最低分、最高分、各分级临界点）
  - 确保所有测试用例都通过
- **Acceptance Criteria Addressed**: FR-5
- **Test Requirements**:
  - `programmatic` TR-9.1: 测试用例覆盖所有得分范围
  - `programmatic` TR-9.2: 边界情况测试通过
  - `programmatic` TR-9.3: 所有测试用例100%通过

## [ ] Task 10: 完整的端到端测试
- **Priority**: P2
- **Depends On**: Task 5-9
- **Description**: 
  - 从用户浏览量表到查看结果的完整流程测试
  - 验证后台管理到前台展示的完整流程
  - 验证数据持久化和跨会话一致性
- **Acceptance Criteria Addressed**: FR-1, FR-2, FR-3, FR-4, FR-5, FR-6
- **Test Requirements**:
  - `human-judgement` TR-10.1: 完整用户流程流畅
  - `programmatic` TR-10.2: 数据持久化正确
  - `programmatic` TR-10.3: 跨会话一致性验证
