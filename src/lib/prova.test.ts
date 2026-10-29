import { describe, expect, it } from 'vitest'
import { estadoInicial } from './storage'
import { ehDescanso, ehDiaDaProva, sincronizarProva } from './prova'

describe('prova', () => {
  const dias = estadoInicial().dias
  it('identifica o dia da prova e o descanso', () => {
    expect(dias.filter(ehDiaDaProva)).toHaveLength(1)
    expect(dias.filter(ehDescanso)).toHaveLength(1)
  })
  it('sincroniza a prova na data e o descanso na véspera, sem mexer nos outros dias', () => {
    const s = sincronizarProva(dias, '2027-02-07')
    expect(s.find(ehDiaDaProva)!.data).toBe('2027-02-07')
    expect(s.find(ehDescanso)!.data).toBe('2027-02-06')
    expect(s[0]).toEqual(dias[0])
  })
})
