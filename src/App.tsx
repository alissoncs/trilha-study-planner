import { lazy } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './StoreContext'
import { Layout } from './Layout'
const Hoje = lazy(() => import('./views/Hoje'))
const Cronograma = lazy(() => import('./views/Cronograma'))
const Revisoes = lazy(() => import('./views/Revisoes'))
const Progresso = lazy(() => import('./views/Progresso'))
const EditalView = lazy(() => import('./views/EditalView'))
const Provas = lazy(() => import('./views/Provas'))
const Backup = lazy(() => import('./views/Backup'))

// HashRouter: o app é estático (base './') e funciona em qualquer hospedagem, sem configurar fallback de rotas.
export default function App() {
  return (
    <HashRouter>
      <StoreProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/hoje" replace />} />
            <Route path="hoje" element={<Hoje />} />
            <Route path="cronograma" element={<Cronograma />} />
            <Route path="revisoes" element={<Revisoes />} />
            <Route path="progresso" element={<Progresso />} />
            <Route path="edital" element={<EditalView />} />
            <Route path="provas" element={<Provas />} />
            <Route path="backup" element={<Backup />} />
            <Route path="*" element={<Navigate to="/hoje" replace />} />
          </Route>
        </Routes>
      </StoreProvider>
    </HashRouter>
  )
}
