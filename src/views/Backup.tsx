import { useRef, useState } from 'react'
import { Download, RotateCcw, Upload } from 'lucide-react'
import { useEstudos } from '../StoreContext'
import { isISO, normalizar } from '../lib/storage'
import { Confirm } from '../ui/Modal'
import { useToast } from '../ui/Toast'

export default function Backup() {
  const { estado, configurar, importar, resetar } = useEstudos()
  const toast = useToast()
  const arquivo = useRef<HTMLInputElement>(null)
  const [confirmar, setConfirmar] = useState(false)

  const exportar = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(estado, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `trilha-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast('Backup exportado')
  }

  const ler = async (f: File) => {
    try {
      const e = normalizar(JSON.parse(await f.text()))
      if (!e) throw new Error()
      importar(e)
      toast('Backup importado')
    } catch {
      toast('Arquivo inválido')
    }
  }

  return (
    <>
      <section className="card">
        <h3 className="secao serif">Backup</h3>
        <p className="texto-modal">Seus dados ficam só neste navegador. Exporte um backup de vez em quando: limpar os dados do site apaga tudo.</p>
        <div className="acoes">
          <button className="btn btn-primario" onClick={exportar}>
            <Download size={16} /> Exportar JSON
          </button>
          <button className="btn" onClick={() => arquivo.current?.click()}>
            <Upload size={16} /> Importar JSON
          </button>
          <input ref={arquivo} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && ler(e.target.files[0])} />
          <button className="btn btn-perigo-suave" onClick={() => setConfirmar(true)}>
            <RotateCcw size={16} /> Restaurar cronograma original
          </button>
        </div>
      </section>

      <section className="card">
        <h3 className="secao serif">Configurações</h3>
        <div className="grade-campos">
          <label className="campo">
            <span className="rotulo">Data da prova</span>
            <input className="input" type="date" value={estado.dataProva} onChange={(e) => isISO(e.target.value) && configurar({ dataProva: e.target.value })} />
          </label>
          <label className="campo">
            <span className="rotulo">Revisar se acertos &lt; (%)</span>
            <input className="input" type="number" min={0} max={100} value={estado.limiteAcertos} onChange={(e) => {
                const n = Number(e.target.value)
                if (e.target.value !== '' && Number.isFinite(n)) configurar({ limiteAcertos: Math.min(100, Math.max(0, n)) })
              }} />
          </label>
          {(['r7', 'r14', 'r30'] as const).map((k) => (
            <label key={k} className="campo">
              <span className="rotulo">Revisão {k.toUpperCase()} (dias)</span>
              <input
                className="input"
                type="number"
                min={1}
                value={estado.intervalos[k]}
                onChange={(e) => {
                  const n = Math.round(Number(e.target.value))
                  if (e.target.value !== '' && Number.isFinite(n)) configurar({ intervalos: { ...estado.intervalos, [k]: Math.max(1, n) } })
                }}
              />
            </label>
          ))}
        </div>
      </section>

      {confirmar && (
        <Confirm
          perigo
          titulo="Restaurar cronograma original?"
          mensagem="Todo o seu progresso, anotações, revisões e marcações serão apagados e o cronograma volta ao estado inicial. Essa ação não pode ser desfeita."
          confirmar="Apagar e restaurar"
          onCancel={() => setConfirmar(false)}
          onConfirm={() => {
            resetar()
            setConfirmar(false)
            toast('Cronograma restaurado')
          }}
        />
      )}
    </>
  )
}
