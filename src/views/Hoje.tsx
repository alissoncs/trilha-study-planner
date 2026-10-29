import { useState } from 'react'
import { AlertCircle, CalendarClock, CheckCheck, RefreshCw, Timer } from 'lucide-react'
import type { Store } from '../store'
import { diffDias, fmtData, fmtMin, hojeISO } from '../lib/dates'
import { prioridade, revisoesPendentes } from '../lib/revisoes'
import { Confirm } from '../ui/Modal'
import { useToast } from '../ui/Toast'
import { DiaCard, numeroDia } from './DiaCard'
import { DiaModal } from './DiaModal'
import { Stat } from './Stat'

export default function Hoje({ store }: { store: Store }) {
  const { estado, atualizarDia, marcarRevisao, reagendarAtrasados } = store
  const toast = useToast()
  const [aberto, setAberto] = useState<string | null>(null)
  const [confirmar, setConfirmar] = useState(false)
  const hoje = hojeISO()
  const doDia = estado.dias.filter((d) => d.data === hoje)
  const atrasados = estado.dias
    .filter((d) => d.data < hoje && d.status !== 'Concluído')
    .map((d) => ({ d, atraso: diffDias(hoje, d.data) }))
    .sort((a, b) => prioridade(b.d, b.atraso) - prioridade(a.d, a.atraso))
  const revisoes = revisoesPendentes(estado.dias, estado.intervalos).filter((r) => r.vence <= hoje)
  const proximo = estado.dias.find((d) => d.data > hoje && d.status !== 'Concluído')
  const concluidos = estado.dias.filter((d) => d.status === 'Concluído').length

  return (
    <>
      <div className="stats">
        <Stat icone={<Timer size={20} />} valor={fmtMin(doDia.reduce((s, d) => s + d.minPdf + d.minVideo, 0))} rotulo="de estudo planejado hoje" tom="verde" />
        <Stat icone={<RefreshCw size={20} />} valor={revisoes.length} rotulo="revisões vencidas" tom={revisoes.length ? 'rosa' : 'neutro'} />
        <Stat icone={<AlertCircle size={20} />} valor={atrasados.length} rotulo="dias atrasados" tom={atrasados.length ? 'ambar' : 'neutro'} />
        <Stat icone={<CheckCheck size={20} />} valor={`${concluidos}/${estado.dias.length}`} rotulo="dias concluídos" tom="azul" />
      </div>

      <section>
        <h3 className="secao serif">Estudo de hoje · {fmtData(hoje)}</h3>
        {doDia.length ? (
          doDia.map((d) => (
            <DiaCard key={d.id} dia={d} onAbrir={() => setAberto(d.id)} onStatus={(status) => atualizarDia(d.id, { status })} />
          ))
        ) : (
          <div className="vazio">
            <CalendarClock size={28} />
            <p>
              Nenhum dia do cronograma cai hoje.
              {proximo && ` Próximo: ${numeroDia(proximo)} em ${fmtData(proximo.data)}.`}
            </p>
          </div>
        )}
      </section>

      <section>
        <h3 className="secao serif">Revisões vencidas</h3>
        {revisoes.length === 0 && <div className="vazio"><CheckCheck size={28} /><p>Nenhuma revisão vencida.</p></div>}
        {revisoes.map((r) => (
          <label key={r.dia.id + r.chave} className="linha">
            <input type="checkbox" className="check" checked={false} onChange={() => (marcarRevisao(r.dia.id, r.chave, true), toast('Revisão registrada'))} />
            <span>
              <strong>{r.chave.toUpperCase()}</strong> · {r.dia.disciplina}
              <small>
                {numeroDia(r.dia)} · venceu em {fmtData(r.vence)}
              </small>
            </span>
          </label>
        ))}
      </section>

      <section>
        <div className="secao-topo">
          <h3 className="secao serif">Atrasados por prioridade</h3>
          {atrasados.length > 0 && (
            <button className="btn" onClick={() => setConfirmar(true)}>
              <RefreshCw size={15} /> Reagendar atrasados
            </button>
          )}
        </div>
        {atrasados.length === 0 && <div className="vazio"><CheckCheck size={28} /><p>Nada atrasado.</p></div>}
        {atrasados.slice(0, 8).map(({ d, atraso }) => (
          <DiaCard
            key={d.id}
            dia={d}
            extra={`${atraso}d de atraso`}
            onAbrir={() => setAberto(d.id)}
            onStatus={(status) => atualizarDia(d.id, { status })}
          />
        ))}
        {atrasados.length > 8 && <p className="dica">+ {atrasados.length - 8} atrasados na aba Cronograma.</p>}
      </section>

      {aberto && <DiaModal id={aberto} store={store} onClose={() => setAberto(null)} />}
      {confirmar && (
        <Confirm
          titulo="Reagendar dias atrasados?"
          mensagem="Todos os dias não concluídos serão deslocados para que o primeiro comece hoje. O dia da prova não muda."
          confirmar="Reagendar"
          onCancel={() => setConfirmar(false)}
          onConfirm={() => {
            reagendarAtrasados()
            setConfirmar(false)
            toast('Cronograma reagendado')
          }}
        />
      )}
    </>
  )
}
