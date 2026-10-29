import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

export interface Opt<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  value: T
  options: Opt<T>[]
  onChange: (v: T) => void
  icon?: ReactNode
  variant?: 'field' | 'pill'
  tone?: string // classe extra para colorir o botão (ex.: status)
  label?: string
}

// Dropdown próprio: o menu usa position:fixed para não ser cortado por tabelas com scroll.
export function Select<T extends string>({ value, options, onChange, icon, variant = 'field', tone = '', label }: Props<T>) {
  const [aberto, setAberto] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0, minWidth: 0 })
  const [ativo, setAtivo] = useState(0)
  const uid = useId()
  const idOpt = (i: number) => `${uid}-opt-${i}`
  const btn = useRef<HTMLButtonElement>(null)
  const atual = options.find((o) => o.value === value)

  useEffect(() => {
    if (!aberto) return
    const fechar = (e: Event) => {
      if (!(e.target as HTMLElement).closest?.('.sel-menu') && !btn.current?.contains(e.target as Node)) setAberto(false)
    }
    const reposicionar = (e: Event) => {
      if ((e.target as HTMLElement | Document).nodeType === 1 && (e.target as HTMLElement).closest?.('.sel-menu')) return
      if (!btn.current) return
      const r = btn.current.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return setAberto(false)
      setPos((p) => ({ ...p, top: r.bottom + 6, left: r.left }))
    }
    document.addEventListener('mousedown', fechar)
    window.addEventListener('resize', reposicionar)
    window.addEventListener('scroll', reposicionar, true)
    return () => {
      document.removeEventListener('mousedown', fechar)
      window.removeEventListener('resize', reposicionar)
      window.removeEventListener('scroll', reposicionar, true)
    }
  }, [aberto])

  const abrir = () => {
    const r = btn.current!.getBoundingClientRect()
    const cabeBaixo = window.innerHeight - r.bottom > 220
    setPos({ top: cabeBaixo ? r.bottom + 6 : Math.max(8, r.top - 6 - Math.min(options.length * 38 + 12, 280)), left: r.left, minWidth: r.width })
    setAtivo(Math.max(0, options.findIndex((o) => o.value === value)))
    setAberto(true)
  }

  const escolher = (v: T) => {
    onChange(v)
    setAberto(false)
    btn.current?.focus()
  }

  const teclado = (e: React.KeyboardEvent) => {
    if (!aberto) {
      if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        abrir()
      }
      return
    }
    if (e.key === 'Escape') setAberto(false)
    else if (e.key === 'ArrowDown') (e.preventDefault(), setAtivo((a) => Math.min(a + 1, options.length - 1)))
    else if (e.key === 'ArrowUp') (e.preventDefault(), setAtivo((a) => Math.max(a - 1, 0)))
    else if (e.key === 'Home') (e.preventDefault(), setAtivo(0))
    else if (e.key === 'End') (e.preventDefault(), setAtivo(options.length - 1))
    else if (e.key === 'Enter') (e.preventDefault(), escolher(options[ativo].value))
  }

  return (
    <>
      <button
        ref={btn}
        type="button"
        className={`sel sel-${variant} ${tone}`}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-controls={aberto ? `${uid}-lista` : undefined}
        aria-activedescendant={aberto ? idOpt(ativo) : undefined}
        aria-label={label}
        onClick={(e) => {
          e.stopPropagation()
          aberto ? setAberto(false) : abrir()
        }}
        onKeyDown={teclado}
      >
        {icon}
        <span>{atual?.label ?? '—'}</span>
        <ChevronDown size={14} className="sel-seta" />
      </button>
      {aberto && (
        <ul id={`${uid}-lista`} className="sel-menu" role="listbox" aria-label={label} style={pos} onMouseDown={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
          {options.map((o, i) => (
            <li
              key={o.value}
              id={idOpt(i)}
              role="option"
              aria-selected={o.value === value}
              className={`${i === ativo ? 'ativo' : ''} ${o.value === value ? 'sel-atual' : ''}`}
              onMouseEnter={() => setAtivo(i)}
              onClick={() => escolher(o.value)}
            >
              <span>{o.label}</span>
              {o.value === value && <Check size={15} />}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
