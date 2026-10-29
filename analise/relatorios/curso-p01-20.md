# Cronograma do curso (120 dias) - páginas 1 a 20

Fonte: `analise/convertido/cronograma-120dias-curso.txt`. Dados estruturados: `curso-p01-20.json` (208 itens).
As datas (08/12/2025 a 08/02/2026) são do cronograma original e estão desatualizadas; são só registro, não plano.

Total das páginas 1-20: 208 itens, 145h52 (8752 min), 55 dias de calendário (08/12/2025 a 08/02/2026).

## Horas por tipo

| Tipo | Itens | Tempo |
|---|---|---|
| Exibição (aula ao vivo/blocos) | 145 | 70h45 |
| Leitura do Material | 45 | 45h00 (sempre 1h fixa) |
| Banco de Questões | 9 | 18h00 (sempre 2h fixas) |
| Gravada | 8 | 11h07 |
| Mentoria | 1 | 1h00 (Mentoria 01, classificada "Gravada" no PDF) |

Observação: há 2 blocos regulares marcados Gravada (Morfologia Bloco 10, Estatuto PcD Bloco 02) e 6 aulas gravadas de sábado, uma por disciplina (ver Padrões).

## Horas por disciplina

A coluna "Disciplina" do PDF na verdade traz o nome da AULA (e a coluna "Aula" traz o BLOCO). O nome da disciplina
não aparece em nenhuma linha, exceto nas aulas gravadas de sábado ("Língua Portuguesa - Prof. Patrick..."). Toda
disciplina marcada "inferida" no JSON (`disciplinaInferida: true`) foi deduzida do professor e da numeração das aulas.

| Disciplina | Tempo de aula | Observação |
|---|---|---|
| Língua Portuguesa | 29h45 | inferida (exceto a gravada de sábado) |
| Direito Constitucional | 13h42 | inferida (Ben Hur Botelho) |
| Matemática | 12h18 | inferida (Dudan) |
| Raciocínio Lógico | 8h47 | inferida (Gustavo Rodrigues, aulas 01-07) |
| Direito Administrativo | 4h31 | inferida (Ariel Zvoziak aula 01; Vinícius Filipin aulas 02-04) |
| Legislação Específica / Dir. Administrativo (incerta) | 6h06 | inferida, baixa confiança: Rafael Ravazolo, Aulas 05 LGPD, 06 Estatuto PcD, 07 Res. CNJ 400/2021 |
| Gestão Pública | 3h23 | gravada Patrícia Sostmeier (1h21, explícita) + Ravazolo aulas 01-02 "organizações formais"/"gestão pública x privada" (2h02, inferida) |
| Direito Processual do Trabalho | 1h43 | explícita (gravada de sábado, Cleize Kohls) |
| Direito do Trabalho | 1h37 | explícita (gravada de sábado, Luiz Henrique) |
| Mentoria | 1h00 | Mentoria 01 - Direcionamento AVA |
| (sem disciplina) | 63h00 | 45 Leituras + 9 Bancos de Questões: o PDF não diz de qual matéria |

Soma só de aulas (Exibição + Gravada): 82h52; mais mentoria 1h.

## Ordem em que as disciplinas aparecem

Primeira aparição (dia do cronograma): 1) Língua Portuguesa (dia 1), 2) Matemática (dia 2), 3) Raciocínio Lógico (dia 20),
4) Direito Processual do Trabalho (dia 24, gravada), 5) Gestão Pública (dia 30, gravada), 6) Direito do Trabalho (dia 42, gravada),
7) Direito Constitucional (dia 37 aula; gravada no dia 48), 8) Direito Administrativo (dia 44),
9) Legislação Específica/Ravazolo (dia 49), 10) Gestão Pública, aulas regulares (dia 52).

As disciplinas se alternam em blocos: Português e Matemática intercalados nos dias 1-20 , depois RLM entra no dia 20 em paralelo a Matemática/Português; Português continua até o dia 37;
Direito Constitucional e Direito Administrativo são intercalados nos dias 44-49; Ravazolo fecha com legislação e gestão.
Língua Portuguesa reaparece no dia 55 (Correção da Redação do Simulado 01, 13 min).

## Professores por disciplina

- Língua Portuguesa: Patrick Meneghetti (37 itens), Luana Teixeira Porto (18 itens: acentuação, pontuação, vozes verbais, regência, concordância, sintaxe, redação)
- Matemática: Dudan (24)
- Raciocínio Lógico: Gustavo Rodrigues (20)
- Direito Constitucional: Ben Hur Botelho (22)
- Direito Administrativo: Ariel Rocha Zvoziak (5, Lei 8.112), Vinícius Filipin (7: improbidade, processo administrativo, licitações)
- Legislação Específica / Gestão: Rafael Ravazolo (17: LGPD, Estatuto PcD, Res. CNJ 400, organizações formais, gestão pública x privada)
- Direito Processual do Trabalho: Cleize Kohls; Direito do Trabalho: Luiz Henrique Menegon Dutra; Gestão Pública (gravada): Patrícia Sostmeier
- Mentoria: Franciele Letícia Kühl

