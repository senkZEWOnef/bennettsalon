import React, { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useAdmin } from '../contexts/AdminContextNew'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showError, setShowError] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAdmin()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setShowError(false)

    try {
      const success = await login(username, password)
      if (success) {
        navigate('/admin/dashboard')
      } else {
        setShowError(true)
        setTimeout(() => setShowError(false), 3000)
      }
    } catch (error) {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    } finally {
      setLoading(false)
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
                  Usuario o contraseña incorrecta. Por favor, inténtalo de nuevo.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    size="lg"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
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
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Iniciando...
                    </>
                  ) : (
                    '🚪 Iniciar Sesión'
                  )}
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