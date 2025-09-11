import { Spinner, Container, Row, Col } from 'react-bootstrap'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm'
  centered?: boolean
}

const LoadingSpinner = ({ 
  message = "Cargando...", 
  size, 
  centered = true 
}: LoadingSpinnerProps) => {
  const content = (
    <div className="text-center">
      <Spinner animation="border" variant="primary" size={size} />
      {message && (
        <p className="mt-3 text-muted">
          {message}
        </p>
      )}
    </div>
  )

  if (centered) {
    return (
      <Container>
        <Row className="justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <Col xs="auto">
            {content}
          </Col>
        </Row>
      </Container>
    )
  }

  return content
}

export default LoadingSpinner