# SpecTeam 技术架构

> English version: [architecture.md](./architecture.md)

本文档描述支撑当前产品主张所需的架构：
**SpecTeam 让 specs、decisions 和 AI agents 保持对齐。**

它刻意比"AI 协作平台"类架构窄。它描述今天实际存在什么，以及 [roadmap](./roadmap.zh-CN.md)
接下来会加什么。它**不**承诺任何实时、CRDT、服务端或数据库技术栈——这些都属于后续 Gate，
且在当前 PMF 阶段被 PRD 明确列为 Non-Goals。

## 设计原则

1. **Git 就是唯一事实来源。** 协作产出的全部内容（specs、decisions、divergence 状态、
   行动项）都作为纯文件存在 `.spec/` 下，像代码一样做版本、diff、review、merge。
2. **Prompt 负责判断，代码负责确定性。** 解析、状态评分、跃迁守卫属于代码；divergence
   叙述和决策提议留在 prompt。这是 roadmap 中"工具重构"要落地的分工。
3. **每个交互面消费同一份状态。** CLI、VS Code 扩展、未来的服务都必须通过同一个共享
   引擎派生工作区状态，不能各自再用 regex 解析 markdown。
4. **异步优先。** 异步 Git 工作流完整可信之前，不引入任何实时同步或订阅层。
5. **轻交互面。** 分发形态固定为 prompt skills + 轻 CLI + 轻 VS Code 视图。更重的
   交互面要等底层契约稳定之后再做。

## 当前组件

```
┌─────────────────────────────────────────────────────────────────┐
│                        你的 Git 仓库                            │
│                                                                 │
│   .spec/                                                        │
│     ├── THESIS.md          ← North Star + 决策日志              │
│     ├── COLLABORATORS.md   ← 身份映射                           │
│     ├── DIVERGENCES.md     ← 分歧登记 (D-001…)                  │
│     ├── SIGNALS.md         ← 运行态状态与 blocker              │
│     ├── RULES.md           ← 代码规范                           │
│     ├── INDEX.md           ← 自动生成的文档索引                 │
│     ├── decisions/         ← 每个 divergence 的决策记录         │
│     └── design/{code}/     ← 按成员归一化后的 spec             │
└───────────────────────────────┬─────────────────────────────────┘
                                │ 读 / 写
        ┌───────────────────────┼────────────────────────┐
        │                       │                        │
        ▼                       ▼                        ▼
┌────────────────┐   ┌────────────────────┐   ┌────────────────────┐
│  Prompt Skills │   │     SpecTeam CLI   │   │ VS Code 扩展       │
│  (plugin/)     │   │     (cli/)         │   │ (vscode-extension/)│
│                │   │                    │   │                    │
│ 在 Claude Code│   │ `spec install`     │   │ Divergence Review  │
│ / Codex /      │   │ `spec init`        │   │ 侧边栏树           │
│ 其他 LLM 工具 │   │ `spec status`      │   │                    │
│ 的回合中运行   │   │ `spec sos`         │   │ 在集成终端里调起   │
│                │   │                    │   │ `/spec-align`      │
│ 执行 review / │   │ 本地轻量 dashboard,│   │                    │
│ align / parse /│   │ 不承载任何业务逻辑 │   │                    │
│ update…        │   │                    │   │                    │
└────────────────┘   └────────────────────┘   └────────────────────┘
```

### Prompt Skills — 工作流引擎

`plugin/skills/spec-*/SKILL.md` 描述完整协作循环。每个 skill 都是由 AI 工具执行的
确定性 prompt。它们统一强制：

- 通过 `git config spec.member-code` 做 identity guard，
- 通过 `git config spec.main-branch` 做 branch guard，
- 四态分歧生命周期 `open → proposed → resolved → fully-closed`，
- Propose → Approve 两阶段决策规则，
- 源文档只读不变式（只有 `.spec/` 会被写入）。

共享契约见 `plugin/SHARED-CONTEXT.md`，平台差异见 `plugin/CLAUDE.md` /
`plugin/AGENTS.md`。

### CLI (`specteam-cli`) — 零 token 的本地交互面

`cli/bin/spec.js` 是一个不带任何业务逻辑的轻量 Node CLI。它的存在是为了：

