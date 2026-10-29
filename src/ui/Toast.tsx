import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'

const Ctx = createContext<(msg: string) => void>(() => {})
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<{ id: number; msg: string }[]>([])
  const proximo = useRef(0)
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>())
  useEffect(() => {
    const t = timers.current
    return () => {
      t.forEach(clearTimeout)
      t.clear()
    }
  }, [])
  const toast = useCallback((msg: string) => {
    const id = ++proximo.current
    setItens((l) => [...l, { id, msg }])
    const t = setTimeout(() => {
      timers.current.delete(t)
      setItens((l) => l.filter((i) => i.id !== id))
    }, 3200)
    timers.current.add(t)
  }, [])
  return (
    <Ctx.Provider value={toast}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {itens.map((i) => (
          <div key={i.id} className="toast">
            <CheckCircle2 size={18} />
            {i.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
