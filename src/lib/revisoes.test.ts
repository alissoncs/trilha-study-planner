import { describe, expect, it } from 'vitest'
import type { DiaEstudo } from '../types'
import { agendaSemana, precisaRevisar, prioridade, revisoesDe, revisoesFeitas, revisoesPendentes } from './revisoes'

const dia = (p: Partial<DiaEstudo> = {}): DiaEstudo => ({
  id: 'dia-01', n: 1, data: '2026-10-01', disciplina: 'X', conteudo: '', minPdf: 60, minVideo: 60,
  relevancia: 'Alta', status: 'Concluído', concluidoEm: '2026-10-01',
  revisoes: { r7: null, r14: null, r30: null }, anotacoes: '', acertos: null, ...p,
})
const iv = { r7: 7, r14: 14, r30: 30 }

describe('revisoes', () => {
  it('gera R7/R14/R30 a partir da conclusão', () => {
    expect(revisoesDe(dia(), iv).map((r) => r.vence)).toEqual(['2026-10-08', '2026-10-15', '2026-10-31'])
  })
  it('não gera para dia não concluído', () => {
    expect(revisoesDe(dia({ status: 'Pendente', concluidoEm: undefined }), iv)).toEqual([])
  })
  it('pendentes ignoram feitas e ordenam por vencimento', () => {
    const a = dia({ id: 'a', concluidoEm: '2026-10-05', revisoes: { r7: '2026-10-12', r14: null, r30: null } })
    const b = dia({ id: 'b' })
    const p = revisoesPendentes([a, b], iv)
    expect(p).toHaveLength(5)
    expect(p[0].dia.id).toBe('b')
    expect(p.some((r) => r.dia.id === 'a' && r.chave === 'r7')).toBe(false)
  })
  it('revisoesFeitas ordena da mais recente', () => {
    const d = dia({ revisoes: { r7: '2026-10-08', r14: '2026-10-15', r30: null } })
    expect(revisoesFeitas([d]).map((r) => r.chave)).toEqual(['r14', 'r7'])
  })
  it('prioridade combina relevância e atraso (limitado a 30)', () => {
    expect(prioridade(dia({ relevancia: 'Altíssima' }), 2)).toBe(32)
    expect(prioridade(dia({ relevancia: 'Média' }), 100)).toBe(40)
    expect(prioridade(dia({ relevancia: 'Especial' }), 0)).toBe(0)
  })
  it('precisaRevisar por marca manual ou acertos baixos', () => {
    expect(precisaRevisar(dia({ revisar: true }), 70)).toBe(true)
    expect(precisaRevisar(dia({ acertos: 50 }), 70)).toBe(true)
    expect(precisaRevisar(dia({ acertos: 80 }), 70)).toBe(false)
    expect(precisaRevisar(dia({ acertos: 50, status: 'Pendente' }), 70)).toBe(false)
  })
  it('agendaSemana agrupa por dia e põe as vencidas em hoje', () => {
    const d = dia({ concluidoEm: '2026-10-01' }) // vence 08/10, 15/10, 31/10
    const ag = agendaSemana(revisoesPendentes([d], iv), '2026-10-10', 7)
    expect(ag).toHaveLength(7)
    expect(ag[0].itens.map((r) => r.chave)).toEqual(['r7'])
    expect(ag[5].data).toBe('2026-10-15')
    expect(ag[5].itens.map((r) => r.chave)).toEqual(['r14'])
  })
})
