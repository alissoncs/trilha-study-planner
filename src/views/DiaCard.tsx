import { Check, Clock, Flag, Flame, Maximize2, Minus, Star, TrendingUp, Undo2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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

const RELEV_ICONE: Record<DiaEstudo['relevancia'], LucideIcon> = {
  Altíssima: Flame,
  Alta: TrendingUp,
  Média: Minus,
  Especial: Star,
}

export const Chip = ({ r }: { r: DiaEstudo['relevancia'] }) => {
  const Icone = RELEV_ICONE[r]
  return (
    <span className={`chip r-${r}`}>
      <Icone size={12} strokeWidth={2.4} aria-hidden="true" />
      {r}
    </span>
  )
}

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
        {dia.revisar && <Flag size={14} className="flag-on" aria-label="Precisa revisar" role="img" />}
        {extra && <span className="atraso">{extra}</span>}
        <button className="icone-btn empurra" aria-label={`Abrir detalhes do ${numeroDia(dia)}`} onClick={onAbrir}>
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
        <div className="acoes-card">
          {dia.status === 'Concluído' ? (
            <button className="btn btn-sm" onClick={() => onStatus('Pendente')}>
              <Undo2 size={14} /> Desfazer
            </button>
          ) : (
            <button className="btn btn-primario btn-sm" onClick={() => onStatus('Concluído')}>
              <Check size={14} /> Concluir
            </button>
          )}
          <StatusSelect dia={dia} onChange={onStatus} />
        </div>
      </div>
    </article>
  )
}
