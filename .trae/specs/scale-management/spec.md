# 后台量表管理系统 - 产品需求文档

## Overview
- **Summary**: 为后台管理系统开发完整的量表管理功能，包括量表的创建、编辑、删除、启用/禁用，以及题目的管理和量表预览功能。
- **Purpose**: 提供一个直观、高效的量表管理界面，使管理员能够轻松管理测评量表，确保测评系统的正常运行。
- **Target Users**: 系统管理员、测评系统运营人员。

## Goals
- 实现完整的量表管理功能，包括CRUD操作
- 提供题目管理功能，支持题目添加、编辑、删除和顺序调整
- 实现量表预览功能，模拟前台用户测评体验
- 确保系统的安全性和可靠性
- 提供友好的用户界面和操作体验

## Non-Goals (Out of Scope)
- 不包括前台用户测评功能
- 不包括数据分析和报告生成功能
- 不包括用户权限管理的详细配置
- 不包括第三方集成功能

## Background & Context
- 系统基于 Next.js 15、React 19、TypeScript 开发
- 使用 SQLite 作为数据库
- 采用 RESTful API 设计
- 已实现 JWT 认证机制
- 现有后台管理界面已基本搭建完成

## Functional Requirements
- **FR-1**: 量表管理
  - 查看量表列表
  - 创建新量表
  - 编辑现有量表
  - 删除量表
  - 启用/禁用量表

- **FR-2**: 题目管理
  - 查看题目列表
  - 添加新题目
  - 编辑现有题目
  - 删除题目
  - 调整题目顺序

- **FR-3**: 量表预览
  - 预览量表的完整测评流程
  - 模拟答题和提交过程
  - 查看量表的实际显示效果

- **FR-4**: 权限控制
  - 只有管理员可以访问量表管理功能
  - 所有操作需要JWT认证

## Non-Functional Requirements
- **NFR-1**: 性能
  - 页面加载时间不超过2秒
  - API响应时间不超过500ms

- **NFR-2**: 安全性
  - 所有API端点需要JWT认证
  - 防止SQL注入攻击
  - 防止XSS攻击

- **NFR-3**: 可用性
  - 界面友好，操作直观
  - 提供清晰的错误提示
  - 支持响应式设计，适配不同屏幕尺寸

- **NFR-4**: 可维护性
  - 代码结构清晰，易于维护
  - 提供详细的代码注释
  - 遵循TypeScript最佳实践

## Constraints
- **Technical**: Next.js 15、React 19、TypeScript、SQLite
- **Business**: 开发周期短，功能需要快速实现
- **Dependencies**: 依赖现有的JWT认证系统

## Assumptions
- 系统已经具备基本的后台管理框架
- 数据库结构已经设计完成
- JWT认证机制已经实现
- 管理员用户已经存在

## Acceptance Criteria

### AC-1: 量表管理功能
- **Given**: 管理员登录系统
- **When**: 访问量表管理页面
- **Then**: 能够看到量表列表，包括名称、描述、状态等信息
- **Verification**: `human-judgment`

### AC-2: 创建量表
- **Given**: 管理员在量表管理页面
- **When**: 点击"创建量表"按钮并填写表单
- **Then**: 新量表成功创建并显示在列表中
- **Verification**: `programmatic`

### AC-3: 编辑量表
- **Given**: 管理员在量表管理页面
- **When**: 点击量表的"编辑"按钮并修改信息
- **Then**: 量表信息成功更新
- **Verification**: `programmatic`

### AC-4: 删除量表
- **Given**: 管理员在量表管理页面
- **When**: 点击量表的"删除"按钮并确认
- **Then**: 量表从列表中移除
- **Verification**: `programmatic`

### AC-5: 启用/禁用量表
- **Given**: 管理员在量表管理页面
- **When**: 点击量表的"启用"或"禁用"按钮
- **Then**: 量表状态成功切换
- **Verification**: `programmatic`

### AC-6: 题目管理
- **Given**: 管理员在量表管理页面
- **When**: 点击量表的"题目管理"按钮
- **Then**: 弹出题目管理模态框，显示该量表的所有题目
- **Verification**: `human-judgment`

### AC-7: 添加题目
- **Given**: 管理员在题目管理模态框
- **When**: 点击"添加题目"按钮并填写表单
- **Then**: 新题目成功添加到列表中
- **Verification**: `programmatic`

### AC-8: 编辑题目
- **Given**: 管理员在题目管理模态框
- **When**: 点击题目的"编辑"按钮并修改信息
- **Then**: 题目信息成功更新
- **Verification**: `programmatic`

### AC-9: 删除题目
- **Given**: 管理员在题目管理模态框
- **When**: 点击题目的"删除"按钮并确认
- **Then**: 题目从列表中移除
- **Verification**: `programmatic`

### AC-10: 调整题目顺序
- **Given**: 管理员在题目管理模态框
- **When**: 使用拖拽功能调整题目顺序
- **Then**: 题目顺序成功更新
- **Verification**: `programmatic`

### AC-11: 量表预览
- **Given**: 管理员在量表管理页面
- **When**: 点击量表的"预览"按钮
- **Then**: 弹出预览模态框，模拟前台用户的测评体验
- **Verification**: `human-judgment`

### AC-12: 权限控制
- **Given**: 非管理员用户尝试访问量表管理功能
- **When**: 访问量表管理页面或API
- **Then**: 系统拒绝访问并返回401错误
- **Verification**: `programmatic`

## Open Questions
- [ ] 是否需要支持量表的分类管理？
- [ ] 是否需要支持题目类型的多样化（如多选题、填空题等）？
- [ ] 是否需要支持量表的导入/导出功能？
- [ ] 是否需要添加量表的使用统计功能？