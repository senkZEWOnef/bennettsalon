import React, { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab } from 'react-bootstrap'
import { useAdmin } from '../contexts/AdminContextNew'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [legacyPassword, setLegacyPassword] = useState('')
  const [showError, setShowError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('new')
  const { login, loginLegacy } = useAdmin()
  const navigate = useNavigate()

  const handleNewLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setShowError('')
    
    try {
      const success = await login(username, password)
      if (success) {
        navigate('/admin/dashboard')
      } else {
        setShowError('Usuario o contraseña incorrectos')
        setTimeout(() => setShowError(''), 3000)
      }
    } catch (error) {
      setShowError('Error de conexión. Inténtalo de nuevo.')
      setTimeout(() => setShowError(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleLegacyLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setShowError('')
    
    if (loginLegacy(legacyPassword)) {
      navigate('/admin/dashboard')
    } else {
      setShowError('Contraseña incorrecta')
      setTimeout(() => setShowError(''), 3000)
    }
    setLoading(false)
  }

  return (
    <Container style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="salon-card">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}>🔐</div>
                <h2 className="mb-3">Admin Login</h2>
                <p className="text-muted">Acceso administrativo para Bennett Salon</p>
              </div>

              {showError && (
                <Alert variant="danger" className="mb-4">
                  {showError}
                </Alert>
              )}

              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || 'new')}
                className="mb-4"
                fill
              >
                <Tab eventKey="new" title="🆔 Login con Usuario">
                  <Form onSubmit={handleNewLogin} className="mt-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Usuario</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="admin, backdoor, test..."
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
                      {loading ? '🔄 Iniciando...' : '🚪 Iniciar Sesión'}
                    </Button>
                  </Form>
                </Tab>

                <Tab eventKey="legacy" title="🔑 Login Legacy">
                  <Form onSubmit={handleLegacyLogin} className="mt-4">
                    <Form.Group className="mb-4">
                      <Form.Label>Contraseña de Administrador (Legacy)</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Contraseña antigua"
                        value={legacyPassword}
                        onChange={(e) => setLegacyPassword(e.target.value)}
                        required
                        size="lg"
                      />
                      <Form.Text className="text-muted">
                        Modo de compatibilidad con la contraseña anterior
                      </Form.Text>
                    </Form.Group>

                    <Button 
                      type="submit" 
                      className="btn-outline-primary w-100" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? '🔄 Iniciando...' : '🔑 Login Legacy'}
                    </Button>
                  </Form>
                </Tab>
              </Tabs>

              <div className="text-center mt-4">
                <div className="mb-2">
                  <small className="text-muted d-block">
                    <strong>Cuentas disponibles:</strong>
                  </small>
                  <small className="text-muted d-block">
                    👑 <code>admin</code> - Cuenta principal
                  </small>
                  <small className="text-muted d-block">
                    🚪 <code>backdoor</code> - Acceso de emergencia
                  </small>
                  <small className="text-muted d-block">
                    🧪 <code>test</code> - Cuenta de pruebas
                  </small>
                </div>
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