import { useState } from 'react'
import { AlarmClock, CalendarClock, Check, CheckCheck, Flag, History, Sun, Undo2 } from 'lucide-react'
import { useEstudos } from '../StoreContext'
import { useDiaAberto } from '../useDiaAberto'
import { useHoje } from '../useHoje'
import { diffDias, fmtData, fmtDiaSemana } from '../lib/dates'
import { GRUPO_COR, grupoDe } from '../lib/grupos'
import { agendaSemana, precisaRevisar, revisoesFeitas, revisoesPendentes } from '../lib/revisoes'
import type { RevisaoDevida } from '../lib/revisoes'
import type { RevKey } from '../types'
import { useToast } from '../ui/Toast'
import { numeroDia } from './DiaCard'

type Filtro = RevKey | 'todas'
const FILTROS: { id: Filtro; rotulo: string }[] = [
  { id: 'todas', rotulo: 'Todas' },
  { id: 'r7', rotulo: 'R7' },
  { id: 'r14', rotulo: 'R14' },
  { id: 'r30', rotulo: 'R30' },
]

const LIMITE = 6

const quando = (vence: string, hoje: string) => {
  const d = diffDias(vence, hoje)
  if (d < 0) return `${-d}d de atraso`
  if (d === 0) return 'vence hoje'
  if (d === 1) return 'vence amanhã'
  return `em ${d} dias · ${fmtDiaSemana(vence)}, ${fmtData(vence).slice(0, 5)}`
}

function Anel({ pct, vazio }: { pct: number; vazio: boolean }) {
  const r = 46
  const c = 2 * Math.PI * r
  return (
    <svg className="rv-anel" viewBox="0 0 120 120" role="img" aria-label={vazio ? 'Sem revisões geradas' : `${pct}% das revisões em dia`}>
      <circle cx="60" cy="60" r={r} className="rv-anel-fundo" />
      {!vazio && <circle cx="60" cy="60" r={r} className="rv-anel-valor" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />}
      <text x="60" y="58" textAnchor="middle" className="rv-anel-num">
        {vazio ? '—' : `${pct}%`}
      </text>
      <text x="60" y="76" textAnchor="middle" className="rv-anel-leg">
        em dia
      </text>
    </svg>
  )
}

