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
      backgroundColor: '#F8F9FA',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <Card style={{
              background: 'white',
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px auto',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                  }}>
                    <span style={{ fontSize: '2.5rem' }}>💅</span>
                  </div>
                  <h3 className="mb-3" style={{
                    fontWeight: '600',
                    color: '#2C3E50',
                    fontSize: '1.5rem'
                  }}>Welcome Back</h3>
                  <p style={{ color: '#95A5A6', fontSize: '14px', margin: '0' }}>
                    Sign in to Bennett Salon Admin Panel
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
                    <Form.Label style={{ fontWeight: '500', color: '#2C3E50', fontSize: '14px' }}>
                      Admin Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #E9ECEF',
                        padding: '12px 16px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        backgroundColor: '#F8F9FA'
                      }}
                      onFocus={(e) => {
                        (e.target as HTMLElement).style.borderColor = '#667eea'
                        ;(e.target as HTMLElement).style.backgroundColor = 'white'
                        ;(e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                      }}
                      onBlur={(e) => {
                        (e.target as HTMLElement).style.borderColor = '#E9ECEF'
                        ;(e.target as HTMLElement).style.backgroundColor = '#F8F9FA'
                        ;(e.target as HTMLElement).style.boxShadow = 'none'
                      }}
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontWeight: '500',
                      fontSize: '14px',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)',
                      transition: 'all 0.2s ease',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        (e.target as HTMLElement).style.transform = 'translateY(-1px)'
                        ;(e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        (e.target as HTMLElement).style.transform = 'translateY(0)'
                        ;(e.target as HTMLElement).style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.2)'
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      <>Sign In</>
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <small style={{ color: '#95A5A6', fontSize: '12px' }}>
                    Authorized admin access only
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