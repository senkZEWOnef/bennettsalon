import React, { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useAdmin } from '../contexts/AdminContextNew'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const [password, setPassword] = useState('')
  const [showError, setShowError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginLegacy } = useAdmin()
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setShowError('')
    
    if (loginLegacy(password)) {
      navigate('/admin/dashboard')
    } else {
      setShowError('Contraseña incorrecta. Por favor, inténtalo de nuevo.')
      setTimeout(() => setShowError(''), 3000)
    }
    setLoading(false)
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%),
                          radial-gradient(circle at 40% 80%, rgba(255,255,255,0.03) 0%, transparent 50%)`,
        zIndex: 1,
        pointerEvents: 'none'
      }}></div>

      <Container style={{ paddingTop: '120px', paddingBottom: '60px', position: 'relative', zIndex: 10 }}>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <Card style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="mb-3" style={{ 
                    fontSize: '4rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  } as React.CSSProperties}>💅</div>
                  <h2 className="mb-3" style={{
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  } as React.CSSProperties}>Admin Access</h2>
                  <p style={{ color: '#666', fontSize: '1.1rem' }}>
                    Acceso administrativo para Bennett Salon de Beauté
                  </p>
                </div>

                {showError && (
                  <Alert variant="danger" className="mb-4" style={{
                    borderRadius: '12px',
                    border: 'none',
                    background: 'rgba(220, 53, 69, 0.1)',
                    color: '#721c24'
                  }}>
                    {showError}
                  </Alert>
                )}

                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', color: '#4a5568' }}>
                      Contraseña de Administrador
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      size="lg"
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        padding: '16px 20px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        (e.target as HTMLElement).style.borderColor = '#667eea'
                        ;(e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                      }}
                      onBlur={(e) => {
                        (e.target as HTMLElement).style.borderColor = '#e2e8f0'
                        ;(e.target as HTMLElement).style.boxShadow = 'none'
                      }}
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      fontWeight: '600',
                      fontSize: '1.1rem',
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                        ;(e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        (e.target as HTMLElement).style.transform = 'translateY(0)'
                        ;(e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)'
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      <>🚪 Iniciar Sesión</>
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <small style={{ color: '#718096', fontSize: '0.9rem' }}>
                    Solo para uso administrativo autorizado
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AdminLogin