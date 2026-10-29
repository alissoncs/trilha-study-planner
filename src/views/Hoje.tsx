import type { Store } from '../store'
import { diffDias, fmtData, hojeISO } from '../lib/dates'
import { prioridade, revisoesPendentes } from '../lib/revisoes'
import { DiaCard } from './DiaCard'

export default function Hoje({ store }: { store: Store }) {
  const { estado, atualizarDia, reagendarAtrasados } = store
  const hoje = hojeISO()
  const doDia = estado.dias.filter((d) => d.data === hoje)
  const atrasados = estado.dias
    .filter((d) => d.data < hoje && d.status !== 'Concluído')
    .map((d) => ({ d, atraso: diffDias(hoje, d.data) }))
    .sort((a, b) => prioridade(b.d, b.atraso) - prioridade(a.d, a.atraso))
  const revisoes = revisoesPendentes(estado.dias, estado.intervalos).filter((r) => r.vence <= hoje)
  const proximo = estado.dias.find((d) => d.data > hoje && d.status !== 'Concluído')

  return (
    <>
      <section>
        <h2>Hoje · {fmtData(hoje)}</h2>
        {doDia.length ? (
          doDia.map((d) => <DiaCard key={d.id} dia={d} onStatus={(status) => atualizarDia(d.id, { status })} />)
        ) : (
          <p className="vazio">
            Nenhum dia do cronograma cai hoje.
            {proximo && ` Próximo: ${proximo.id.replace('dia-', 'Dia ')} em ${fmtData(proximo.data)}.`}
          </p>
        )}
      </section>

      <section>
        <h2>Revisões do dia ({revisoes.length})</h2>
        {revisoes.length === 0 && <p className="vazio">Nenhuma revisão vencida.</p>}
        {revisoes.map((r) => (
          <label key={r.dia.id + r.chave} className="linha">
            <input
              type="checkbox"
              checked={false}
              onChange={() => atualizarDia(r.dia.id, { revisoes: { ...r.dia.revisoes, [r.chave]: true } })}
            />
            <span>
              <strong>{r.chave.toUpperCase()}</strong> · {r.dia.disciplina}
              <small> {r.dia.id.replace('dia-', 'Dia ')} · venceu em {fmtData(r.vence)}</small>
            </span>
          </label>
        ))}
      </section>

      <section>
        <div className="secao-topo">
          <h2>Atrasados por prioridade ({atrasados.length})</h2>
          {atrasados.length > 0 && (
            <button
              onClick={() => confirm('Mover todos os dias não concluídos para começar hoje? O dia da prova não muda.') && reagendarAtrasados()}
            >
              Reagendar atrasados
            </button>
          )}
        </div>
        {atrasados.length === 0 && <p className="vazio">Nada atrasado. 🎯</p>}
        {atrasados.slice(0, 10).map(({ d, atraso }) => (
          <DiaCard
            key={d.id}
            dia={d}
            extra={`${atraso}d de atraso`}
            onStatus={(status) => atualizarDia(d.id, { status })}
          />
        ))}
        {atrasados.length > 10 && <p className="vazio">+ {atrasados.length - 10} atrasados (veja no Cronograma).</p>}
      </section>
    </>
  )
}
