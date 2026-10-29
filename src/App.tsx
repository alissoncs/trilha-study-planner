import { useState } from 'react'
import { BarChart3, CalendarCheck, FileSearch, GraduationCap, ListChecks, RefreshCw, Save, Table2, Timer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useStore } from './store'
import { diffDias, fmtData, hojeISO } from './lib/dates'
import Hoje from './views/Hoje'
import Cronograma from './views/Cronograma'
import Revisoes from './views/Revisoes'
import Progresso from './views/Progresso'
import EditalView from './views/EditalView'
import Provas from './views/Provas'
import Backup from './views/Backup'

const MENU: { id: string; icone: LucideIcon; sub: string }[] = [
  { id: 'Hoje', icone: CalendarCheck, sub: 'O que estudar agora' },
  { id: 'Cronograma', icone: Table2, sub: 'Os 90 dias de estudo' },
  { id: 'Revisões', icone: RefreshCw, sub: 'O que precisa ser revisado' },
  { id: 'Progresso', icone: BarChart3, sub: 'Sua evolução por matéria' },
  { id: 'Edital', icone: ListChecks, sub: 'Checklist do conteúdo programático' },
  { id: 'Provas anteriores', icone: FileSearch, sub: 'Treino com a banca FCC' },
  { id: 'Backup', icone: Save, sub: 'Seus dados e configurações' },
]

export default function App() {
  const store = useStore()
  const [aba, setAba] = useState('Hoje')
  const { estado } = store
  const faltam = Math.max(diffDias(estado.dataProva, hojeISO()), 0)
  const atual = MENU.find((m) => m.id === aba)!

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-in">
          <div className="marca">
            <span className="logo">
              <GraduationCap size={20} />
            </span>
            <div>
              <h1 className="serif">Trilha</h1>
              <span className="sub">TRT-4 · banca FCC</span>
            </div>
          </div>
          <div className="prova-chip" title={`Prova em ${fmtData(estado.dataProva)}`}>
            <Timer size={16} />
            <strong>{faltam}</strong> dias para a prova
          </div>
        </div>
        <nav className="topnav">
          {MENU.map((m) => (
            <button key={m.id} className={m.id === aba ? 'ativa' : ''} onClick={() => setAba(m.id)}>
              <m.icone size={16} />
              {m.id}
            </button>
          ))}
        </nav>
      </header>
      <main>
        <header className="pagina-topo">
          <h2 className="serif">{atual.id}</h2>
          <p>{atual.sub}</p>
        </header>
        {aba === 'Hoje' && <Hoje store={store} />}
        {aba === 'Cronograma' && <Cronograma store={store} />}
        {aba === 'Revisões' && <Revisoes store={store} />}
        {aba === 'Progresso' && <Progresso store={store} />}
        {aba === 'Edital' && <EditalView store={store} />}
        {aba === 'Provas anteriores' && <Provas />}
        {aba === 'Backup' && <Backup store={store} />}
      </main>
    </div>
  )
}
