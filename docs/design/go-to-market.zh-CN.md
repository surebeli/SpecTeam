# SpecTeam 推广方案 (Go-to-Market)

这份文档定义当前产品楔子的 go-to-market 动作。

它只服务 PMF 阶段，不描述长期平台化扩张。

## 目标

当前阶段的目标，不是大规模曝光或企业级放量。

当前阶段的目标，是证明一小批 AI-native 产品与工程团队会反复使用 SpecTeam 来：

1. 发现 spec divergence
2. 更快形成 decision
3. 让人和 AI 工具围绕同一份事实来源协作

因此，GTM 应该优化 design partner 的重复使用，而不是表层流量指标。

## 当前阶段的产品定位

### 市场侧命名

当前对外主名使用 `SpecTeam`。

产品、仓库和工作流对外统一使用 `SpecTeam`。

### 类别表达

第一句话优先使用更窄的类别表达：

- AI-native spec review and alignment
- AI 时代的决策对齐层
- spec-driven teamwork 的 alignment layer

### 一句话介绍

`SpecTeam 帮助团队发现 spec 分歧、更快形成决策，并让人和 AI 工具保持对齐。`

## 初始 ICP

先只聚焦最可能形成重复使用的一小段用户。

1. 2 到 10 人的技术型创始团队和产品工程团队
2. 已经在规划、spec 编写或架构讨论中同时使用多个 AI 工具的团队
3. 已经在 Git 工作流中维护 PRD、架构文档和 proposals 的团队
4. 已经感受到 AI 输出冲突或方案收敛缓慢痛点的团队

在出现稳定复用前，不要扩这段 ICP。

## 楔子与当前 Offer

当前 offer 不是完整协作平台。

它是一个收敛得很窄的工作流：

1. 导入或准备冲突的 spec / proposal
2. 自动发现 divergence
3. review 一条分歧
4. align 成一条 decision
5. 把结果同步回 shared source of truth

因此 GTM 承诺必须和这个工作流一致，不应提前承诺完整 spec-to-execution 能力。

## 核心 GTM 动作

PMF 前正确的动作是 design partner wedge，而不是先做大规模 self-serve。

### Stage 1 - 先验证问题清晰度和目标团队匹配

核心目标：

找到已经真实感受到问题的团队。

优先触达面：

1. 已在使用 Claude Code、Codex CLI、Cursor 等工具的 founder / builder 社区
2. spec 密度高的小型产品工程团队定向触达
3. 使用 AI 协作设计 proposal 的开源维护者
4. 用 GitHub demo 和样例仓库直观呈现 divergence 问题

招募话术要足够直接：

`你的 PRD、架构文档和 AI 生成方案不应该彼此漂移。SpecTeam 帮助团队发现分歧、更快形成决策，并让所有参与者保持对齐。`

### Stage 2 - 用引导式首用完成 activation

核心目标：

在一次引导式会话里让团队完成 first value。

理想路径是：

1. 看见冲突输入
2. 发现 divergence
3. review 一条问题
4. 记录一次 resolution
5. 明白新的事实来源现在在哪里

第一次会话不能只当 demo，要当成 PMF 验证动作。

### Stage 3 - 逼出真实场景复用

核心目标：

把第一次成功使用，推进成第二次和第三次真实决策复用。

在 onboarding 后一周内，每个 design partner 都应该被推动在真实流程里再用一次，例如：

1. PRD 与架构设计不一致
2. 多个 AI 方案互相冲突
3. 团队对 scope 或技术方向存在分歧

最强信号不是“能跑通”，而是“不催也会再回来用”。

### Stage 4 - 验证轻量付费拉力

核心目标：

找到哪种更强的工作流或 visibility 诉求，已经强到值得收费。

第一阶段不要假设固定企业套餐。

更合理的做法，是围绕这些层做轻量收费验证：

1. team dashboard 和 decision visibility
2. approval workflow 与更清晰的 reviewer role
3. 可复用模板与更强 onboarding 支持
4. shared history、audit trail 与 decision traceability

