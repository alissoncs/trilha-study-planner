export type Status = 'Pendente' | 'Em Andamento' | 'Concluído'
export type Relevancia = 'Altíssima' | 'Alta' | 'Média' | 'Especial'
export type RevKey = 'r7' | 'r14' | 'r30'

export interface DiaEstudo {
  id: string
  n: number
  data: string // ISO yyyy-mm-dd
  disciplina: string
  conteudo: string
  minPdf: number
  minVideo: number
  relevancia: Relevancia
  status: Status
  concluidoEm?: string // ISO
  revisoes: Record<RevKey, boolean>
  anotacoes: string
  acertos: number | null // % de acertos nas questões
}

export interface Edital {
  cargo: string
  disciplinas: {
    id: string
    nome: string
    bloco: string
    topicos: { id: string; titulo: string }[]
  }[]
}

export type Cargo = 'tecnico' | 'analista'

export interface Estado {
  version: 1
  dias: DiaEstudo[]
  dataProva: string
  intervalos: Record<RevKey, number>
  cargo: Cargo
  topicosFeitos: Record<string, boolean>
}
