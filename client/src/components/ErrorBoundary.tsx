import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-page">
          <AlertTriangle size={42} />
          <h1>Não foi possível carregar esta tela.</h1>
          <p>Os dados locais continuam preservados. Recarregue a página para tentar novamente.</p>
          <button className="btn btn-primary btn-md" onClick={() => window.location.reload()}>Recarregar</button>
        </main>
      );
    }
    return this.props.children;
  }
}
