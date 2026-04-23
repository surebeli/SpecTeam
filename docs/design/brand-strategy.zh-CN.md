# SpecTeam 品牌策略

这份文档定义当前产品的最终品牌决定。

核心前提很简单：

产品尚未发布，因此现在应该把品牌一次性统一，而不是继续保留历史兼容层。

## 最终决定

所有关键表面统一使用 `SpecTeam`：

1. 产品名
2. 仓库名
3. 协议与工作流名
4. 命令族
5. 插件与扩展元数据

当前方案不保留单独的过渡品牌。

也不保留旧命令族的兼容层。

## 为什么这样做是对的

当前产品真正解决的是一个很窄但很真实的问题：

1. 团队会产出彼此冲突的 specs 和 proposals
2. 多个 AI 工具会放大 divergence，而不是自动消除它
3. 决策很难稳定回写到共享事实来源

`SpecTeam` 直接指向这个问题域。

它比抽象品牌更容易理解，也比过早强调执行的名字更稳。

## 命名规则

以下规则必须保持一致。

| 表面 | 统一命名 |
|------|----------|
| 产品 | `SpecTeam` |
| Prompt 入口文件 | `SPECTEAM.md` |
| Workspace 状态目录 | `.spec/` |
| Git 配置键 | `spec.member-code`、`spec.main-branch` |
| 命令族 | `spec-*` |
| CLI 二进制名 | `spec` |
| 包名和扩展 id | 需要机器标识时使用 `specteam-*` |

## 市场定位

### 类别表达

对外优先使用这些更窄的类别表达：

1. AI-native spec review and alignment
2. AI 时代的决策对齐层
3. spec-driven teamwork 的 alignment layer

### 一句话介绍

`SpecTeam keeps specs, decisions, and AI agents aligned.`

### 扩展介绍

`SpecTeam 帮助产品和工程团队发现 PRD、架构文档和 AI 生成方案之间的分歧，然后把决策沉淀成共享事实来源。`

## 为什么现在不选 SpecEx

`SpecEx` 仍然比当前产品更偏执行导向。

当前最强的能力是：

1. divergence detection
2. decision alignment
3. shared state visibility
4. 保持人和 AI 工具同步

它还不是一个以 spec-to-execution 自动化见长的产品。

如果现在用 `SpecEx`，市场预期会先跑到产品前面。

## 文案规则

### 应优先强调

1. 自动发现 spec divergence
2. 更快完成产品和架构决策
3. 让人和 AI 工具保持对齐

### 不应作为首句强调

1. 多 Agent 基础设施语言
2. MCP 实现细节
3. PMF 前的企业包装
4. 产品尚未真正支持的完整 spec-to-code 承诺

## 一致性要求

所有用户可见表面都要讲同一个故事。

包括：

1. README 与 onboarding 文档
2. prompt skill 名称和示例
3. CLI 帮助文本与包元数据
4. VS Code 扩展名称与命令
5. demo script、截图和测试提示
6. marketplace 与 plugin manifest

## 立即执行清单

1. 产品、仓库、工作流和命令全部统一使用 `SpecTeam`
2. 所有文档只使用 `.spec/` 作为工作区状态目录
3. 所有示例只使用 `spec-*` 命令族
4. 删除文档里的“过渡期”“兼容层”“旧品牌”表述
5. `SpecEx` 只保留为未来命名选项，不作为当前有效品牌

## 相关文档

- [产品需求](./product-requirements.zh-CN.md)
- [English Brand Strategy](./brand-strategy.md)
- [Messaging Kit](./messaging-kit.zh-CN.md)
- [推广方案](./go-to-market.zh-CN.md)

**Headline**

`AI moves fast. Your specs should not drift.`

**Subhead**

`Review conflicting proposals, resolve decisions, and keep humans and AI tools working from the same spec.`

### Hero 方案 C

**Headline**

`The alignment layer for spec-driven teamwork.`

**Subhead**

`Start with spec review and decision alignment. Expand later into a broader AI-native workflow as your team grows.`

## 首页信息块建议

### Problem Block

`你的 PRD 写了一套，架构文档写了另一套，Claude 提议 REST，Cursor 提议 GraphQL，最后没人知道到底哪个决策才是最终版本。`

### Solution Block

`SpecTeam 会先找出分歧，再帮助团队形成决策，并把结果写回共享事实来源，让人和 AI 不再各走各路。`

### How It Works

1. 导入或编写 specs 与 proposals
2. 自动发现 divergence
3. 评审并形成决策
4. 把结果同步回团队的 shared source of truth

### Outcome Block

- 更少彼此冲突的 spec
- 更快的方案收敛
- 更清晰的人机执行边界

## 命令命名方向

建议未来对外 alias：

| 当前 | 未来 alias |
|------|------------|
| `/spec-review` | `/spec-review` |
| `/spec-align` | `/spec-align` |
| `/spec-status` | `/spec-status` |
| `/spec-update` | `/spec-update` |
| `/spec-push` | `/spec-sync` 或 `/spec-push` |

不要一次性全量重命名。先做 alias，比做 breaking change 更稳。

## 最终建议

如果目标是更快让市场理解产品，并更快逼近 PMF：

1. 当前市场侧主名用 `SpecTeam`
2. `SpecTeam` 作为仓库脉络和过渡期品牌保留
3. 核心叙事从“大基础设施”切回“spec review + decision alignment”
4. 在真正拥有 spec-to-execution 能力之前，不要用 `SpecEx` 做主名

## 相关文档

- [产品需求](./product-requirements.zh-CN.md)
- [English Brand Strategy](./brand-strategy.md)
- [Roadmap](./roadmap.zh-CN.md)