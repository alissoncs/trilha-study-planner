import { Suspense, useLayoutEffect, useMemo, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { GraduationCap, Target } from 'lucide-react'
import { useEstudos } from './StoreContext'
import { diffDias, fmtData } from './lib/dates'
import { percentual, somaMin } from './lib/tempo'
import { useHoje } from './useHoje'
import { ROTAS } from './routes'
import { useDiaAberto } from './useDiaAberto'
import { DiaModal } from './views/DiaModal'
import { ErrorBoundary } from './ui/ErrorBoundary'

export function Layout() {
  const { estado } = useEstudos()
  const { pathname } = useLocation()
  const { id: diaAberto, fechar } = useDiaAberto()
  const topo = useRef<HTMLElement>(null)

  // Expõe a altura do menu fixo para que elementos sticky (ex.: filtros) fiquem logo abaixo dele.
  useLayoutEffect(() => {
    const el = topo.current
    if (!el) return
    const medir = () => document.documentElement.style.setProperty('--topbar-h', `${el.offsetHeight}px`)
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const atual = ROTAS.find((r) => pathname === `/${r.path}`)

  const hoje = useHoje()
  const faltam = Math.max(diffDias(estado.dataProva, hoje), 0)
  const progresso = useMemo(
    () => percentual(somaMin(estado.dias.filter((d) => d.status === 'Concluído')), somaMin(estado.dias)),
    [estado.dias],
  )

  return (
    <div className="shell">
      <header className="topbar" ref={topo}>
        <div className="topbar-in">
          <div className="marca">
            <span className="logo">
              <GraduationCap size={18} />
            </span>
            <h1 className="serif">Trilha</h1>
          </div>
          <nav className="topnav" aria-label="Navegação principal">
            {ROTAS.map((r) => (
              <NavLink key={r.path} to={r.path} className={({ isActive }) => (isActive ? 'ativa' : '')}>
                <r.icone size={17} />
                <span>{r.titulo}</span>
              </NavLink>
            ))}
          </nav>
          <div className="pct" title={`${progresso}% do plano concluído · prova em ${fmtData(estado.dataProva)} (${faltam} dias)`}>
            <span className="pct-icone">
              <Target size={17} />
            </span>
            <span className="pct-texto">
              <strong className="serif">{progresso}%</strong>
              <small>do plano</small>
            </span>
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
