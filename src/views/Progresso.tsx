import { useMemo } from 'react'
import { CheckCheck, Clock, Flame, Target } from 'lucide-react'
import { useEstudos } from '../StoreContext'
import { useDiaAberto } from '../useDiaAberto'
import { useHoje } from '../useHoje'
import { addDias, diffDias, fmtData, fmtMin } from '../lib/dates'
import { GRUPOS, GRUPO_COR, grupoDe } from '../lib/grupos'
import { somaMin, mediaAcertos, percentual } from '../lib/tempo'
import type { DiaEstudo } from '../types'
import { numeroDia } from './DiaCard'

function Anel({ pct, tamanho = 120, traco = 10, cor = '#fff', fundo = 'rgba(255,255,255,.22)', children }: {
  pct: number
  tamanho?: number
  traco?: number
  cor?: string
  fundo?: string
  children?: React.ReactNode
}) {
  const r = (tamanho - traco) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="pg-anel" style={{ width: tamanho, height: tamanho }} role="img" aria-label={`${pct}% concluído`}>
      <svg width={tamanho} height={tamanho} viewBox={`0 0 ${tamanho} ${tamanho}`}>
        <circle cx={tamanho / 2} cy={tamanho / 2} r={r} fill="none" stroke={fundo} strokeWidth={traco} />
        <circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={r}
          fill="none"
          stroke={cor}
          strokeWidth={traco}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          transform={`rotate(-90 ${tamanho / 2} ${tamanho / 2})`}
          style={{ transition: 'stroke-dashoffset .6s ease' }}
        />
      </svg>
      <div className="pg-anel-centro">{children}</div>
    </div>
  )
}

const domingoDe = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return addDias(iso, -new Date(y, m - 1, d).getDay())
}

