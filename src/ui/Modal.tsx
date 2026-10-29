import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props {
  titulo: string
  subtitulo?: string
  onClose: () => void
  children: ReactNode
  rodape?: ReactNode
  largo?: boolean
  xl?: boolean
}

const pilha: object[] = []

export function Modal({ titulo, subtitulo, onClose, children, rodape, largo, xl }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const tituloId = useId()

  const fechar = useRef(onClose)
  useEffect(() => {
    fechar.current = onClose
  })

  useEffect(() => {
    // Com modais empilhados, só o do topo responde ao Esc.
    const token = {}
    pilha.push(token)
    const origem = document.activeElement as HTMLElement | null
    const tecla = (e: KeyboardEvent) => {
      if (pilha[pilha.length - 1] !== token) return
      if (e.key === 'Escape') return fechar.current()
      if (e.key !== 'Tab' || !ref.current) return
      const foc = Array.from(
        ref.current.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      ).filter((el) => !(el as HTMLButtonElement).disabled && el.getClientRects().length > 0)
      if (!foc.length) {
        e.preventDefault()
        return ref.current.focus()
      }
      const ativo = document.activeElement
      if (e.shiftKey && (ativo === foc[0] || ativo === ref.current || !ref.current.contains(ativo))) {
        e.preventDefault()
        foc[foc.length - 1].focus()
      } else if (!e.shiftKey && (ativo === foc[foc.length - 1] || !ref.current.contains(ativo))) {
        e.preventDefault()
        foc[0].focus()
      }
    }
    document.addEventListener('keydown', tecla)
    const antes = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ref.current?.focus()
    return () => {
      pilha.splice(pilha.indexOf(token), 1)
      document.removeEventListener('keydown', tecla)
      document.body.style.overflow = antes
      if (origem?.isConnected) origem.focus()
    }
  }, [])

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={tituloId} className={`modal ${largo ? 'largo' : ''} ${xl ? 'xl' : ''}`}>
        <header className="modal-topo">
          <div>
            <h3 id={tituloId}>{titulo}</h3>
            {subtitulo && <p>{subtitulo}</p>}
          </div>
          <button className="icone-btn" aria-label="Fechar" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <div className="modal-corpo">{children}</div>
        {rodape && <footer className="modal-rodape">{rodape}</footer>}
      </div>
    </div>
  )
}

interface ConfirmProps {
  titulo: string
  mensagem: string
  confirmar: string
  perigo?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function Confirm({ titulo, mensagem, confirmar, perigo, onConfirm, onCancel }: ConfirmProps) {
  return (
    <Modal
      titulo={titulo}
      onClose={onCancel}
      rodape={
        <>
          <button className="btn" onClick={onCancel}>
            Cancelar
          </button>
          <button className={`btn ${perigo ? 'btn-perigo' : 'btn-primario'}`} onClick={onConfirm}>
            {confirmar}
          </button>
        </>
      }
    >
      <p className="texto-modal">{mensagem}</p>
    </Modal>
  )
}
