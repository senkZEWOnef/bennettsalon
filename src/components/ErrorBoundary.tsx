import { Component, ReactNode, ErrorInfo } from 'react'
import { Container, Row, Col, Alert, Button } from 'react-bootstrap'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true, error: null, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })
    
    // Log error to console in development
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="mt-5 pt-5">
          <Row className="justify-content-center">
            <Col lg={8}>
              <Alert variant="danger" className="text-center">
                <h4>🙋‍♀️ ¡Ups! Algo salió mal</h4>
                <p className="mb-3">
                  Nuestro sistema tuvo un pequeño inconveniente. No te preocupes, 
                  nuestro equipo técnico ya está trabajando en solucionarlo.
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <Button variant="primary" onClick={this.handleReload}>
                    🔄 Recargar Página
                  </Button>
                  <Button variant="outline-primary" href="/">
                    🏠 Ir al Inicio
                  </Button>
                </div>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-3 text-start">
                    <summary>Detalles del Error (Solo visible en desarrollo)</summary>
                    <pre className="mt-2 p-3 bg-light rounded">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
              </Alert>
            </Col>
          </Row>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary