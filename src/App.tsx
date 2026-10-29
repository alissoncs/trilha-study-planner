import { useState } from 'react'
import { BarChart3, CalendarCheck, FileSearch, GraduationCap, ListChecks, RefreshCw, Save, Table2 } from 'lucide-react'
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

const dataCurta = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/\./g, '')
}

export default function App() {
  const store = useStore()
  const [aba, setAba] = useState('Hoje')
  const { estado } = store
  const faltam = Math.max(diffDias(estado.dataProva, hojeISO()), 0)
  const atual = MENU.find((m) => m.id === aba)!
  const total = estado.dias.reduce((t, d) => t + d.minPdf + d.minVideo, 0)
  const feito = estado.dias.filter((d) => d.status === 'Concluído').reduce((t, d) => t + d.minPdf + d.minVideo, 0)
  const progresso = total ? Math.round((feito / total) * 100) : 0

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-in">
          <div className="marca">
            <span className="logo">
              <GraduationCap size={22} />
            </span>
            <div>
              <h1 className="serif">Trilha</h1>
              <span className="sub">TRT-4 · banca FCC</span>
            </div>
          </div>
          <nav className="topnav" aria-label="Navegação principal">
            {MENU.map((m) => (
              <button key={m.id} className={m.id === aba ? 'ativa' : ''} onClick={() => setAba(m.id)}>
                <m.icone size={16} />
                <span>{m.id}</span>
              </button>
            ))}
          </nav>
          <div className="prova-card" title={`Prova em ${fmtData(estado.dataProva)}`}>
            <div className="prova-num">
              <strong className="serif">{faltam}</strong>
              <span>dias</span>
            </div>
            <div className="prova-info">
              <span>Prova · {dataCurta(estado.dataProva)}</span>
              <div className="barra mini">
                <div style={{ width: `${progresso}%` }} />
              </div>
              <small>{progresso}% do plano concluído</small>
            </div>
          </div>
        </div>
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
