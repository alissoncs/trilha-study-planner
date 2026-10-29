import type { DiaEstudo, Estado, Relevancia, RevKey } from '../types'
import { addDias } from './dates'

export const REV_KEYS: RevKey[] = ['r7', 'r14', 'r30']

export interface RevisaoDevida {
  dia: DiaEstudo
  chave: RevKey
  vence: string
}

// Revisões geradas a partir da data de conclusão de cada dia.
export function revisoesDe(dia: DiaEstudo, intervalos: Estado['intervalos']): RevisaoDevida[] {
  if (dia.status !== 'Concluído' || !dia.concluidoEm) return []
  return REV_KEYS.map((chave) => ({ dia, chave, vence: addDias(dia.concluidoEm!, intervalos[chave]) }))
}

export const revisoesPendentes = (dias: DiaEstudo[], intervalos: Estado['intervalos']) =>
  dias
    .flatMap((d) => revisoesDe(d, intervalos))
    .filter((r) => !r.dia.revisoes[r.chave])
    .sort((a, b) => a.vence.localeCompare(b.vence))

// Peso de prioridade: relevância + quantos dias de atraso.
const PESO: Record<Relevancia, number> = { Altíssima: 3, Alta: 2, Média: 1, Especial: 0 }
export const prioridade = (d: DiaEstudo, atrasoDias: number) =>
  PESO[d.relevancia] * 10 + Math.min(atrasoDias, 30)

export const revisoesFeitas = (dias: DiaEstudo[]) =>
  dias
    .flatMap((d) => REV_KEYS.filter((k) => d.revisoes[k]).map((chave) => ({ dia: d, chave, feitaEm: d.revisoes[chave]! })))
    .sort((a, b) => b.feitaEm.localeCompare(a.feitaEm))

// Marcado à mão ou com % de acertos abaixo do limite.
export const precisaRevisar = (d: DiaEstudo, limite: number) =>
  d.status === 'Concluído' && (!!d.revisar || (d.acertos !== null && d.acertos < limite))

// Revisões por dia, de hoje até hoje+dias-1. A célula de hoje inclui as vencidas (o que precisa ser feito agora).
export function agendaSemana(pendentes: RevisaoDevida[], hoje: string, dias = 7) {
  return Array.from({ length: dias }, (_, i) => {
    const data = addDias(hoje, i)
    return { data, itens: pendentes.filter((r) => (i === 0 ? r.vence <= data : r.vence === data)) }
  })
}