export default function Progresso() {
  const { estado } = useEstudos()
  const { dias, dataProva, limiteAcertos } = estado
  const { abrir } = useDiaAberto()
  const hoje = useHoje()

  const dados = useMemo(() => {
    const concl = (ds: DiaEstudo[]) => ds.filter((d) => d.status === 'Concluído')
    const total = somaMin(dias)
    const feito = somaMin(concl(dias))

    const materias = GRUPOS.map((g) => {
      const ds = dias.filter((d) => grupoDe(d.disciplina) === g)
      return { g, dias: ds.length, concluidos: concl(ds).length, t: somaMin(ds), f: somaMin(concl(ds)), acerto: mediaAcertos(ds) }
    }).filter((l) => l.dias > 0 && l.g !== 'Prova e Descanso')

    const semanas = new Map<string, { plan: number; feito: number }>()
    for (const d of dias) {
      const k = domingoDe(d.data)
      const s = semanas.get(k) ?? { plan: 0, feito: 0 }
      s.plan += d.minPdf + d.minVideo
      if (d.status === 'Concluído') s.feito += d.minPdf + d.minVideo
      semanas.set(k, s)
    }

    // sequência de dias concluídos terminando no último dia já vencido
    const passados = dias.filter((d) => d.data <= hoje).sort((a, b) => b.data.localeCompare(a.data))
    let sequencia = 0
    for (const d of passados) {
      if (d.status !== 'Concluído') {
        if (d.data === hoje) continue
        break
      }
      sequencia++
    }

    return {
      total,
      feito,
      pct: percentual(feito, total),
      concluidos: concl(dias).length,
      acerto: mediaAcertos(dias),
      materias,
      semanas: [...semanas.entries()].sort(([a], [b]) => a.localeCompare(b)),
      sequencia,
    }
  }, [dias, hoje])

  const faltam = Math.max(diffDias(dataProva, hoje), 0)
  const maxSemana = Math.max(...dados.semanas.map(([, s]) => s.plan), 1)

  return (
    <>
      <section className="pg-hero">
        <Anel pct={dados.pct} tamanho={148} traco={12}>
          <strong className="serif">{dados.pct}%</strong>
          <span>do plano</span>
        </Anel>
        <div className="pg-hero-txt">
          <p className="pg-eyebrow">Sua trilha até a prova</p>
          <h3 className="serif">
            {dados.concluidos} de {dias.length} dias concluídos
          </h3>
          <p>
            {fmtMin(dados.feito)} estudadas de {fmtMin(dados.total)} planejadas. Faltam <strong>{faltam} dias</strong> para a prova em {fmtData(dataProva)}.
          </p>
        </div>
        <ul className="pg-kpis">
          <li>
            <Flame size={18} />
            <strong>{dados.sequencia}</strong>
            <span>dias seguidos</span>
          </li>
          <li>
            <Clock size={18} />
            <strong>{fmtMin(dados.feito)}</strong>
            <span>de estudo</span>
          </li>
          <li>
            <Target size={18} />
            <strong>{dados.acerto !== null ? `${dados.acerto}%` : '—'}</strong>
            <span>média de acertos</span>
          </li>
        </ul>
      </section>

      <section>
        <div className="secao-topo">
          <h3 className="secao serif">A trilha dos {dias.length} dias</h3>
          <ul className="pg-legenda" aria-hidden="true">
            <li><i className="feito" /> concluído</li>
            <li><i className="andamento" /> em andamento</li>
            <li><i className="pendente" /> pendente</li>
            <li><i className="atrasado" /> atrasado</li>
          </ul>
        </div>
        <div className="card pg-trilha">
          {dias.map((d) => {
            const cor = GRUPO_COR[grupoDe(d.disciplina)]
            const atrasado = d.data < hoje && d.status !== 'Concluído'
            return (
              <button
                key={d.id}
                className={`pg-dia ${d.status === 'Concluído' ? 'feito' : d.status === 'Em Andamento' ? 'andamento' : 'pendente'} ${atrasado ? 'atrasado' : ''} ${d.data === hoje ? 'hoje' : ''}`}
                style={{ ['--cor' as string]: cor }}
                title={`${numeroDia(d)} · ${fmtData(d.data)}\n${d.disciplina} · ${d.status}`}
                aria-label={`${numeroDia(d)}, ${d.disciplina}, ${d.status}`}
                onClick={() => abrir(d.id)}
              >
                {d.n}
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h3 className="secao serif">Por matéria</h3>
        <div className="pg-materias">
          {dados.materias.map((m) => {
            const pct = percentual(m.f, m.t)
            const baixo = m.acerto !== null && m.acerto < limiteAcertos
            return (
              <article key={m.g} className="pg-materia" style={{ ['--cor' as string]: GRUPO_COR[m.g] }}>
                <Anel pct={pct} tamanho={64} traco={7} cor={GRUPO_COR[m.g]} fundo="var(--brd)">
                  <strong>{pct}%</strong>
                </Anel>
                <div className="pg-materia-txt">
                  <h4>{m.g}</h4>
                  <p>
                    {m.concluidos}/{m.dias} dias · {fmtMin(m.f)}/{fmtMin(m.t)}
                  </p>
                  {m.acerto !== null ? (
                    <span className={`pg-acerto ${baixo ? 'baixo' : ''}`}>{m.acerto}% de acertos{baixo && ' · revisar'}</span>
                  ) : (
                    <span className="pg-acerto vazio">sem questões ainda</span>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section>
        <h3 className="secao serif">Ritmo semanal</h3>
        <div className="card">
          <div className="pg-semanas">
            {dados.semanas.map(([inicio, s]) => {
              const atual = hoje >= inicio && hoje <= addDias(inicio, 6)
              return (
                <div key={inicio} className={`pg-semana ${atual ? 'atual' : ''}`} title={`Semana de ${fmtData(inicio)}: ${fmtMin(s.feito)} de ${fmtMin(s.plan)}`}>
                  <div className="pg-coluna" style={{ height: `${(s.plan / maxSemana) * 100}%` }}>
                    <div style={{ height: `${percentual(s.feito, s.plan)}%` }} />
                  </div>
                  <small>{fmtData(inicio).slice(0, 5)}</small>
                </div>
              )
            })}
          </div>
          <p className="dica">
            <CheckCheck size={13} style={{ verticalAlign: '-2px' }} /> Cada coluna é uma semana: a parte escura é o tempo já estudado.
          </p>
        </div>
      </section>
    </>
  )
}
