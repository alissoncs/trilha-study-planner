import { ExternalLink } from 'lucide-react'
import { BUSCAS, CONCURSO } from '../lib/concurso'

export default function Provas() {
  return (
    <>
      <section className="card ficha">
        <h3 className="secao serif">O concurso</h3>
        <dl>
          <dt>Órgão</dt>
          <dd>{CONCURSO.orgao}</dd>
          <dt>Edital</dt>
          <dd>{CONCURSO.edital}</dd>
          <dt>Banca</dt>
          <dd>{CONCURSO.banca}</dd>
          <dt>Provas</dt>
          <dd>{CONCURSO.provas}</dd>
          <dt>Inscrições</dt>
          <dd>{CONCURSO.inscricoes}</dd>
        </dl>
        <p className="dica">Informações vindas de notícias, não do edital. Confirme no Diário Oficial da União e no site da FCC.</p>
      </section>
      {BUSCAS.map((b) => (
        <section key={b.grupo}>
          <h3 className="secao serif">{b.grupo}</h3>
          <div className="links-grade">
            {b.links.map((l) => (
              <a key={l.titulo} className="link-card" href={l.url} target="_blank" rel="noreferrer">
                <strong>
                  {l.titulo} <ExternalLink size={14} />
                </strong>
                <small>{l.descricao}</small>
              </a>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
