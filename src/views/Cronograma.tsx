import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowDown, CalendarDays, ArrowUp, ChevronsUpDown, Flag, Search } from 'lucide-react'
import { useEstudos } from '../StoreContext'
import { useDiaAberto } from '../useDiaAberto'
import type { DiaEstudo, Relevancia, Status } from '../types'
import { fmtData, fmtDiaSemana, fmtMin, hojeISO } from '../lib/dates'
import { GRUPOS, grupoDe } from '../lib/grupos'
import { revisoesDe } from '../lib/revisoes'
import { Select } from '../ui/Select'
import type { Opt } from '../ui/Select'
import { CalendarioModal } from './CalendarioModal'
import { Chip, Dot, STATUS, StatusSelect, numeroDia } from './DiaCard'

const RELEVANCIAS: Relevancia[] = ['Altíssima', 'Alta', 'Média', 'Especial']
const opts = <T extends string>(todos: string, lista: readonly T[]): Opt<T | ''>[] => [
  { value: '', label: todos },
  ...lista.map((v) => ({ value: v, label: v })),
]

type Chave = 'n' | 'data' | 'disciplina' | 'conteudo' | 'tempo' | 'relevancia' | 'status'
const COLUNAS: { chave: Chave | null; titulo: string }[] = [
  { chave: 'n', titulo: 'Dia' },
  { chave: 'data', titulo: 'Data' },
  { chave: 'disciplina', titulo: 'Disciplina' },
  { chave: 'conteudo', titulo: 'Conteúdo' },
  { chave: 'tempo', titulo: 'Tempo' },
  { chave: 'relevancia', titulo: 'Relevância' },
  { chave: 'status', titulo: 'Status' },
  { chave: null, titulo: 'Revisões' },
]
const ORDEM_STATUS: Record<Status, number> = { Pendente: 0, 'Em Andamento': 1, Concluído: 2 }
const valorDe = (d: DiaEstudo, c: Chave): string | number => {
  switch (c) {
    case 'n': return d.n
    case 'data': return d.data
    case 'disciplina': return d.disciplina
    case 'conteudo': return d.conteudo
    case 'tempo': return d.minPdf + d.minVideo
    case 'relevancia': return RELEVANCIAS.indexOf(d.relevancia)
    case 'status': return ORDEM_STATUS[d.status]
  }
}

export default function Cronograma() {
  const { estado, atualizarDia, marcarRevisao } = useEstudos()
  const [params, setParams] = useSearchParams()
  const grupoP = params.get('materia') ?? ''
  const grupo = (GRUPOS as readonly string[]).includes(grupoP) ? grupoP : ''
  const statusP = params.get('status') ?? ''
  const status = (STATUS as readonly string[]).includes(statusP) ? (statusP as Status) : ''
  const relevP = params.get('relev') ?? ''
  const relev = (RELEVANCIAS as string[]).includes(relevP) ? (relevP as Relevancia) : ''
  const busca = params.get('q') ?? ''
  const chaveP = params.get('ord') ?? ''
  const chaveOrd: Chave = COLUNAS.some((c) => c.chave === chaveP) ? (chaveP as Chave) : 'n'
  const ordem = { chave: chaveOrd, asc: params.get('dir') !== 'desc' }

  // Atualiza só os parâmetros dados, preservando os demais (ex.: `dia`).
  const mudar = (novos: Record<string, string>) =>
    setParams(
      (p) => {
        const q = new URLSearchParams(p)
        for (const [k, v] of Object.entries(novos)) v ? q.set(k, v) : q.delete(k)
        return q
      },
      { replace: true },
    )

  const [buscaLocal, setBuscaLocal] = useState(busca)
  useEffect(() => setBuscaLocal(busca), [busca])
  useEffect(() => {
    if (buscaLocal === busca) return
    const t = setTimeout(() => mudar({ q: buscaLocal }), 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buscaLocal])
  const { abrir } = useDiaAberto()
  const [calendario, setCalendario] = useState(false)
  const hoje = hojeISO()

  const ordenar = (chave: Chave) =>
    mudar(
      ordem.chave === chave
        ? { ord: chave, dir: ordem.asc ? 'desc' : '' }
        : { ord: chave, dir: '' },
    )

  const dias = useMemo(() => {
    const termo = busca.toLowerCase()
    const filtrados = estado.dias.filter(
      (d) =>
        (!grupo || grupoDe(d.disciplina) === grupo) &&
        (!status || d.status === status) &&
        (!relev || d.relevancia === relev) &&
        (!termo || `${d.disciplina} ${d.conteudo}`.toLowerCase().includes(termo)),
    )
    return filtrados.sort((a, b) => {
      const x = valorDe(a, ordem.chave)
      const y = valorDe(b, ordem.chave)
      const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'pt-BR')
      return (ordem.asc ? c : -c) || a.n - b.n
    })
  }, [estado.dias, grupo, status, relev, busca, ordem])

  return (
    <>
      <div className="filtros">
        <div className="busca">
          <Search size={16} />
          <input placeholder="Buscar no cronograma…" value={buscaLocal} aria-label="Buscar no cronograma" onChange={(e) => setBuscaLocal(e.target.value)} />
        </div>
        <Select value={grupo} options={opts('Todas as matérias', GRUPOS)} onChange={(v) => mudar({ materia: v })} label="Matéria" />
        <Select value={status} options={opts('Todos os status', STATUS)} onChange={(v) => mudar({ status: v })} label="Status" />
        <Select value={relev} options={opts('Toda relevância', RELEVANCIAS)} onChange={(v) => mudar({ relev: v })} label="Relevância" />
        <span className="contagem-filtro">{dias.length} dias</span>
        <button className="btn" onClick={() => setCalendario(true)}>
          <CalendarDays size={15} /> Calendário
        </button>
      </div>

      <div className="tabela-wrap">
        <table>
          <thead>
            <tr>
              {COLUNAS.map(({ chave, titulo }) =>
                chave ? (
                  <th key={chave} aria-sort={ordem.chave === chave ? (ordem.asc ? 'ascending' : 'descending') : 'none'}>
                    <button className={`th-sort ${ordem.chave === chave ? 'ativa' : ''}`} onClick={() => ordenar(chave)}>
                      {titulo}
                      {ordem.chave !== chave ? <ChevronsUpDown size={12} /> : ordem.asc ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    </button>
                  </th>
                ) : (
                  <th key={titulo}>{titulo}</th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {dias.map((d) => {
              const atrasado = d.data < hoje && d.status !== 'Concluído'
              return (
                <tr
                  key={d.id}
                  className={`${atrasado ? 'atrasado' : ''} ${d.data === hoje ? 'hoje' : ''}`}
                  tabIndex={0}
                  onClick={() => abrir(d.id)}
                  onKeyDown={(e) => e.target === e.currentTarget && e.key === 'Enter' && abrir(d.id)}
                >
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
      {calendario && <CalendarioModal onClose={() => setCalendario(false)} />}
      <p className="dica">Clique em uma linha para abrir os detalhes, anotações e % de acertos.</p>
    </>
  )
}
