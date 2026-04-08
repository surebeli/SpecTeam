# PhoenixTeam 增强产品需求规格 (Enhanced PRD)

## 产品定位

PhoenixTeam 是一款分布式 AI 团队上下文一致性基础设施，解决当前多 AI 工具（Claude、Cursor、Copilot 等）碎片化、设计发散、进度黑盒的问题。

## 核心价值

- **设计阶段**：多 Agent 并行脑暴 → 自动仲裁收敛 → 决策冻结并广播（≤5 分钟全工具生效）
- **开发阶段**：实时进度透视、技术路线同步、阻塞项广播（分钟级）
- **跨工具/自带 Agent**：以 MCP 为单一事实来源，强制所有工具（Claude 优先级最高）继承 THESIS.md / RULES.md / SIGNALS.md

## 功能模块

### 1. 人类仲裁中心 UI (Web Dashboard)

- 提案可视化对比
- AI 建议合并 + 一键批准
- 时间旅行查询
- 审计日志

### 2. Agent SDK

- 自带 Agent 接入标准（MCP + Yunxin 信令）
- 个人偏好隔离
- Agent 状态管理

### 3. 一致性评分

- 实时计算团队上下文一致度（0-100 分）
- 基于 THESIS.md 对比各 Agent 输出
- 偏差告警

### 4. 上下文分级

- none / summary / recent / full（Token 优化）
- 按角色、按场景自动切换

### 5. 扩展接口

- Remote Control HTTP 接口（移动端查询）
- Webhook 通知
- 自定义仲裁规则

## 单一事实来源

Phoenix MCP Server + Yunxin 信令 + Git 仓库

## 性能指标

| 指标 | 目标 |
|------|------|
| 同步延迟 | ≤5min（Yunxin 保证） |
| 新成员接入 | ≤2min（MCP + Git clone） |
| 一致性差异 | <5% |
| 收敛速度 | ≤20 分钟 |
| 离线恢复 | ≤3 分钟 |
| 团队采用后冲突减少 | ≥70% |
