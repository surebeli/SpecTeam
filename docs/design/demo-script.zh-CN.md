# SpecTeam Demo Script

这份文档提供一套可直接运行的 demo narrative，用于当前 SpecTeam wedge。

它适用于 live call、录屏 walkthrough 或短版产品介绍。

这套 demo 的目标很简单：

展示 SpecTeam 如何帮助团队发现 spec divergence、清晰关掉一个 decision，并把结果同步回 shared source of truth。

## 最佳 Demo 场景

优先使用最窄、最容易让问题一眼成立的场景。

推荐默认场景：

- 两个协作者之间的 PRD 或 API spec 冲突
- 一条很具体的分歧，例如 REST versus GraphQL
- 一条能在五分钟内讲清楚的 resolution path

对于这个仓库，最适合演示的默认故事可以直接映射到 `tests/mock-scenarios/demo-1-conflict/`。

## Demo 承诺

先说承诺，再展示工具。

`如果你的 PRD、架构文档和 AI 生成方案经常彼此漂移，SpecTeam 会帮助团队发现分歧、形成一个清晰决策，并把结果同步回共享事实来源。`

## 30 秒开场

适用于时间很短的时候。

`SpecTeam 面向那些 PRD、架构文档和 AI 生成方案经常彼此漂移的团队。它在一条 workflow 里先发现 divergence，再帮助团队形成一个清晰决策，并把结果写回 shared source of truth，让人和 AI 工具不再基于不同假设工作。`

## 90 秒 Demo Narrative

1. 从两份互相冲突的输入开始，比如一个协作者主张 REST，另一个主张 GraphQL。
2. 先说明问题不是缺方案，而是团队和 AI 工具正在基于相互矛盾的假设工作。
3. 展示 SpecTeam 如何把这种矛盾显式识别成 divergence。
4. 打开一条具体分歧，演示 review 和 align 的过程。
5. 形成 decision 后，展示新的 shared source of truth 在哪里。
6. 最后强调价值是重复决策里的持续对齐，而不是一次性 review。

## 5 分钟 Live Demo Script

### Step 1 - 先建立问题

讲解词：

`真正的问题在这里：一份 spec 写的是一套，另一份又是另一套，而 AI 工具会把这种偏差进一步放大成不同路线。团队不是缺想法，而是缺一个能发现 divergence 并明确关掉 decision 的流程。`

展示：

1. 两份冲突的 spec 或 proposal
2. 对应的协作者输入

### Step 2 - 展示 divergence detection

讲解词：

`SpecTeam 会先把这种分歧显式变成一条 divergence record。这样团队不需要靠记忆争论，而是能看到当前到底哪些问题还处于 open 状态。`

展示：

1. 运行 review 流程，或直接展示产出的 divergence state
2. 高亮其中一条具体 divergence

### Step 3 - 演示 alignment

讲解词：

`现在我们挑一条分歧来 review，并把它 align 成一个 decision。目标不是无限比较 proposal，而是清晰地关掉这个 decision。`

展示：

1. 一条 divergence 进入 review
2. align 步骤
3. 最终进入 resolved 的状态

### Step 4 - 展示 source of truth

讲解词：

`重要的输出不是一段聊天，而是一条现在可以被当作 shared source of truth 的 decision。`

展示：

1. resolved 的 divergence 条目
2. 对应的 decision log 或后续状态产物

### Step 5 - 收束到价值

讲解词：

`这就是当前 wedge。SpecTeam 帮助团队发现 spec divergence、更快形成决策，并让人和 AI 工具保持对齐。重点不是生成更多 proposal，而是停止让团队基于不同假设工作。`

## Demo 操作清单

开始前：

1. 只选一个冲突场景
2. 提前准备好要讲的那条 divergence
3. 不要一次性展示太多命令或文件
4. 在开始前先想清楚最后一句收尾

演示中：

1. 先讲矛盾，再讲架构
2. 让 workflow 足够可见和具体
3. 每一步都解释“为什么这一段重要”
4. 最后停在 shared source of truth，而不是工具细节

## 不要这样讲

1. 不要先讲多 Agent 基础设施
2. 不要把开场浪费在 MCP 细节上
3. 不要承诺完整 spec-to-execution 自动化
4. 不要把 demo 讲成 prompt 技巧展示，而不是 decision alignment 展示

## Demo 收尾与 CTA

### 收尾句

`如果你们团队已经有这个问题，下一步不是马上大规模铺开，而是挑一条真实 decision 跑一次这套 workflow，看团队会不会自己回来再用一次。`

### 面向 design partner 的 CTA

`带一条真实的 spec 冲突或 AI proposal mismatch，我们可以一起把它跑进 SpecTeam。`

## 相关文档

- [Messaging Kit](./messaging-kit.zh-CN.md)
- [推广方案](./go-to-market.zh-CN.md)
- [Design Partner Playbook](./design-partner-playbook.zh-CN.md)