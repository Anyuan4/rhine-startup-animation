# Rhine-style startup animation — Skill project

A Lumos Framework–compatible agent skill that generates a cinematic, interactive six-scene startup (splash) animation for web applications.

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

## Copyright

This skill reproduces only the **structure and interaction pattern** of an animated boot sequence. It does **not** include the source film's audio, character identity, or verbatim lines — all copy is placeholder and the default voice is browser TTS. Supply your own assets and ensure you hold the rights before commercial use.

## License

The skill's own code and text are released under MIT. Third-party style/material rights are not included or granted.
