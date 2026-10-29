import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface State {
  erro: Error | null
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { erro: null }

  static getDerivedStateFromError(erro: Error): State {
    return { erro }
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    console.error(erro, info.componentStack)
  }

  render() {
    if (!this.state.erro) return this.props.children
    return (
      <div className="vazio" role="alert">
        <p>Algo deu errado ao exibir esta tela.</p>
        <button className="btn" onClick={() => this.setState({ erro: null })}>
          Tentar de novo
        </button>
      </div>
    )
  }
}
