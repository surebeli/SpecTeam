# PhoenixCollab Prompt Plugin

> 纯 Prompt 实现的分布式 AI 团队文档协作插件 — 零代码、零开发、立即可用。

## 什么是 PhoenixCollab？

PhoenixCollab 是 PhoenixTeam 产品的 Demo 阶段实现。它用一个纯自然语言 Prompt 文件（`PHOENIXCOLLAB.md`），让 AI 编码工具（Claude Code、Cursor CLI）直接扮演"协作插件"，实现多人 AI 团队的文档协作管理。

**核心理念**：把"插件"本身定义成一套可复用的 Skill Prompt 集合，AI 在你的编码工具里直接扮演 "PhoenixCollab Agent"。所有操作都通过自然语言指令触发，AI 自动调用 Git、读写文件、解析文档，完全不需要写一行代码。

灵感来源：[yetone/voice-input-src](https://github.com/yetone/voice-input-src) — 仓库只有 Prompt，无任何代码。

## 快速开始

### 1. 准备环境

- Claude Code (Desktop/CLI) 或 Cursor CLI
- 一个 Git 仓库（可以是现有项目或独立文档仓库）

### 2. 复制 Prompt

将 `PHOENIXCOLLAB.md` 放到你的项目根目录。

### 3. 运行

在 Claude Code / Cursor 中输入：

```
你现在是 PhoenixCollab Plugin v1.3，完全遵循 ./PHOENIXCOLLAB.md 中的所有规则。
Skill: init
```

AI 会：
1. 问你的协作者代号（如 `alice`、`bob`）
2. 问你的设计文档所在目录（如 `./docs/design`）
3. 自动规范化文档到 `.phoenix/design/{代号}/`
4. 创建核心文件 + 首次 Git commit
5. 自动执行 parse 生成 INDEX.md

### 4. 日常使用

```
Skill: status    # 查看全局状态、一致性评分
Skill: parse     # 重新解析文档、生成索引
Skill: push      # 推送文档变更（含 diff 检查）
Skill: pull      # 拉取远程变更 + 自动 diff 解读
Skill: suggest   # 基于 diff 的协作建议
Skill: diff      # 查看精确变更（按协作者分组）
Skill: archive   # 归档已冻结的提案
```

## 7 个 Skill 一览

| Skill | 功能 | 参数 |
|-------|------|------|
| `init` | 初始化：问代号 → 问目录 → 规范化 → 建索引 | 无（交互式） |
| `pull` | 拉取 + 自动解析 + diff 摘要 | 无 |
| `push` | 文档专用推送（强制 diff 检查） | 可选 commit message |
| `parse` | 扫描目录、生成 INDEX.md、diff 感知 | 无 |
| `status` | 全局状态概览 + 一致性评分 | 无 |
| `suggest` | 基于 THESIS + diff 的协作建议 | 可选问题 |
| `diff` | 精确 diff 查看（按协作者分组） | `--last` / `--commit=xxx` / `--against=origin/main` |
| `archive` | 提案归档 + 决策冻结 | 提案文件名 |

## .phoenix/ 目录结构

```
.phoenix/
├── COLLABORATORS.md    # 协作者身份映射表
├── THESIS.md           # 项目设计宪法 (North Star)
├── RULES.md            # 代码规范
├── SIGNALS.md          # 运行时状态 & 阻塞项
├── INDEX.md            # 自动生成的文档索引
├── last-parse.json     # parse 对比缓存
├── design/             # 规范化后的设计文档
│   ├── alice/          # 协作者 alice 的文档
│   │   ├── architecture.md
│   │   └── api-design.md
│   ├── bob/            # 协作者 bob 的文档
│   │   └── proposal.md
│   └── shared/         # 共同维护的文档（可选）
└── archive/            # 已冻结的归档提案
    └── 20260408/
```

## 多人协作流程

```
Alice (Claude Code)                    Bob (Cursor CLI)
       │                                     │
  Skill: init                           Skill: init
  代号: alice                            代号: bob
  目录: ./docs/alice-design              目录: ./docs/bob-proposal
       │                                     │
  编辑 .phoenix/design/alice/           编辑 .phoenix/design/bob/
       │                                     │
  Skill: push ──────────► Git ◄──────── Skill: push
       │                                     │
  Skill: pull ◄────── diff 摘要          Skill: pull
  "bob 新增了 GraphQL 提案,                    │
   与 THESIS REST 优先冲突"              Skill: suggest
       │                            "基于 alice 的 diff, 建议..."
  Skill: suggest                              │
  "建议触发 archive + 仲裁"                     │
```

## 设计原则

1. **纯 Prompt，零代码** — 插件即 Prompt，AI 即运行时
2. **Git 原生** — diff/log/status 就是最好的协作感知系统
3. **协作者感知** — 每个操作都知道"我是谁"，每个 diff 都按代号分组
4. **只读源文档** — 从不污染用户原始设计文档
5. **跨工具兼容** — Claude Code、Cursor CLI、任何支持文件操作 + Git 的 AI 工具

## Demo 测试

本仓库已包含示例设计文档 `docs/design/`，可以直接运行 init 测试完整流程。

## License

MIT
