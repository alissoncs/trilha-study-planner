import { CheckCheck, Clock, Percent } from 'lucide-react'
import { useEstudos } from '../StoreContext'
import { fmtMin } from '../lib/dates'
import { GRUPOS, GRUPO_COR, grupoDe } from '../lib/grupos'
import { somaMin, mediaAcertos, percentual } from '../lib/tempo'
import { Stat } from './Stat'

export default function Progresso() {
  const { dias } = useEstudos().estado
  const concl = (ds: typeof dias) => ds.filter((d) => d.status === 'Concluído')
  const total = somaMin(dias)
  const feito = somaMin(concl(dias))
  const acertoGeral = mediaAcertos(dias)

  const linhas = GRUPOS.map((g) => {
    const ds = dias.filter((d) => grupoDe(d.disciplina) === g)
    return { g, dias: ds.length, concluidos: concl(ds).length, t: somaMin(ds), f: somaMin(concl(ds)), acerto: mediaAcertos(ds) }
  }).filter((l) => l.dias > 0)

  return (
    <>
      <div className="stats">
        <Stat icone={<Percent size={20} />} valor={`${percentual(feito, total)}%`} rotulo="do tempo concluído" tom="verde" />
        <Stat icone={<Clock size={20} />} valor={fmtMin(feito)} rotulo={`de ${fmtMin(total)} planejadas`} tom="azul" />
        <Stat icone={<CheckCheck size={20} />} valor={`${concl(dias).length}/${dias.length}`} rotulo="dias concluídos" tom="neutro" />
        <Stat
          icone={<Percent size={20} />}
          valor={acertoGeral !== null ? `${acertoGeral}%` : '—'}
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
                <div style={{ width: `${percentual(l.f, l.t)}%`, background: GRUPO_COR[l.g] }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
