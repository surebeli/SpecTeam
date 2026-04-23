# SpecTeam PMF 验证循环

这份文档把 PRD 里的 PMF 假设，进一步收敛为可按周执行的验证闭环。

它只服务当前 wedge：

- AI-native spec review
- divergence detection
- decision alignment
- 面向产品与工程团队的 shared source of truth

它不是长期平台扩张计划。

## 目标

最快的 PMF 路径，是证明一小批 AI-native 团队会反复使用 SpecTeam，来缩短从 divergence 到 decision 的时间。

这套循环要收集四类证据：

1. 用户能用一句短话理解产品。
2. 用户能快速完成第一次 review 和 align。
3. 用户会把这套工作流带入真实项目，而不只是跑 demo。
4. 用户愿意为更强的团队工作流和共享可见性付费。

## 首先验证的用户段

先只打最窄的一段：

1. 2 到 10 人的技术型创始团队和产品工程团队
2. 已经在规划或设计阶段同时使用多个 AI 工具的团队
3. 已经在 Git 工作流中写 PRD、架构文档或 proposal 的团队
4. 已经感受到 AI 输出互相冲突或方案收敛太慢的团队

在出现稳定复用之前，不要扩 ICP。

## 当前这轮 PMF 需要回答的问题

每一轮循环都要拿证据回答：

1. 团队是否能立刻理解 SpecTeam 解决的是 spec drift 和 decision alignment？
2. 团队是否能在 10 分钟内到达第一次价值时刻？
3. 团队是否会把工作流带入第二次、第三次真实决策？
4. 团队是否会主动提出更强的 visibility、template、approval 或 team control 诉求？
5. 这些诉求里，哪些已经形成明确的付费意愿？

## 最快验证循环

### Step 1 - 找对团队，而不是找很多团队

优先聚焦 10 到 15 个 design partner 团队，而不是泛流量。

优先来源：

1. 已经在使用 Claude Code、Codex CLI、Cursor 等工具的创始人社区
2. spec 密度高的小型产品工程团队
3. 借助 AI 协作设计 proposal 的开源维护者

对外招募话术应尽量简单：

`SpecTeam 帮助你的团队发现 spec 分歧、更快形成决策，并让人和 AI 工具围绕同一份事实来源协作。`

### Step 2 - 跑一次引导式首用

第一次会话的目标，是观察一个完整闭环：

1. 导入或准备两份冲突的 spec / proposal
2. 自动发现 divergence
3. review 一条 divergence
4. 记录一次 resolution
5. 验证团队是否知道改了什么，以及新的 source of truth 在哪里

只记录高信号摩擦：

1. 首屏理解是否卡住
2. setup 是否太重
3. 用户是否不清楚谁来 propose、approve、finalize
4. 用户是否看不懂输出结果和下一步动作

### Step 3 - 逼出真实复用

单次 demo 不能算强验证。

在 onboarding 后一周内，要求每个 design partner 至少在一条真实决策中使用 SpecTeam，例如：

1. PRD 与架构文档不一致
2. 多个 AI 生成方案彼此冲突
3. 多人对 scope 或技术方向存在分歧

真正的问题不是“能不能用”，而是“会不会自己再回来用一次”。

### Step 4 - 把重复使用转成产品学习

每次真实使用后，都记录这些信息：

| 信号 | 记录内容 |
|------|----------|
| Trigger | 这次 divergence review 是被什么触发的 |
| Time to decision | 从发现分歧到形成决策花了多久 |
| Participants | 涉及哪些人和 AI actor |
| Friction | 用户卡在什么地方 |
| Reuse intent | 是否愿意在下一次决策继续使用 |
| Upgrade pull | 用户主动想要哪些更强的工作流或可见性能力 |

看模式，不看单点意见。

### Step 5 - 轻量验证付费意愿

在扩大产品面之前，先验证一个很小的 premium layer 是否真有付费拉力。

优先测试这些候选能力：

1. 更强的团队 dashboard 和 decision visibility
2. approval workflow 与更清晰的 reviewer role
3. 可复用模板与更高确定性的工作流初始化
4. shared history、audit trail 与 decision traceability

当前目标不是放大收入，而是找到哪种痛点足够值得收费。

## 每周运行节奏

建议按周运转，并保留一个固定 PMF checkpoint。

### 周一到周四

1. onboard 或支持 design partners
2. 观察同步或异步使用过程
3. 记录摩擦、复用和新增诉求

### 周五

跑一次 PMF checkpoint：

1. 本周哪些团队复用了工作流？
2. 哪些因素缩短了或拉长了 time to decision？
3. 哪些摩擦阻碍了重复使用？
4. 哪些请求跨多个团队重复出现？
5. 下一次产品改动，是否明确提升 activation、repetition 或 willingness to pay？

## 应重点看的指标

这些指标应和 PRD 保持一致。

| 指标 | 为什么重要 |
|------|------------|
| 新团队完成首次 demo 的时间 | 衡量 activation friction |
| 首屏约 5 秒内能理解产品 | 衡量叙事清晰度 |
| 每团队每周 review 次数 | 衡量是否形成重复使用 |
| open 到 resolved 的转化率 | 衡量决策效率 |
| resolved 到 fully-closed 的转化率 | 衡量决策是否真正落地 |
| 重复使用工作流的 design partner 数 | 衡量真实 pull |
| 主动要求 premium 能力的团队数 | 衡量商业化信号 |

## 每周迭代的判断规则

每次 checkpoint 后，按最简单的规则做决策。

### 继续加码，当

1. 用户能很快完成第一次价值时刻
2. 同一团队不需要强提醒就会再次使用
3. visibility 或 approval 类需求在多个团队里重复出现

### 继续收敛，当

1. 用户理解问题，但不理解工作流
2. demo 能跑通，但真实场景复用不起来
3. decision 能 resolve，但 follow-through 很弱

### 停止或进一步收窄，当

1. 团队并不觉得 spec divergence 足够痛
2. 工作流被反复认为“太重，不值这个收益”
3. 即使 activation friction 降下来了，重复使用仍然没有出现

## PMF 前不要做的事

1. 不要过早扩 ICP
2. 不要继续用平台基础设施语言做首句
3. 不要在没有重复 team pull 前先重投企业能力
4. 不要把一次成功 demo 当成产品拉力证明
5. 不要在还没确认用户愿为哪类 visibility 付费前，就先做完整 dashboard

## 立即动作

1. 改写所有前门文案，统一回到 spec review + alignment wedge
2. 招募首批 10 到 15 个 design partner 团队
3. 为每个团队跑引导式首用，并逼出至少一次真实 follow-up 使用
4. 建立每周 PMF checkpoint，并记录重复出现的请求
5. 只有当某项能力明确提升 activation、repetition 或 willingness to pay 时，才进入下一轮产品实现

## 相关文档

- [产品需求](./product-requirements.zh-CN.md)
- [Design Partner Playbook](./design-partner-playbook.zh-CN.md)
- [品牌重构方案](./brand-strategy.zh-CN.md)
- [推广方案](./go-to-market.zh-CN.md)