- 搭起 `.spec/` 并引导 `/spec-init`（`spec init`），
- 把 skill prompts 安装到 `.claude/commands/`（`spec install`），
- 不消耗 token 地渲染一个本地 DIVERGENCES.md 状态面板（`spec status`），
- 检测 Git 合并冲突并指引 `/spec-sos`（`spec sos`）。

现在的解析逻辑是刻意简单的，后续会随 roadmap 的工具重构迁移到共享状态引擎。

### VS Code 扩展 — 轻量可见性

`vscode-extension/` 在活动栏提供 `SpecTeam` 视图，把 `.spec/DIVERGENCES.md` 渲染
成树，并把 `/spec-align D-xxx` 投递到一个集成终端里运行——解析逻辑不下放到扩展里。

## 状态模型

SpecTeam 关心的一切都可从 `.spec/` 树加本地 Git config 推导出来。正式字段：

| 工件 | 用途 | 写入方 | 读取方 |
|------|------|--------|--------|
| `THESIS.md` | North Star + 决策日志（append-only） | `spec-init`、`spec-align` finalize | 所有 skill、`spec-status` |
| `COLLABORATORS.md` | 成员代号 ↔ 设计目录映射、主分支登记 | `spec-init`、`spec-whoami` | 所有 skill |
| `DIVERGENCES.md` | 带稳定 ID 和生命周期态的 D-NNN 登记 | `spec-review`、`spec-align` | CLI、VS Code、`spec-push`、`spec-status` |
| `SIGNALS.md` | 运行态状态与 blocker | 任意 skill | 所有交互面 |
| `decisions/D-NNN.md` | 每条 divergence 的决策 + 验收标准 | `spec-align` | `spec-update`、`spec-review` |
| `INDEX.md` | 生成的文档索引 | `spec-parse` | 所有交互面 |
| `last-review.json`、`last-sync.json`、`last-parse.json` | 增量执行锚点 | review / update / parse | review / update / parse |

本地（永不提交）的身份信息存在 `git config`：`spec.member-code`、`spec.main-branch`。

## Divergence 生命周期

```
    open 🔴  ──(spec-align propose)──▶  proposed 🟡
                                           │
                       （另一位协作者 approve）
                                           │
                                           ▼
                                      resolved ✅
                                           │
         （spec-update 将所有源端行动项打勾）
                                           │
                                           ▼
                                    fully-closed 🔒
```

规则：

- `propose` 是非破坏性的——只有 approve 后才会写 THESIS。
- 每次 resolve 一定会在 `decisions/` 产出一个带验收标准的决策文件，由 `spec-update`
  后续核验。
- resolved 条目永不删除，它们是审计轨迹。

## 当前不做的事（显式）

以下能力属于后续 roadmap Gate，不应被假设已经存在：

- 独立的 Spec 运行时或服务。
- CLI 与 VS Code 共享的状态引擎——今天双方仍各自轻量 regex 解析。
- MCP connector 目录。`spec-import` 是扩展点，但没有打包任何 connector；这一 skill
  依赖宿主 AI 工具自带的抓取能力。
- 实时同步（CRDT、信令、订阅）。
- Web 仲裁面板。
- RBAC、审计存储、企业部署、私有云打包。

[Roadmap](./roadmap.zh-CN.md) 描述了把它们加进来的依赖顺序；
[PRD](./product-requirements.zh-CN.md) 把它们列为当前 PMF 阶段的显式 Non-Goals。

## 演进路径

近期基础工作按依赖顺序：

1. **协议规范** — 为 `COLLABORATORS`、`THESIS`、`DIVERGENCES`、`decisions/*`、
   `SIGNALS` 出带版本的 JSON Schema，外加 parser 契约和 fixtures。
2. **本地状态引擎** — 用一个库把 `.spec/` 树转成类型化的 workspace snapshot、
   divergence 索引、待审批列表和一致性评分，替换 CLI 和 VS Code 里重复的 regex 通路。
3. **决策工作流状态机** — 把四态跃迁和 Propose → Approve 契约用代码强制。
4. **Spec Server（可选）** — 仅当 (2) 和 (3) 稳定后，把引擎以 MCP/API 方式暴露给
   外部工具和 agent。

超过这四项的内容都必须等当前 wedge 产生 PMF 信号之后再做。

## 相关文档

- [产品需求](./product-requirements.zh-CN.md)
- [Roadmap](./roadmap.zh-CN.md)
- [PMF 验证循环](./pmf-loop.zh-CN.md)
- [基础执行计划](./execution-plan.zh-CN.md)
