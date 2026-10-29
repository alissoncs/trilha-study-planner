import { useCallback, useEffect, useState } from 'react'
import type { DiaEstudo, Estado, RevKey } from './types'
import { carregar, estadoInicial, salvar } from './lib/storage'
import { ehDiaDaProva, sincronizarProva } from './lib/prova'
import { addDias, diffDias, hojeISO } from './lib/dates'


export function useStore() {
  const [estado, setEstado] = useState<Estado>(carregar)
  useEffect(() => salvar(estado), [estado])

  const atualizarDia = useCallback((id: string, patch: Partial<DiaEstudo>) => {
    setEstado((e) => ({
      ...e,
      dias: e.dias.map((d) => {
        if (d.id !== id) return d
        const novo = { ...d, ...patch }
        if (patch.status === 'Concluído' && !novo.concluidoEm) novo.concluidoEm = hojeISO()
        if (patch.status && patch.status !== 'Concluído') {
          novo.concluidoEm = undefined
          novo.revisoes = { r7: null, r14: null, r30: null }
          novo.revisar = false
        }
        return novo
      }),
    }))
  }, [])

  const marcarRevisao = useCallback(
    (id: string, chave: RevKey, feito: boolean) =>
      setEstado((e) => ({
        ...e,
        dias: e.dias.map((d) =>
          d.id === id ? { ...d, revisoes: { ...d.revisoes, [chave]: feito ? hojeISO() : null } } : d,
        ),
      })),
    [],
  )

  // Empurra os dias não concluídos e atrasados para frente, sem mexer no dia da prova.
  const reagendarAtrasados = useCallback(() => {
    setEstado((e) => {
      const hoje = hojeISO()
      const pend = e.dias.filter((d) => d.status !== 'Concluído' && !ehDiaDaProva(d))
      if (!pend.length) return e
      const desloc = diffDias(hoje, pend.reduce((m, d) => (d.data < m ? d.data : m), pend[0].data))
      if (desloc <= 0) return e
      const ids = new Set(pend.map((d) => d.id))
      return { ...e, dias: e.dias.map((d) => (ids.has(d.id) ? { ...d, data: addDias(d.data, desloc) } : d)) }
    })
  }, [])

  const configurar = useCallback(
    (patch: Partial<Estado>) =>
      setEstado((e) => ({
        ...e,
        ...patch,
        dias: patch.dataProva ? sincronizarProva(e.dias, patch.dataProva) : e.dias,
      })),
    [],
  )
  const importar = useCallback((e: Estado) => setEstado(e), [])
  const resetar = useCallback(() => setEstado(estadoInicial()), [])

  return { estado, atualizarDia, marcarRevisao, reagendarAtrasados, configurar, importar, resetar }
}
export type Store = ReturnType<typeof useStore>
