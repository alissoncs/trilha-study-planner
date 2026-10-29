import { useState } from 'react'
import type { Store } from '../store'
import type { Cargo, Edital } from '../types'
import tecnico from '../data/edital-tecnico.json'
import analista from '../data/edital-analista.json'

const EDITAIS: Record<Cargo, Edital> = { tecnico: tecnico as Edital, analista: analista as Edital }

export default function EditalView({ store }: { store: Store }) {
  const { estado, configurar } = store
  const edital = EDITAIS[estado.cargo]
  const [aberta, setAberta] = useState<string | null>(null)
  const feitos = estado.topicosFeitos

  const alternar = (id: string, v: boolean) => configurar({ topicosFeitos: { ...feitos, [id]: v } })
  const totalTopicos = edital.disciplinas.reduce((s, d) => s + d.topicos.length, 0)
  const totalFeitos = edital.disciplinas.reduce((s, d) => s + d.topicos.filter((t) => feitos[t.id]).length, 0)

  return (
    <>
      <div className="filtros">
        <select value={estado.cargo} onChange={(e) => configurar({ cargo: e.target.value as Cargo })}>
          <option value="tecnico">Técnico Administrativo</option>
          <option value="analista">Analista Judiciário</option>
        </select>
        <span className="contagem-filtro">
          {totalFeitos}/{totalTopicos} tópicos estudados
        </span>
      </div>
      {edital.disciplinas.map((d) => {
        const f = d.topicos.filter((t) => feitos[t.id]).length
        return (
          <section key={d.id} className="disc">
            <button className="disc-topo" onClick={() => setAberta(aberta === d.id ? null : d.id)}>
              <strong>{d.nome}</strong>
              <small>{d.bloco}</small>
              <span>
                {f}/{d.topicos.length}
              </span>
              <div className="barra">
                <div style={{ width: `${(f / d.topicos.length) * 100}%` }} />
              </div>
            </button>
            {aberta === d.id &&
              d.topicos.map((t) => (
                <label key={t.id} className="linha">
                  <input type="checkbox" checked={!!feitos[t.id]} onChange={(e) => alternar(t.id, e.target.checked)} />
                  <span>{t.titulo}</span>
                </label>
              ))}
          </section>
        )
      })}
    </>
  )
}
