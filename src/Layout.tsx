import { Suspense, useMemo } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { useEstudos } from './StoreContext'
import { diffDias, fmtData } from './lib/dates'
import { percentual, somaMin } from './lib/tempo'
import { useHoje } from './useHoje'
import { ROTAS } from './routes'
import { useDiaAberto } from './useDiaAberto'
import { DiaModal } from './views/DiaModal'
import { ErrorBoundary } from './ui/ErrorBoundary'

const dataCurta = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/\./g, '')
}

export function Layout() {
  const { estado } = useEstudos()
  const { pathname } = useLocation()
  const { id: diaAberto, fechar } = useDiaAberto()
  const atual = ROTAS.find((r) => pathname === `/${r.path}`)

  const hoje = useHoje()
  const faltam = Math.max(diffDias(estado.dataProva, hoje), 0)
  const progresso = useMemo(
    () => percentual(somaMin(estado.dias.filter((d) => d.status === 'Concluído')), somaMin(estado.dias)),
    [estado.dias],
  )

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
            {ROTAS.map((r) => (
              <NavLink key={r.path} to={r.path} className={({ isActive }) => (isActive ? 'ativa' : '')}>
                <r.icone size={16} />
                <span>{r.titulo}</span>
              </NavLink>
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
        {atual && (
          <header className="pagina-topo">
            <h2 className="serif">{atual.titulo}</h2>
            <p>{atual.sub}</p>
          </header>
        )}
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<p className="dica" role="status">Carregando…</p>}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      {diaAberto && <DiaModal id={diaAberto} onClose={fechar} />}
    </div>
  )
}
