// Gera src/data/seed.json a partir do cronograma convertido do xlsx.
import { readFileSync, writeFileSync } from 'node:fs'

const rows = JSON.parse(readFileSync('analise/convertido/cronograma-90dias.json', 'utf8'))
const minutos = (s) => {
  const m = /(\d+)h(\d+)m/.exec(s ?? '')
  return m ? Number(m[1]) * 60 + Number(m[2]) : 0
}
const iso = (s) => s.split('/').reverse().join('-')

const dias = rows.map((r) => ({
  id: r.Dia.toLowerCase().replace(/\s+/g, '-'),
  n: Number(r.Dia.replace(/\D/g, '')),
  data: iso(r.Data),
  disciplina: r['Disciplina Principal'],
  conteudo: r['Conteúdo / Aulas / Leitura Detalhada'],
  minPdf: minutos(r['Tempo PDF']),
  minVideo: minutos(r['Tempo Vídeo/Questões']),
  relevancia: r['Relevância (High Yield)'],
  status: r.Status,
  anotacoes: '',
  acertos: null,
  revisoes: { r7: false, r14: false, r30: false },
}))
writeFileSync('src/data/seed.json', JSON.stringify(dias, null, 1))
console.log(dias.length, 'dias')
