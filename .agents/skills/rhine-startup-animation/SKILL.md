---
name: rhine-startup-animation
description: This skill should be used when users ask to create, customize, or integrate a cinematic "startup / splash / boot" animation for an application — specifically the six-scene, interactive, dual-theme "access authorization" sequence inspired by the Rhine Lab "Access" sequence (厂牌标识 → 过曝洗白 → 暖白档案底板 → 五步访问授权 → 色散揭幕). Trigger on requests such as "做个启动动画", "开机动画", "splash screen", "启动过场", "访问授权动画", "Rhine/莱茵风格启动页", or when adapting the bundled splash template to a specific project. Produces runnable HTML/CSS/JS with configurable identity, timing, voice and theme.
agent_created: true
---

# Rhine-style startup animation

## Purpose

Generate a self-contained, runnable startup (splash) animation that plays once on application cold start. The animation is an interactive "access authorization" sequence: it does not merely play a film — it asks the user to confirm the first two steps, then advances through scripted scenes with timing derived from audio length. The output is standard HTML/CSS/JS that can be embedded into any web application or rendered as a standalone page.

## When to use

- Creating a startup / splash / boot animation for a web app.
- Reproducing or adapting the six-scene "access authorization" boot sequence.
- Customizing the bundled template: identity name/number, clearance level, brand copy, colors, timing, voice, theme (light / dark).
- Integrating a startup animation into an existing project's entry point.

## Copyright boundary (mandatory)

The source visual style, original Chinese lines, the "JOYCE MOORE" identity and any third-party voice clips belong to their respective rights holders and are NOT licensed for commercial use. This skill therefore:

- Uses **placeholder copy** and a **neutral default identity**; never embed the original film's lines, character identity, or audio files.
- Uses **browser SpeechSynthesis (TTS)** as the default voice source; voice clips are optional and must be supplied by the user with their own rights.
- Reproduces only the *structure and interaction pattern*, not protected expression.

When a user asks for the original lines / identity / audio, explain the boundary and offer editable placeholders instead. Do not silently include protected material.

## Generation workflow

1. Collect requirements: application name, identity name/number, clearance level, theme preference, whether the two confirmation steps are required, whether sound is enabled, and target project framework. If values are missing, use the defaults in `references/config-schema.md` and state the assumption.
2. Read `references/six-scenes.md` for the exact scene order, visuals, copy slots and interaction rules.
3. Read `references/timing.md` for the timing algorithm, the voice-duration table and the 9-second safety fallback. Do not hard-code per-scene durations.
4. Read `references/config-schema.md` for the full configuration object, defaults and grouping.
5. Copy the template from `assets/splash-template/` into the target project. Edit `config` inside `splash.js` with the collected values; adjust `index.html` / `styles.css` only for brand text and color tokens.
6. Wire the animation to the host application: call `startSplash()` on cold start and hide the app until the `splash:done` event fires. Always keep the 9-second self-removal fallback.
7. Verify by opening the page: confirm both themes render, the first two steps require click/Enter, Esc skips, text types out, the reticle rotates, and the splash removes itself even if audio fails.

## Resource map

- `references/six-scenes.md` — scene sequence, visuals, copy slots, interaction rules, accessibility.
- `references/timing.md` — timing formula, voice duration table, 9-second fallback, skip semantics.
- `references/config-schema.md` — 33 configuration items in 7 groups, defaults, JSON persistence.
- `assets/splash-template/` — runnable reference implementation: `index.html`, `styles.css`, `splash.js`.

## Output contract

Deliver a folder containing `index.html`, `styles.css`, `splash.js` and an optional `config.json`, plus a short note listing which values were customized and how to trigger/integrate the splash. Prefer self-contained files with no build step and no external runtime dependencies beyond the browser.

## Constraints

- Never use the original film's audio, character identity, or verbatim lines.
- Never remove the 9-second safety fallback — a stuck black screen is worse than no animation.
- Respect `prefers-reduced-motion`: skip transitions and shorten the sequence when requested.
- Keep text and the rotating reticle from overlapping; the reticle gap stays at the bottom.
- Do not require a network connection at runtime (all assets local or browser-generated).
