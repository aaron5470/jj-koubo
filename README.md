# JJ 口播剪辑 Skill

一个基于 Remotion 的 Codex Skill，用来包装真人出镜的横版口播视频。它把原始口播素材整理为带有双语字幕、章节卡、顶部标题和科技感信息卡的成片，并采用“先 1080p 预览、确认后再渲染 4K”的工作流。

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

- Codex 或其他能够读取 `SKILL.md` 的智能体
- Node.js 20+ 与 npm
- FFmpeg / ffprobe
- Remotion 支持的 Chromium 浏览器
- 足够的磁盘空间；4K 渲染通常需要数 GB 临时空间

Remotion、React、FFmpeg 和字体各自受其原始许可证约束，详见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。使用 Remotion 前请确认你的使用场景符合其当前许可证。

## 安装

克隆或下载仓库后，把 [`jj`](./jj) 文件夹复制到 Codex Skills 目录：

**Windows PowerShell**

```powershell
Copy-Item -Recurse -LiteralPath .\jj -Destination "$env:USERPROFILE\.codex\skills\jj"
```

**macOS / Linux**

```bash
cp -R ./jj ~/.codex/skills/jj
```

重新打开 Codex 会话后，可以这样调用：

```text
用 $jj 剪辑这段真人口播视频，先给我 1080p 预览。
```

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

