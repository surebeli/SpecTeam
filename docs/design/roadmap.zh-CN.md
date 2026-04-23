# SpecTeam 产品 Roadmap

这份 roadmap 按依赖关系和并行边界排序，而不是按自然时间排序。

它基于当前仓库的真实状态：

- 核心协作流程仍主要实现为 prompt skills。
- CLI 和 VS Code 扩展仍是轻量 UX 壳层。
- MCP connectors 目前更接近参考实现。
- 仓库里还没有独立的 Spec 运行时或服务端主体。

这份路线图的目标，是让 SpecTeam 从“prompt 驱动的协作原型”逐步演进为“可产品化的协作平台”，同时避免跳过必要的基础层。

## 规划原则

1. 先把确定性逻辑代码化，再继续扩 UI。
2. 所有前端和工具面都消费同一份状态模型，而不是各自解析 markdown。
3. 先统一 connector contract，再扩 connector 数量。
4. 先把异步协作链路跑稳，再引入实时基础设施。
5. 企业能力要建立在可信的核心协作闭环之上，而不是提前堆叠。

## 目标结果

SpecTeam 最终应该演进为一个协作平台，在这个平台里：

- 不同 Agent 共享同一份可信项目状态。
- 人类可以不依赖聊天命令，直接查看、审批和追溯决策。
- 外部工具和文档源通过统一运行时协议接入。
- 实时同步是加速层，而不是第一层依赖。

## 主依赖链

| 顺位 | 工作包 | 依赖 | 为什么现在做 | 核心产出 | 完成判定 |
|------|--------|------|--------------|----------|----------|
| 1 | Spec 协议规格化 | 无 | 当前很多规则散落在 prompt skill 和 markdown 约定中，必须先把这些约定稳定成 schema，后续代码、UI、Server 才能共用。 | `COLLABORATORS`、`THESIS`、`SIGNALS`、`DIVERGENCES`、`decisions` 的版本化 schema、迁移规则、解析契约、示例 fixtures | 不依赖 prompt 解释，也能稳定解析核心 `.spec/` 文件 |
| 2 | 本地状态引擎 | 1 | CLI、扩展和后续服务端都需要同一种方式来计算状态、待办、审批项和一致性评分。 | workspace snapshot、divergence index、待确认项、一致性评分逻辑、状态聚合库 | CLI、扩展和测试对同一仓库算出同一状态 |
| 3 | 决策与审批状态机 | 1、2 | 当前 divergence 生命周期更多靠 prompt 规范维持，需要显式的状态流转和校验规则。 | `open -> proposed -> resolved -> fully-closed` 转移规则、投票规则、提议者/确认者约束、action item 完成规则 | 非法状态转移由代码阻止，而不是靠文档约束 |
| 4 | Spec Server | 2、3 | 当本地状态和决策规则稳定后，才能安全暴露成给工具和 Agent 共用的接口。 | MCP resources、查询接口、动作接口、workspace state service、统一响应结构 | 工具和 Agent 不再直接解析仓库文件即可读取 Spec 状态 |
| 5 | 工具面重构 | 初步依赖 2，完整依赖 4 | 当前 CLI 和 VS Code 扩展各自做了轻量解析，后续应改为依赖共享状态接口。 | CLI 改为基于共享状态引擎或 Server，VS Code 扩展改为读取标准状态，动作入口统一化 | 工具层不再依赖零散正则或 markdown 直读逻辑 |
| 6 | 人类仲裁中心 MVP | 4、5 | 只有状态模型和动作接口稳定后，人类工作台才不会反复推倒重来。 | divergence 列表、方案对比、审批流程、决策历史、action item 视图 | 人类无需只靠聊天命令也能完成查看和审批 |
| 7 | Connector 运行时 | 初步依赖 1，完整依赖 4 | connector 应挂在统一导入和归一化流水线上，而不是每个来源都自成一套逻辑。 | connector manifest 契约、认证模型、normalize pipeline、import orchestration、运行时校验 | 新 connector 可以按统一方式接入，而不是重复实现导入语义 |
| 8 | 实时状态层 | 4、6 | 只有 Spec 先有稳定服务模型和可订阅 UI，实时层才真正有意义。 | presence 模型、SIGNALS 广播、订阅通道、增量刷新协议 | 状态变化可以被推送，而不只是依赖 pull 和 refresh |
| 9 | 审计与企业能力层 | 4、6、8 | 合规、私有化、权限和企业支持必须建立在稳定工作流和状态架构之上。 | RBAC、审计存储、部署模型、团队隔离、运维控制、管理员工作流 | Team Pro 和 Enterprise 功能具备可信的技术基础 |

## 可并行工作流

这些轨道在满足起始依赖后可以并行推进。

| 轨道 | 最早启动点 | 依赖程度 | 主要产出 | 说明 |
|------|------------|----------|----------|------|
| 契约与 Fixture 测试轨 | 1 之后 | 低 | schema fixtures、parser tests、状态转移测试、回归场景 | 这一轨应成为 2 到 7 的质量门槛 |
| UI 信息架构与原型轨 | 2 的草案稳定后 | 中 | dashboard 信息架构、决策详情页、审批体验原型 | 应先消费 mock state，不要反向绑架后端契约 |
| Prompt 逻辑收敛轨 | 2 之后 | 中 | 将确定性逻辑下沉到代码，把判断性逻辑保留在 prompt | 目标是减轻 prompt 负担，不是把 prompt 完全移除 |
| Connector 框架扩展轨 | 1 之后 | 中 | 通用 connector runtime，以及更高价值来源如 Figma、Linear、GitHub Issues | 不要在 contract 未稳定前盲目扩来源数量 |
| 文档与 Demo 轨 | 立即 | 低 | README、样例仓库、工作流 walkthrough、架构说明持续更新 | 保证外部叙事与真实产品阶段一致 |

## 推荐执行规则

1. 任何新的 UI 面都只能读共享状态引擎或 Spec Server，不能直接解析 `.spec/*.md`。
2. 任何能被确定性表达的规则，都应该优先从 prompt 文本迁移到代码或 schema。
3. 每个 connector 在写入 `.spec/design/` 前，都应先输出统一的归一化文档契约。
4. 每个主要里程碑都应先补 fixtures 和回归测试，再继续扩大范围。

## 准入门槛

### Gate A - 协议可被机器读取

- 核心 `.spec/` 文档有明确 schema 和迁移规则。
- fixtures 覆盖当前格式和历史格式。

### Gate B - 各个入口的状态一致

- CLI、VS Code 扩展和测试都消费同一份派生状态。
- 一致性评分已经变成代码逻辑，而不是只存在于 prompt 描述里。

### Gate C - 决策不再依赖纯聊天中介

- 人类可以在 UI 中查看 divergence、审阅提案、批准或驳回，并跟踪后续 action items。

### Gate D - 实时层带来增益而不是复杂度

- 异步仓库工作流已经稳定可用。
- 实时订阅解决的是速度问题，而不是正确性问题。

## 下一阶段的明确非目标

- 在 Spec 状态服务稳定前，提前上完整的 Yjs、Yunxin、数据库重基础设施。
- 在共享 contract 定义前，盲目扩充大量 connector。
- 在状态接口不稳定前，先做很重的 dashboard。
- 把企业部署和合规诉求，提前当作替代核心工作流成熟度的理由。

## 相关文档

- [技术架构](./architecture.md)
- [产品需求](./product-requirements.zh-CN.md)
- [推广方案](./go-to-market.zh-CN.md)
- [基础执行计划](./execution-plan.zh-CN.md)
- [English Roadmap](./roadmap.md)