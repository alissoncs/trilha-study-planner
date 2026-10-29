import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useStore } from './store'
import type { Store } from './store'

const StoreCtx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useStore()
  return <StoreCtx.Provider value={store}>{children}</StoreCtx.Provider>
}

export function useEstudos(): Store {
  const store = useContext(StoreCtx)
  if (!store) throw new Error('useEstudos deve ser usado dentro de <StoreProvider>')
  return store
}
