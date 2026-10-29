import { useEffect, useState } from 'react'
import { hojeISO } from './lib/dates'

/** Data ISO de hoje; atualiza quando o dia vira (timer até a meia-noite e ao voltar para a aba). */
export function useHoje(): string {
  const [hoje, setHoje] = useState(hojeISO)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const checar = () => setHoje((h) => { const n = hojeISO(); return n === h ? h : n })
    const agendar = () => {
      const agora = new Date()
      const meiaNoite = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1, 0, 0, 1)
      timer = setTimeout(() => { checar(); agendar() }, meiaNoite.getTime() - agora.getTime())
    }
    agendar()
    const vis = () => { if (document.visibilityState === 'visible') checar() }
    document.addEventListener('visibilitychange', vis)
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', vis) }
  }, [])
  return hoje
}
