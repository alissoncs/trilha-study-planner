import type { Estado } from '../types'
import seed from '../data/seed.json'

const KEY = 'trilha:v1'

export const estadoInicial = (): Estado => ({
  version: 1,
  dias: structuredClone(seed) as Estado['dias'],
  dataProva: '2026-12-27',
  intervalos: { r7: 7, r14: 14, r30: 30 },
  cargo: 'tecnico',
  topicosFeitos: {},
})

export function carregar(): Estado {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const e = JSON.parse(raw) as Estado
      if (e.version === 1 && Array.isArray(e.dias)) return e
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
