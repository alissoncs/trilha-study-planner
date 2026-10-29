import type { Cargo, DiaEstudo, Estado, Relevancia, RevKey, Status } from '../types'
import seed from '../data/seed.json'
import { hojeISO } from './dates'
import { sincronizarProva } from './prova'

const KEY = 'trilha:v1'

export const estadoInicial = (): Estado => ({
  version: 2,
  dias: sincronizarProva(structuredClone(seed) as Estado['dias'], '2027-01-31'),
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

type Obj = Record<string, unknown>

const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)
const isStr = (v: unknown): v is string => typeof v === 'string'
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
const isMin = (v: unknown): v is number => isNum(v) && v >= 0

export const isISO = (v: unknown): v is string => {
  if (!isStr(v) || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false
  const [y, m, d] = v.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d
}

const RELEVANCIAS: readonly Relevancia[] = ['Altíssima', 'Alta', 'Média', 'Especial']
const STATUS: readonly Status[] = ['Pendente', 'Em Andamento', 'Concluído']
const isRelevancia = (v: unknown): v is Relevancia => RELEVANCIAS.includes(v as Relevancia)
const isStatus = (v: unknown): v is Status => STATUS.includes(v as Status)

function revisao(d: Obj, k: RevKey): string | null | undefined {
  const v = isObj(d.revisoes) ? d.revisoes[k] : undefined
  if (v === undefined || v === null || v === false) return null
  if (isISO(v)) return v
  if (v === true) return isISO(d.concluidoEm) ? d.concluidoEm : hojeISO()
  return undefined // inválido
}

function normalizarDia(d: unknown): DiaEstudo | null {
  if (!isObj(d)) return null
  if (!isStr(d.id) || !d.id || !isNum(d.n) || !isISO(d.data)) return null
  if (!isStr(d.disciplina) || !isStr(d.conteudo)) return null
  if (!isMin(d.minPdf) || !isMin(d.minVideo)) return null
  if (!isRelevancia(d.relevancia) || !isStatus(d.status)) return null
  if (d.acertos !== null && d.acertos !== undefined && !isNum(d.acertos)) return null
  if (d.anotacoes !== undefined && !isStr(d.anotacoes)) return null
  if (d.concluidoEm !== undefined && d.concluidoEm !== null && !isISO(d.concluidoEm)) return null
  const r7 = revisao(d, 'r7')
  const r14 = revisao(d, 'r14')
  const r30 = revisao(d, 'r30')
  if (r7 === undefined || r14 === undefined || r30 === undefined) return null
  const dia: DiaEstudo = {
    id: d.id,
    n: d.n,
    data: d.data,
    disciplina: d.disciplina,
    conteudo: d.conteudo,
    minPdf: d.minPdf,
    minVideo: d.minVideo,
    relevancia: d.relevancia,
    status: d.status,
    revisoes: { r7, r14, r30 },
    revisar: !!d.revisar,
    anotacoes: d.anotacoes ?? '',
    acertos: d.acertos ?? null,
  }
  if (isISO(d.concluidoEm)) dia.concluidoEm = d.concluidoEm
  return dia
}

const boolMap = (v: unknown): Record<string, boolean> => {
  const out: Record<string, boolean> = {}
  if (isObj(v)) for (const [k, x] of Object.entries(v)) if (x === true) out[k] = true
  return out
}

// Aceita o formato v1 (revisões booleanas) e o v2; devolve null se não for um backup válido.
export function normalizar(e: unknown): Estado | null {
  if (!isObj(e) || !Array.isArray(e.dias) || (e.version !== 1 && e.version !== 2)) return null
  const base = estadoInicial()

  const dias: DiaEstudo[] = []
  for (const d of e.dias) {
    const n = normalizarDia(d)
    if (!n) return null
    dias.push(n)
  }

  let dataProva = base.dataProva
  if (e.dataProva !== undefined) {
    if (!isISO(e.dataProva)) return null
    // 27/12 e 31/12/2026 eram datas erradas da prova (a prova do TRT-4 é em 31/01/2027).
    const errada = e.dataProva === '2026-12-31' || (e.version === 1 && e.dataProva === '2026-12-27')
    dataProva = errada ? base.dataProva : e.dataProva
  }

  const intervalos = { ...base.intervalos }
  if (isObj(e.intervalos)) {
    for (const k of ['r7', 'r14', 'r30'] as const) {
      const v = e.intervalos[k]
      if (isNum(v) && v >= 1) intervalos[k] = Math.round(v)
    }
  }

  const limiteAcertos = isNum(e.limiteAcertos) && e.limiteAcertos >= 0 && e.limiteAcertos <= 100 ? e.limiteAcertos : base.limiteAcertos
  const cargo: Cargo = e.cargo === 'analista' || e.cargo === 'tecnico' ? e.cargo : base.cargo

  return {
    version: 2,
    dias: sincronizarProva(dias, dataProva),
    dataProva,
    intervalos,
    cargo,
    topicosFeitos: boolMap(e.topicosFeitos),
    topicosRevisar: boolMap(e.topicosRevisar),
    limiteAcertos,
  }
}
