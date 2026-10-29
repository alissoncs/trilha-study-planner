import { describe, expect, it } from 'vitest'
import { addDias, diffDias, fmtData, fmtMin } from './dates'

describe('dates', () => {
  it('addDias atravessa mês e ano', () => {
    expect(addDias('2026-12-30', 3)).toBe('2027-01-02')
    expect(addDias('2026-03-01', -1)).toBe('2026-02-28')
  })
  it('diffDias', () => {
    expect(diffDias('2026-10-10', '2026-10-01')).toBe(9)
    expect(diffDias('2026-10-01', '2026-10-10')).toBe(-9)
  })
  it('fmtData e fmtMin', () => {
    expect(fmtData('2027-01-31')).toBe('31/01/2027')
    expect(fmtMin(90)).toBe('01h30m')
    expect(fmtMin(5)).toBe('00h05m')
  })
})
