# Rhine-style startup animation — Skill project

A Lumos Framework–compatible agent skill that generates a cinematic, interactive six-scene startup (splash) animation for web applications.

> [!WARNING]
> **注意事项 / Important — 非商业项目**
>
> 本项目**基于他人的项目改编**：六幕开机序列的结构、交互模式与时序思路参考自
> [6shenhonghong9/dsh-startup-screen](https://github.com/6shenhonghong9/dsh-startup-screen)
> （原作者 6shenhonghong9，原项目 MIT）。原作视觉风格、台词、人声音频及角色身份
> 属相应权利人所有，原作者明确声明**未授权任何商业用途**。
>
> 本项目**仅限个人学习、研究与非商业使用，禁止用于任何商业场景**。
> 如需商用，须自行移除全部衍生元素并取得相关权利人的授权。详见 [注意事项与版权](#注意事项与版权--copyright--non-commercial)。

## Import

This project follows the Lumos Framework skill layout. To use it:

1. Copy this folder into your project, or merge its two hidden directories into your project root:

```
your-project/
├── .agents/
│   └── skills/
│       └── rhine-startup-animation/     <- canonical skill
└── .claude/
    └── skills/
        └── rhine-startup-animation/     <- alias for Claude Code
```

2. Tell your coding agent what you want, e.g. "给这个项目做个莱茵风格的开机动画" / "customize the startup splash with brand X". The agent auto-selects the skill from its `description`.

3. Verify: ask the agent to list available skills, or run `/skills` in your client.

## What is inside

```
.agents/skills/rhine-startup-animation/
├── SKILL.md                      # trigger + generation workflow
├── references/
│   ├── six-scenes.md             # 6-scene sequence, visuals, interaction
│   ├── timing.md                 # timing formula, voice durations, 9s fallback
│   └── config-schema.md          # 33 settings in 7 groups
└── assets/splash-template/
    ├── index.html                # runnable demo
    ├── styles.css                # light/dark themes, reticle, glitch
    └── splash.js                 # state machine, TTS, watchdog
```

`.claude/skills/rhine-startup-animation/` is a real copy of the same skill so that zip / git / copy operations keep both paths in sync. When editing the skill, update **both** directories.

## Try it directly

Open `assets/splash-template/index.html` in a browser. The sequence plays on load:

- Scenes 1–2 wait for the **确认 / CONFIRM** button or `Enter` / `Space`.
- `Esc` or the top-right **跳过 / SKIP** button skips.
- Theme is set by `config.theme` (`light` / `dark`).
- Open the console and call `StartupAnimation.start()` to replay.
- A 9-second watchdog removes the curtain even if audio or script fails.

## Customize

Edit the `config` object at the top of `splash.js`, or have the agent do it from your description. Key fields: `identityName`, `identityNumber`, `clearanceLevel`, `theme`, `accentColor`, `glitchColorA/B`, `requireConfirmation`, `voiceEnabled`, `speed`.

## 注意事项与版权 / Copyright & non-commercial

- **改编来源**：本项目参考并改编自
  [6shenhonghong9/dsh-startup-screen](https://github.com/6shenhonghong9/dsh-startup-screen)
  的六幕开机序列，包括其结构、交互模式与时序思路。感谢原作者的公开分享。
- **权利归属**：原作的视觉风格、中文台词、人声音频、角色身份（如 JOYCE MOORE）
  及动画作品相关元素归各自权利人所有。**本项目对这些元素不主张任何权利，
  也未获得任何形式的授权或背书。**
- **本项目内容**：仅复刻通用结构与交互模式，**不含**原片台词、人声音频或角色身份；
  文案为可替换占位符，默认语音为浏览器 TTS。
- **使用限制**：本项目**不得用于商业用途**，仅限个人学习、研究与非商业使用。
  任何商业使用须先取得相关权利人的明确授权，并自行替换所有潜在衍生内容。
- **免责**：因使用本项目产生的任何版权纠纷，由使用者自行承担。

## License

本项目原创代码与文本在**非商业**前提下可自由使用、修改与分享（attribution 保留原作者署名）。
MIT 许可**不适用于**任何第三方风格、素材或衍生内容——这些内容的权利不在本仓库授予范围内。
