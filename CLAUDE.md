# Trilha — organizador de estudos (TRT-4 2026)

App web interativo para organizar e priorizar os estudos de concurso. **Trilha** é o nome fictício (provisório).

## Princípios
- React web, **sem backend e sem banco de dados**. Toda a persistência fica no `localStorage` do navegador.
- Como o `localStorage` se perde ao limpar o navegador, o app deve ter **exportar/importar backup em JSON**.
- Toda leitura/escrita no `localStorage` fica em try/catch e o app deve renderizar sem ele.
- Interface em português do Brasil. Datas `dd/mm/aaaa`, durações `01h30m`.
- O dado salvo tem um campo `version` para permitir migrações.

## Contexto do concurso
- Concurso: **TRT-4 (RS) 2026**. A prova está prevista para **27/12/2026**. O cronograma de 90 dias começa em 29/09/2026.
- Dois cargos, com editais verticalizados: **Analista Judiciário** e **Técnico Administrativo**. O app precisa permitir escolher o cargo, e cada um tem seu próprio conteúdo programático.
- Todos os arquivos de referência estão em `docs/`.

## Arquivos em `docs/`
| Arquivo | O que é | Papel no app |
|---|---|---|
| `cronograma_intensivo_90dias_trt4.xlsx` | Cronograma feito pela usuária. **É a referência do resultado final.** | Define o modelo de dados e a tela principal. |
| `CRONOGRAMA 120 DIAS TRT-4 _ PRÉ - EDITAL (1).pdf` | Cronograma de aulas do curso (41 págs). Cada linha é uma leitura, aula (bloco) ou banco de questões, com professor, data e duração. | Fonte de itens de estudo granulares (aulas e blocos). |
| `Edital-Verticalizado-trt4-2026-tecnico-administrativa.pdf` | Conteúdo programático do Técnico (13 págs). | Árvore disciplina → tópico. |
| `Edital-Verticalizado-trt4-2026-analista-judiciaria.pdf` | Conteúdo programático do Analista (21 págs). | Árvore disciplina → tópico. |

### Cronograma XLSX (modelo de referência)
Aba única, 90 linhas (Dia 01 a Dia 90), com cabeçalho congelado. Colunas:
`Dia` · `Data` · `Disciplina Principal` · `Conteúdo / Aulas / Leitura Detalhada` · `Tempo PDF` · `Tempo Vídeo/Questões` · `Tempo Total` · `Relevância (High Yield)` · `Status` · `Revisão R7 (7d)` · `Revisão R14 (14d)` · `Revisão R30 (30d)` · `Anotações / % Acertos`

- **Relevância:** `Altíssima` (60 dias), `Média` (23), `Alta` (5) e `Especial` (2: descanso e dia da prova).
- **Status:** `Pendente`, `Em Andamento` e `Concluído`. É um dropdown na planilha.
- **Revisão espaçada:** cada dia aponta para o dia em que será revisado em 7, 14 e 30 dias, no formato `R7: Dia 83 (disciplina)`. O app deve **calcular isso automaticamente** a partir da data de conclusão e do status.
- **Estrutura do plano:** teoria primeiro (Português, RLM, Constitucional, Administrativo, Trabalho, Processo do Trabalho, Gestão, AFO), depois dias de "Revisão & Questões", "Lei Seca", "Reta Final" e, no fim, véspera e prova. Os blocos de Direito do Trabalho e Processo do Trabalho são marcados como "NÚCLEO".
- Cerca de 3h de estudo por dia, divididas em leitura de PDF (~1h) e vídeo ou questões.
- Observação: os números de dia nas colunas R7/R14/R30 vêm preenchidos à mão e alguns são inconsistentes. O app deve **recalcular** em vez de importar.

### Cronograma do curso (PDF de 120 dias)
Tabela com as colunas `Assistido ☐ · Aula · Disciplina · Professor · Tipo da Aula · Data e hora · Duração · Anotações`.
- Tipos: `Exibição`, `Gravada`, `Leitura do Material` (1h), `Banco de Questões` (2h) e `Mentoria`.
- As datas são de dez/2025 a mar/2026, ou seja, **desatualizadas** em relação ao plano de 2026. Use o PDF só para conteúdo e duração dos blocos, nunca as datas.
- A extração de texto desse PDF é confusa (colunas misturadas). Se for importar de verdade, confira os dados.

### Editais verticalizados (PDF)
- Cada disciplina tem uma lista de tópicos e, ao lado, colunas de controle: `Conteúdo · Videoaulas · Questões · Revisão · Lei Seca`, mais as janelas `24 h · 7 dias · 30 dias · 90 dias` (revisão espaçada).
- **Conhecimentos gerais (ambos os cargos):** Língua Portuguesa, Matemática e Raciocínio Lógico, Noções de Direitos Humanos, Noções de Legislação (Regimento Interno do TRT-4, Resoluções CNJ e CSJT, Código de Conduta) e Noções de Informática. Também há Prova Discursiva (redação).
- **Técnico, específicos:** Noções de Direito Constitucional, Administrativo, do Trabalho, Processual do Trabalho e de Administração Pública.
- **Analista, específicos:** Direito Constitucional, Administrativo, Civil, Processual Civil, do Trabalho e Processual do Trabalho.
- Os PDFs têm links "CLIQUE AQUI" para materiais, que não vêm no texto extraído.

## Modelo de dados sugerido
- `Disciplina { id, nome, peso, relevancia }`
- `Topico { id, disciplinaId, titulo, cargo[] }`
- `DiaEstudo { id, n, data, disciplinaId, conteudo, minutosPdf, minutosVideo, relevancia, status, revisoes: {r7, r14, r30}, anotacoes, acertos }`
- Datas em ISO internamente, formatadas em `dd/mm/aaaa` só na exibição. Durações em minutos.

## Funcionalidades alvo
1. Visão tabela do cronograma, como o xlsx: filtros por disciplina, status e relevância, com status editável.
2. Visão "hoje / semana" e uma contagem regressiva até a prova.
3. Priorização por relevância, peso da disciplina e atraso, com ajuste manual.
4. Revisões espaçadas (R7/R14/R30) geradas automaticamente, com uma fila de revisões do dia.
5. Progresso por disciplina e por tópico do edital, com % de acertos nas questões.
6. Reagendar dias atrasados e recalcular as datas seguintes.
7. Importar o xlsx como carga inicial, além de exportar e importar JSON.

## Convenções
- Stack ainda não escolhida: Vite + React. Pergunte à usuária se quer TypeScript antes de iniciar.
- Antes de usar as bibliotecas de `docs/` (pypdf, openpyxl), instale-as em um venv fora do projeto. Não há `pdftotext` na máquina.
- Não commitar nem alterar os arquivos em `docs/`.
