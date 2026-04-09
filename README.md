# PhoenixTeam

纯 Prompt 实现的分布式 AI 团队文档协作插件 — 零代码、零开发、立即可用。

## 简介

PhoenixTeam 以纯 Prompt Skill 的形式，让 AI 编码工具（Claude Code、Codex CLI）直接扮演"协作插件"，管理多人 AI 团队的设计文档。所有操作通过自然语言指令触发，AI 自动调用 Git、读写文件、解析文档，无需写任何代码。

## 安装

### Claude Code — `.claude/commands/`（推荐）

```bash
git clone https://github.com/surebeli/PhoenixTeam.git /tmp/phoenix-team

# 安装到当前项目
mkdir -p .claude/commands
for skill in /tmp/phoenix-team/plugin/skills/*/SKILL.md; do
  cp "$skill" ".claude/commands/$(basename $(dirname $skill)).md"
done

# 或全局安装（对所有项目生效）
mkdir -p ~/.claude/commands
for skill in /tmp/phoenix-team/plugin/skills/*/SKILL.md; do
  cp "$skill" ~/.claude/commands/$(basename $(dirname $skill)).md
done
```

### Claude Code — `/plugin` marketplace

```bash
/plugin marketplace add surebeli/PhoenixTeam
/plugin install p-team@PhoenixTeam
```

### Codex CLI

```bash
git clone https://github.com/surebeli/PhoenixTeam.git ~/.codex/skills/phoenix-team
```

### 任意 AI 工具 — 独立 Prompt

将 `PHOENIXTEAM.md` 复制到项目根目录，在 AI 工具中输入：

```
你现在是 PhoenixTeam Plugin，完全遵循 ./PHOENIXTEAM.md 中的所有规则。
Skill: init
```

## 使用

```bash
/phoenix-init      # 初始化（首人设定项目目标，后续者确认并加入）
/phoenix-whoami    # 查看/绑定本机身份（换机器或多机登录时使用）
/phoenix-status    # 查看全局状态、分歧面板与一致性评分
/phoenix-pull      # 拉取远程变更 + 自动 diff 解读
/phoenix-push      # 推送文档变更（diff 检查 + 分歧软拦截）
/phoenix-parse     # 重新解析文档、更新索引
/phoenix-suggest   # 获取基于 diff 的协作建议
/phoenix-diff      # 查看精确变更（按协作者分组）
/phoenix-review    # 分歧分析 → 写入 DIVERGENCES.md（带提交锚点）
/phoenix-align     # 分歧收敛（从 DIVERGENCES.md 读取，交互式决策）
/phoenix-archive   # 归档并冻结提案
/phoenix-update    # 源文档变更同步（增量检测 + 分歧影响评估）
```

## Skill 列表

| 命令 | 功能 | 参数 |
|------|------|------|
| `/phoenix-init` | 初始化（首人设目标 → 后续者确认加入） | 交互式 |
| `/phoenix-whoami` | 查看/绑定本机身份（换机器/多机时用） | 交互式 |
| `/phoenix-pull` | 拉取 + 解析 + diff 摘要 | — |
| `/phoenix-push` | 推送（diff 检查 + 未解决分歧软拦截） | 可选 commit message |
| `/phoenix-parse` | 扫描文档、生成 INDEX.md | — |
| `/phoenix-status` | 全局状态 + 分歧面板 + 一致性评分 (0-100) | — |
| `/phoenix-suggest` | 基于 diff 的协作建议 | 可选问题 |
| `/phoenix-diff` | diff 详情（按协作者分组） | `--last` / `--commit=<hash>` / `--against=origin/main` |
| `/phoenix-review` | 分歧分析，结果写入 DIVERGENCES.md（含提交锚点，重复运行只分析有新提交的协作者） | 可选聚焦主题 |
| `/phoenix-align` | 双方确认的分歧收敛：提议者提交方案（proposed），对方确认后才生效（resolved） | `D-001` / 关键词 / `all` |
| `/phoenix-archive` | 提案归档 + 决策冻结（归档前检查分歧引用） | `<代号/文件名>` |
| `/phoenix-update` | 源文档增量同步：哈希比对检测变更，评估分歧影响，触发 parse | `--dry-run` / `--force` |

## 协作流程

