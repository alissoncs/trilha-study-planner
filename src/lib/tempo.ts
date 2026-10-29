export const minutosDe = (d: { minPdf: number; minVideo: number }) => d.minPdf + d.minVideo
export const somaMin = (ds: { minPdf: number; minVideo: number }[]) => ds.reduce((s, d) => s + minutosDe(d), 0)
export const percentual = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0)
export const mediaAcertos = (ds: { acertos: number | null }[]) => {
  const ac = ds.map((d) => d.acertos).filter((a): a is number => a !== null)
  return ac.length ? Math.round(ac.reduce((s, a) => s + a, 0) / ac.length) : null
}
