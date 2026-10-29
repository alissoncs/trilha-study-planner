import { useState } from 'react'
import { useStore } from './store'
import { diffDias, fmtData, hojeISO } from './lib/dates'
import Hoje from './views/Hoje'
import Cronograma from './views/Cronograma'
import Progresso from './views/Progresso'
import EditalView from './views/EditalView'
import Backup from './views/Backup'

const ABAS = ['Hoje', 'Cronograma', 'Progresso', 'Edital', 'Backup'] as const
type Aba = (typeof ABAS)[number]

export default function App() {
  const store = useStore()
  const [aba, setAba] = useState<Aba>('Hoje')
  const { estado } = store
  const faltam = diffDias(estado.dataProva, hojeISO())

  return (
    <div className="app">
      <header className="topo">
        <div>
          <h1>Trilha</h1>
          <span className="sub">TRT-4 2026 · prova em {fmtData(estado.dataProva)}</span>
        </div>
        <div className="contagem" title="Dias até a prova">
          <strong>{Math.max(faltam, 0)}</strong>
          <span>dias</span>
        </div>
      </header>
      <nav className="abas">
        {ABAS.map((a) => (
          <button key={a} className={a === aba ? 'ativa' : ''} onClick={() => setAba(a)}>
            {a}
          </button>
        ))}
      </nav>
      <main>
        {aba === 'Hoje' && <Hoje store={store} />}
        {aba === 'Cronograma' && <Cronograma store={store} />}
        {aba === 'Progresso' && <Progresso store={store} />}
        {aba === 'Edital' && <EditalView store={store} />}
        {aba === 'Backup' && <Backup store={store} />}
      </main>
    </div>
  )
}
