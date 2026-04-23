# SpecTeam Design Partner Templates

这份文档提供一组可直接复制使用的模板，把 design partner playbook 变成日常可执行材料。

做法很简单：改占位符，保留结构，并尽量让所有团队都用同一套格式。

## 如何使用这份文档

1. 用招募模板发起对话
2. 用 discovery 和 guided session 模板稳定跑会话
3. 用记录模板和每周 checkpoint 模板统一记录证据
4. 只有在真实 workflow pull 出现后，才使用付费 pilot 模板

## 模板 1 - 冷启动触达消息

适用于你不直接认识的 founder 或小团队。

```text
Subject: 减少团队和 AI 工具之间的 spec drift

Hi {name},

你们可能已经有这个问题：PRD 写的是一套，架构文档是另一套，AI 工具又给出不同路线。

我在做 SpecTeam，它是一套帮助产品和工程团队发现 spec divergence、更快形成决策，并让人和 AI 工具保持对齐的 workflow。

如果你们团队也有这个问题，我想和你对一下实际情况，看看当前 workflow 是否匹配你们的现实。不是销售 pitch，更像一个 20 到 30 分钟的问题访谈。

{time option A} 或 {time option B} 哪个方便？

Best,
{your name}
```

## 模板 2 - 熟人转介绍消息

适用于有共同连接人的情况。

```text
Hi {name},

{mutual contact} 建议我联系你。我在做 SpecTeam，主要解决 PRD、架构文档和 AI 生成 proposal 之间的 spec drift。

我们现在看到一些小型产品工程团队开始对这类 workflow 感兴趣，尤其是那些同时使用多个 AI 工具、又需要更快关掉 decision 的团队。

如果这和你们的情况接近，我想约一个短工作会，看看你们当前流程和这套 workflow 是否匹配。

下周有 20 分钟方便聊吗？
```

## 模板 3 - Inbound 回复模板

适用于对方主动来问 demo 或产品细节时。

```text
感谢联系。

在约时间之前，能不能先发一个最近的真实例子：你们的 PRD、架构文档或 AI 生成 proposal 是怎么互相矛盾的？

最有效的第一次会话，是直接用你们当前 workflow 里的真实案例。如果这个问题当前正在发生，我们可以先跑一个短 discovery，也可以直接进入 guided session。
```

## 模板 4 - Discovery 会议议程

适用于问题还需要先被确认时。

```markdown
# Discovery Call - {team}

## Goal
- 确认 spec divergence 和 decision alignment 的痛点是否足够强，值得形成重复使用。

## Timebox
- 5 分钟：上下文
- 10 分钟：当前流程
- 10 分钟：痛点强度
- 5 分钟：产品匹配度和下一步

## Questions
1. 你们团队最容易在哪类决策上出现混乱？
2. 矛盾通常最先出现在 PRD、架构文档还是 AI 生成 proposal？
3. 当两份 spec 冲突时，你们现在怎么处理？
4. 谁来决定什么是最终版本？
5. 你们怎么知道最终决策真的同步回了源文档？
6. 这个问题在时间、返工或错误决策上有多贵？
7. 如果有一个工具能发现 divergence 并帮助更快关掉 decision，它会放进你们哪一段流程？
8. 要满足什么条件，你们才会重复使用？

## Exit Criteria
- 明确知道这个痛点是不是当前活跃问题
- 拿到一个可用于 guided session 的真实案例
- 确认下一步动作
```

## 模板 5 - 引导式首用议程

适用于已经拿到真实案例之后。

```markdown
# Guided First-Use Session - {team}

## Goal
- 用一条真实 divergence case 到达 first value。

## Inputs Needed
- 两份冲突的 spec、proposal 或文档
- 一条当前值得讨论的 decision
- 一位能判断结果是否有价值的人

## Success Path
1. 准备冲突输入
2. 运行 divergence detection
3. 选一条值得解决的分歧
4. review 并 align 成一个 decision
5. 确认新的 source of truth 现在在哪里

## Observation Checklist
- 团队是否很快理解产品？
- setup friction 是否可接受？
- 参与者是否理解谁 propose、approve、finalize？
- 他们是否信任记录结果？
- 他们是否说出了下一条会继续用的真实 decision？

## Exit Criteria
- 一条 decision 被解决或至少被清晰界定
- 团队能用自己的话复述这套 workflow
- 一周内的 follow-up 真实使用被约定下来
```

