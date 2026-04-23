# SpecTeam 基础执行计划

这份文档把 roadmap 前四个工作包下钻为执行级计划。

它当前只覆盖平台基础层：

- 协议规格化
- 本地状态引擎
- 决策与审批状态机
- Spec Server

它暂时不展开人类仲裁 UI、实时同步和企业化运维能力。

## 范围

这份计划的目标，是让 SpecTeam 从 prompt 驱动的工作流原型，转向可复用的产品核心。

核心约束只有一句话：凡是确定性规则，都应先下沉到共享代码或 schema，再让其他产品界面建立在上面。

## 工作假设

1. 在这一阶段，`.spec/` 仍然是仓库内的事实来源。
2. prompt skills 在迁移期仍然存在，但它们应消费共享状态，而不是各自重新发明状态。
3. CLI 和 VS Code 扩展应成为同一派生状态的消费者，而不是各自持有业务规则。
4. MCP connectors 导入的外部内容，最终都应归一化到同一份文档契约里。

## 建议模块边界

这些名字代表逻辑模块，未来可以落成 package、目录或内部库。

| 模块 | 职责 | 依赖 | 主要消费者 |
|------|------|------|------------|
| `spec-schema` | 文档 schema、解析规则、迁移辅助、校验错误模型 | 无 | 状态引擎、工作流引擎、测试、Server |
| `spec-state` | 仓库扫描、workspace snapshot、派生状态与一致性评分 | `spec-schema` | CLI、扩展、Server、测试 |
| `spec-workflow` | divergence 状态流转、投票处理、action item 生命周期、决策生成契约 | `spec-schema`、`spec-state` | Server、prompts、测试 |
| `spec-server` | MCP resources、查询接口、动作接口，后续再扩订阅能力 | `spec-state`、`spec-workflow` | 工具、Agent、UI |
| `spec-fixtures` | 示例 `.spec/` 状态、回归场景、迁移 fixtures | `spec-schema` | 所有模块测试 |

## 工作包 1 - 协议规格化

### 目标

为核心 `.spec/` 文档定义一套可被机器稳定读取的契约，让所有运行时入口都读取同一结构。

### 主要产出

- `COLLABORATORS`、`THESIS`、`SIGNALS`、`DIVERGENCES`、`decisions/D-*.md` 的标准字段定义
- schema 演进策略
- 历史仓库迁移策略
- 解析与校验错误模型
- 覆盖有效、无效和迁移状态的 fixtures

### 任务拆解

| 任务 | 描述 | 输出 |
|------|------|------|
| 1.1 现状格式审计 | 盘点各核心 `.spec/` 文档目前在 prompt skill、README 示例和测试里的描述方式 | 格式清单与歧义列表 |
| 1.2 规范数据模型 | 为每类核心文档定义必填字段、可选字段和派生字段 | 各文档的 schema 草案 |
| 1.3 元数据策略 | 定义 schema 版本、生成者标识、时间戳等元数据如何被机器读取 | 元数据封装规则 |
| 1.4 校验规则 | 定义必填校验、引用完整性以及不支持状态的处理方式 | 校验规则集与错误分类 |
| 1.5 迁移规则 | 定义旧仓库如何向前升级，且不破坏现有 prompt 流程 | 迁移规范与 fixture 覆盖 |
| 1.6 Fixture 包 | 构建 clean、conflicted、proposed、resolved、partially migrated 等代表性状态 | 共享测试 fixture 库 |

### 必须锁定的核心实体

| 实体 | 需要被显式定义的内容 |
|------|------------------------|
| Collaborator | `code`、`role`、`sourceDirectories`、`phoenixPath`、`joinedAt` 以及可选归属元数据 |
| Divergence | `id`、`status`、`parties`、`priority`、`nature`、`foundAt`、`proposal`、`votes`、`history`、`changeInstructionsRef` |
| Decision | `decisionId`、`resolutionSummary`、`rationale`、`finalizedBy`、`resolvedAt`、`actionItems` |
| Action Item | `owner`、`targetFile`、`requiredChanges`、`acceptanceCriterion`、`completionState` |
| Signal | blocker、status、source、updatedAt 以及可选 scope |

### 完成判定

- 解析器可以把所有支持的 `.spec/` 文档加载成稳定的内存模型。
- fixtures 同时覆盖当前格式和历史格式。
- 核心实体不再依赖非正式 markdown 解读。

## 工作包 2 - 本地状态引擎

