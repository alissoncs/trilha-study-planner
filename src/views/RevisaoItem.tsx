import { useEstudos } from '../StoreContext'
import { useToast } from '../ui/Toast'
import { fmtData } from '../lib/dates'
import type { revisoesPendentes } from '../lib/revisoes'
import { numeroDia } from './DiaCard'

type Pendente = ReturnType<typeof revisoesPendentes>[number]

export function RevisaoItem({ r, detalhe }: { r: Pendente; detalhe?: string }) {
  const { marcarRevisao } = useEstudos()
  const toast = useToast()
  return (
    <label className="linha">
      <input type="checkbox" className="check" checked={false} onChange={() => (marcarRevisao(r.dia.id, r.chave, true), toast('Revisão registrada'))} />
      <span>
        <strong>{r.chave.toUpperCase()}</strong> · {r.dia.disciplina}
        <small>
          {numeroDia(r.dia)} · {detalhe ?? `vence em ${fmtData(r.vence)}`}
        </small>
      </span>
    </label>
  )
}
