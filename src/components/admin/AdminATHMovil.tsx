import { useState } from 'react'
import { Row, Col, Card, Alert, Button, Form, InputGroup } from 'react-bootstrap'

const AdminATHMovil = () => {
  const [showToken, setShowToken] = useState(false)
  const currentToken = (import.meta as any).env.VITE_ATHM_BUSINESS_TOKEN

  const testATHConfiguration = () => {
    if (window.ATHM_Checkout) {
      alert('✅ ATH Móvil está correctamente cargado y listo para usar.')
    } else {
      alert('❌ ATH Móvil no está disponible. Verifica que el script esté cargado.')
    }
  }

  return (
    <>
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">📱 Configuración ATH Móvil</h5>
            </Card.Header>
            <Card.Body>
              <Alert variant="info">
                <h6>ℹ️ Sistema de Pagos Configurado</h6>
                <p className="mb-0">
                  Bennett Salon está configurado para usar <strong>únicamente ATH Móvil</strong> como método de pago para depósitos. 
                  Este es el sistema oficial de pagos de Puerto Rico.
                </p>
              </Alert>

              <div className="mb-4">
                <h6>🔧 Estado de la Configuración</h6>
                <div className="d-flex align-items-center mb-2">
                  <span className="me-2">Token de Negocio:</span>
                  {currentToken ? (
                    <span className="badge bg-success">✅ Configurado</span>
                  ) : (
                    <span className="badge bg-warning">⚠️ Usando Sandbox</span>
                  )}
                </div>
                
                <Form.Group className="mb-3">
                  <Form.Label>Token de Negocio ATH Móvil</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showToken ? "text" : "password"}
                      value={currentToken || "sandbox (modo de prueba)"}
                      readOnly
                      className="bg-light"
                    />
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setShowToken(!showToken)}
                    >
                      {showToken ? '🙈' : '👁️'}
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Para cambiar el token, actualiza la variable <code>VITE_ATHM_BUSINESS_TOKEN</code> en el archivo .env
                  </Form.Text>
                </Form.Group>

                <Button 
                  variant="primary" 
                  onClick={testATHConfiguration}
                  className="me-2"
                >
                  🧪 Probar Configuración
                </Button>
              </div>

              <div className="bg-light p-3 rounded">
                <h6>📋 Configuración Actual</h6>
                <ul className="mb-0 small">
                  <li><strong>Depósito:</strong> $20.00 USD</li>
                  <li><strong>Tiempo límite:</strong> 30 minutos</li>
                  <li><strong>Idioma:</strong> Español</li>
                  <li><strong>Modo:</strong> {currentToken ? 'Producción' : 'Sandbox (Pruebas)'}</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">🚀 Cómo Activar ATH Móvil</h6>
            </Card.Header>
            <Card.Body>
              <div className="small">
                <h6>1. Obtener Token de Negocio</h6>
                <ul>
                  <li>Registrarse en <a href="https://athmovil.com/business" target="_blank" rel="noopener noreferrer">athmovil.com/business</a></li>
                  <li>Completar verificación de negocio</li>
                  <li>Obtener el <strong>Public Token</strong></li>
                </ul>

                <h6 className="mt-3">2. Configurar Token</h6>
                <ul>
                  <li>Editar archivo <code>.env</code></li>
                  <li>Actualizar: <code>VITE_ATHM_BUSINESS_TOKEN="tu_token_aqui"</code></li>
                  <li>Reiniciar la aplicación</li>
                </ul>

                <h6 className="mt-3">3. Verificar</h6>
                <ul>
                  <li>Usar el botón "Probar Configuración"</li>
                  <li>Hacer una transacción de prueba</li>
                  <li>Verificar notificaciones WhatsApp</li>
                </ul>
              </div>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Header>
              <h6 className="mb-0">💳 Información de Pagos</h6>
            </Card.Header>
            <Card.Body>
              <div className="small">
                <h6>Depósitos Requeridos</h6>
                <p>Todos los servicios requieren un depósito de <strong>$20</strong> para confirmar la cita.</p>
                
                <h6>Métodos Aceptados</h6>
                <ul className="mb-2">
                  <li>📱 ATH Móvil (Automático)</li>
                  <li>👩‍💼 Confirmación Manual (Admin)</li>
                </ul>
                
                <div className="bg-warning bg-opacity-10 p-2 rounded">
                  <small>
                    <strong>Nota:</strong> Stripe fue removido del sistema. Solo se acepta ATH Móvil para pagos automáticos.
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">📊 Flujo de Pagos</h6>
            </Card.Header>
            <Card.Body>
              <div className="row text-center">
                <div className="col-md-2">
                  <div className="p-3 bg-primary bg-opacity-10 rounded mb-2">
                    <div style={{ fontSize: '2rem' }}>📅</div>
                  </div>
                  <small><strong>1. Cliente reserva cita</strong></small>
                </div>
                <div className="col-md-2">
                  <div className="p-3 bg-warning bg-opacity-10 rounded mb-2">
                    <div style={{ fontSize: '2rem' }}>⏰</div>
                  </div>
                  <small><strong>2. 30 min para pagar</strong></small>
                </div>
                <div className="col-md-2">
                  <div className="p-3 bg-info bg-opacity-10 rounded mb-2">
                    <div style={{ fontSize: '2rem' }}>📱</div>
                  </div>
                  <small><strong>3. Pago ATH Móvil</strong></small>
                </div>
                <div className="col-md-2">
                  <div className="p-3 bg-success bg-opacity-10 rounded mb-2">
                    <div style={{ fontSize: '2rem' }}>✅</div>
                  </div>
                  <small><strong>4. Cita confirmada</strong></small>
                </div>
                <div className="col-md-2">
                  <div className="p-3 bg-success bg-opacity-10 rounded mb-2">
                    <div style={{ fontSize: '2rem' }}>💬</div>
                  </div>
                  <small><strong>5. WhatsApp enviado</strong></small>
                </div>
                <div className="col-md-2">
                  <div className="p-3 bg-secondary bg-opacity-10 rounded mb-2">
                    <div style={{ fontSize: '2rem' }}>🎉</div>
                  </div>
                  <small><strong>6. Cliente notificado</strong></small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default AdminATHMovil