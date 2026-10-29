import type { DiaEstudo } from '../types'
import { addDias } from './dates'
import { grupoDe } from './grupos'

const especial = (d: DiaEstudo, re: RegExp) =>
  d.relevancia === 'Especial' && grupoDe(d.disciplina) === 'Prova e Descanso' && re.test(d.disciplina)

export const ehDiaDaProva = (d: DiaEstudo) => especial(d, /prova/i)
export const ehDescanso = (d: DiaEstudo) => especial(d, /descanso/i)

/** Mantém o "dia da prova" do cronograma na data da prova, e o descanso na véspera. */
export const sincronizarProva = (dias: DiaEstudo[], dataProva: string): DiaEstudo[] =>
  dias.map((d) =>
    ehDiaDaProva(d) ? { ...d, data: dataProva } : ehDescanso(d) ? { ...d, data: addDias(dataProva, -1) } : d,
  )
