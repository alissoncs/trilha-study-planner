import type { Estado } from '../types'
import seed from '../data/seed.json'
import { hojeISO } from './dates'

const KEY = 'trilha:v1'

export const estadoInicial = (): Estado => ({
  version: 2,
  dias: structuredClone(seed) as Estado['dias'],
  dataProva: '2027-01-31',
  intervalos: { r7: 7, r14: 14, r30: 30 },
  cargo: 'tecnico',
  topicosFeitos: {},
  topicosRevisar: {},
  limiteAcertos: 70,
})

export function carregar(): Estado {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const e = normalizar(JSON.parse(raw))
      if (e) return e
    }
  } catch {
    /* localStorage indisponível ou corrompido: começa do seed */
  }
  return estadoInicial()
}

export function salvar(e: Estado) {
  try {
    localStorage.setItem(KEY, JSON.stringify(e))
  } catch {
    /* sem persistência (modo privado, cota cheia) */
  }
}

const rev = (d: any, k: string): string | null => {
  const v = d.revisoes?.[k]
  return typeof v === 'string' ? v : v === true ? (d.concluidoEm ?? hojeISO()) : null
}

// Aceita o formato v1 (revisões booleanas) e o v2; devolve null se não for um backup válido.
export function normalizar(e: any): Estado | null {
  if (!e || !Array.isArray(e.dias) || (e.version !== 1 && e.version !== 2)) return null
  const base = estadoInicial()
  return {
    ...base,
    ...e,
    version: 2,
    dataProva: e.version === 1 && e.dataProva === '2026-12-27' ? base.dataProva : e.dataProva ?? base.dataProva,
    dias: e.dias.map((d: any) => ({
      ...d,
      revisar: !!d.revisar,
      revisoes: { r7: rev(d, 'r7'), r14: rev(d, 'r14'), r30: rev(d, 'r30') },
    })),
    topicosRevisar: e.topicosRevisar ?? {},
  }
}
