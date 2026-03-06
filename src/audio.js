let audioCtx = null

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

// Synthesize a violin-like tone using oscillators + envelope
export function playNote(frequency, duration = 1.2) {
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()

  const now = ctx.currentTime
  const gain = ctx.createGain()
  gain.connect(ctx.destination)

  // Attack-decay-sustain-release envelope
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.4, now + 0.05)   // attack
  gain.gain.linearRampToValueAtTime(0.25, now + 0.2)   // decay
  gain.gain.setValueAtTime(0.25, now + duration - 0.2) // sustain
  gain.gain.linearRampToValueAtTime(0, now + duration)  // release

  // Fundamental + harmonics for a richer string-like tone
  const harmonics = [
    { ratio: 1, amp: 1 },
    { ratio: 2, amp: 0.5 },
    { ratio: 3, amp: 0.3 },
    { ratio: 4, amp: 0.15 },
    { ratio: 5, amp: 0.08 },
  ]

  harmonics.forEach(({ ratio, amp }) => {
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(frequency * ratio, now)
    oscGain.gain.setValueAtTime(amp * 0.3, now)
    osc.connect(oscGain)
    oscGain.connect(gain)
    osc.start(now)
    osc.stop(now + duration)
  })
}
