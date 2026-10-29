import { CheckCheck, Flag, RotateCcw } from 'lucide-react'
import { useEstudos } from '../StoreContext'
import { useDiaAberto } from '../useDiaAberto'
import { diffDias, fmtData } from '../lib/dates'
import { precisaRevisar, revisoesFeitas, revisoesPendentes } from '../lib/revisoes'
import { useToast } from '../ui/Toast'
import { numeroDia } from './DiaCard'
import { RevisaoItem } from './RevisaoItem'
import { useHoje } from '../useHoje'

export default function Revisoes() {
  const { estado, atualizarDia, marcarRevisao } = useEstudos()
  const toast = useToast()
  const { abrir } = useDiaAberto()
  const hoje = useHoje()
  const pend = revisoesPendentes(estado.dias, estado.intervalos)
  const vencidas = pend.filter((r) => r.vence < hoje)
  const deHoje = pend.filter((r) => r.vence === hoje)
  const proximas = pend.filter((r) => r.vence > hoje && diffDias(r.vence, hoje) <= 7)
  const marcados = estado.dias.filter((d) => precisaRevisar(d, estado.limiteAcertos))
  const feitas = revisoesFeitas(estado.dias)

  const item = (r: (typeof pend)[number], atraso = false) => (
    <RevisaoItem
      key={r.dia.id + r.chave}
      r={r}
      detalhe={atraso ? `venceu em ${fmtData(r.vence)} (${diffDias(hoje, r.vence)}d de atraso)` : undefined}
    />
  )
  const vazio = (txt: string) => (
    <div className="vazio">
      <CheckCheck size={26} />
      <p>{txt}</p>
    </div>
  )

  return (
    <>
      <section>
        <h3 className="secao serif">Vencidas <span className="badge rosa">{vencidas.length}</span></h3>
        {vencidas.length === 0 ? vazio('Nenhuma revisão atrasada.') : vencidas.map((r) => item(r, true))}
      </section>
      <section>
        <h3 className="secao serif">Para hoje <span className="badge">{deHoje.length}</span></h3>
        {deHoje.length === 0 ? vazio('Nada vence hoje.') : deHoje.map((r) => item(r))}
      </section>
      <section>
        <h3 className="secao serif">Próximos 7 dias <span className="badge">{proximas.length}</span></h3>
        {proximas.length === 0 ? vazio('Nada nos próximos 7 dias.') : proximas.map((r) => item(r))}
      </section>
      <section>
        <h3 className="secao serif">Marcados para revisar <span className="badge ambar">{marcados.length}</span></h3>
        <p className="dica">Dias com ⚑ ou com acertos abaixo de {estado.limiteAcertos}%.</p>
        {marcados.map((d) => (
          <div key={d.id} className="linha">
            <Flag size={16} className="flag-on" />
            <button className="cresce clicavel link-btn" onClick={() => abrir(d.id)}>
              <strong>{d.disciplina}</strong>
              <small>
                {numeroDia(d)}
                {d.acertos !== null && ` · ${d.acertos}% de acertos`}
              </small>
            </button>
            <button
              className="btn"
              onClick={() => {
                atualizarDia(d.id, { revisar: false, acertos: d.acertos !== null && d.acertos < estado.limiteAcertos ? null : d.acertos })
                toast('Marcação removida')
              }}
            >
              Revisei
            </button>
          </div>
        ))}
      </section>
      <section>
        <h3 className="secao serif">Já revisadas <span className="badge verde">{feitas.length}</span></h3>
        {feitas.slice(0, 20).map((r) => (
          <div key={r.dia.id + r.chave} className="linha feita">
            <CheckCheck size={16} className="ok" />
            <span className="cresce">
              <strong>{r.chave.toUpperCase()}</strong> · {r.dia.disciplina}
              <small>revisada em {fmtData(r.feitaEm)}</small>
            </span>
            <button className="icone-btn" aria-label="Desfazer" title="Desfazer" onClick={() => marcarRevisao(r.dia.id, r.chave, false)}>
              <RotateCcw size={15} />
            </button>
          </div>
        ))}
      </section>
    </>
  )
}
