# 后台量表管理系统 - 验证清单

## API 功能验证
- [ ] 量表管理 API - GET /api/admin/scales 返回 200 状态码和量表列表
- [ ] 量表管理 API - POST /api/admin/scales 创建新量表并返回 201 状态码
- [ ] 量表管理 API - PUT /api/admin/scales 更新量表并返回 200 状态码
- [ ] 量表管理 API - PATCH /api/admin/scales 切换量表状态并返回 200 状态码
- [ ] 量表管理 API - DELETE /api/admin/scales 删除量表并返回 200 状态码
- [ ] 题目管理 API - GET /api/admin/scales/{id}/questions 返回 200 状态码和题目列表
- [ ] 题目管理 API - POST /api/admin/scales/{id}/questions 创建新题目并返回 201 状态码
- [ ] 题目管理 API - PUT /api/admin/scales/{id}/questions 更新题目并返回 200 状态码
- [ ] 题目管理 API - DELETE /api/admin/scales/{id}/questions 删除题目并返回 200 状态码
- [ ] 题目管理 API - PATCH /api/admin/scales/{id}/questions 调整题目顺序并返回 200 状态码
- [ ] 权限控制 - 非管理员访问 API 返回 401 状态码

## 界面功能验证
- [ ] 量表列表页面显示正确，包含所有必要信息
- [ ] 所有按钮功能正常显示
- [ ] 创建/编辑量表模态框显示正确，表单字段完整
- [ ] 表单提交成功后量表列表更新
- [ ] 题目管理模态框显示正确
- [ ] 题目添加、编辑、删除功能正常
- [ ] 题目顺序调整功能正常
- [ ] 量表预览模态框显示正确，模拟前台测评体验
- [ ] 答题和提交功能正常
- [ ] 删除确认对话框显示正确
- [ ] 确认删除后数据正确更新

## 非功能验证
- [ ] 页面加载时间不超过2秒
- [ ] API响应时间不超过500ms
- [ ] 加载状态显示正确
- [ ] 错误提示清晰明了
- [ ] 页面在不同屏幕尺寸下显示正常
- [ ] 代码结构清晰，易于维护
- [ ] 代码注释充分
- [ ] 遵循TypeScript最佳实践

## 安全验证
- [ ] 所有API端点需要JWT认证
- [ ] 防止SQL注入攻击
- [ ] 防止XSS攻击