# SpecTeam Design Partner Playbook

这份文档把 PMF loop 和 go-to-market 策略进一步落成一套可重复执行的操作手册。

它只服务当前 PMF 阶段。

目标是让团队能更稳定地完成四件事：找到对的人、跑对的对话、记录对的信号，以及更快做出产品和 GTM 决策。

## 目标

这份 playbook 用来稳定完成四件事：

1. 识别高匹配的 design partner 团队
2. 用清晰的问题表述完成招募触达
3. 运行结构化 discovery 和首用会话
4. 把用户信号转成每周产品和 GTM 判断

## 什么样的团队算 Design Partner

Design partner 不是“感兴趣的用户”就够了。

一个合格的 design partner，最好同时满足大部分条件：

1. 团队规模在 2 到 10 人之间，并且存在真实产品工程协作
2. 已经在规划、spec 编写或架构工作中同时使用多个 AI 工具
3. 关键文档在 Git 或 Git 邻近工作流中维护
4. 最近确实出现过冲突的 spec、proposal 或 AI 输出
5. 愿意在一周内尝试一次真实工作流，而不只是看 demo
6. 愿意给出直接反馈，并讨论什么能力值得付费

## 伙伴筛选标准

### 高优先级候选

1. 直接参与产品和架构决策的技术型创始人
2. PRD 和架构频繁变化的小团队
3. 已经在抱怨 AI 输出相互矛盾的团队
4. 有足够紧迫性，愿意很快尝试 live workflow 的团队

### 低优先级候选

1. 只想看 demo，不愿试真实流程的团队
2. 当前没有 spec 或 decision pain 的团队
3. 完全不使用 Git 管理文档的团队
4. 一上来就要求完整企业套件的团队

## 招募信息框架

招募信息要短，而且以问题为中心。

### 短版消息

`SpecTeam 帮助产品和工程团队发现 spec divergence、更快形成 decision，并让人和 AI 工具保持对齐。`

### 长版消息

`如果你的 PRD、架构文档和 AI 生成方案经常彼此漂移，SpecTeam 可以帮助你的团队发现分歧、形成一个清晰决策，并把结果同步回共享事实来源。`

### 不要作为开头强调的内容

1. 多 Agent 基础设施语言
2. MCP 内部实现
3. 企业套餐和大客户包装
4. 在问题未被承认前就讲平台大愿景

## 招募序列

### Sequence A - 冷启动 founder outreach

1. 先抛一个清晰痛点
2. 说一个具体的 spec drift 或 AI proposal 冲突场景
3. 约一个 20 到 30 分钟的问题访谈，而不是销售 demo

建议话术：

`你们可能已经有这个问题：PRD 写的是一套，架构文档是另一套，AI 工具又给出不同路线。我在做 SpecTeam，它的目标是帮团队发现这种 divergence，并更快形成决策。如果你们也有这个问题，我想和你对一下实际情况，看看现在这套 workflow 是否匹配。`

### Sequence B - 熟人转介绍触达

1. 第一时间说明共同连接人
2. 直接描述当前哪类团队开始看到价值
3. 如果问题已经存在，约短工作会而不是泛聊

### Sequence C - Inbound 跟进

1. 先确认对方是否真有当前的 spec 或 decision drift
2. 预约前先要一个最近案例
3. 根据痛点强度，分流到 discovery 或直接 guided session

## 资格筛选问题

在投入深度会话前，先问这些问题。

1. 现在有多少人参与产品和技术决策？
2. 目前在规划、spec 编写和设计评审里，哪些 AI 工具在被使用？
3. PRD、架构文档和 proposal 现在放在哪里？
4. 最近能不能举一个两个 spec 或 AI proposal 互相矛盾的例子？
5. 你们当时是怎么解决那个冲突的？
6. 最终决策有没有真的同步回源文档？
7. 如果这个问题够真实，你们是否愿意在接下来一周试一次真实 workflow？

## Discovery 访谈脚本

第一次对话的目标，是先确认问题，再讨论方案。

### Part 1 - 上下文

1. 你们团队最容易在哪类决策上出现混乱？
2. 矛盾通常最先出现在 PRD、架构文档还是 AI 生成 proposal？
3. 你们多频繁遇到“人和 AI 工具基于不同前提工作”的情况？

### Part 2 - 当前流程

1. 当两份 spec 冲突时，你们现在怎么处理？
2. 谁来决定什么是最终版本？
3. 团队如何知道这个决策已经同步到了该同步的地方？
4. 当前流程里最慢、最烦或最有风险的部分是什么？

### Part 3 - 痛点强度

1. 这个问题在时间、返工或错误决策上有多贵？
2. 如果 divergence 没被及早发现，会发生什么？
3. 随着 AI 工具变多，这个痛点是在变强吗？

