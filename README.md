# JJ 口播剪辑 Skill

一个基于 Remotion 的通用 Agent Skill，用来包装真人出镜的横版口播视频。它兼容 Codex、Claude Code，以及能够读取 Agent Skills 格式的其他智能体工具。它把原始口播素材整理为带有双语字幕、章节卡、顶部标题和科技感信息卡的成片，并采用“先 1080p 预览、确认后再渲染 4K”的工作流。

> [!IMPORTANT]
> 本项目源码公开，但**禁止未经授权的商业使用**。它采用 [PolyForm Noncommercial 1.0.0](./LICENSE) 许可，不属于 OSI 定义的开源软件。个人学习、研究、实验和非商业项目可以使用；公司业务、收费服务、商业内容生产和其他营利场景需要另行获得书面授权。

## 能做什么

- 真人口播视频包装，而不是通用时间线剪辑器
- 4K 3840×2160、30fps 横版输出
- 中英双语字幕与关键词高亮
- 章节切换卡、顶部主题栏和进度提示
- 数据、清单、步骤、对比、引用等信息卡
- 可选 SFX 打点，不默认铺设 BGM
- 区分原始素材和已经美颜、调色的素材
- 1080p 预览确认后再渲染 4K 成片

## 不包含什么

- 不包含任何人的视频、照片、声音或口播稿
- 不包含私人音效库、字体文件、API Key 或账号信息
- 不包含语音转写模型；可使用本机 Whisper 或用户提供的稿件
- 不包含 `node_modules`、渲染缓存和成片

## 环境要求

- Codex、Claude Code 或其他能够读取 Agent Skills 格式的智能体
- Node.js 20+ 与 npm
- FFmpeg / ffprobe
- Remotion 支持的 Chromium 浏览器
- 足够的磁盘空间；4K 渲染通常需要数 GB 临时空间

Remotion、React、FFmpeg 和字体各自受其原始许可证约束，详见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。使用 Remotion 前请确认你的使用场景符合其当前许可证。

## 支持的 Agent

[`jj`](./jj) 是唯一的 Skill 核心，采用标准 `SKILL.md` 结构。不同工具只需要把同一个文件夹安装到各自的发现目录：

| 工具 | 用户级目录 | 项目级目录 | 调用方式 |
| --- | --- | --- | --- |
| Codex | `~/.agents/skills/jj` | `.agents/skills/jj` | `$jj` 或自然语言触发 |
| Claude Code | `~/.claude/skills/jj` | `.claude/skills/jj` | `/jj` 或自然语言触发 |
| 其他 Agent Skills 工具 | 该工具声明的 Skills 目录 | 该工具声明的项目 Skills 目录 | 由工具决定 |

`jj/agents/openai.yaml` 只提供 Codex 的界面元数据，Claude Code 和其他工具可以安全忽略它。不同 Agent 的终端、文件和浏览器权限仍由各自产品控制；仅有 `SKILL.md` 不会绕过工具本身的权限限制。

## 一键安装

克隆或下载仓库后，在仓库根目录运行安装脚本。默认安装为用户级 Skill，对所有项目生效。

**Windows PowerShell**

```powershell
# Codex
.\scripts\install.ps1 -Target codex

# Claude Code
.\scripts\install.ps1 -Target claude

# 使用通用 ~/.agents/skills 目录
.\scripts\install.ps1 -Target agents
```

**macOS / Linux**

```bash
# Codex
./scripts/install.sh codex user

# Claude Code
./scripts/install.sh claude user

# 使用通用 ~/.agents/skills 目录
./scripts/install.sh agents user
```

只在一个项目中启用时，使用项目级安装：

```powershell
.\scripts\install.ps1 -Target claude -Scope project -ProjectPath C:\path\to\project
```

```bash
./scripts/install.sh claude project /path/to/project
```

安装器默认拒绝覆盖已有的 `jj`。确认需要升级时，PowerShell 增加 `-Force`，Shell 增加最后一个参数 `--force`。

## 调用

Codex：

```text
用 $jj 剪辑这段真人口播视频，先给我 1080p 预览。
```

Claude Code：

```text
/jj 剪辑这段真人口播视频，先给我 1080p 预览。
```

支持自动发现 Skill 的工具也可以直接说“用 JJ 剪辑这段真人口播视频”。

## 使用方式

最简单的输入是一段口播视频和对应稿件：

```text
用 $jj 处理 ./source.mp4。
口播稿在 ./script.txt，素材已经美颜调色，不要再次调色。
```

Skill 会复制 [`remotion-template`](./jj/assets/remotion-template) 创建独立项目。主要内容集中在 `src/data.ts`：

- `VIDEO`：标题、顶部副标题和画面处理
- `SUBS`：字幕时间轴与关键词高亮
- `CHAPTERS`：章节时间轴
- `CARD_CUES`：信息卡时间轴和内容
- `SFX_CUES`：可选音效时间点

生成项目的底图视频保存在项目自己的 `public/source.mp4`，该路径已被 `.gitignore` 排除。

## 当前边界

- v1 主要针对 16:9 真人横版口播。
- 卡片模板是可复用起点，复杂内容仍需要智能体根据语义定制。
- 4K 渲染速度取决于 CPU、内存、磁盘和视频解码能力。
- 许可证能禁止商用并提供追责依据，但无法从技术上阻止他人违规复制。

## 许可

项目原创代码、Skill 指令与模板采用 [PolyForm Noncommercial License 1.0.0](./LICENSE)。未经书面授权，不得用于商业目的。
