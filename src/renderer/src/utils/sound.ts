function playTone(frequency: number, duration: number, volume = 0.25): void {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = frequency
    osc.type = 'sine'
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
    osc.onended = () => ctx.close()
  } catch {
    // AudioContext not available
  }
}

export function playBlockEnd(): void {
  playTone(880, 0.12)
  setTimeout(() => playTone(660, 0.12), 160)
  setTimeout(() => playTone(880, 0.25), 320)
}

export function playSessionComplete(): void {
  playTone(523, 0.15)
  setTimeout(() => playTone(659, 0.15), 200)
  setTimeout(() => playTone(784, 0.15), 400)
  setTimeout(() => playTone(1047, 0.4), 600)
}