### Part 4 - 产品匹配度

1. 如果有一个工具能发现 spec divergence，并帮助团队更快关掉 decision，它会放进你们哪一段流程？
2. 要满足什么条件，你们才会持续重复使用？
3. 什么会让它显得太重，不值得接入？

## 引导式首用脚本

目标是在尽可能短的时间里到达 first value，并观察真实摩擦。

### 成功路径

1. 准备两份冲突文档或 proposals
2. 运行 divergence detection
3. 选一条值得讨论的 divergence
4. review 并 align 成一个 decision
5. 确认团队理解输出，以及新的 source of truth 在哪里

### 重点观察什么

1. 团队是否在前几分钟内就理解产品？
2. setup friction 是否可接受？
3. 参与者是否理解谁 propose、approve、finalize？
4. 他们是否信任记录下来的结果？
5. 他们是否愿意在真实决策里再用一次？

## 首用后的跟进问题

这些问题在 24 小时内问一次，在第一次真实 follow-up 使用后再问一次。

1. 哪一部分工作流最有立即价值？
2. 哪一部分比预期更困惑或更重？
3. 你能不能说出下一条会继续用它的真实 decision？
4. 什么会阻止你们下周再用一次？
5. 哪种更强的 visibility、template 或 approval 支持会让它更值钱？

## 真实使用验证清单

不要因为对方完成了一次 demo 就把它算作已验证。

至少要满足大部分条件：

1. 完成过一次成功的 guided session
2. 在至少一条真实 decision 上使用过工作流
3. 不用重度催促也会再回来用一次
4. 能用自己的话说清楚价值是什么
5. 能说出如果工作流继续有效，哪类能力值得付费

## 付费意愿试探

不要过早拿出完整价格表。

先用轻量问题试探 payment pull：

1. 如果这套 workflow 能稳定缩短团队决策时间，它值不值得付费？
2. 哪部分最值得付费：visibility、approval、template，还是 decision history？
3. 如果它能在你们下一个项目里解决这个痛点，你愿不愿意为一个轻量 pilot 付费？
4. 这笔预算最终要由谁批准？

### 早期适合测试的 pilot 形态

1. 付费 onboarding 与 workflow setup 支持
2. 更强 decision visibility 的付费能力
3. 团队 approval 或 template 功能的付费试点

## 记录模板

每个团队只保留一份标准记录。

| 字段 | 记录内容 |
|------|----------|
| Team | 公司或项目名 |
| Contact | 主要联系人和角色 |
| Team size | 活跃产品工程参与人数 |
| AI stack | 当前使用的工具 |
| Doc workflow | PRD 和架构文档现在放在哪里 |
| Trigger example | 最近一次 divergence 案例 |
| Pain intensity | low / medium / high 和一句原因 |
| First-use result | blocked / partial / successful |
| Real reuse | no / prompted / unprompted |
| Premium pull | 主动要求的能力 |
| Payment signal | none / weak / medium / strong |
| Next action | 下一步动作和 owner |

## 每周复盘节奏

每周至少复盘一次所有活跃 design partners。

### 每周 checkpoint 问题

1. 本周哪些团队复用了工作流？
2. 哪些团队停在第一次会话之后，原因是什么？
3. 哪种摩擦在多个团队里重复出现？
4. 哪类 premium 请求在多个团队里重复出现？
5. 现在最小的产品或文案调整，哪一个最可能改善 activation、repetition 或 payment pull？

## 判断规则

### 继续加码，当

1. 团队很快到达 first value
2. 重复使用出现在真实项目里
3. 同类 premium 请求在多个团队中重复出现

### 继续收敛，当

1. 问题能引起共鸣，但 workflow 本身显得混乱
2. guided session 能跑通，但真实复用没有出现
3. 用户认同方向，但放不进现有文档流程

### 停止或继续收窄，当

1. 高匹配团队也不认为问题足够紧迫
2. 即使摩擦下降，重复使用仍然没有出现
3. 即使团队高匹配，付费意愿仍持续偏弱

## 立即执行清单

1. 招募首批 10 到 15 个高匹配团队
2. 在 guided session 前或同时完成 discovery 对话
3. 在一周内逼出一次真实 follow-up 使用
4. 每次都用同一套模板记录信号
5. 每周按模式复盘，只改会影响 activation、repetition 或 willingness to pay 的部分

## 相关文档

- [Design Partner Templates](./design-partner-templates.zh-CN.md)
- [产品需求](./product-requirements.zh-CN.md)
- [PMF 验证循环](./pmf-loop.zh-CN.md)
- [推广方案](./go-to-market.zh-CN.md)