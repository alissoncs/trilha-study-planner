// Dados do concurso, conforme noticiado após a publicação do Edital nº 1/2026 (DOU de 22/10/2026).
// Confira no edital oficial e no site da banca.
export const CONCURSO = {
  orgao: 'TRT-4 (Tribunal Regional do Trabalho da 4ª Região — RS)',
  edital: 'Edital nº 1/2026 (cadastro de reserva)',
  banca: 'FCC (Fundação Carlos Chagas)',
  provas: '31/01/2027, em Porto Alegre (Técnico pela manhã, Analista à tarde)',
  inscricoes: '26/10/2026 a 25/11/2026',
}

const g = (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}`

export interface LinkBusca {
  titulo: string
  descricao: string
  url: string
}

export const BUSCAS: { grupo: string; links: LinkBusca[] }[] = [
  {
    grupo: 'Provas do TRT-4 pela FCC',
    links: [
      { titulo: 'Provas anteriores TRT-4 (PDF)', descricao: 'Provas e gabaritos de edições passadas', url: g('prova TRT 4ª Região FCC Analista Judiciário Área Judiciária gabarito filetype:pdf') },
      { titulo: 'Técnico Judiciário — Área Administrativa', descricao: 'Para o cargo de Técnico', url: g('prova TRT 4 FCC Técnico Judiciário Área Administrativa gabarito filetype:pdf') },
      { titulo: 'Site da FCC', descricao: 'Provas e gabaritos oficiais da banca', url: 'https://www.concursosfcc.com.br/' },
    ],
  },
  {
    grupo: 'Outros TRTs com a FCC (mesmo estilo de prova)',
    links: [
      { titulo: 'Provas de TRTs aplicadas pela FCC', descricao: 'Vale como treino: mesma banca, mesma matriz de conteúdo', url: g('prova TRT FCC Analista Judiciário Área Judiciária caderno de prova filetype:pdf') },
      { titulo: 'PCI Concursos — provas TRT', descricao: 'Repositório de provas e gabaritos', url: g('site:pciconcursos.com.br provas TRT Analista Judiciário FCC') },
    ],
  },
  {
    grupo: 'Questões por disciplina (FCC + Tribunais do Trabalho)',
    links: [
      { titulo: 'Direito do Trabalho', descricao: 'Núcleo do cargo', url: g('questões FCC TRT Direito do Trabalho Analista Judiciário') },
      { titulo: 'Direito Processual do Trabalho', descricao: 'Núcleo do cargo', url: g('questões FCC TRT Direito Processual do Trabalho Analista Judiciário') },
      { titulo: 'Língua Portuguesa', descricao: 'Peso alto em todas as provas', url: g('questões FCC TRT Língua Portuguesa Técnico Judiciário') },
      { titulo: 'Direito Constitucional e Administrativo', descricao: 'Revisar com lei seca', url: g('questões FCC TRT Direito Constitucional Administrativo Analista Judiciário') },
    ],
  },
  {
    grupo: 'Prova discursiva',
    links: [
      { titulo: 'Discursiva TRT-4 FCC', descricao: 'Temas e padrões de correção', url: g('TRT 4 FCC prova discursiva padrão de resposta') },
    ],
  },
]
