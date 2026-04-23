# SpecTeam 产品需求文档（PMF 导向版）

## 产品说明

- **市场侧产品名**：SpecTeam
- **仓库 / 协议标识**：SpecTeam
- **当前阶段定位**：从“大而全的 AI 协作基础设施”收缩为“AI 时代的规格评审与决策对齐工具”

这份 PRD 只描述当前最接近 PMF 的产品形态，不描述完整长期平台蓝图。

## 产品定位

SpecTeam 帮助产品和工程团队在 PRD、架构设计、技术方案和 AI 生成提案之间发现分歧、形成决策，并让人和 AI 工具围绕同一份事实来源协作。

一句话版本：

`SpecTeam keeps specs, decisions, and AI agents aligned.`

当前不主打“分布式 AI 团队上下文一致性基础设施”，而主打更窄、更容易被市场理解的能力：

- 自动发现 spec divergence
- 加快设计和架构决策收敛
- 让团队和 AI 工具围绕同一份决策协作

## 问题定义

AI-native 团队在写 PRD、架构文档和技术方案时，会同时面临三类问题：

1. 不同人和不同 AI 工具会提出彼此冲突的方案
2. 决策过程分散在聊天记录、文档 diff 和口头同步里，难以追溯
3. 决策形成后，执行层仍然容易继续沿着旧 spec 或冲突 spec 前进

团队真正的痛点不是“缺少更多 AI”，而是“缺少一个让 spec 和 decision 持续对齐的机制”。

## 目标用户（Initial ICP）

当前阶段只优化最可能快速重复使用并产生付费意愿的用户。

### 核心 ICP

1. 2 到 10 人的技术型创业团队或产品工程团队
2. 并用 Claude、Cursor、Copilot、Codex 等多个 AI 工具
3. 已经使用 Git 管理 PRD、架构文档或设计方案
4. 已经感受到 AI 输出互相冲突、评审反复、设计收敛慢的问题

### 次级用户

1. 技术型创始人或 solo builder，但需要多 AI 工具协同工作
2. 小团队中的 Tech Lead、架构负责人、产品负责人

### 当前不优先的用户

1. 需要强实时协作和复杂权限体系的大企业
2. 主要痛点在代码补全而不是 spec 收敛的团队
3. 还没有形成文档协作习惯的团队

## 核心使用场景

### 场景 1：PRD 与架构方案冲突

产品文档和架构文档由不同人或不同 AI 工具产出后，出现方向不一致。SpecTeam 负责发现 divergence、组织决策、沉淀结果。

### 场景 2：多 AI 工具提出不同技术路线

Claude 提议 REST，Cursor 提议 GraphQL，团队需要快速比较、选择和冻结决策，而不是继续无限讨论。

### 场景 3：决策形成后同步执行约束

某项设计决策已经确认，但团队成员和 AI 工具仍在沿用旧版本方案。SpecTeam 负责把决策同步到共享事实来源，并提示后续动作。

## Jobs To Be Done

用户雇佣 SpecTeam，不是为了“拥有一个协作平台”，而是为了完成以下工作：

1. 当多个 spec 或 proposal 冲突时，尽快发现分歧
2. 当团队需要做设计或架构决策时，保留上下文和理由
3. 当决策已形成时，确保人和 AI 不再沿着不同方向执行

## 产品承诺

SpecTeam 的核心承诺不是“替你自动完成所有执行”，而是：

1. 让分歧更早被发现
2. 让决策更快形成
3. 让决策更容易被后续工作流继承

## MVP 范围

当前 MVP 只保留三项核心能力。

### 1. Divergence Detection

- 扫描和比较多份 spec、PRD、架构文档和 AI 生成提案
- 输出结构化 divergence 记录
- 标记优先级和涉及方

### 2. Decision Alignment

- 围绕 divergence 发起提议、确认、修改和定稿
- 将决策写入共享事实来源
- 为后续执行生成明确 action items

### 3. Shared State Visibility

- 提供当前 workspace 的 divergence 状态
- 提供待确认、已解决、待更新的统一视图
- 提供一致性评分和阻塞项提示