## 模板 6 - 团队记录模板

每个团队只保留一份记录，并持续更新。

```markdown
# Design Partner Note - {team}

## Snapshot
- Contact: {name} - {role}
- Team size: {size}
- AI stack: {tools}
- Doc workflow: {where docs live}
- Current status: {cold | qualified | discovery done | first-use done | real reuse | pilot discussion}

## Trigger Example
- {recent divergence case}

## Pain Assessment
- Intensity: {low | medium | high}
- Why: {short reason}

## First-Use Result
- Result: {blocked | partial | successful}
- What worked: {notes}
- What broke: {notes}

## Reuse Signal
- Reuse status: {no | prompted | unprompted}
- Next real use case: {case}

## Premium Pull
- Requested capability: {visibility | approvals | templates | decision history | other}
- Payment signal: {none | weak | medium | strong}
- Budget owner: {name or unknown}

## Next Action
- Owner: {name}
- Date: {date}
- Action: {follow-up task}
```

## 模板 7 - 首次会话后跟进消息

建议在 24 小时内发送。

```text
感谢今天的会话。

我最想确认的是，这套 workflow 是否已经有足够价值，值得你们带进下一条真实 decision。

基于今天的会话，我记录的是：
- What worked: {summary}
- What felt confusing: {summary}
- Next real decision candidate: {summary}

如果可以的话，你们愿不愿意在接下来一周内把它用在 {next decision} 上？如果愿意，我可以把 follow-up 会话压到尽量轻。
```

## 模板 8 - 每周 PMF Checkpoint

适用于每周对所有活跃 design partners 做一次统一复盘。

```markdown
# Weekly PMF Checkpoint - {week}

## Reuse
- Teams that reused the workflow: {list}
- Teams that stalled: {list}

## Friction Patterns
1. {pattern}
2. {pattern}
3. {pattern}

## Premium Pull Patterns
1. {request}
2. {request}

## Metrics Snapshot
- Active design partners: {number}
- Teams with successful first use: {number}
- Teams with real reuse: {number}
- Open to resolved conversion trend: {up | flat | down}
- Resolved to fully-closed trend: {up | flat | down}

## Decision
- Double down on: {one thing}
- Refine: {one thing}
- Stop or defer: {one thing}

## Next Week Focus
- {highest-priority action}
```

## 模板 9 - 轻量付费 Pilot 提案

只有当团队已经表现出真实 workflow pull 时才使用。

```text
我们已经在你们团队的真实 decision 里看到这套 workflow 起作用了，尤其是在 {problem area} 上。

下一步值得测试的是一个聚焦 {visibility | approvals | templates | decision history} 的轻量付费 pilot。

这个 pilot 的目标会是：
1. 进一步缩短 decision 时间
2. 让这套 workflow 更容易在团队里重复发生
3. 验证这一层能力是否足够有价值，值得预算支持

如果你觉得合适，我可以起草一个很小的 pilot scope，包括：
- success criteria
- timeline
- support level
- pilot price
```

## 模板 10 - 每周内部决策备忘录

适用于团队内部，避免功能方向随机漂移。

```markdown
# Weekly Decision Memo - {week}

## What We Learned
1. {learning}
2. {learning}
3. {learning}

## What Changed In Our View
- ICP: {change or no change}
- Messaging: {change or no change}
- Workflow: {change or no change}
- Monetization signal: {change or no change}

## One Change We Will Make
- {single change most likely to improve activation, repetition, or willingness to pay}

## One Change We Will Not Make
- {tempting but unsupported change}
```

## 相关文档

- [Design Partner Playbook](./design-partner-playbook.zh-CN.md)
- [PMF 验证循环](./pmf-loop.zh-CN.md)
- [推广方案](./go-to-market.zh-CN.md)