```
Alice (Claude Code)                    Bob (Codex CLI)
       │                                     │
 /phoenix-init (founder)              /phoenix-init (join)
 设定项目目标 → THESIS.md             确认目标 → 加入协作
       │                                     │
 编辑 .phoenix/design/alice/          编辑 .phoenix/design/bob/
       │                                     │
 /phoenix-push ──────► Git ◄───────── /phoenix-push
       │                                     │
 /phoenix-pull                        /phoenix-pull
       │                                     │
       └──────── 发现分歧 ────────────────────┘
                    │
            /phoenix-review
            分析文档 vs THESIS → 生成 D-001
            写入 DIVERGENCES.md + 提交锚点
                    │
  ┌─────────────────┴──────────────────┐
  │                                    │
  Alice: /phoenix-align D-001          │
  选择方案 → proposed 🟡               │
  ⚠️ THESIS 暂不更新                   │
  /phoenix-push                        │
  │                                    │
  │                         Bob: /phoenix-pull
  │                         🟡 "D-001 等待您确认"
  │                         Bob: /phoenix-align D-001
  │                         ✅ 同意 → resolved ✅
  │                         生成 decisions/D-001.md
  │                         更新 THESIS Decision Log
  │                         /phoenix-push
  │                                    │
  └────────────────────────────────────┘
                    │
         ╔══════════╧══════════════════════════════════════════╗
         ║  【旁路】决议应用到源文档                            ║
         ║                                                      ║
         ║  decisions/D-001.md 包含各方变更指令块               ║
         ║  （决策背景 / 需要的变更 / 验收标准）                 ║
         ║                                                      ║
         ║  Alice                          Bob                  ║
         ║  读取 decisions/D-001.md        读取 decisions/D-001.md
         ║  传给自己的模型 →               传给自己的模型 →      ║
         ║  模型执行源文档变更             模型执行源文档变更    ║
         ║       │                              │               ║
         ║  /phoenix-update               /phoenix-update       ║
         ║  AI 验证符合验收标准            AI 验证符合验收标准   ║
         ║  ✅ 通过                        ✅ 通过               ║
         ║       │                              │               ║
         ║       └──────── 全部 ✅ ────────────┘               ║
         ║                    │                                 ║
         ║           D-001 fully-closed 🔒                      ║
         ╚══════════╤══════════════════════════════════════════╝
                    │
            /phoenix-push（无 open/proposed，直接推送）
```

## 分歧处理机制

### 四种分歧状态

| 状态 | 含义 | 谁可以操作 |
|------|------|------------|
| `open` 🔴 | 未解决 | 任意一方可以提议 |
| `proposed` 🟡 | 一方已提议，等待对方确认 | 对方确认/拒绝/修改；提议者可撤回 |
| `resolved` ✅ | 双方达成一致，源文档更新中 | 各方运行 update 完成源文档更新 |
| `fully-closed` 🔒 | 源文档已全部按决议更新 | 只读，完全归档 |

### DIVERGENCES.md — 分歧注册表

`review` 写入，`align` 读写，`push`/`status` 读取：

```markdown
## Open

### D-001: API 风格选择
状态: open 🔴 | 涉及方: alice vs bob | 优先级: 阻塞性

## Proposed

### D-002: 部署策略
状态: proposed 🟡 | 提议者: alice | 等待 bob 确认
提议决策: 采用 Kubernetes（bob 方案）| 提议理由: ...

## Resolved

### D-003: 数据模型 ✅
状态: resolved | 提议者: alice | 确认者: bob
决策: 采用 NoSQL | 解决于: 2026-04-09
```

### Propose → Approve 双方确认

`align` 根据分歧状态自动切换行为：

- **分歧为 open** → 展示对比表 + AI 推荐，用户选择后标记为 `proposed`，THESIS **暂不更新**
- **分歧为 proposed，等待我确认** → 展示提议者的方案和理由，可以：
  - ✅ 同意 → `resolved`，AI 为每位协作者生成**变更指令块**（含决策背景、具体操作项、验收标准），写入 DIVERGENCES.md；同时更新 THESIS Decision Log
  - ❌ 拒绝（附理由）→ 恢复为 `open`
  - 🔄 修改后反向提议 → 仍为 `proposed`，但提议者变为自己
- **分歧为 proposed，我是提议者** → 提示等待对方，可选撤回

### review 提交锚点去重

`last-review.json` 记录各协作者上次分析时的 commit hash：

- 有新提交 → 重新分析
- 无新提交 → 跳过
- `resolved` / `proposed` → 不干预

### pull 自动提醒

拉取后检测有等待自己确认的 `proposed` 分歧，主动提醒运行 `align`。

### push 分歧软拦截

推送前区分提示：
- 🟡 有等待我确认的提议 → 建议先确认
- 🔴 有未解决分歧 → 提示并等待确认
- ⏳ 等待对方确认 → 告知推送后对方会收到提醒

## 源文档更新机制

### 问题背景

`init` 只做一次初始复制。如果之后源文档（如 `./design/spec.md`）发生修改，`.phoenix/design/{code}/` 中的副本不会自动更新。

### phoenix-update 解决方案

