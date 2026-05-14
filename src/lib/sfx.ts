// Lightweight Web Audio sound effects — synthesized, no assets needed.
let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

interface Tone {
  freq: number;
  time: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  sweepTo?: number;
}

function play(tones: Tone[], masterGain = 0.18) {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  const out = ac.createGain();
  out.gain.value = masterGain;
  out.connect(ac.destination);

  tones.forEach((t) => {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = t.type ?? "sine";
    osc.frequency.setValueAtTime(t.freq, now + t.time);
    if (t.sweepTo) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, t.sweepTo),
        now + t.time + t.dur,
      );
    }
    const peak = t.gain ?? 1;
    g.gain.setValueAtTime(0.0001, now + t.time);
    g.gain.exponentialRampToValueAtTime(peak, now + t.time + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + t.time + t.dur);
    osc.connect(g).connect(out);
    osc.start(now + t.time);
    osc.stop(now + t.time + t.dur + 0.02);
  });
}

// White-noise burst via AudioBuffer — used for the whoosh swoosh layer.
function playNoise(
  startOffset: number,
  dur: number,
  gain: number,
  masterGain = 0.14,
  filter: { highpass?: number; lowpass?: number } = {},
) {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  const bufLen = Math.ceil(ac.sampleRate * (dur + 0.05));
  const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

  const src = ac.createBufferSource();
  src.buffer = buf;

  const filters: BiquadFilterNode[] = [];
  if (filter.highpass) {
    const hp = ac.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = filter.highpass;
    filters.push(hp);
  }
  if (filter.lowpass) {
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = filter.lowpass;
    filters.push(lp);
  }

  const env = ac.createGain();
  const now = ac.currentTime + startOffset;
  env.gain.setValueAtTime(gain * 0.45, now);
  env.gain.linearRampToValueAtTime(gain, now + 0.004);
  env.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  const out = ac.createGain();
  out.gain.value = masterGain;
  out.connect(ac.destination);

  const chain = filters.reduce<AudioNode>((node, next) => node.connect(next), src);
  chain.connect(env).connect(out);
  src.start(ac.currentTime + startOffset);
  src.stop(ac.currentTime + startOffset + dur + 0.05);
}

export const sfx = {
  setMuted(v: boolean) { muted = v; },
  prime() { getCtx(); },

  click() {
    play([{ freq: 520, time: 0, dur: 0.06, type: "triangle", gain: 0.5 }], 0.12);
  },

  reveal() {
    play([
      { freq: 440, time: 0, dur: 0.18, type: "sine", gain: 0.6, sweepTo: 680 },
    ], 0.13);
  },

  // Kill hit: crisp whoosh sweep + metallic ping + resonant ring.
  hit() {
    // Softened whoosh layer, kept below the sharp ear-fatiguing range.
    playNoise(0, 0.24, 0.42, 0.08, { highpass: 420, lowpass: 1800 });

    play([
      // Immediate impact transient so the sound lands with the slash frame.
      { freq: 520, time: 0,    dur: 0.035, type: "triangle", gain: 0.35, sweepTo: 260 },
      // Warm downward sweep for the blade impact.
      { freq: 760, time: 0.01, dur: 0.17,  type: "triangle", gain: 0.34, sweepTo: 120 },
      // Short, low ring instead of a piercing ping.
      { freq: 980, time: 0.02, dur: 0.14, type: "sine",     gain: 0.22, sweepTo: 620 },
      // Low resonant body thump.
      { freq: 150, time: 0.04, dur: 0.20, type: "sine",     gain: 0.45, sweepTo: 70 },
    ], 0.09);
  },

  // Damage thud: low bass hit + dissonant buzz to signal pain.
  miss() {
    play([
      // Deep bass thud.
      { freq: 160, time: 0,    dur: 0.24, type: "sine",     gain: 0.55, sweepTo: 70 },
      // Softer dissonant layer without the square-wave edge.
      { freq: 220, time: 0.02, dur: 0.18, type: "triangle", gain: 0.22, sweepTo: 100 },
      // Short low crack.
      { freq: 95,  time: 0.05, dur: 0.16, type: "sine",     gain: 0.28, sweepTo: 50 },
    ], 0.085);
  },

  victory() {
    play([
      { freq: 523,  time: 0.00, dur: 0.22, type: "triangle", gain: 0.7 },
      { freq: 659,  time: 0.18, dur: 0.22, type: "triangle", gain: 0.7 },
      { freq: 784,  time: 0.36, dur: 0.30, type: "triangle", gain: 0.7 },
      { freq: 1046, time: 0.58, dur: 0.55, type: "triangle", gain: 0.85 },
    ], 0.17);
  },

  defeat() {
    play([
      { freq: 392, time: 0.00, dur: 0.32, type: "sine", gain: 0.7, sweepTo: 330 },
      { freq: 330, time: 0.28, dur: 0.36, type: "sine", gain: 0.7, sweepTo: 262 },
      { freq: 196, time: 0.62, dur: 0.75, type: "sine", gain: 0.8, sweepTo: 110 },
    ], 0.15);
  },
};