## MVP 交付面

当前阶段的主要交付面应保持轻量：

1. Prompt skills 工作流
2. 轻量 CLI
3. 轻量 VS Code 状态视图

它们共同服务于“review -> align -> update -> status”这条闭环。

## 明确非目标（当前阶段不做）

以下内容属于长期方向，但不应成为当前 PMF 阶段的主要投入：

1. 完整的人类仲裁中心 Web Dashboard
2. BYO Agent SDK 的完整产品化
3. Yjs、Yunxin、PostgreSQL 等重实时与重基础设施能力
4. 广泛 connector 扩张（Figma、Linear、GitHub Issues 等）
5. 企业级 RBAC、审计、私有化部署优先级前置
6. “从 spec 到代码执行”的完整自动化承诺

## 产品原则

1. **先解决分歧，再扩张平台**：优先解决当前最真实的协作痛点。
2. **先对齐决策，再讲自动执行**：当前阶段的价值中心在 alignment，不在 full execution。
3. **让市场第一眼看懂**：优先使用用户能立刻理解的产品表达。
4. **让团队愿意重复使用**：每次使用都要缩短收敛时间，而不是制造新流程负担。

## 差异化

相较于泛 AI coding 工具，SpecTeam 的差异化不在“再给团队一个 Agent”，而在：

1. 直接面向 spec、方案和决策冲突
2. 以 Git-native 方式沉淀共享事实来源
3. 让多人、多文档、多 AI 工具进入同一条决策闭环

## 成功指标（PMF 前）

当前阶段的指标不应以宏大平台指标为主，而应围绕重复使用和收敛效率。

### 核心指标

| 指标 | 目标 |
|------|------|
| 首次发现到形成决策的中位时间 | 持续下降 |
| 每周重复使用团队数 | 持续上升 |
| 每团队每周 review 次数 | ≥ 2 |
| divergence 从 open 到 resolved 的转化率 | 持续上升 |
| resolved 到 fully-closed 的转化率 | 持续上升 |

### 体验指标

| 指标 | 目标 |
|------|------|
| 新团队完成首次 demo 所需时间 | ≤ 10 分钟 |
| 初次接入理解成本 | 用户能在首屏 5 秒内理解产品用途 |
| 用户是否愿意带入下一项目 | 明显提高 |

## PMF 假设

当前产品的核心假设如下：

1. AI-native 小团队已经开始因为多个 AI 工具带来的 spec 分歧而感受到真实痛点
2. 这些团队愿意接受 Git-native、prompt-first 的轻量协作方式
3. 如果 SpecTeam 能显著缩短分歧发现和决策形成时间，团队会持续重复使用
4. 只要 review 和 align 成为高频工作流，就具备向更大平台扩张的基础

## 商业化方向

PMF 前的商业化应围绕“设计伙伴团队 + 轻量付费验证”展开，而不是提前构建完整企业产品。

### 早期商业化路径

1. 用开源仓库和 demo 降低试用门槛
2. 聚焦 10 到 15 个 design partner 团队
3. 提供更强的团队工作流支持、模板和状态视图作为付费候选能力

### 未来可付费层

1. 团队级 Dashboard 与审批界面
2. 更强的 decision history 和 audit 能力
3. 扩展连接器与组织级协作能力

## 下一阶段扩张路径

在当前 wedge 成立之后，再逐步进入更广义的 spec-driven teamwork：

1. 从 spec review 扩展到更完整的 decision ops
2. 从轻量状态视图扩展到人类仲裁中心
3. 从 Git-native async workflow 扩展到更强的 runtime/state service
4. 最终再进入更完整的 spec-driven development 平台叙事

## 品牌一致性

当前建议是在产品、仓库、工作流和命令层统一使用 `SpecTeam` 命名。

## 相关文档

- [品牌重构方案](./brand-strategy.zh-CN.md)
- [PMF 验证循环](./pmf-loop.zh-CN.md)
- [推广方案](./go-to-market.zh-CN.md)
- [依赖式 Roadmap](./roadmap.zh-CN.md)
