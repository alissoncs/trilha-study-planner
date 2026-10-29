import type { ReactNode } from 'react'

export function Stat({ icone, valor, rotulo, tom }: { icone: ReactNode; valor: ReactNode; rotulo: string; tom: string }) {
  return (
    <div className={`stat tom-${tom}`}>
      <span className="stat-icone">{icone}</span>
      <div>
        <strong>{valor}</strong>
        <span>{rotulo}</span>
      </div>
    </div>
  )
}