## 获客渠道

PMF 前，渠道选择标准应是反馈质量，而不是漏斗体量。

| 渠道 | 当前为什么重要 | 预期结果 |
|------|----------------|----------|
| 定向 founder outreach | 最快接触高匹配团队 | design partner 对话 |
| GitHub 仓库与 demo 场景 | 低试用摩擦地展示问题 | demo 请求与自然兴趣 |
| 短篇技术内容 | 清晰解释 spec drift 和 alignment 痛点 | 叙事验证 |
| 早期用户转介绍 | 一旦形成真实使用，这是最高信任来源 | 更高质量的 design partners |

在重复使用出现前，不要做宽泛付费投放。

## 转化路径

早期转化路径应尽量简单：

1. 一眼看懂问题
2. 跑一次引导式会话
3. 在一条真实 decision 上使用
4. 在第二条真实 decision 上复用
5. 如果 premium pull 出现，再讨论轻量付费 pilot

在重复使用闭环没跑通之前，不要提前优化 free-trial funnel。

## 文案优先级

### 应优先强调

1. 发现 spec divergence
2. 更快收敛产品和架构决策
3. 让人和 AI 工具保持对齐

### 不应作为首句强调

1. 多 Agent 协作基础设施
2. MCP 架构细节
3. 企业部署和私有化叙事
4. 在楔子未验证前就包装成大平台

## PMF 阶段的商业化方式

这一阶段的商业化应该由证据驱动，而不是提前固化套餐。

### 免费层

继续用开源分发、示例和引导式 demo 降低采用门槛。

### 付费验证层

优先和 design partners 测试轻量 paid pilot，而不是过早锁定完整价格表。

适合测试的 pilot 形式：

1. 付费 onboarding 与 workflow setup 支持
2. 更强 decision visibility 能力的付费试点
3. 团队模板或 approval 支持的付费版本

当前目标不是最大化短期收入，而是验证是否存在明确付费意愿。

## PMF 前真正重要的指标

这些指标应和 PRD 与 PMF loop 保持一致。

| 指标 | 为什么重要 |
|------|------------|
| 首次接触是否快速理解 | 测试市场是否一眼看懂楔子 |
| 到第一次成功引导式会话的时间 | 衡量 activation friction |
| 活跃 design partner 团队数 | 衡量高匹配采用 |
| 每团队每周 review 次数 | 衡量是否形成重复行为 |
| open 到 resolved 的转化率 | 衡量决策效率 |
| resolved 到 fully-closed 的转化率 | 衡量决策是否真正落地 |
| 重复使用工作流的团队数 | 衡量真实 pull |
| 主动要求 premium 能力的团队数 | 衡量商业化信号 |

## PMF 前不要做的事

1. 不要把激进收入预测当成已验证事实写进核心 GTM
2. 不要在叙事和工作流转化还没验证前扩大曝光投放
3. 不要在 design partner pull 未出现前先重压企业销售方案
4. 不要把 GitHub star 当成主成功指标
5. 不要在产品尚未真正支持前先承诺完整执行平台

## 进入下一阶段 GTM 的判定条件

当前 GTM 动作算跑通，需要同时接近这些信号：

1. 有一批 design partners 在真实决策里重复使用工作流
2. 用户在首次接触几秒内就能理解产品
3. 从 divergence 到 decision 的路径被可测量地缩短
4. 某类 premium 请求在多个团队中重复出现
5. 至少有一部分团队对更强 workflow layer 表现出可信付费意愿

只有在那之后，才应该继续扩展到更广 self-serve 增长、团队套餐或企业销售。

## 相关文档

- [品牌重构方案](./brand-strategy.zh-CN.md)
- [产品需求](./product-requirements.zh-CN.md)
- [Design Partner Playbook](./design-partner-playbook.zh-CN.md)
- [PMF 验证循环](./pmf-loop.zh-CN.md)
- [依赖式 Roadmap](./roadmap.zh-CN.md)
