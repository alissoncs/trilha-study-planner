import { describe, expect, it } from 'vitest'
import { estadoInicial, isISO, normalizar } from './storage'

const diaV2 = () => structuredClone(estadoInicial().dias[0]) as unknown as Record<string, unknown>

describe('normalizar', () => {
  it('aceita o estado inicial (v2)', () => {
    const e = estadoInicial()
    const n = normalizar(JSON.parse(JSON.stringify(e)))!
    expect(n.dias).toHaveLength(e.dias.length)
    expect({ ...n, dias: [] }).toEqual({ ...e, dias: [] })
    expect(n.dias[0]).toMatchObject({ id: e.dias[0].id, data: e.dias[0].data, revisar: false })
  })
  it('migra v1 com revisões booleanas e prova antiga', () => {
    const d = diaV2()
    d.status = 'Concluído'
    d.concluidoEm = '2026-10-01'
    d.revisoes = { r7: true, r14: false, r30: false }
    const e = normalizar({ version: 1, dias: [d], dataProva: '2026-12-27' })
    expect(e).not.toBeNull()
    expect(e!.version).toBe(2)
    expect(e!.dataProva).toBe('2027-01-31')
    expect(e!.dias[0].revisoes).toEqual({ r7: '2026-10-01', r14: null, r30: null })
  })
  it('corrige a prova salva como 31/12/2026 e alinha o dia da prova do cronograma', () => {
    const e = estadoInicial()
    const n = normalizar({ ...JSON.parse(JSON.stringify(e)), dataProva: '2026-12-31' })!
    expect(n.dataProva).toBe('2027-01-31')
    const prova = n.dias.find((d) => /DIA DA PROVA/i.test(d.disciplina))!
    expect(prova.data).toBe('2027-01-31')
  })
  it('usa fallback para intervalos e limite inválidos', () => {
    const e = normalizar({ version: 2, dias: [diaV2()], intervalos: { r7: 0, r14: 'x', r30: 20 }, limiteAcertos: 500 })!
    expect(e.intervalos).toEqual({ r7: 7, r14: 14, r30: 20 })
    expect(e.limiteAcertos).toBe(70)
  })
  it.each([
    ['null', null],
    ['versão desconhecida', { version: 3, dias: [] }],
    ['dias não é array', { version: 2, dias: {} }],
    ['dataProva inválida', { version: 2, dias: [], dataProva: '31/01/2027' }],
  ])('rejeita %s', (_n, v) => {
    expect(normalizar(v)).toBeNull()
  })
  it.each([
    ['data inválida', { data: '2026-13-40' }],
    ['relevância desconhecida', { relevancia: 'Baixa' }],
    ['status desconhecido', { status: 'Feito' }],
    ['minPdf negativo', { minPdf: -1 }],
    ['id numérico', { id: 1 }],
    ['acertos string', { acertos: '80' }],
  ])('rejeita dia com %s', (_n, patch) => {
    expect(normalizar({ version: 2, dias: [{ ...diaV2(), ...patch }] })).toBeNull()
  })
})

describe('isISO', () => {
  it('valida datas reais', () => {
    expect(isISO('2026-02-28')).toBe(true)
    expect(isISO('2026-02-30')).toBe(false)
    expect(isISO('')).toBe(false)
  })
})