### 目标

构建一个确定性的本地引擎，从仓库内容中推导 Spec workspace 状态。

### 职责

- 读取 `.spec/` 文档并归一化为统一 snapshot
- 派生当前用户和全体协作者的待处理项
- 计算 divergence 摘要和一致性评分
- 为 CLI、扩展、测试和 Server 提供稳定查询面

### 核心领域模型

| 模型 | 用途 |
|------|------|
| `WorkspaceSnapshot` | 仓库 Spec 状态的原始与归一化视图 |
| `CollaboratorView` | 单个协作者的角色、目录映射和待办状态 |
| `DivergenceView` | 包含 proposal、votes 和 actionability 的完整 divergence 视图 |
| `DecisionView` | 已解决决策及其 action item 进度 |
| `ConsistencyScore` | 数值分数以及对应的解释因子 |
| `WorkspaceHealth` | 缺失文件、非法字段、过期同步标记、未解决 blocker |

### 任务拆解

| 任务 | 描述 | 输出 |
|------|------|------|
| 2.1 仓库读取层 | 读取 `.spec/` 与相关 git 元数据，形成原始输入结构 | 仓库加载层 |
| 2.2 归一化层 | 把解析结果转成不依赖 markdown 排版的标准视图 | 标准状态模型 |
| 2.3 派生状态规则 | 计算待确认项、开放分歧、过期同步和源文档更新义务 | 确定性推导函数 |
| 2.4 一致性评分 | 把 prompt 中的评分描述转为代码，并保留解释能力 | 评分引擎与因子说明 |
| 2.5 查询契约 | 定义诸如 `getWorkspaceState`、`listActionableDivergences`、`getPendingActionItems` 等接口 | 对外状态 API |
| 2.6 回归覆盖 | 确保现有 mock scenarios 和示例仓库都能稳定产出一致结果 | 状态引擎测试集 |

### 输出契约必须回答的问题

状态引擎在不依赖 prompt 解读的情况下，必须能回答：

- 我在这个 workspace 中是谁？
- 现在有哪些 divergence 对我可操作？
- 哪些 decision 已经 resolved 但还没有 fully-closed？
- 为什么 consistency score 不是 100？
- 哪些文件或元数据当前缺失、非法或过期？

### 完成判定

- CLI 和扩展可以消费同一份派生状态对象。
- 一致性评分由代码计算，并且带有解释因子。
- 测试场景仅通过 fixtures 就能稳定复现输出。

## 工作包 3 - 决策与审批状态机

### 目标

把 divergence 解决流程从 prompt 约定，升级为带显式不变量的确定性工作流引擎。

### 核心不变量

1. 每个 divergence 在任意时刻只能有一个活动状态。
2. 只有合法角色可以提议、批准、驳回、定稿或撤回。
3. `resolved` 必须对应一个完整决策记录和 action item 快照。
4. `fully-closed` 必须以所有必需 action items 完成为前提。
5. 非法投票组合必须在写文件之前被拒绝。

### 需要支持的命令

| 命令 | 结果 |
|------|------|
| `proposeResolution` | 将 `open` 变为 `proposed`，记录提议者、理由和首个投票 |
| `approveProposal` | 为 `proposed` 的 divergence 增加合法批准 |
| `rejectProposal` | 退回 `open`，并保留历史 |
| `modifyProposal` | 替换当前提案，同时保留提案历史 |
| `finalizeResolution` | 将 `proposed` 变为 `resolved`，生成 decision 和 action items |
| `withdrawProposal` | 将提案回退为 `open`，并显式记录撤回历史 |
| `markActionItemComplete` | 更新 action item 完成状态，推动进入 `fully-closed` |
| `recomputeClosure` | 重新评估某个 resolved divergence 是否已 fully-closed |

### 任务拆解

| 任务 | 描述 | 输出 |
|------|------|------|
| 3.1 状态转移表 | 定义合法 from-state 到 to-state 的关系，以及拒绝原因 | 转移矩阵 |
| 3.2 权限模型 | 将 maintainer、contributor、observer 的工作流行为代码化 | 工作流授权规则 |
| 3.3 投票语义 | 定义提议者、审阅者、最终定稿者在多方场景下的关系 | 投票汇总规则 |
| 3.4 决策生成契约 | 定义 divergence 进入 resolved 前，decision 文件必须包含哪些内容 | 决策生成校验器 |
| 3.5 Action item 生命周期 | 定义 pending、complete、no-change-needed、stale 等状态 | Action item 生命周期规则 |
| 3.6 失败恢复 | 定义部分写入、非法历史和过期源更新如何被暴露与恢复 | 可恢复错误模型 |

