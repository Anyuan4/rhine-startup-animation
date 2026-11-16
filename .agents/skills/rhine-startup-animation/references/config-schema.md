# Configuration schema (33 items / 7 groups)

All settings live in one `config` object in `splash.js` and persist to a single JSON file (`~/.dsh/dsh-startup.json` in the original; use `<app-config-dir>/startup-animation.json` for a generic app). Most users change only identity and colors. Every item is live-adjustable; "preview" must replay using the **saved** config.

## 1. Playback (6)

| Key | Type | Default | Meaning |
|-----|------|---------|---------|
| `enabled` | boolean | `true` | Master on/off |
| `displayMode` | enum | `session` | `session` (每次会话) / `always` / `daily` |
| `theme` | enum | `light` | `light` (暖白) / `dark` |
| `speed` | number | `1` | 0.35–3× playback multiplier |
| `requireConfirmation` | boolean | `true` | Scenes 1–2 wait for click/Enter |
| `allowSkip` | boolean | `true` | Enable skip button and Esc |

## 2. Identity (3)

| Key | Type | Default | Meaning |
|-----|------|---------|---------|
| `identityName` | string | `OPERATOR` | Shown in scene 2 and welcome line — **replace the source character's name** |
| `identityNumber` | string | `0000` | Serial number on the dossier card |
| `clearanceLevel` | number | `1` | Permission level, 1–5 |

## 3. Voice (9)

| Key | Type | Default | Meaning |
|-----|------|---------|---------|
| `voiceEnabled` | boolean | `true` | Narration master switch |
| `voiceSource` | enum | `tts` | `tts` / `clip` (user-supplied clips only) |
| `voiceName` | string | auto | TTS voice identifier |
| `voiceRate` | number | `0.88` | Speech rate |
| `voicePitch` | number | `0.85` | Speech pitch |
| `voiceVolume` | number | `1` | 0–1 |
| `preSpeechTone` | boolean | `true` | Cue tone before speaking |
| `preSpeechGap` | number | `240` | Tail padding / breathing room in ms |
| `voiceClips` | object | `{}` | Optional per-scene clip URLs with their rights cleared |

## 4. Interface sounds (3)

| Key | Type | Default | Meaning |
|-----|------|---------|---------|
| `soundsEnabled` | boolean | `true` | UI sound master switch |
| `soundVolume` | number | `0.6` | 0–1 |
| `soundSource` | enum | `synth` | `synth` (generated) / `clip` (user-supplied) |

Voice and interface sounds are configured **separately** — changing one must not affect the other.

## 5. Visual (7)

| Key | Type | Default | Meaning |
|-----|------|---------|---------|
| `accentColor` | color | `#ff7500` | Primary accent |
| `glitchColorA` | color | `#ff3b30` | Chromatic aberration layer A |
| `glitchColorB` | color | `#2971b8` | Chromatic aberration layer B |
| `glassOpacity` | number | `0.72` | Liquid-glass overlay opacity |
| `glassBlur` | number | `18` | Frosted-glass blur radius (px) |
| `glassSaturation` | number | `1.2` | Glass saturation |
| `backgroundBlur` | number | `8` | Backdrop blur radius (px) |

Glass values are independent and live-adjustable; setting opacity to 1 / blur to 0 returns to a solid board.

## 6. Copy (4)

| Key | Type | Meaning |
|-----|------|---------|
| `brandLines` | string[3] | Three brand lines shown in scene 1 |
| `curtainLines` | string[3] | Three lines on the black curtain |
| `finalFrame` | string | Welcome frame text in scene 6 (use `{identity}` placeholder) |
| `footer` | string | Footer line |

All copy is user-editable placeholder text. Do not populate with protected lines.

## 7. Advanced (1)

| Key | Type | Meaning |
|-----|------|---------|
| `watchdogMs` | number | 9-second safety timeout — keep enabled |

## Notes

- **Preview uses saved config**: clicking "立即预览" replays the last persisted JSON, not unsaved edits. Save first, then preview.
- **Persistence**: write the whole object to one JSON file; load it before the first scene.
- **Defaults above are the safe fallback** when a key is missing — never fail the whole splash on a bad value.
