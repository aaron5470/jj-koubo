---
name: jj
description: Use Remotion to package real-person recorded videos with bilingual subtitles, highlighted keywords, chapter cards, a top title, animated information cards, optional sound effects, a 1080p review render, and a final 4K render. Use when the user invokes $jj or provides a recorded MP4 and asks for visual packaging.
---

# Media Workflow Packaging

Package a real-person 16:9 talking-head video. Preserve the presenter and spoken content; add information hierarchy around them.

## Dependencies

Require:

- Node.js 20+ and npm
- FFmpeg and ffprobe
- A Chromium browser supported by Remotion
- A transcript, or a local transcription tool such as Whisper

Do not require an API key. Do not upload private media to an external service unless the user explicitly authorizes it.

Resolve bundled scripts and assets relative to the directory containing this `SKILL.md`. Never assume a Codex-, Claude Code-, or vendor-specific installation root.

## Create the project

Inspect the source first:

```bash
ffprobe -v error -show_entries format=duration -show_entries stream=width,height,r_frame_rate -of json <source-video>
```

Create an isolated project with the bundled script:

```bash
node <skill-dir>/scripts/create-project.mjs <source-video> [output-root]
```

The script copies `assets/remotion-template/` into `<output-root>/<project-name>/remotion-edit/` and places the source at `public/source.mp4`. It refuses to overwrite an existing project.

## Build the edit

Edit `remotion-edit/src/data.ts` in this order:

1. Set `VIDEO` title, eyebrow, subtitle, zoom, and grading mode.
2. Split the transcript into 1-3 second `SUBS` entries.
3. Wrap important Chinese words in `**double asterisks**` for yellow highlighting.
4. Add concise English subtitles. Use an empty string only when the user requests Chinese-only output.
5. Divide the story into 3-6 `CHAPTERS` with clear semantic boundaries.
6. Add `CARD_CUES` only where a visual summary improves understanding.
7. Add `SFX_CUES` only when the user supplies licensed sound effects.

Use the built-in card kinds:

- `metric`: one important number and a short note
- `list`: two to four checks or takeaways
- `steps`: a three-to-five-step process
- `comparison`: a compact A/B contrast
- `quote`: one strong conclusion or sentence

Extend `components/Cards.tsx` only when the subject needs a genuinely different visualization.

## Editing standard

- Keep the real presenter as the primary visual subject.
- Use large cards that stay long enough to read; do not flash a card for less than about 1.8 seconds.
- Prefer 8-16 useful cards for a three-minute information-dense video, but let content density decide.
- Keep subtitle movement restrained: short fade and rise, no bouncing keywords.
- Do not add continuous BGM by default.
- Keep SFX below the voice and attach it to chapter or card events, not every subtitle.
- If the source is already beauty-edited or color-graded, set `applyGrade: false` and avoid extra filters.
- If the source is raw, set `applyGrade: true` and inspect the preview before final output.
- Preserve deliberately speed-adjusted source audio and video. Scale all subtitle, chapter, card, and SFX times to the final source timeline.

## Validate

From `remotion-edit/`:

```bash
npm install
npm run typecheck
```

Open Studio when visual inspection is useful:

```bash
npm run studio
```

## Render in two stages

Create a 1080p review file first. The composition is 4K, so `--scale=0.5` outputs 1920×1080:

```bash
npx remotion render Main ../preview-1080p.mp4 --scale=0.5 --crf=23 --concurrency=4 --timeout=120000
```

After the user approves the preview, render the final 4K file:

```bash
npx remotion render Main ../final-4k.mp4 --crf=18 --concurrency=4 --timeout=120000
```

Lower concurrency when memory is limited. Add `--browser-executable=<path>` only when Remotion cannot find or download a compatible browser; never hard-code a user-specific path.

## Verify

Before delivery, verify:

- subtitles match the final audio timeline
- title, chapter, and card text fit within the frame
- cards do not cover the presenter's face
- no unlicensed SFX, music, fonts, logos, or footage were added
- the preview and final output have the expected resolution, frame rate, duration, and audio stream

Report the output paths, resolution, duration, and the files changed. Do not claim the render succeeded until ffprobe confirms the final file.
