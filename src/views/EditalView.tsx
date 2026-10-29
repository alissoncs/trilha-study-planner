import { useEffect, useState } from 'react'
import { ChevronRight, Flag } from 'lucide-react'
import { useEstudos } from '../StoreContext'
import type { Cargo, Edital } from '../types'
import { Select } from '../ui/Select'

const CARREGAR: Record<Cargo, () => Promise<{ default: unknown }>> = {
  tecnico: () => import('../data/edital-tecnico.json'),
  analista: () => import('../data/edital-analista.json'),
}
const CARGOS = [
  { value: 'tecnico' as Cargo, label: 'Técnico Judiciário' },
  { value: 'analista' as Cargo, label: 'Analista Judiciário' },
]

export default function EditalView() {
  const { estado, configurar } = useEstudos()
  const [carregado, setCarregado] = useState<{ cargo: Cargo; edital: Edital } | null>(null)
  const [erro, setErro] = useState(false)
  useEffect(() => {
    let vivo = true
    setErro(false)
    CARREGAR[estado.cargo]()
      .then((m) => vivo && setCarregado({ cargo: estado.cargo, edital: m.default as Edital }))
      .catch(() => vivo && setErro(true))
    return () => {
      vivo = false
    }
  }, [estado.cargo])
  const edital = carregado?.cargo === estado.cargo ? carregado.edital : null
  const [aberta, setAberta] = useState<string | null>(null)
  const feitos = estado.topicosFeitos

  const alternar = (id: string, v: boolean) => configurar({ topicosFeitos: { ...feitos, [id]: v } })
  const marcarRevisar = (id: string) => configurar({ topicosRevisar: { ...estado.topicosRevisar, [id]: !estado.topicosRevisar[id] } })
  const totalTopicos = !edital ? 0 : edital.disciplinas.reduce((s, d) => s + d.topicos.length, 0)
  const totalFeitos = !edital ? 0 : edital.disciplinas.reduce((s, d) => s + d.topicos.filter((t) => feitos[t.id]).length, 0)

  return (
    <>
      <div className="filtros">
        <Select value={estado.cargo} options={CARGOS} onChange={(cargo) => configurar({ cargo })} label="Cargo" />
        <span className="contagem-filtro">
          {totalFeitos}/{totalTopicos} tópicos estudados
        </span>
      </div>
      {!edital && <p className="dica" role="status">{erro ? 'Não foi possível carregar o edital.' : 'Carregando edital…'}</p>}
      {edital?.disciplinas.map((d) => {
        const f = d.topicos.filter((t) => feitos[t.id]).length
        const pct = (f / d.topicos.length) * 100
        const isAberta = aberta === d.id
        return (
          <section key={d.id} className="card disc">
            <button className="disc-topo" onClick={() => setAberta(isAberta ? null : d.id)}>
              <ChevronRight size={18} className={`giro ${isAberta ? 'on' : ''}`} />
              <div className="cresce">
                <strong className="serif">{d.nome}</strong>
                <small>{d.bloco}</small>
              </div>
              <span className="mut">
                {f}/{d.topicos.length}
              </span>
              <div className="barra">
                <div style={{ width: `${pct}%` }} />
              </div>
            </button>
            {isAberta &&
              d.topicos.map((t) => (
                <div key={t.id} className="topico">
                  <label>
                    <input type="checkbox" className="check" checked={!!feitos[t.id]} onChange={(e) => alternar(t.id, e.target.checked)} />
                    <span className={feitos[t.id] ? 'feito' : ''}>{t.titulo}</span>
                  </label>
                  <button
                    className={`flag ${estado.topicosRevisar[t.id] ? 'on' : ''}`}
                    title="Precisa revisar"
                    aria-label="Precisa revisar"
                    onClick={() => marcarRevisar(t.id)}
                  >
                    <Flag size={14} />
                  </button>
                </div>
              ))}
          </section>
        )
      })}
    </>
  )
}
