import type { DiaEstudo, Status } from '../types'
import { fmtData, fmtDiaSemana, fmtMin } from '../lib/dates'

export const STATUS: Status[] = ['Pendente', 'Em Andamento', 'Concluído']

export function StatusSelect({ dia, onChange }: { dia: DiaEstudo; onChange: (s: Status) => void }) {
  return (
    <select
      className={`status s-${dia.status.replace(/\s/g, '')}`}
      value={dia.status}
      onChange={(e) => onChange(e.target.value as Status)}
    >
      {STATUS.map((s) => (
        <option key={s}>{s}</option>
      ))}
    </select>
  )
}

export const Chip = ({ r }: { r: DiaEstudo['relevancia'] }) => <span className={`chip r-${r}`}>{r}</span>

export function DiaCard({
  dia,
  onStatus,
  extra,
}: {
  dia: DiaEstudo
  onStatus: (s: Status) => void
  extra?: string
}) {
  return (
    <article className="card">
      <div className="card-topo">
        <strong>
          {dia.id.replace('dia-', 'Dia ')} · {fmtDiaSemana(dia.data)} {fmtData(dia.data)}
        </strong>
        <Chip r={dia.relevancia} />
        {extra && <span className="atraso">{extra}</span>}
      </div>
      <h3>{dia.disciplina}</h3>
      <p>{dia.conteudo}</p>
      <div className="card-base">
        <span>
          PDF {fmtMin(dia.minPdf)} · Vídeo/Questões {fmtMin(dia.minVideo)} · Total {fmtMin(dia.minPdf + dia.minVideo)}
        </span>
        <StatusSelect dia={dia} onChange={onStatus} />
      </div>
    </article>
  )
}
