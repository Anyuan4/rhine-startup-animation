/* Rhine-style startup animation — reference implementation.
 * No external dependencies. All copy is placeholder; supply your own. */
(function () {
  "use strict";

  // ---- Configuration (edit here, or load config.json) --------------------
  const config = {
    // playback
    enabled: true,
    displayMode: "session",       // session | always | daily
    theme: "light",               // light | dark
    speed: 1,                     // 0.35 - 3
    requireConfirmation: true,
    allowSkip: true,
    // identity
    identityName: "OPERATOR",
    identityNumber: "0000",
    clearanceLevel: 1,
    // voice
    voiceEnabled: true,
    voiceSource: "tts",           // tts | clip
    voiceName: "",
    voiceRate: 0.88,
    voicePitch: 0.85,
    voiceVolume: 1,
    preSpeechTone: true,
    preSpeechGap: 240,            // ms
    voiceClips: {},               // { sceneIndex: url } — user-supplied, rights cleared
    // interface sounds
    soundsEnabled: true,
    soundVolume: 0.6,
    soundSource: "synth",         // synth | clip
    // visual
    accentColor: "#ff7500",
    glitchColorA: "#ff3b30",
    glitchColorB: "#2971b8",
    glassOpacity: 0.12,
    glassBlur: 18,
    glassSaturation: 1.2,
    backgroundBlur: 8,
    // copy — placeholder text only
    brandLines: ["YOUR BRAND", "ACCESS SYSTEM", "v1.0"],
    curtainLines: ["SYSTEM BOOT", "INITIALIZING", "PLEASE WAIT"],
    finalFrame: "欢迎 {identity} 访问",
    footer: "SECURE TERMINAL",
    // advanced
    watchdogMs: 9000
  };

  // Six scenes. Lines are generic descriptions, not protected copy.
  const SCENES = [
    { cn: "需要访问许可",       en: "ACCESS PERMISSION REQUIRED", visual: 1200, voice: 1.96, confirm: true  },
    { cn: "身份资料确认",       en: "IDENTITY VERIFICATION",      visual: 1400, voice: 1.16, confirm: true, card: true },
    { cn: "接收访问需求",       en: "RECEIVING ACCESS REQUEST",   visual: 1000, voice: 1.07 },
    { cn: "开始读取权限",       en: "READING PERMISSIONS",        visual: 1200, voice: 1.18, log: "正在读取权限…" },
    { cn: "读取完毕·核验通过",  en: "VERIFICATION COMPLETE",      visual: 1300, voice: 1.70, log: "核验通过" },
    { cn: "",                   en: "ACCESS GRANTED",             visual: 1600, voice: 0,    final: true }
  ];

  const REF_TABLE = SCENES.map(s => s.voice); // seconds
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- DOM ---------------------------------------------------------------
  const splash = document.getElementById("splash");
  const elPrimary = document.getElementById("primary");
  const elSubtitle = document.getElementById("subtitle");
  const elIndex = document.getElementById("scene-index");
  const elCard = document.getElementById("idcard");
  const elConfirm = document.getElementById("splash-confirm");
  const elSkip = document.getElementById("splash-skip");
  const elLog = document.getElementById("log");
  const elBar = document.getElementById("bar-fill");
  const elPct = document.getElementById("pct");
  const elStage = document.getElementById("stage-label");
  const app = document.getElementById("app");

  if (!splash) return;
  if (!config.enabled) { bootDone(true); return; }

  let watchdog = null;
  let currentVoice = null;
  let aborted = false;

  // ---- Setup theme & tokens ---------------------------------------------
  function applyConfig() {
    splash.dataset.theme = config.theme;
    const s = splash.style;
    s.setProperty("--accent", config.accentColor);
    s.setProperty("--glitch-a", config.glitchColorA);
    s.setProperty("--glitch-b", config.glitchColorB);
    s.setProperty("--glass-opacity", config.glassOpacity);
    s.setProperty("--glass-blur", config.glassBlur + "px");
    s.setProperty("--glass-sat", config.glassSaturation);
    document.querySelectorAll("[data-bind]").forEach(n => {
      const k = n.getAttribute("data-bind");
      n.textContent = config[k];
    });
    if (reduceMotion) { config.requireConfirmation = config.requireConfirmation && true; }
  }

  // ---- Voice -------------------------------------------------------------
  function stopVoice() {
    if (currentVoice) {
      try { speechSynthesis.cancel(); } catch (_) {}
      currentVoice = null;
    }
  }

  function speak(text, index) {
    if (!config.voiceEnabled) return Promise.resolve(0);
    // Optional user-supplied clip with cleared rights.
    const clip = config.voiceClips[index];
    if (clip && config.voiceSource === "clip") {
      return new Promise(resolve => {
        const a = new Audio(clip);
        a.volume = config.voiceVolume;
        currentVoice = a;
        a.onended = () => { currentVoice = null; resolve(a.duration * 1000); };
        a.onerror = () => { currentVoice = null; resolve(REF_TABLE[index] * 1000); }; // fallback
        const p = a.play();
        if (p && p.catch) p.catch(() => { currentVoice = null; resolve(REF_TABLE[index] * 1000); });
      });
    }
    // Browser TTS fallback.
    if ("speechSynthesis" in window) {
      return new Promise(resolve => {
        stopVoice();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = config.voiceRate;
        u.pitch = config.voicePitch;
        u.volume = config.voiceVolume;
        if (config.voiceName) {
          const v = speechSynthesis.getVoices().find(x => x.name === config.voiceName);
          if (v) u.voice = v;
        }
        u.onend = () => { currentVoice = null; resolve(estimateTts(text)); };
        u.onerror = () => { currentVoice = null; resolve(REF_TABLE[index] * 1000); };
        currentVoice = u;
        speechSynthesis.speak(u);
      });
    }
    return Promise.resolve(REF_TABLE[index] * 1000);
  }

  function estimateTts(text) {
    // Rough estimate from characters and rate; visual baseline still floors it.
    const perChar = 220 / config.voiceRate;
    return text.length * perChar;
  }

  function chime() {
    if (!config.soundsEnabled || config.soundSource !== "synth") return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [523.25, 659.25, 783.99].forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = f; o.type = "sine";
        g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
        g.gain.linearRampToValueAtTime(config.soundVolume * 0.15, ctx.currentTime + i * 0.12 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 0.5);
        o.connect(g).connect(ctx.destination);
        o.start(ctx.currentTime + i * 0.12);
        o.stop(ctx.currentTime + i * 0.12 + 0.55);
      });
    } catch (_) {}
  }

  // ---- Typewriter --------------------------------------------------------
  function typeText(node, text) {
    return new Promise(resolve => {
      if (reduceMotion) { node.textContent = text; resolve(); return; }
      node.textContent = "";
      const interval = 42 / config.speed;
      let i = 0;
      const timer = setInterval(() => {
        if (aborted) { clearInterval(timer); resolve(); return; }
        node.textContent = text.slice(0, ++i);
        if (i >= text.length) { clearInterval(timer); resolve(); }
      }, interval);
    });
  }

  // ---- Scene runner ------------------------------------------------------
  function waitForConfirm() {
    if (!config.requireConfirmation || reduceMotion) return Promise.resolve();
    elConfirm.hidden = false;
    elConfirm.focus();
    return new Promise(resolve => {
      const done = () => {
        elConfirm.hidden = true;
        elConfirm.removeEventListener("click", done);
        window.removeEventListener("keydown", onKey);
        resolve();
      };
      const onKey = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); done(); } };
      elConfirm.addEventListener("click", done);
      window.addEventListener("keydown", onKey);
    });
  }

  async function runScene(index) {
    const s = SCENES[index];
    elIndex.textContent = String(index + 1).padStart(2, "0") + " / 06";
    elCard.hidden = !s.card;
    if (s.log) elLog.textContent = s.log;
    elBar.style.width = Math.round((index / SCENES.length) * 100) + "%";
    elPct.textContent = Math.round((index / SCENES.length) * 100) + "%";
    elStage.textContent = index < 4 ? "AUTHORIZATION" : "VERIFY";

    const cn = s.final ? config.finalFrame.replace("{identity}", config.identityName) : s.cn;
    await typeText(elPrimary, cn);
    await typeText(elSubtitle, s.en);

    // Confirmation gate (scenes 1-2) runs BEFORE the timed hold.
    if (s.confirm) await waitForConfirm();
    if (aborted) return;

    // Timing: hold = max(visual baseline, audio duration + tail padding).
    const visualBaseline = reduceMotion ? 200 : s.visual / config.speed;
    const spoken = await speak(s.final ? "" : cn, index);
    if (aborted) return;
    const hold = Math.max(visualBaseline, spoken + config.preSpeechGap);
    await delay(hold);
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, reduceMotion ? Math.min(ms, 250) : ms));
  }

  async function play() {
    applyConfig();
    watchdog = setTimeout(onWatchdog, config.watchdogMs);
    for (let i = 0; i < SCENES.length; i++) {
      if (aborted) return;
      await runScene(i);
    }
    if (aborted) return;
    // Final unveil: chromatic glitch + chime, then dismiss.
    splash.classList.add("glitch");
    chime();
    await delay(reduceMotion ? 100 : 420);
    finish(false);
  }

  function onWatchdog() {
    // Curtain still attached after timeout → remove unconditionally.
    if (!aborted && splash.isConnected) {
      aborted = true;
      finish(true);
    }
  }

  function finish(failed) {
    clearTimeout(watchdog);
    stopVoice();
    aborted = true;
    splash.classList.add("hide");
    setTimeout(() => {
      if (splash.parentNode) splash.parentNode.removeChild(splash);
      bootDone(failed);
    }, reduceMotion ? 0 : 300);
  }

  function bootDone(failed) {
    if (app) app.hidden = false;
    document.dispatchEvent(new CustomEvent(failed ? "splash:failed" : "splash:done"));
  }

  // ---- Skip --------------------------------------------------------------
  function skip() {
    if (!config.allowSkip || aborted) return;
    aborted = true;
    finish(false);
  }
  elSkip.addEventListener("click", skip);
  window.addEventListener("keydown", e => { if (e.key === "Escape") skip(); });

  // ---- Public API --------------------------------------------------------
  window.StartupAnimation = {
    start: play,
    stop: skip,
    config: config
  };

  // Auto-start on load; call StartupAnimation.start() manually to replay.
  window.addEventListener("DOMContentLoaded", () => { if (config.enabled) play(); });
})();
