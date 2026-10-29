import { useState } from 'react'
import { Flag, Search } from 'lucide-react'
import type { Store } from '../store'
import type { Relevancia, Status } from '../types'
import { fmtData, fmtDiaSemana, fmtMin, hojeISO } from '../lib/dates'
import { GRUPOS, grupoDe } from '../lib/grupos'
import { revisoesDe } from '../lib/revisoes'
import { Select } from '../ui/Select'
import type { Opt } from '../ui/Select'
import { Chip, Dot, STATUS, StatusSelect, numeroDia } from './DiaCard'
import { DiaModal } from './DiaModal'

const RELEVANCIAS: Relevancia[] = ['Altíssima', 'Alta', 'Média', 'Especial']
const opts = <T extends string>(todos: string, lista: readonly T[]): Opt<T | ''>[] => [
  { value: '', label: todos },
  ...lista.map((v) => ({ value: v, label: v })),
]

export default function Cronograma({ store }: { store: Store }) {
  const { estado, atualizarDia, marcarRevisao } = store
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
        <div className="busca">
          <Search size={16} />
          <input placeholder="Buscar no cronograma…" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <Select value={grupo} options={opts('Todas as matérias', GRUPOS)} onChange={setGrupo} label="Matéria" />
        <Select value={status} options={opts('Todos os status', STATUS)} onChange={setStatus} label="Status" />
        <Select value={relev} options={opts('Toda relevância', RELEVANCIAS)} onChange={setRelev} label="Relevância" />
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
            </tr>
          </thead>
          <tbody>
            {dias.map((d) => {
              const atrasado = d.data < hoje && d.status !== 'Concluído'
              return (
                <tr key={d.id} className={`${atrasado ? 'atrasado' : ''} ${d.data === hoje ? 'hoje' : ''}`} onClick={() => setAberto(d.id)}>
                  <td className="nowrap">
                    <button
                      className={`flag ${d.revisar ? 'on' : ''}`}
                      title="Precisa revisar"
                      aria-label="Precisa revisar"
                      onClick={(e) => (e.stopPropagation(), atualizarDia(d.id, { revisar: !d.revisar }))}
                    >
                      <Flag size={14} />
                    </button>
                    {numeroDia(d).replace('Dia ', '')}
                  </td>
                  <td className="nowrap data-col">
                    {fmtDiaSemana(d.data)}, {fmtData(d.data)}
                  </td>
                  <td>
                    <Dot disciplina={d.disciplina} />
                    {d.disciplina}
                  </td>
                  <td className="conteudo">{d.conteudo}</td>
                  <td className="nowrap">{fmtMin(d.minPdf + d.minVideo)}</td>
                  <td>
                    <Chip r={d.relevancia} />
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <StatusSelect dia={d} onChange={(s) => atualizarDia(d.id, { status: s })} />
                  </td>
                  <td className="nowrap" onClick={(e) => e.stopPropagation()}>
                    {d.status !== 'Concluído' && <span className="mut">—</span>}
                    {revisoesDe(d, estado.intervalos).map((r) => (
                      <button
                        key={r.chave}
                        title={d.revisoes[r.chave] ? `feita em ${fmtData(d.revisoes[r.chave]!)}` : `vence ${fmtData(r.vence)}`}
                        className={`rev-mini ${d.revisoes[r.chave] ? 'feita' : r.vence <= hoje ? 'vencida' : ''}`}
                        onClick={() => marcarRevisao(d.id, r.chave, !d.revisoes[r.chave])}
                      >
                        {r.chave.toUpperCase()}
                      </button>
                    ))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="dica">Clique em uma linha para abrir os detalhes, anotações e % de acertos.</p>
      {aberto && <DiaModal id={aberto} store={store} onClose={() => setAberto(null)} />}
    </>
  )
}
