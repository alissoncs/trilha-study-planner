import { CheckCheck, Clock, Percent } from 'lucide-react'
import { useEstudos } from '../StoreContext'
import { fmtMin } from '../lib/dates'
import { GRUPOS, GRUPO_COR, grupoDe } from '../lib/grupos'
import { Stat } from './Stat'

export default function Progresso() {
  const { dias } = useEstudos().estado
  const tempo = (d: { minPdf: number; minVideo: number }) => d.minPdf + d.minVideo
  const total = dias.reduce((s, d) => s + tempo(d), 0)
  const feito = dias.filter((d) => d.status === 'Concluído').reduce((s, d) => s + tempo(d), 0)
  const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0)
  const acertos = dias.map((d) => d.acertos).filter((a): a is number => a !== null)

  const linhas = GRUPOS.map((g) => {
    const ds = dias.filter((d) => grupoDe(d.disciplina) === g)
    const t = ds.reduce((s, d) => s + tempo(d), 0)
    const f = ds.filter((d) => d.status === 'Concluído').reduce((s, d) => s + tempo(d), 0)
    const ac = ds.map((d) => d.acertos).filter((a): a is number => a !== null)
    return {
      g,
      dias: ds.length,
      concluidos: ds.filter((d) => d.status === 'Concluído').length,
      t,
      f,
      acerto: ac.length ? Math.round(ac.reduce((s, a) => s + a, 0) / ac.length) : null,
    }
  }).filter((l) => l.dias > 0)

  return (
    <>
      <div className="stats">
        <Stat icone={<Percent size={20} />} valor={`${pct(feito, total)}%`} rotulo="do tempo concluído" tom="verde" />
        <Stat icone={<Clock size={20} />} valor={fmtMin(feito)} rotulo={`de ${fmtMin(total)} planejadas`} tom="azul" />
        <Stat icone={<CheckCheck size={20} />} valor={`${dias.filter((d) => d.status === 'Concluído').length}/${dias.length}`} rotulo="dias concluídos" tom="neutro" />
        <Stat
          icone={<Percent size={20} />}
          valor={acertos.length ? `${Math.round(acertos.reduce((s, a) => s + a, 0) / acertos.length)}%` : '—'}
          rotulo="média de acertos"
          tom="ambar"
        />
      </div>
      <section>
        <h3 className="secao serif">Por matéria</h3>
        <div className="card">
          {linhas.map((l) => (
            <div key={l.g} className="barra-linha">
              <div className="barra-topo">
                <strong>
                  <span className="dot" style={{ background: GRUPO_COR[l.g] }} />
                  {l.g}
                </strong>
                <span>
                  {l.concluidos}/{l.dias} dias · {fmtMin(l.f)}/{fmtMin(l.t)}
                  {l.acerto !== null && ` · ${l.acerto}% de acertos`}
                </span>
              </div>
              <div className="barra">
                <div style={{ width: `${pct(l.f, l.t)}%`, background: GRUPO_COR[l.g] }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
