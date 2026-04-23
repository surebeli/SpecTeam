# SpecTeam 技术架构设计

## North Star

让每一个 Agent，都在同一页上。SpecTeam 是分布式 AI 团队的上下文一致性基础设施。

## 三层架构

### L1 - 工程规范层 (Git + MCP Resource)

- 存储 THESIS / RULES / SECURITY 等核心文档
- 自动转换脚本生成 `.cursorrules` / `copilot-instructions` 等工具格式
- Git 作为强一致版本控制

### L2 - 运行时状态层 (Yjs CRDT + Yunxin 信令)

- Yjs CRDT 实现实时编辑、无冲突合并
- 网易云信 Yunxin 提供信令广播、在线状态、自定义消息队列
- 实现 SIGNALS.md 的实时同步

### L3 - 追溯层 (PostgreSQL + Git History + RAG)

- PostgreSQL / Chroma 存储审计日志
- Git history 提供完整变更追溯
- 向量检索支持 RAG 查询

## 核心流程

```
多 Agent 并行提案 → 写入 design/ 目录
    ↓
检测冲突 → LangGraph 仲裁 Agent（基于 THESIS RAG）生成合并决策
    ↓
决策写入 THESIS → MCP 推送 + Yunxin 广播 → 所有工具 ≤5min 冻结旧方案
    ↓
开发中 → Yunxin 实时更新 SIGNALS + Yjs 同步
```

## 集成方式

| 优先级 | 方式 | 说明 |
|--------|------|------|
| P0 | MCP 客户端 | 直接 MCP 支持 |
| P1 | Bot-to-Bot | 自带 Agent + Yunxin 信令继承 |
| P2 | Git hook | Python 自动生成各工具格式 |

## 部署

- Docker Compose（MCP Server + Yunxin SDK + Yjs Provider）
- 可选 K8s 水平扩展
- 全 Docker/K8s 自托管，不依赖公网

## 安全

- RBAC 权限控制
- Agent 沙箱隔离
- 敏感内容标记 + 加密
- 审计日志符合中国数据安全法
