import { useRef, useState } from 'react'
import type { Store } from '../store'
import type { Estado } from '../types'

export default function Backup({ store }: { store: Store }) {
  const { estado, configurar, importar, resetar } = store
  const arquivo = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')

  const exportar = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(estado, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `trilha-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const ler = async (f: File) => {
    try {
      const e = JSON.parse(await f.text()) as Estado
      if (e.version !== 1 || !Array.isArray(e.dias)) throw new Error()
      importar(e)
      setMsg('Backup importado.')
    } catch {
      setMsg('Arquivo inválido.')
    }
  }

  return (
    <section className="config">
      <h2>Backup</h2>
      <p>Seus dados ficam só neste navegador. Exporte um backup de vez em quando — limpar os dados do site apaga tudo.</p>
      <div className="acoes">
        <button onClick={exportar}>Exportar JSON</button>
        <button onClick={() => arquivo.current?.click()}>Importar JSON</button>
        <input ref={arquivo} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && ler(e.target.files[0])} />
        <button className="perigo" onClick={() => confirm('Apagar seu progresso e voltar ao cronograma original?') && resetar()}>
          Restaurar cronograma original
        </button>
      </div>
      {msg && <p>{msg}</p>}

      <h2>Configurações</h2>
      <label className="campo">
        Data da prova
        <input type="date" value={estado.dataProva} onChange={(e) => configurar({ dataProva: e.target.value })} />
      </label>
      {(['r7', 'r14', 'r30'] as const).map((k) => (
        <label key={k} className="campo">
          Intervalo da revisão {k.toUpperCase()} (dias)
          <input
            type="number"
            min={1}
            value={estado.intervalos[k]}
            onChange={(e) => configurar({ intervalos: { ...estado.intervalos, [k]: Math.max(1, Number(e.target.value)) } })}
          />
        </label>
      ))}
    </section>
  )
}
