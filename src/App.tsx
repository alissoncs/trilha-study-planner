import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './StoreContext'
import { Layout } from './Layout'
import Hoje from './views/Hoje'
import Cronograma from './views/Cronograma'
import Revisoes from './views/Revisoes'
import Progresso from './views/Progresso'
import EditalView from './views/EditalView'
import Provas from './views/Provas'
import Backup from './views/Backup'

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
