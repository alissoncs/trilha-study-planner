import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEstudos } from '../StoreContext'
import { useDiaAberto } from '../useDiaAberto'
import { addDias, fmtMin, hojeISO } from '../lib/dates'
import { GRUPO_COR, grupoDe } from '../lib/grupos'
import { Modal } from '../ui/Modal'
import { numeroDia } from './DiaCard'

const SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

/** Datas ISO de todas as semanas (domingo a sábado) que tocam o mês `ym`. */
function semanasDoMes(ano: number, mes: number): string[][] {
  const primeiro = new Date(ano, mes, 1)
  const ultimo = iso(ano, mes, new Date(ano, mes + 1, 0).getDate())
  let cursor = addDias(iso(ano, mes, 1), -primeiro.getDay())
  const semanas: string[][] = []
  while (cursor <= ultimo) {
    semanas.push(Array.from({ length: 7 }, (_, i) => addDias(cursor, i)))
    cursor = addDias(cursor, 7)
  }
  return semanas
}

export function CalendarioModal({ onClose }: { onClose: () => void }) {
  const { estado } = useEstudos()
  const { abrir } = useDiaAberto()
  const hoje = hojeISO()

  const inicial = useMemo(() => {
    const datas = estado.dias.map((d) => d.data).sort()
    const ref = hoje >= datas[0] && hoje <= datas[datas.length - 1] ? hoje : datas[0]
    return { ano: Number(ref.slice(0, 4)), mes: Number(ref.slice(5, 7)) - 1 }
  }, [estado.dias, hoje])
  const [{ ano, mes }, setMes] = useState(inicial)

  const porData = useMemo(() => {
    const mapa = new Map<string, typeof estado.dias>()
    for (const d of estado.dias) mapa.set(d.data, [...(mapa.get(d.data) ?? []), d])
    return mapa
  }, [estado.dias])

  const semanas = useMemo(() => semanasDoMes(ano, mes), [ano, mes])
  const titulo = new Date(ano, mes, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const navegar = (delta: number) => {
    const d = new Date(ano, mes + delta, 1)
    setMes({ ano: d.getFullYear(), mes: d.getMonth() })
  }

  return (
    <Modal xl titulo="Calendário de estudos" subtitulo="Clique em um dia para ver os detalhes" onClose={onClose}>
      <div className="cal-barra">
        <button className="btn btn-sm" onClick={() => setMes({ ano: Number(hoje.slice(0, 4)), mes: Number(hoje.slice(5, 7)) - 1 })}>
          Hoje
        </button>
        <button className="icone-btn" aria-label="Mês anterior" onClick={() => navegar(-1)}>
          <ChevronLeft size={18} />
        </button>
        <button className="icone-btn" aria-label="Próximo mês" onClick={() => navegar(1)}>
          <ChevronRight size={18} />
        </button>
        <h4 className="cal-titulo serif">{titulo}</h4>
      </div>

      <div className="cal-grade" role="grid" aria-label={titulo}>
        {SEMANA.map((s) => (
          <div key={s} className="cal-cab" role="columnheader">
            {s}
          </div>
        ))}
        {semanas.flat().map((data) => {
          const doMes = Number(data.slice(5, 7)) - 1 === mes
          const eventos = porData.get(data) ?? []
          return (
            <div key={data} role="gridcell" className={`cal-dia ${doMes ? '' : 'fora'} ${data === hoje ? 'hoje' : ''}`}>
              <span className="cal-num">{Number(data.slice(8))}</span>
              {eventos.map((d) => (
                <button
                  key={d.id}
                  className={`cal-evento ${d.status === 'Concluído' ? 'feito' : ''} ${data < hoje && d.status !== 'Concluído' ? 'atrasado' : ''}`}
                  style={{ ['--cor' as string]: GRUPO_COR[grupoDe(d.disciplina)] }}
                  title={`${numeroDia(d)} · ${d.disciplina} · ${fmtMin(d.minPdf + d.minVideo)}\n${d.conteudo}`}
                  onClick={() => abrir(d.id)}
                >
                  <strong>{d.disciplina}</strong>
                  <span>{d.conteudo}</span>
                  <small>
                    {numeroDia(d)} · {fmtMin(d.minPdf + d.minVideo)}
                  </small>
                </button>
              ))}
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
