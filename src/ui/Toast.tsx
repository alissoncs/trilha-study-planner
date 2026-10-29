import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'

const Ctx = createContext<(msg: string) => void>(() => {})
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<{ id: number; msg: string }[]>([])
  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random()
    setItens((l) => [...l, { id, msg }])
    setTimeout(() => setItens((l) => l.filter((i) => i.id !== id)), 3200)
  }, [])
  return (
    <Ctx.Provider value={toast}>
      {children}
      <div className="toasts" aria-live="polite">
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
