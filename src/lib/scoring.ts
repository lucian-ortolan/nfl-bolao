export function winner(home: number, away: number) {
  return home > away ? 'HOME' : 'AWAY'
}

export function distance(ph: number, pa: number, rh: number, ra: number) {
  return Math.abs(ph - rh) + Math.abs(pa - ra)
}
