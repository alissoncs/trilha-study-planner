import type { Store } from '../store'
import { fmtMin } from '../lib/dates'
import { GRUPOS, grupoDe } from '../lib/grupos'

export default function Progresso({ store }: { store: Store }) {
  const { dias } = store.estado
  const total = dias.reduce((s, d) => s + d.minPdf + d.minVideo, 0)
  const feito = dias.filter((d) => d.status === 'Concluído').reduce((s, d) => s + d.minPdf + d.minVideo, 0)
  const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0)

  const linhas = GRUPOS.map((g) => {
    const ds = dias.filter((d) => grupoDe(d.disciplina) === g)
    const t = ds.reduce((s, d) => s + d.minPdf + d.minVideo, 0)
    const f = ds.filter((d) => d.status === 'Concluído').reduce((s, d) => s + d.minPdf + d.minVideo, 0)
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
      <section className="resumo">
        <div>
          <strong>{pct(feito, total)}%</strong>
          <span>
            do tempo concluído ({fmtMin(feito)} de {fmtMin(total)})
          </span>
        </div>
        <div>
          <strong>{dias.filter((d) => d.status === 'Concluído').length}</strong>
          <span>de {dias.length} dias concluídos</span>
        </div>
      </section>
      <section>
        <h2>Por matéria</h2>
        {linhas.map((l) => (
          <div key={l.g} className="barra-linha">
            <div className="barra-topo">
              <strong>{l.g}</strong>
              <span>
                {l.concluidos}/{l.dias} dias · {fmtMin(l.f)}/{fmtMin(l.t)}
                {l.acerto !== null && ` · ${l.acerto}% de acertos`}
              </span>
            </div>
            <div className="barra">
              <div style={{ width: `${pct(l.f, l.t)}%` }} />
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