### 完成判定

- 每个工作流写操作都受显式不变量校验。
- prompt skills 可以调用共享工作流逻辑，而不再在 prose 中重复写状态转移规则。
- 多方场景下无需再为每个 case 发明新的 markdown 格式。

## 工作包 4 - Spec Server

### 目标

为工具、Agent 和后续 UI 暴露一个统一运行时入口，承载 Spec 状态与工作流动作。

### 最小边界

第一版 Spec Server 只需要做好四件事：

1. 通过状态引擎读取 workspace state。
2. 暴露标准化查询资源。
3. 执行经过校验的工作流动作。
4. 返回工具可消费的结构化响应，而不是让工具继续抓 markdown。

### 第一阶段明确不做的事

- 不引入 Yjs 或 CRDT。
- 不依赖外部数据库。
- 不建设超出仓库状态和本地日志的长期审计存储。
- 不把完整 Web Dashboard 打包进第一版 Server 交付物。

### 建议能力面

#### 查询资源

| 资源 | 用途 |
|------|------|
| `spec://workspace/state` | 完整的标准化 workspace state |
| `spec://workspace/health` | 校验问题、过期文件和 blocker |
| `spec://collaborators` | 协作者列表与角色信息 |
| `spec://divergences` | divergence 摘要列表 |
| `spec://divergence/{id}` | 单个 divergence 的完整详情 |
| `spec://decisions/{id}` | decision 详情与 action item 进度 |
| `spec://signals` | 当前 signal 和 blocker 状态 |

#### 动作工具

| 工具 | 用途 |
|------|------|
| `phoenix_refresh_state` | 重算并返回当前状态 |
| `phoenix_propose_resolution` | 为 open divergence 提交提案 |
| `phoenix_record_vote` | 批准、驳回或修改提案 |
| `phoenix_finalize_resolution` | 将 divergence resolve 并产出 decision/action items |
| `phoenix_update_action_item` | 更新 action item 的完成或过期状态 |
| `phoenix_validate_workspace` | 校验 schema、引用关系和工作流不变量 |

### 任务拆解

| 任务 | 描述 | 输出 |
|------|------|------|
| 4.1 Server 契约 | 定义 resources 和 tools 的请求响应结构 | Server API 契约 |
| 4.2 运行时适配层 | 把状态引擎和工作流引擎包在一个统一运行时中 | Spec runtime service |
| 4.3 写入边界 | 确保所有写操作都经过校验命令，而不是直接改文件 | 受控写入适配层 |
| 4.4 工具接入 | 让 CLI、扩展和 prompt 流程逐步消费 Server 响应 | 消费方接入计划 |
| 4.5 可观测性 | 增加结构化日志和失败分类，便于调试 | Server 诊断模型 |

### 完成判定

- 工具不再需要直接解析 markdown 文件即可查询 Spec 状态。
- 所有工作流写操作都通过校验命令执行。
- Server 可以成为后续 UI 和实时层的共享底座，而无需重做领域模型。

## 依赖规则

1. 在工作包 1 的 fixtures 稳定前，工作包 2 不能冻结对外查询契约。
2. 工作包 3 可以在工作包 2 的模型草案阶段提前启动，但只有当状态模型稳定后才能冻结命令语义。
3. 工作包 4 可以提前原型化查询资源，但在工作流不变量测试通过前，不应暴露写操作工具。

## 并行支撑轨

| 轨道 | 启动点 | 贡献 |
|------|--------|------|
| 契约与 fixture 测试 | 工作包 1 草案后 | 锁定 schema 和回归覆盖 |
| Prompt 收敛 | 工作包 2 草案后 | 减少 skill 文本里的重复逻辑 |
| 工具面重构 | 工作包 2 草案后，工作包 4 后更深入 | 让 CLI 和扩展迁移到共享状态，而不是自定义解析 |

## 建议继续补的文档

- 每个核心 `.spec/` 文件的 schema 规范
- 状态引擎接口文档
- 工作流命令契约文档
- Spec Server API 与资源规范

## 相关文档

- [Roadmap](./roadmap.zh-CN.md)
- [技术架构](./architecture.md)
- [English Execution Plan](./execution-plan.md)