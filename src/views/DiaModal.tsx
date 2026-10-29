import { useEffect, useRef, useState } from 'react'
import { Flag } from 'lucide-react'
import { useEstudos } from '../StoreContext'
import { fmtData, fmtMin, hojeISO } from '../lib/dates'
import { revisoesDe } from '../lib/revisoes'
import { Modal } from '../ui/Modal'
import { Chip, StatusSelect, numeroDia } from './DiaCard'

export function DiaModal({ id, onClose }: { id: string; onClose: () => void }) {
  const { estado, atualizarDia, marcarRevisao } = useEstudos()
  const dia = estado.dias.find((d) => d.id === id)

  // Anotações: estado local, gravado no store com debounce e ao desmontar.
  const [nota, setNota] = useState(dia?.anotacoes ?? '')
  const pendente = useRef<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const gravar = useRef<(texto: string) => void>(() => {})
  gravar.current = (texto) => atualizarDia(id, { anotacoes: texto })
  const flush = () => {
    clearTimeout(timer.current)
    if (pendente.current !== null) {
      gravar.current(pendente.current)
      pendente.current = null
    }
  }
  useEffect(() => flush, []) // eslint-disable-line react-hooks/exhaustive-deps
  const aoDigitar = (texto: string) => {
    setNota(texto)
    pendente.current = texto
    clearTimeout(timer.current)
    timer.current = setTimeout(flush, 400)
  }

  const fechar = useRef(onClose)
  fechar.current = onClose
  const existe = !!dia
  useEffect(() => {
    if (!existe) fechar.current()
  }, [existe])

  if (!dia) return null
  const revs = revisoesDe(dia, estado.intervalos)

  return (
    <Modal
      largo
      titulo={dia.disciplina}
      subtitulo={`${numeroDia(dia)} · ${fmtData(dia.data)} · ${fmtMin(dia.minPdf + dia.minVideo)} de estudo`}
      onClose={onClose}
      rodape={
        <button className="btn btn-primario" onClick={() => { flush(); onClose() }}>
          Fechar
        </button>
      }
    >
      <p className="texto-modal">{dia.conteudo}</p>

      <div className="grade-campos">
        <div className="campo">
          <span className="rotulo">Status</span>
          <StatusSelect dia={dia} onChange={(status) => atualizarDia(dia.id, { status })} />
        </div>
        <div className="campo">
          <span className="rotulo">Relevância</span>
          <div>
            <Chip r={dia.relevancia} />
          </div>
        </div>
        <div className="campo">
          <span className="rotulo">% de acertos</span>
          <input
            className="input"
            type="number"
            min={0}
            max={100}
            placeholder="ex.: 78"
            value={dia.acertos ?? ''}
            onChange={(e) => {
              const n = Number(e.target.value)
              atualizarDia(dia.id, {
                acertos: e.target.value === '' || !Number.isFinite(n) ? null : Math.min(100, Math.max(0, Math.round(n))),
              })
            }}
          />
        </div>
        <div className="campo">
          <span className="rotulo">Revisão</span>
          <button className={`btn ${dia.revisar ? 'btn-aviso' : ''}`} onClick={() => atualizarDia(dia.id, { revisar: !dia.revisar })}>
            <Flag size={15} /> {dia.revisar ? 'Marcado para revisar' : 'Marcar para revisar'}
          </button>
        </div>
      </div>

      <div className="campo">
        <span className="rotulo">Revisões espaçadas</span>
        {dia.status !== 'Concluído' ? (
          <p className="dica">As revisões R7, R14 e R30 aparecem quando você conclui o dia.</p>
        ) : (
          <div className="revs">
            {revs.map((r) => {
              const feita = dia.revisoes[r.chave]
              return (
                <button
                  key={r.chave}
                  className={`rev-chip ${feita ? 'feita' : r.vence <= hojeISO() ? 'vencida' : ''}`}
                  onClick={() => marcarRevisao(dia.id, r.chave, !feita)}
                >
                  <strong>{r.chave.toUpperCase()}</strong>
                  <span>{feita ? `feita em ${fmtData(feita)}` : `vence ${fmtData(r.vence)}`}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="campo">
        <span className="rotulo">Anotações</span>
        <textarea
          className="input"
          rows={5}
          placeholder="Dúvidas, macetes, o que errar nas questões…"
          value={nota}
          onChange={(e) => aoDigitar(e.target.value)}
          onBlur={flush}
        />
      </div>
    </Modal>
  )
}
