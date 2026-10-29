import { describe, expect, it } from 'vitest'
import { grupoDe } from './grupos'

describe('grupoDe', () => {
  it.each([
    ['Língua Portuguesa', 'Língua Portuguesa'],
    ['DIA DA PROVA TRT-4!', 'Prova e Descanso'],
    ['DESCANSO E PREPARAÇÃO MENTAL', 'Prova e Descanso'],
    ['Revisão & Questões (R7/R14/R30)', 'Revisão e Questões'],
    ['Direito do Trabalho (NÚCLEO DURO)', 'Direito do Trabalho'],
    ['Processo do Trabalho', 'Processo do Trabalho'],
    ['Direito Constitucional', 'Direito Constitucional'],
    ['Reta Final: Direito Administrativo', 'Direito Administrativo'],
    ['RLM', 'Raciocínio Lógico'],
    ['AFO', 'Gestão e Legislação'],
    ['algo desconhecido', 'Revisão e Questões'],
  ])('%s -> %s', (entrada, grupo) => {
    expect(grupoDe(entrada)).toBe(grupo)
  })
})
