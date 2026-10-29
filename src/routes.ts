import { BarChart3, CalendarCheck, FileSearch, ListChecks, RefreshCw, Save, Table2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Rota {
  path: string
  titulo: string
  sub: string
  icone: LucideIcon
}

export const ROTAS: Rota[] = [
  { path: 'hoje', titulo: 'Hoje', sub: 'O que estudar agora', icone: CalendarCheck },
  { path: 'cronograma', titulo: 'Cronograma', sub: 'Os 90 dias de estudo', icone: Table2 },
  { path: 'revisoes', titulo: 'Revisões', sub: 'O que precisa ser revisado', icone: RefreshCw },
  { path: 'progresso', titulo: 'Progresso', sub: 'Sua evolução por matéria', icone: BarChart3 },
  { path: 'edital', titulo: 'Edital', sub: 'Checklist do conteúdo programático', icone: ListChecks },
  { path: 'provas', titulo: 'Provas anteriores', sub: 'Treino com a banca FCC', icone: FileSearch },
  { path: 'backup', titulo: 'Backup', sub: 'Seus dados e configurações', icone: Save },
]