## Padrões

- Dias úteis (seg-sex, 46 dias): 1 Leitura do Material (1h) + cerca de 1h35 (média ~95 min, mediana 94) de aulas em 3 a 5 itens
  (blocos de 15 a 50 min). Fica abaixo do "2h" imaginado: o total do dia (leitura + aulas) é ~2h35.
- A Leitura costuma aparecer logo após os blocos do mesmo dia (ou antes) e, na prática, é a leitura do material do dia seguinte;
  a posição dentro do dia varia (1º item em 10 dias, 3º/4º em 31 dias). Não confie na posição relativa.
- Sábado (9 sábados: 13/12, 20/12, 27/12, 03/01, 10/01, 17/01, 24/01, 31/01, 07/02): Banco de Questões 2h fixas, a cada 7 dias
  (dias 6, 12, 18, 24, 30, 36, 42, 48, 54 do cronograma) e uma aula Gravada de revisão de 1h21 a 1h59 (13/12, 20/12 e 07/02 só têm Banco).
  Gravadas de sábado em ordem: Redação (Luana, 1h29), Dir. Proc. Trabalho (Cleize, 1h43), Gestão Pública (Patrícia, 1h21), Língua Portuguesa (Patrick, 1h59),
  Direito do Trabalho (Luiz Henrique, 1h37), Direito Constitucional (Ben Hur, 1h59).
- Domingo não aparece: nenhum item. Os saltos de data (sáb -> seg) são sempre 2 dias.
- Mentoria 01 (gravada, 1h, 15/12/2025 19:00): única mentoria nas págs. 1-20; é a única linha com horário diferente de 00:00.
- Blocos têm numeração que reinicia por aula ("Bloco 01 ...") e aulas de um mesmo professor continuam pela numeração de aula (Aula 01-19 de Português se espalham entre Patrick e Luana).
- O dia 55 (08/02/2026) tem apenas a Correção da Redação do Simulado 01 (13 min), sem Leitura.

## Problemas de extração e ambiguidades

1. Cabeçalho enganoso: "Aula" = nome do bloco, "Disciplina" = nome da aula. Disciplina real nunca aparece nas linhas regulares; foi inferida
   (flag `disciplinaInferida`). Leituras e Bancos ficam com `disciplina: null`.
2. Possível linha duplicada na quebra de página 18/19: "Bloco 03 - Estatuto da Pessoa com Deficiência" (24 min, 03/02/2026) aparece
   duas vezes, com uma Leitura entre elas (ordem 192 e 194; o 194 está marcado `possivelDuplicata: true`). Se for duplicata real, subtrair 24 min.
3. Textos de células quebram em várias linhas, às vezes com linhas antes e depois da linha da data; o parser usa a linha de duração como âncora
   e atribui linhas vizinhas por regras de posição. Há 3 correções manuais: Pontuação Bloco 01 (texto longo), Redação Oficial Bloco 03 (sufixo "Mensagem, E-mail, Ata... Apostila"),
   Licitações Bloco 02 ("... Dispensa de Licitação; Licitação Dispensada"). Os textos de bloco dessas linhas podem estar um pouco desordenados, mas durações, datas e aulas conferem.
4. Aulas com nome longo foram unificadas: ex. "Aula 05 | Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)" e "Aula 06 | Estatuto da Pessoa com Deficiência (Lei nº 13.146/2015)".
5. "Aula 03 | Dos direitos e garantias fundamentais" tem 8 blocos (págs. 12-13) e "Aula 06 | Morfologia" tem 13 blocos (págs. 3-4); nada faltando.
6. Aulas gravadas de sábado não têm "Aula NN": o campo `aula` repete "Disciplina - Prof. X" (ex. "Língua Portuguesa - Prof. Patrick Meneghetti"); a disciplina é explícita.
7. A "Prova discursiva (Redação)" (Luana) foi classificada em Língua Portuguesa. "Analisando a Redação" também.
8. A Leitura e o Banco de Questões não trazem disciplina nem professor; a Mentoria vem como "Gravada" no PDF (campo `tipoOriginal`) e foi tipada como "Mentoria".
9. Ravazolo, Aulas 05-07 (LGPD, Estatuto PcD, Res. CNJ 400): classificadas como "Direito Administrativo / Legislação Específica" por numeração contínua após as aulas de Direito Administrativo; baixa confiança.
10. Os ids `dia` no JSON são o índice do dia de calendário na ordem dos itens (1 = 08/12/2025), não o dia de plano de estudo.