export default function Revisoes() {
  const { estado, atualizarDia, marcarRevisao } = useEstudos()
  const toast = useToast()
  const { abrir } = useDiaAberto()
  const hoje = useHoje()
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [expandidas, setExpandidas] = useState<Record<string, boolean>>({})

  const todas = revisoesPendentes(estado.dias, estado.intervalos)
  const pend = filtro === 'todas' ? todas : todas.filter((r) => r.chave === filtro)
  const vencidas = pend.filter((r) => r.vence < hoje)
  const deHoje = pend.filter((r) => r.vence === hoje)
  const proximas = pend.filter((r) => r.vence > hoje && diffDias(r.vence, hoje) <= 14)
  const marcados = estado.dias.filter((d) => precisaRevisar(d, estado.limiteAcertos))
  const feitas = revisoesFeitas(estado.dias)
  const semana = agendaSemana(todas, hoje, 7)

  const devidas = feitas.length + todas.filter((r) => r.vence <= hoje).length
  const pct = devidas ? Math.round((feitas.length / devidas) * 100) : 0

  const concluir = (r: RevisaoDevida) => {
    marcarRevisao(r.dia.id, r.chave, true)
    toast('Revisão registrada')
  }

  const cartao = (r: RevisaoDevida, tom: string) => (
    <li key={r.dia.id + r.chave} className={`rv-card ${tom}`}>
      <span className={`rv-tipo k-${r.chave}`}>{r.chave.toUpperCase()}</span>
      <button className="rv-corpo" onClick={() => abrir(r.dia.id)}>
        <strong className="serif">
          <span className="dot" style={{ background: GRUPO_COR[grupoDe(r.dia.disciplina)] }} />
          {r.dia.disciplina}
        </strong>
        <small>
          {numeroDia(r.dia)} · <em>{quando(r.vence, hoje)}</em>
        </small>
      </button>
      <button className="rv-check" aria-label={`Marcar ${r.chave.toUpperCase()} de ${r.dia.disciplina} como revisada`} title="Marcar como revisada" onClick={() => concluir(r)}>
        <Check size={16} />
      </button>
    </li>
  )

  const coluna = (titulo: string, icone: React.ReactNode, tom: string, todos: RevisaoDevida[], vazio: string) => {
    const aberta = !!expandidas[tom]
    const itens = aberta ? todos : todos.slice(0, LIMITE)
    return (
    <section className={`rv-col ${tom}`}>
      <header>
        <span className="rv-col-icone">{icone}</span>
        <h3 className="serif">{titulo}</h3>
        <span className="rv-col-n">{todos.length}</span>
      </header>
      {todos.length === 0 ? (
        <p className="rv-vazio">
          <CheckCheck size={18} /> {vazio}
        </p>
      ) : (
        <ul>{itens.map((r) => cartao(r, tom))}</ul>
      )}
      {todos.length > LIMITE && (
        <button className="rv-mais" onClick={() => setExpandidas((e) => ({ ...e, [tom]: !aberta }))}>
          {aberta ? 'Mostrar menos' : `Ver todas (${todos.length})`}
        </button>
      )}
    </section>
    )
  }

  return (
    <>
      <div className="rv-hero">
        <section className="card rv-resumo">
          <Anel pct={pct} vazio={devidas === 0} />
          <div className="rv-legenda">
            <h3 className="serif">Memória em dia</h3>
            <p>{devidas === 0 ? 'Conclua um dia de estudo para gerar as revisões.' : `${feitas.length} de ${devidas} revisões devidas até hoje.`}</p>
            <ul>
              <li><i className="rosa" /> {todas.filter((r) => r.vence < hoje).length} vencidas</li>
              <li><i className="verde" /> {todas.filter((r) => r.vence === hoje).length} para hoje</li>
              <li><i className="azul" /> {todas.filter((r) => r.vence > hoje && diffDias(r.vence, hoje) <= 7).length} nos próximos 7 dias</li>
            </ul>
          </div>
        </section>

        <section className="card rv-semana">
          <header>
            <h3 className="serif">Próximos 7 dias</h3>
            <span className="mut">R7 · R14 · R30 por dia</span>
          </header>
          <div className="rv-dias">
            {semana.map((d, i) => (
              <div
                key={d.data}
                className={`rv-dia ${i === 0 ? 'hoje' : ''} ${d.itens.length ? 'tem' : ''}`}
                title={d.itens.length ? d.itens.map((r) => `${r.chave.toUpperCase()} · ${r.dia.disciplina}`).join('\n') : 'Nada para revisar'}
              >
                <small>{i === 0 ? 'hoje' : fmtDiaSemana(d.data)}</small>
                <b className="serif">{Number(d.data.slice(8))}</b>
                <span className="rv-dia-n">{d.itens.length || '·'}</span>
                <span className="rv-pontos">
                  {d.itens.slice(0, 4).map((r) => (
                    <i key={r.dia.id + r.chave} style={{ background: GRUPO_COR[grupoDe(r.dia.disciplina)] }} />
                  ))}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="rv-barra">
        <h3 className="serif">Fila de revisões</h3>
        <div className="seg" role="group" aria-label="Filtrar por tipo de revisão">
          {FILTROS.map((f) => (
            <button key={f.id} className={filtro === f.id ? 'on' : ''} aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)}>
              {f.rotulo}
            </button>
          ))}
        </div>
      </div>

      <div className="rv-board">
        {coluna('Atrasadas', <AlarmClock size={17} />, 'rosa', vencidas, 'Nenhuma revisão atrasada.')}
        {coluna('Para hoje', <Sun size={17} />, 'verde', deHoje, 'Nada vence hoje.')}
        {coluna('A caminho', <CalendarClock size={17} />, 'azul', proximas, 'Nada nos próximos 14 dias.')}
      </div>

      <div className="rv-baixo">
        <section className="card">
          <header className="rv-sec-topo">
            <h3 className="serif">
              <Flag size={16} className="flag-on" /> Para reforçar
            </h3>
            <span className="badge ambar">{marcados.length}</span>
          </header>
          <p className="dica">Dias com ⚑ ou com acertos abaixo de {estado.limiteAcertos}%.</p>
          {marcados.length === 0 && (
            <p className="rv-vazio">
              <CheckCheck size={18} /> Nada marcado para reforço.
            </p>
          )}
          <ul className="rv-lista">
            {marcados.map((d) => (
              <li key={d.id} className="rv-reforco">
                <button className="rv-corpo" onClick={() => abrir(d.id)}>
                  <strong className="serif">
                    <span className="dot" style={{ background: GRUPO_COR[grupoDe(d.disciplina)] }} />
                    {d.disciplina}
                  </strong>
                  <small>{numeroDia(d)}</small>
                  {d.acertos !== null && (
                    <span className="rv-medidor-linha" title={`${d.acertos}% de acertos`}>
                      <span className="rv-medidor">
                        <span style={{ width: `${d.acertos}%` }} className={d.acertos < estado.limiteAcertos ? 'baixo' : ''} />
                      </span>
                      <b>{d.acertos}%</b>
                    </span>
                  )}
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    atualizarDia(d.id, { revisar: false, acertos: d.acertos !== null && d.acertos < estado.limiteAcertos ? null : d.acertos })
                    toast('Marcação removida')
                  }}
                >
                  Revisei
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <header className="rv-sec-topo">
            <h3 className="serif">
              <History size={16} /> Histórico
            </h3>
            <span className="badge verde">{feitas.length}</span>
          </header>
          {feitas.length === 0 && (
            <p className="rv-vazio">
              <History size={18} /> As revisões feitas aparecem aqui.
            </p>
          )}
          <ol className="rv-linha-tempo">
            {feitas.slice(0, 12).map((r) => (
              <li key={r.dia.id + r.chave}>
                <span className={`rv-tipo mini k-${r.chave}`}>{r.chave.toUpperCase()}</span>
                <span className="cresce">
                  {r.dia.disciplina}
                  <small>{numeroDia(r.dia)} · revisada em {fmtData(r.feitaEm)}</small>
                </span>
                <button className="icone-btn" aria-label="Desfazer revisão" title="Desfazer" onClick={() => marcarRevisao(r.dia.id, r.chave, false)}>
                  <Undo2 size={15} />
                </button>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  )
}
