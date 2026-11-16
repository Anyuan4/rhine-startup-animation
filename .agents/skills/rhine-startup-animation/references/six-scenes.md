# Six-scene sequence reference

The boot animation is a six-scene state machine. Scenes 1–2 are interactive (wait for confirmation); scenes 3–6 run automatically. Each scene has a Chinese primary line and an English monospace subtitle that types out character by character, like a terminal receiving data.

## Scene map

| # | Name | Primary line (placeholder) | English subtitle | Interaction | Visual |
|---|------|---------------------------|------------------|-------------|--------|
| 1 | Brand mark | 需要访问许可 | ACCESS PERMISSION REQUIRED | Wait for click / Enter / Space | Black curtain, brand logo fades in center |
| 2 | Identity card | 身份资料确认 | IDENTITY VERIFICATION | Wait for click / Enter | Technical dossier card; shows name, number, clearance |
| 3 | Receive request | 接收访问需求 | RECEIVING ACCESS REQUEST | Auto | Overexposure wash → warm-white dossier board |
| 4 | Read permission | 开始读取权限 | READING PERMISSIONS | Auto | Log lines scroll at bottom, percentage readout climbs |
| 5 | Verified | 读取完毕·核验通过 | VERIFICATION COMPLETE | Auto | Stage bar advances AUTHORIZATION → VERIFY |
| 6 | Unveil | 欢迎 {identity} 访问 | WELCOME / ACCESS GRANTED | Auto, then dismiss | Chromatic-aberration glitch reveals the app |

Note: the six lines above are generic descriptions, not protected copy. Replace with the user's own wording. Do not reuse the source film's exact lines or identity.

## Scene details

### Scene 1 — Brand mark
- Full black curtain covering the app.
- Brand mark (text or SVG) fades in at center, scale 0.96 → 1.0 over ~400ms.
- Progress hint at bottom: a thin indeterminate bar or percentage.
- Requires explicit confirmation before advancing (configurable via `requireConfirmation`).

### Scene 2 — Identity card
- Dossier card slides/fades in: identity name, serial number, clearance level.
- Card uses corner brackets, scan-line texture, monospace fields.
- Same confirmation gate as scene 1.
- Both confirmation steps exist to make the viewer "complete a procedure" rather than "watch a video".

### Scene 3 — Receive request
- Overexposure wash: white flash that briefly over-saturates, then settles into the warm-white board.
- Warm-white theme: paper-like `#F5F1E8` base with dark text.
- Dark theme: near-black base with light text; layout, text positions, progress bar and reticle are identical — only colors invert.

### Scene 4 — Read permission
- Bottom log area scrolls lines: "等待用户授权…", "正在读取权限…", etc. — all user-editable.
- Percentage readout increments; stage label shows current phase.

### Scene 5 — Verified
- Stage bar completes; a verification tick or color pulse confirms success.
- Brief hold determined by timing rules (see `timing.md`).

### Scene 6 — Unveil
- Chromatic aberration: two offset color layers (config `glitchColorA` / `glitchColorB`, defaults red/blue) split then snap back.
- Center line changes to the welcome message; no spoken voice on this final scene (only a soft chime if sounds enabled).
- Curtain lifts; dispatch `splash:done` and remove the node.

## Persistent elements

- **Reticle**: a slowly rotating ring at center with a gap at the bottom, so it never overlaps the bottom text lines. Rotation is subtle and continuous across all scenes.
- **Stage bar**: labeled `AUTHORIZATION → VERIFY`, reflects progress.
- **Skip control**: a button at top-right; `Esc` also skips. Both are governed by `allowSkip`.

## Interaction rules

1. A confirmation step advances only on click of its button or `Enter`/`Space`.
2. A confirmation step never advances merely because its voice finished — the user must act.
3. Advancing a scene starts the next scene's voice; the scene holds at least until the voice finishes (see `timing.md`).
4. Skip immediately cancels any playing voice and jumps to scene 6 (or dismisses directly, per config).
5. Browser autoplay policy: audio may only start after the first user gesture — so the first confirmation click is what "enables" sound. Plan for silent scene 1 on some browsers.

## Accessibility

- Respect `prefers-reduced-motion`: disable the rotating reticle, glitch and typewriter; show full text at once and shorten holds.
- Confirmation controls must be keyboard-focusable and have visible focus rings.
- Provide `aria-live="polite"` on the log area and `role="status"` on the stage label.
- Ensure text/background contrast meets WCAG AA in both themes.
