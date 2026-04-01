# 后台量表管理系统 - 实现计划

## [ ] Task 1: 实现量表管理API端点
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 实现 `/api/admin/scales/route.ts` 文件
  - 实现 GET、POST、PUT、PATCH、DELETE 方法
  - 实现量表的获取、创建、更新、启用/禁用、删除功能
- **Acceptance Criteria Addressed**: AC-2, AC-3, AC-4, AC-5, AC-12
- **Test Requirements**:
  - `programmatic` TR-1.1: GET /api/admin/scales 返回 200 状态码和量表列表
  - `programmatic` TR-1.2: POST /api/admin/scales 创建新量表并返回 201 状态码
  - `programmatic` TR-1.3: PUT /api/admin/scales 更新量表并返回 200 状态码
  - `programmatic` TR-1.4: PATCH /api/admin/scales 切换量表状态并返回 200 状态码
  - `programmatic` TR-1.5: DELETE /api/admin/scales 删除量表并返回 200 状态码
  - `programmatic` TR-1.6: 非管理员访问 API 返回 401 状态码
- **Notes**: 使用现有的 withAdminAuth 中间件进行权限控制

## [ ] Task 2: 实现题目管理API端点
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 实现 `/api/admin/scales/[id]/questions/route.ts` 文件
  - 实现 GET、POST、PUT、DELETE、PATCH 方法
  - 实现题目的获取、创建、更新、删除、顺序调整功能
- **Acceptance Criteria Addressed**: AC-7, AC-8, AC-9, AC-10, AC-12
- **Test Requirements**:
  - `programmatic` TR-2.1: GET /api/admin/scales/{id}/questions 返回 200 状态码和题目列表
  - `programmatic` TR-2.2: POST /api/admin/scales/{id}/questions 创建新题目并返回 201 状态码
  - `programmatic` TR-2.3: PUT /api/admin/scales/{id}/questions 更新题目并返回 200 状态码
  - `programmatic` TR-2.4: DELETE /api/admin/scales/{id}/questions 删除题目并返回 200 状态码
  - `programmatic` TR-2.5: PATCH /api/admin/scales/{id}/questions 调整题目顺序并返回 200 状态码
  - `programmatic` TR-2.6: 非管理员访问 API 返回 401 状态码
- **Notes**: 确保题目顺序调整功能正确实现

## [ ] Task 3: 更新后台管理页面 - 量表列表
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 修改 `src/app/admin/page.tsx` 文件
  - 添加量表列表展示
  - 添加创建量表按钮
  - 为每个量表添加编辑、删除、启用/禁用、题目管理、预览按钮
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgment` TR-3.1: 量表列表页面显示正确，包含所有必要信息
  - `human-judgment` TR-3.2: 所有按钮功能正常显示
- **Notes**: 确保页面布局美观，操作直观

## [ ] Task 4: 实现创建/编辑量表模态框
- **Priority**: P1
- **Depends On**: Task 3
- **Description**:
  - 在 `src/app/admin/page.tsx` 中添加创建/编辑量表的模态框
  - 实现表单验证
  - 实现提交功能，调用相应的 API
- **Acceptance Criteria Addressed**: AC-2, AC-3
- **Test Requirements**:
  - `human-judgment` TR-4.1: 模态框显示正确，表单字段完整
  - `programmatic` TR-4.2: 表单提交成功后量表列表更新
- **Notes**: 确保表单验证逻辑正确，错误提示清晰

## [ ] Task 5: 实现题目管理模态框
- **Priority**: P1
- **Depends On**: Task 2, Task 3
- **Description**:
  - 在 `src/app/admin/page.tsx` 中添加题目管理模态框
  - 实现题目列表展示
  - 添加添加题目按钮
  - 为每个题目添加编辑、删除按钮
  - 实现题目顺序调整功能
- **Acceptance Criteria Addressed**: AC-6, AC-7, AC-8, AC-9, AC-10
- **Test Requirements**:
  - `human-judgment` TR-5.1: 题目管理模态框显示正确
  - `programmatic` TR-5.2: 题目添加、编辑、删除功能正常
  - `programmatic` TR-5.3: 题目顺序调整功能正常
- **Notes**: 考虑使用拖拽库实现题目顺序调整

## [ ] Task 6: 实现量表预览功能
- **Priority**: P1
- **Depends On**: Task 2, Task 3
- **Description**:
  - 在 `src/app/admin/page.tsx` 中添加量表预览模态框
  - 实现模拟答题功能
  - 实现预览提交功能（模拟）
  - 显示量表的实际显示效果
- **Acceptance Criteria Addressed**: AC-11
- **Test Requirements**:
  - `human-judgment` TR-6.1: 预览模态框显示正确，模拟前台测评体验
  - `human-judgment` TR-6.2: 答题和提交功能正常
- **Notes**: 预览提交只是模拟操作，不会保存实际数据

## [ ] Task 7: 实现删除确认对话框
- **Priority**: P2
- **Depends On**: Task 3
- **Description**:
  - 在 `src/app/admin/page.tsx` 中添加删除确认对话框
  - 实现量表删除和题目删除的确认功能
- **Acceptance Criteria Addressed**: AC-4, AC-9
- **Test Requirements**:
  - `human-judgment` TR-7.1: 删除确认对话框显示正确
  - `programmatic` TR-7.2: 确认删除后数据正确更新
- **Notes**: 确保删除操作有明确的确认步骤，防止误操作

## [ ] Task 8: 添加加载状态和错误处理
- **Priority**: P2
- **Depends On**: Task 3, Task 4, Task 5, Task 6
- **Description**:
  - 在所有API调用中添加加载状态
  - 添加错误处理和错误提示
  - 确保页面在各种状态下的用户体验
- **Acceptance Criteria Addressed**: NFR-3
- **Test Requirements**:
  - `human-judgment` TR-8.1: 加载状态显示正确
  - `human-judgment` TR-8.2: 错误提示清晰明了
- **Notes**: 确保在网络请求过程中提供良好的用户反馈

## [ ] Task 9: 测试和优化
- **Priority**: P2
- **Depends On**: All previous tasks
- **Description**:
  - 测试所有功能的正常运行
  - 优化页面性能
  - 确保响应式设计适配不同屏幕尺寸
- **Acceptance Criteria Addressed**: NFR-1, NFR-3
- **Test Requirements**:
  - `programmatic` TR-9.1: 页面加载时间不超过2秒
  - `programmatic` TR-9.2: API响应时间不超过500ms
  - `human-judgment` TR-9.3: 页面在不同屏幕尺寸下显示正常
- **Notes**: 使用浏览器开发者工具进行性能测试

## [ ] Task 10: 代码审查和文档
- **Priority**: P2
- **Depends On**: All previous tasks
- **Description**:
  - 审查代码质量
  - 添加必要的代码注释
  - 确保代码符合TypeScript最佳实践
- **Acceptance Criteria Addressed**: NFR-4
- **Test Requirements**:
  - `human-judgment` TR-10.1: 代码结构清晰，易于维护
  - `human-judgment` TR-10.2: 代码注释充分
  - `human-judgment` TR-10.3: 遵循TypeScript最佳实践
- **Notes**: 确保代码质量，便于后续维护