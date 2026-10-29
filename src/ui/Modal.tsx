import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props {
  titulo: string
  subtitulo?: string
  onClose: () => void
  children: ReactNode
  rodape?: ReactNode
  largo?: boolean
}

export function Modal({ titulo, subtitulo, onClose, children, rodape, largo }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const fechar = useRef(onClose)
  fechar.current = onClose

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && fechar.current()
    document.addEventListener('keydown', tecla)
    const antes = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ref.current?.focus()
    return () => {
      document.removeEventListener('keydown', tecla)
      document.body.style.overflow = antes
    }
  }, [])

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={titulo} className={`modal ${largo ? 'largo' : ''}`}>
        <header className="modal-topo">
          <div>
            <h3>{titulo}</h3>
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
