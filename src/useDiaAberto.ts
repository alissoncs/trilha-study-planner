import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

const PARAM = 'dia'

/** O dia aberto no modal fica na URL (`?dia=<id>`), o que permite link direto e o botão voltar fechar o modal. */
export function useDiaAberto() {
  const [params, setParams] = useSearchParams()
  const id = params.get(PARAM)

  const abrir = useCallback(
    (novo: string) =>
      setParams((p) => {
        const q = new URLSearchParams(p)
        q.set(PARAM, novo)
        return q
      }),
    [setParams],
  )

  const fechar = useCallback(
    () =>
      setParams((p) => {
        const q = new URLSearchParams(p)
        q.delete(PARAM)
        return q
      }, { replace: true }),
    [setParams],
  )

  return { id, abrir, fechar }
}
