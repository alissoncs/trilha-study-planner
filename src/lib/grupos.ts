// Agrupa os nomes livres de "Disciplina Principal" em poucas matérias.
export const GRUPOS = [
  'Língua Portuguesa',
  'Raciocínio Lógico',
  'Direito Constitucional',
  'Direito Administrativo',
  'Direito do Trabalho',
  'Processo do Trabalho',
  'Gestão e Legislação',
  'Revisão e Questões',
  'Prova e Descanso',
] as const
export type Grupo = (typeof GRUPOS)[number]

export function grupoDe(disciplina: string): Grupo {
  const d = disciplina.toLowerCase().replace(/^reta final:\s*/, '')
  if (/prova trt|descanso/.test(d)) return 'Prova e Descanso'
  if (/^revis[ãa]o|treino discursivo|jurisprud|súmulas/.test(d)) return 'Revisão e Questões'
  if (/proc\.? trabalho|processo do trabalho/.test(d)) return 'Processo do Trabalho'
  if (/trabalho|greve/.test(d)) return 'Direito do Trabalho'
  if (/constitucional/.test(d)) return 'Direito Constitucional'
  if (/administrativo/.test(d)) return 'Direito Administrativo'
  if (/^(l[íi]ngua|portugu)/.test(d)) return 'Língua Portuguesa'
  if (/rlm|racioc/.test(d)) return 'Raciocínio Lógico'
  if (/gest|afo|[ée]tica|legisla/.test(d)) return 'Gestão e Legislação'
  return 'Revisão e Questões'
}

// Cor de cada matéria (barras e marcadores).
export const GRUPO_COR: Record<Grupo, string> = {
  'Língua Portuguesa': '#e07a5f',
  'Raciocínio Lógico': '#3d85c6',
  'Direito Constitucional': '#7c6bc4',
  'Direito Administrativo': '#2a9d8f',
  'Direito do Trabalho': '#d99a2b',
  'Processo do Trabalho': '#c4577a',
  'Gestão e Legislação': '#6a994e',
  'Revisão e Questões': '#8a8f9c',
  'Prova e Descanso': '#b8a99a',
}
