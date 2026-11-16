# Timing reference

The defining behavior of this animation: **scene duration is derived from audio length, not hard-coded seconds**.Fast clicking never cuts a line off mid-sentence.

## Core formula

```
sceneHold = max(visualBaseline, audioDuration + tailPadding)
```

- `visualBaseline` — minimum on-screen time for the scene's visual beat (milliseconds).
- `audioDuration` — actual length of that scene's voice clip, measured at runtime when available.
- `tailPadding` — silence after the line ends before advancing; default **240 ms** ("开口前的留白" / breathing room).

A scene advances only after `sceneHold` elapses. Pressing Enter repeatedly cannot shorten it. Only **Skip** and the final **Unveil** may cut a voice short.

## Voice duration table

Default durations if no clip is supplied (seconds). These are reference baselines for TTS pacing, not protected audio:

| Scene | Clip | Reference duration |
|-------|------|--------------------|
| 1 | access permission line | 1.96 |
| 2 | identity verification line | 1.16 |
| 3 | receiving request line | 1.07 |
| 4 | reading permissions line | 1.18 |
| 5 | verification complete line | 1.70 |
| 6 | welcome line | none — visual only + soft chime |

Final scene uses **no narration**; spoken names tend to sound forced. Use a soft three-tone chime instead if `interfaceSounds` is enabled.

## Measuring actual audio length

Prefer measuring the real clip:

```js
const audio = new Audio(url);
audio.onloadedmetadata = () => {
  const audioDuration = audio.duration * 1000; // ms
  const hold = Math.max(visualBaseline, audioDuration + tailPadding);
};
```

When using browser `SpeechSynthesis`, estimate from `utterance.text` length and `rate`, or use the reference table. TTS cannot report exact duration reliably, so the visual baseline becomes the floor.

## Tail padding

- Default 240 ms.
- Too short → the scene feels rushed; too long → feels stuck.
- Exposed as `preSpeechGap` / tail padding in config so it can be tuned live.

## Voice fallback

- If a clip is missing, fails to load, or fails to decode → fall back to `speechSynthesis` with the configured `voiceName`, `rate` and `pitch`.
- If TTS is unavailable → fall back to the reference duration table so timing still works.
- The startup screen must never stall because of a single missing audio file.

## 9-second safety fallback (mandatory)

A watchdog timer injected at boot:

```js
setTimeout(() => {
  if (curtainNodeStillAttached()) {
    removeCurtain();
    markFailureFlag();
    dispatch('splash:failed');
  }
}, 9000);
```

- If the black curtain is still in the DOM after 9 seconds, remove it unconditionally.
- Covers the case where the splash script is blocked (404), throws a syntax error, or otherwise never completes.
- A stuck black screen is the worst failure mode — this fallback matters more than any config option.
- Scale the timeout with the `speed` multiplier only if the user explicitly wants faster failure recovery; keep 9s as the default.

## Speed multiplier

- `speed` ranges 0.35×–3×; it scales visual baselines and typewriter rate.
- It must not cut a voice clip mid-sentence: scale the visual baseline, then still apply `max(..., audioDuration + tailPadding)`.

## Skip semantics

- `Skip` (button or Esc) cancels active voice and jumps to a quick unveil.
- When `allowSkip` is false, ignore skip requests.
- Skip should still fire `splash:done` so the host app is never left waiting.
