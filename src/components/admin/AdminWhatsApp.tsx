import React, { useState } from 'react'
import { Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap'
import { useAdmin } from '../../contexts/AdminContext'

const AdminWhatsApp = () => {
  const { whatsappSettings, updateWhatsAppSettings } = useAdmin()
  const [settings, setSettings] = useState(whatsappSettings)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState<'success' | 'danger'>('success')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!settings.adminNumber) {
      setAlertMessage('El número de WhatsApp del admin es requerido.')
      setAlertType('danger')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
      return
    }

    updateWhatsAppSettings(settings)
    setAlertMessage('¡Configuración de WhatsApp guardada exitosamente!')
    setAlertType('success')
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const handleTestMessage = () => {
    const testMessage = `🧪 *MENSAJE DE PRUEBA*

Hola, este es un mensaje de prueba del sistema de notificaciones de WhatsApp de ${settings.businessName}.

Si recibiste este mensaje, la configuración está funcionando correctamente! 🎉

*${settings.businessName} - Sistema de Reservas*`
    
    const encodedMessage = encodeURIComponent(testMessage)
    const testURL = `https://wa.me/${settings.adminNumber.replace(/\D/g, '')}?text=${encodedMessage}`
    
    window.open(testURL, '_blank')
  }

  const formatPhoneDisplay = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
    }
    return phone
  }

  return (
    <>
      {showAlert && (
        <Alert 
          variant={alertType} 
          className="mb-4"
          style={{ 
            background: alertType === 'success' 
              ? 'rgba(40, 167, 69, 0.1)' 
              : 'rgba(220, 53, 69, 0.1)',
            border: `1px solid ${alertType === 'success' 
              ? 'rgba(40, 167, 69, 0.3)' 
              : 'rgba(220, 53, 69, 0.3)'}`,
            borderRadius: '15px',
            color: alertType === 'success' ? '#28a745' : '#dc3545',
            fontWeight: '600'
          }}
        >
          {alertType === 'success' ? '✅' : '❌'} {alertMessage}
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <Card style={{ 
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <Card.Header style={{ 
              background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
              border: 'none',
              borderRadius: '20px 20px 0 0',
              padding: '20px 24px'
            }}>
              <h4 style={{ 
                margin: 0,
                fontWeight: '700',
                color: 'white'
              }}>📱 Configuración de WhatsApp</h4>
            </Card.Header>
            <Card.Body style={{ padding: '32px' }}>
              <Form onSubmit={handleSave}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Estado de Notificaciones</Form.Label>
                      <Form.Check 
                        type="switch"
                        id="enable-notifications"
                        label={settings.enableNotifications ? "Activadas" : "Desactivadas"}
                        checked={settings.enableNotifications}
                        onChange={(e) => setSettings({...settings, enableNotifications: e.target.checked})}
                      />
                      <Form.Text className="text-muted">
                        {settings.enableNotifications 
                          ? "Las notificaciones de WhatsApp se enviarán automáticamente" 
                          : "Las notificaciones están desactivadas"
                        }
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Número del Admin (WhatsApp)</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>📱</InputGroup.Text>
                        <Form.Control
                          type="tel"
                          placeholder="787-000-0000"
                          value={settings.adminNumber}
                          onChange={(e) => setSettings({...settings, adminNumber: e.target.value})}
                          required
                        />
                      </InputGroup>
                      <Form.Text className="text-muted">
                        Formato mostrado: {formatPhoneDisplay(settings.adminNumber)}
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Negocio</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Bennett Salon de Beauté"
                    value={settings.businessName}
                    onChange={(e) => setSettings({...settings, businessName: e.target.value})}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Dirección del Negocio</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Aguada, Puerto Rico"
                    value={settings.businessAddress}
                    onChange={(e) => setSettings({...settings, businessAddress: e.target.value})}
                    required
                  />
                </Form.Group>

                <div className="d-flex gap-3">
                  <Button 
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '15px',
                      padding: '12px 24px',
                      fontWeight: '700',
                      fontSize: '1rem',
                      color: 'white',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                      ;(e.target as HTMLElement).style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.transform = 'translateY(0)'
                      ;(e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    💾 Guardar Configuración
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleTestMessage}
                    disabled={!settings.adminNumber}
                    style={{
                      background: settings.adminNumber 
                        ? 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)' 
                        : 'rgba(108, 117, 125, 0.1)',
                      border: settings.adminNumber 
                        ? 'none' 
                        : '1px solid rgba(108, 117, 125, 0.3)',
                      borderRadius: '15px',
                      padding: '12px 24px',
                      fontWeight: '700',
                      fontSize: '1rem',
                      color: settings.adminNumber ? 'white' : '#6c757d',
                      boxShadow: settings.adminNumber 
                        ? '0 6px 20px rgba(37, 211, 102, 0.3)' 
                        : 'none',
                      transition: 'all 0.3s ease',
                      cursor: settings.adminNumber ? 'pointer' : 'not-allowed'
                    }}
                    onMouseEnter={(e) => {
                      if (settings.adminNumber) {
                        (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                        ;(e.target as HTMLElement).style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.4)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (settings.adminNumber) {
                        (e.target as HTMLElement).style.transform = 'translateY(0)'
                        ;(e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.3)'
                      }
                    }}
                  >
                    🧪 Enviar Mensaje de Prueba
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card style={{ 
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <Card.Header style={{ 
              background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
              border: 'none',
              borderRadius: '20px 20px 0 0',
              padding: '16px 20px'
            }}>
              <h5 style={{ 
                margin: 0,
                fontWeight: '700',
                color: 'white'
              }}>ℹ️ Información</h5>
            </Card.Header>
            <Card.Body style={{ padding: '20px' }}>
              <h6>¿Cómo funciona?</h6>
              <ul className="small">
                <li><strong>Confirmación automática:</strong> Cuando confirmes una cita, se abrirán dos ventanas de WhatsApp automáticamente.</li>
                <li><strong>Cliente:</strong> Recibe confirmación con detalles de la cita.</li>
                <li><strong>Admin:</strong> Recibe notificación de la nueva cita confirmada.</li>
              </ul>

              <h6 className="mt-3">Formato del número:</h6>
              <ul className="small">
                <li>Puerto Rico: 787-123-4567</li>
                <li>Estados Unidos: 1-555-123-4567</li>
                <li>Internacional: +1-787-123-4567</li>
              </ul>

              <div className="mt-3 p-2 bg-light rounded">
                <small className="text-muted">
                  <strong>Tip:</strong> Usa el botón "Enviar Mensaje de Prueba" para verificar que tu número funcione correctamente.
                </small>
              </div>
            </Card.Body>
          </Card>

          <Card className="mt-3" style={{ 
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <Card.Header style={{ 
              background: 'linear-gradient(135deg, #ffc107 0%, #ff8f00 100%)',
              border: 'none',
              borderRadius: '20px 20px 0 0',
              padding: '16px 20px'
            }}>
              <h5 style={{ 
                margin: 0,
                fontWeight: '700',
                color: 'white'
              }}>📋 Vista Previa del Mensaje</h5>
            </Card.Header>
            <Card.Body style={{ padding: '20px' }}>
              <small className="text-muted">
                <strong>Para el cliente:</strong><br/>
                "¡Hola [Nombre]! 💅✨<br/>
                Tu cita en {settings.businessName} ha sido CONFIRMADA.<br/>
                📅 Detalles de tu cita:<br/>
                • Servicio: [Servicio]<br/>
                • Fecha: [Fecha]<br/>
                • Hora: [Hora]<br/>
                • Ubicación: {settings.businessAddress}<br/>
                ¡Nos vemos pronto! 💖"
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default AdminWhatsApp