`update` 通过 `last-sync.json` 记录源文件哈希，每次运行时增量检测变更：

```bash
/phoenix-update           # 检测并同步所有变更
/phoenix-update --dry-run # 预览变更，不实际写入
/phoenix-update --force   # 跳过分歧确认，强制同步
```

### 决议后的源文档更新（Action Items）

`align` 确认通过时，AI 分析双方文档与决策内容，自动生成 Action Items 写入 DIVERGENCES.md：

```markdown
#### 源文档更新待办
| 协作者 | 源文件 | 需要的变更 | 状态 |
|--------|--------|-----------|------|
| alice | ./design/api.md | REST 设计保持不变 | ✅ 无需修改 |
| bob | ./design/api-proposal.md | 将 GraphQL 替换为 REST | ⏳ 待更新 |
```

各方更新源文档后运行 `update`，自动验证是否符合决议：
- ✅ 符合 → Action Item 标记完成
- ⚠️ 不符合 → 给出具体提示（"仍有 GraphQL 描述未删除"）
- 全部完成 → 分歧升级为 `fully-closed` 🔒

### 分歧全链路影响评估

源文档变更时，`update` 自动检查对现有分歧的影响：

| 涉及分歧状态 | 处理方式 |
|-------------|---------|
| `open` | 标注影响，建议同步后重新 review |
| `proposed`（我是提议者） | ⚠️ 警告：提议基于旧文档，建议撤回重新提议 |
| `resolved` | 自动验证变更是否符合 Action Items，更新完成状态 |

### 联动感知

| Skill | 源文档漂移感知 |
|-------|--------------|
| `push` | 推送前检测漂移，软拦截提示 |
| `pull` | 拉取后提示本地源文档有未同步变更 |
| `parse` | INDEX 生成时提示源文档漂移 |
| `review` | 锚点扩展源文件哈希，源文档变化触发重新分析 |

## .phoenix/ 目录结构

插件运行后在目标项目中生成：

```
.phoenix/
├── COLLABORATORS.md    # 协作者身份映射
├── THESIS.md           # 项目设计宪法（North Star）+ Decision Log
├── RULES.md            # 代码规范
├── SIGNALS.md          # 运行时状态与阻塞项
├── INDEX.md            # 自动生成的文档索引
├── DIVERGENCES.md      # 分歧注册表（D-001…状态摘要），review 写入，align/push/status 读取
├── last-parse.json     # parse 缓存（文件哈希）
├── last-review.json    # review 提交锚点（各协作者最后分析的 commit hash + 源文件哈希）
├── last-sync.json      # 源文档同步状态（源文件路径 → 哈希，update 维护）
├── design/
│   ├── alice/          # 协作者 alice 的规范化文档
│   ├── bob/
│   └── shared/         # 共同维护（可选）
├── decisions/          # 分歧决议文件（align 确认时生成，每条分歧一个文件）
│   ├── D-001.md        # 完整决议 + 各方变更指令块（含验收标准），可直接传给模型执行
│   └── D-002.md
└── archive/            # 已冻结的提案
```

## 仓库结构

```
PhoenixTeam/
├── .claude-plugin/
│   ├── marketplace.json          # marketplace 清单
│   └── plugin.json               # Claude Code 插件定义
├── .codex-plugin/plugin.json     # Codex CLI 插件清单
├── plugin/                       # 插件本体
│   ├── skills/                   # 12 个 Skill（两平台共用）
│   │   ├── phoenix-init/         # 初始化（首人设目标）
│   │   ├── phoenix-whoami/       # 身份查看/绑定（多机支持）
│   │   ├── phoenix-pull/         # 拉取 + diff
│   │   ├── phoenix-push/         # 推送（diff 检查 + 分歧拦截 + 源文档漂移）
│   │   ├── phoenix-update/       # 源文档增量同步（哈希检测 + 分歧影响）
│   │   ├── phoenix-parse/        # 文档索引
│   │   ├── phoenix-status/       # 状态概览 + 分歧面板
│   │   ├── phoenix-suggest/      # 协作建议（分歧感知）
│   │   ├── phoenix-diff/         # diff 详情（含分歧状态变更）
│   │   ├── phoenix-review/       # 分歧分析 → DIVERGENCES.md
│   │   ├── phoenix-align/        # 分歧收敛（Propose → Approve）
│   │   ├── phoenix-archive/      # 提案归档（分歧引用检查）
│   ├── CLAUDE.md                 # 共享上下文（Claude Code）
│   └── AGENTS.md                 # 共享上下文（Codex CLI）
├── PHOENIXTEAM.md                # 独立 Prompt 版（手动模式）
└── docs/design/                  # 示例设计文档
```

## License

MIT
