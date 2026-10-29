import type { DiaEstudo, Estado, RevKey } from '../types'
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
const PESO: Record<string, number> = { Altíssima: 3, Alta: 2, Média: 1, Especial: 0 }
export const prioridade = (d: DiaEstudo, atrasoDias: number) =>
  (PESO[d.relevancia] ?? 0) * 10 + Math.min(atrasoDias, 30)
