import { Fragment, useState } from 'react'
import type { Store } from '../store'
import type { Relevancia, Status } from '../types'
import { fmtData, fmtDiaSemana, fmtMin, hojeISO } from '../lib/dates'
import { GRUPOS, grupoDe } from '../lib/grupos'
import { revisoesDe } from '../lib/revisoes'
import { Chip, STATUS, StatusSelect } from './DiaCard'

const RELEVANCIAS: Relevancia[] = ['Altíssima', 'Alta', 'Média', 'Especial']

export default function Cronograma({ store }: { store: Store }) {
  const { estado, atualizarDia } = store
  const [grupo, setGrupo] = useState('')
  const [status, setStatus] = useState<Status | ''>('')
  const [relev, setRelev] = useState<Relevancia | ''>('')
  const [busca, setBusca] = useState('')
  const [aberto, setAberto] = useState<string | null>(null)
  const hoje = hojeISO()

  const dias = estado.dias.filter(
    (d) =>
      (!grupo || grupoDe(d.disciplina) === grupo) &&
      (!status || d.status === status) &&
      (!relev || d.relevancia === relev) &&
      (!busca || `${d.disciplina} ${d.conteudo}`.toLowerCase().includes(busca.toLowerCase())),
  )

  return (
    <>
      <div className="filtros">
        <input placeholder="Buscar…" value={busca} onChange={(e) => setBusca(e.target.value)} />
        <select value={grupo} onChange={(e) => setGrupo(e.target.value)}>
          <option value="">Todas as matérias</option>
          {GRUPOS.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as Status | '')}>
          <option value="">Todos os status</option>
          {STATUS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select value={relev} onChange={(e) => setRelev(e.target.value as Relevancia | '')}>
          <option value="">Toda relevância</option>
          {RELEVANCIAS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <span className="contagem-filtro">{dias.length} dias</span>
      </div>

      <div className="tabela-wrap">
        <table>
          <thead>
            <tr>
              <th>Dia</th>
              <th>Data</th>
              <th>Disciplina</th>
              <th>Conteúdo</th>
              <th>Tempo</th>
              <th>Relevância</th>
              <th>Status</th>
              <th>Revisões</th>
              <th>% acertos</th>
            </tr>
          </thead>
          <tbody>
            {dias.map((d) => {
              const revs = revisoesDe(d, estado.intervalos)
              const atrasado = d.data < hoje && d.status !== 'Concluído'
              return (
                <Fragment key={d.id}>
                  <tr
                    className={`${atrasado ? 'atrasado' : ''} ${d.data === hoje ? 'hoje' : ''} rel-${d.relevancia}`}
                  >
                    <td>{d.id.replace('dia-', '')}</td>
                    <td className="nowrap">
                      {fmtDiaSemana(d.data)} {fmtData(d.data)}
                    </td>
                    <td>{d.disciplina}</td>
                    <td className="conteudo" onClick={() => setAberto(aberto === d.id ? null : d.id)}>
                      {d.conteudo}
                    </td>
                    <td className="nowrap">{fmtMin(d.minPdf + d.minVideo)}</td>
                    <td>
                      <Chip r={d.relevancia} />
                    </td>
                    <td>
                      <StatusSelect dia={d} onChange={(s) => atualizarDia(d.id, { status: s })} />
                    </td>
                    <td className="nowrap">
                      {revs.length === 0 && '—'}
                      {revs.map((r) => (
                        <label key={r.chave} className={`rev ${!d.revisoes[r.chave] && r.vence <= hoje ? 'vencida' : ''}`} title={`vence ${fmtData(r.vence)}`}>
                          <input
                            type="checkbox"
                            checked={d.revisoes[r.chave]}
                            onChange={(e) => atualizarDia(d.id, { revisoes: { ...d.revisoes, [r.chave]: e.target.checked } })}
                          />
                          {r.chave.toUpperCase()}
                        </label>
                      ))}
                    </td>
                    <td>
                      <input
                        className="num"
                        type="number"
                        min={0}
                        max={100}
                        value={d.acertos ?? ''}
                        onChange={(e) => atualizarDia(d.id, { acertos: e.target.value === '' ? null : Number(e.target.value) })}
                      />
                    </td>
                  </tr>
                  {aberto === d.id && (
                    <tr className="notas">
                      <td colSpan={9}>
                        <textarea
                          placeholder="Anotações do dia…"
                          value={d.anotacoes}
                          onChange={(e) => atualizarDia(d.id, { anotacoes: e.target.value })}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="dica">Clique no conteúdo para abrir as anotações. As revisões aparecem quando o dia é concluído.</p>
    </>
  )
}
