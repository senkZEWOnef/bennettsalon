import React, { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useAdmin } from '../contexts/AdminContext'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const [password, setPassword] = useState('')
  const [showError, setShowError] = useState(false)
  const { login } = useAdmin()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(password)) {
      navigate('/admin/dashboard')
    } else {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    }
  }

  return (
    <Container style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="salon-card">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}>🔐</div>
                <h2 className="mb-3">Admin Login</h2>
                <p className="text-muted">Acceso administrativo para Bennett Salon</p>
              </div>

              {showError && (
                <Alert variant="danger" className="mb-4">
                  Contraseña incorrecta. Por favor, inténtalo de nuevo.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Contraseña de Administrador</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingresa la contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    size="lg"
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  className="btn-primary w-100" 
                  size="lg"
                >
                  🚪 Iniciar Sesión
                </Button>
              </Form>

              <div className="text-center mt-4">
                <small className="text-muted">
                  Solo para uso administrativo de Bennett Salon de Beauté
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AdminLogin