export const hojeISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const parse = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const addDias = (iso: string, n: number) => {
  const d = parse(iso)
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const diffDias = (a: string, b: string) =>
  Math.round((parse(a).getTime() - parse(b).getTime()) / 86_400_000)

export const fmtData = (iso: string) => iso.split('-').reverse().join('/')

export const fmtDiaSemana = (iso: string) =>
  parse(iso).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')

export const fmtMin = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}h${String(min % 60).padStart(2, '0')}m`
