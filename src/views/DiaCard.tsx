import { Clock, Flag, Maximize2 } from 'lucide-react'
import type { DiaEstudo, Status } from '../types'
import { fmtData, fmtDiaSemana, fmtMin } from '../lib/dates'
import { GRUPO_COR, grupoDe } from '../lib/grupos'
import { Select } from '../ui/Select'
import type { Opt } from '../ui/Select'

export const STATUS: Status[] = ['Pendente', 'Em Andamento', 'Concluído']
export const STATUS_OPTS: Opt<Status>[] = STATUS.map((s) => ({ value: s, label: s }))

export function StatusSelect({ dia, onChange }: { dia: DiaEstudo; onChange: (s: Status) => void }) {
  return (
    <Select
      variant="pill"
      tone={`s-${dia.status.replace(/\s/g, '')}`}
      value={dia.status}
      options={STATUS_OPTS}
      onChange={onChange}
      label="Status do dia"
    />
  )
}

export const Chip = ({ r }: { r: DiaEstudo['relevancia'] }) => <span className={`chip r-${r}`}>{r}</span>

export const Dot = ({ disciplina }: { disciplina: string }) => (
  <span className="dot" style={{ background: GRUPO_COR[grupoDe(disciplina)] }} />
)

export const numeroDia = (d: DiaEstudo) => `Dia ${String(d.n).padStart(2, '0')}`

export function DiaCard({
  dia,
  onStatus,
  onAbrir,
  extra,
}: {
  dia: DiaEstudo
  onStatus: (s: Status) => void
  onAbrir: () => void
  extra?: string
}) {
  return (
    <article className="card dia-card">
      <div className="card-topo">
        <span className="data-tag">
          {numeroDia(dia)} · {fmtDiaSemana(dia.data)}, {fmtData(dia.data)}
        </span>
        <Chip r={dia.relevancia} />
        {dia.revisar && <Flag size={14} className="flag-on" />}
        {extra && <span className="atraso">{extra}</span>}
        <button className="icone-btn empurra" aria-label="Abrir detalhes" onClick={onAbrir}>
          <Maximize2 size={15} />
        </button>
      </div>
      <h3 className="serif">
        <Dot disciplina={dia.disciplina} />
        {dia.disciplina}
      </h3>
      <p>{dia.conteudo}</p>
      <div className="card-base">
        <span className="tempo">
          <Clock size={14} /> {fmtMin(dia.minPdf + dia.minVideo)} <small>(PDF {fmtMin(dia.minPdf)})</small>
        </span>
        <StatusSelect dia={dia} onChange={onStatus} />
      </div>
    </article>
  )
}
