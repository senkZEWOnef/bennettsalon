import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Alert, Modal } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAdmin } from '../contexts/AdminContext'

// Declare ATH Móvil global functions
declare global {
  interface Window {
    ATHM_Checkout?: {
      config: (config: any) => void
      checkout: () => void
    }
  }
}

interface BookingData {
  id: string
  date: Date
  time: string
  service: string
  clientName: string
  clientEmail: string
  clientPhone: string
}

const Payment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { updateBookingStatus } = useAdmin()
  
  const [booking] = useState<BookingData | null>(location.state?.booking || null)
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'ath' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [athMobilReady, setAthMobilReady] = useState(false)

  // Initialize ATH Móvil
  useEffect(() => {
    // Check if ATH Móvil script is loaded
    const checkATHMLoaded = () => {
      if (window.ATHM_Checkout) {
        setAthMobilReady(true)
        setupATHMPayment()
      } else {
        setTimeout(checkATHMLoaded, 100)
      }
    }
    checkATHMLoaded()
  }, [])

  // Timer countdown
  useEffect(() => {
    if (!booking) {
      navigate('/booking')
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired - cancel booking
          updateBookingStatus(booking.id, 'cancelled')
          navigate('/booking', { 
            state: { message: 'Tiempo expirado. Por favor, reserva nuevamente.' }
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [booking, navigate, updateBookingStatus])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // ATH Móvil callback functions
  const authorizationATHM = (data: any) => {
    console.log('ATH Móvil Payment Authorized:', data)
    if (booking) {
      updateBookingStatus(booking.id, 'confirmed', 'ath')
      navigate('/booking', {
        state: { 
          message: '🎉 ¡Pago con ATH Móvil confirmado! Tu cita ha sido reservada exitosamente. Recibirás notificaciones por WhatsApp.',
          type: 'success'
        }
      })
    }
  }

  const cancelATHM = (data: any) => {
    console.log('ATH Móvil Payment Cancelled:', data)
    setIsProcessing(false)
    setPaymentMethod(null)
  }

  const expiredATHM = (data: any) => {
    console.log('ATH Móvil Payment Expired:', data)
    setIsProcessing(false)
    setPaymentMethod(null)
  }

  // Setup ATH Móvil configuration
  const setupATHMPayment = () => {
    if (!window.ATHM_Checkout || !booking) return

    const config = {
      publicToken: import.meta.env.VITE_ATHM_BUSINESS_TOKEN || "sandbox", // Replace with actual ATH Móvil business token
      timeout: 600, // 10 minutes timeout
      theme: "btn",
      lang: "es",
      total: 25.00,
      tax: 0,
      subtotal: 25.00,
      metadata1: `Booking ID: ${booking.id}`,
      metadata2: `Client: ${booking.clientName}`,
      phone: booking.clientPhone.replace(/[^0-9]/g, ''), // Remove non-numeric characters
      email: booking.clientEmail,
      authorizationATHM,
      cancelATHM,
      expiredATHM,
      items: [
        {
          name: booking.service,
          description: `Depósito para cita del ${booking.date.toLocaleDateString('es-PR')} a las ${booking.time}`,
          quantity: "1",
          price: "25.00",
          tax: "0",
          metadata: `Date: ${booking.date.toISOString().split('T')[0]} Time: ${booking.time}`
        }
      ]
    }

    window.ATHM_Checkout.config(config)
  }

  const handlePayment = () => {
    setPaymentMethod('ath')
    setIsProcessing(true)
    
    if (window.ATHM_Checkout && athMobilReady) {
      // Trigger ATH Móvil payment
      window.ATHM_Checkout.checkout()
    } else {
      setIsProcessing(false)
      setPaymentMethod(null)
      // Show error message if ATH Móvil is not ready
      alert('ATH Móvil no está disponible en este momento. Por favor, intenta de nuevo en unos segundos.')
    }
  }

  const handleCancel = () => {
    if (booking) {
      updateBookingStatus(booking.id, 'cancelled')
      navigate('/booking', {
        state: { 
          message: 'Reserva cancelada. El horario está nuevamente disponible.',
          type: 'info'
        }
      })
    }
  }

  if (!booking) {
    return (
      <section className="services-section" style={{ minHeight: '100vh' }}>
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
          <div className="text-center">
            <h2>No se encontró información de reserva</h2>
            <Button href="/booking" className="btn-primary mt-3">
              Volver a Reservar
            </Button>
          </div>
        </Container>
      </section>
    )
  }

  const depositAmount = 25 // $25 USD deposit

  return (
    <section className="services-section" style={{ minHeight: '100vh' }}>
      <Container style={{ paddingTop: '120px', paddingBottom: '60px' }}>
        <Row>
          <Col lg={8} className="mx-auto">
            {/* Timer Alert */}
            <Alert variant={timeLeft < 300 ? "danger" : "warning"} className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <strong>⏰ Tiempo restante para completar el pago:</strong>
                </span>
                <span className="fs-4 fw-bold">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <small>
                Tu reserva se cancelará automáticamente si no completas el pago a tiempo.
              </small>
            </Alert>

            {/* Booking Summary */}
            <Card className="salon-card mb-4">
              <Card.Body className="p-4">
                <h3 className="mb-3">📋 Resumen de tu Cita</h3>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>Servicio:</strong>
                      <div>{booking.service}</div>
                    </div>
                    <div className="mb-3">
                      <strong>Fecha:</strong>
                      <div>{booking.date.toLocaleDateString('es-PR')}</div>
                    </div>
                    <div className="mb-3">
                      <strong>Hora:</strong>
                      <div>{booking.time}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>Cliente:</strong>
                      <div>{booking.clientName}</div>
                    </div>
                    <div className="mb-3">
                      <strong>Email:</strong>
                      <div>{booking.clientEmail}</div>
                    </div>
                    <div className="mb-3">
                      <strong>Teléfono:</strong>
                      <div>{booking.clientPhone}</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Payment Options */}
            <Card className="salon-card mb-4">
              <Card.Body className="p-4">
                <h3 className="mb-4">📱 Confirma tu Cita con ATH Móvil</h3>
                
                <div className="text-center mb-4">
                  <div className="display-6 fw-bold text-primary mb-2">
                    ${depositAmount} USD
                  </div>
                  <p className="text-muted">
                    Depósito requerido para confirmar tu cita
                  </p>
                </div>

                <Row className="justify-content-center">
                  <Col lg={8} md={10}>
                    <Card 
                      className={`payment-option ${paymentMethod === 'ath' ? 'selected' : ''}`}
                      style={{ 
                        cursor: (isProcessing || !athMobilReady) ? 'not-allowed' : 'pointer',
                        border: paymentMethod === 'ath' ? '3px solid #ff6b35' : '2px solid #ff6b35',
                        opacity: athMobilReady ? 1 : 0.7,
                        boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)'
                      }}
                      onClick={() => !isProcessing && athMobilReady && handlePayment()}
                    >
                      <Card.Body className="text-center p-5">
                        <div className="mb-4">
                          <div style={{ 
                            fontSize: '5rem',
                            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                            webkitBackgroundClip: 'text',
                            webkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}>📱</div>
                        </div>
                        <h3 className="mb-3" style={{ color: '#ff6b35', fontWeight: '700' }}>
                          Paga con ATH Móvil
                        </h3>
                        <p className="text-muted mb-4 fs-5">
                          El sistema de pago oficial de Puerto Rico.<br/>
                          <strong>Rápido, seguro y confiable.</strong>
                        </p>
                        
                        <div className="mb-4">
                          <div className="bg-light rounded p-3 mb-3">
                            <h5 className="mb-2">💡 ¿Cómo funciona?</h5>
                            <small className="text-muted">
                              1. Presiona "Pagar Ahora"<br/>
                              2. Se abrirá ATH Móvil en tu teléfono<br/>
                              3. Autoriza el pago de $25<br/>
                              4. ¡Tu cita quedará confirmada!
                            </small>
                          </div>
                        </div>

                        <Button 
                          variant="warning"
                          disabled={isProcessing || !athMobilReady}
                          className="w-100 py-3"
                          style={{
                            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                            border: 'none',
                            borderRadius: '15px',
                            fontSize: '1.2rem',
                            fontWeight: '700',
                            boxShadow: '0 5px 15px rgba(255, 107, 53, 0.4)',
                            color: 'white'
                          }}
                          onClick={handlePayment}
                        >
                          {isProcessing && paymentMethod === 'ath' ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Procesando Pago...
                            </>
                          ) : !athMobilReady ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Cargando ATH Móvil...
                            </>
                          ) : (
                            <>
                              💰 Pagar $25 con ATH Móvil
                            </>
                          )}
                        </Button>
                        
                        {/* ATH Móvil Button Container */}
                        <div id="ATHMovil_Checkout_Button_payment" style={{ display: 'none' }}></div>
                        
                        {athMobilReady && (
                          <div className="mt-3">
                            <small className="text-success">
                              ✅ ATH Móvil listo para procesar tu pago
                            </small>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <div className="text-center mt-4">
                  <Button 
                    variant="outline-danger" 
                    onClick={() => setShowCancelModal(true)}
                    disabled={isProcessing}
                  >
                    Cancelar Reserva
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Information */}
            <Card className="salon-card">
              <Card.Body className="p-4">
                <h5>ℹ️ Información Importante</h5>
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-primary">💰 Sobre el Depósito</h6>
                    <ul className="small">
                      <li>El depósito de <strong>$25</strong> se aplicará al costo total de tu servicio</li>
                      <li>Solo aceptamos <strong>ATH Móvil</strong> para depósitos</li>
                      <li>El pago es seguro y está procesado por ATH Móvil</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-warning">⏰ Tiempo y Confirmación</h6>
                    <ul className="small">
                      <li>Tienes <strong>30 minutos</strong> para completar el pago</li>
                      <li>Recibirás notificación por <strong>WhatsApp</strong> al confirmar</li>
                      <li>Para cambios, contacta al salón con 24 horas de anticipación</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-3 p-3 bg-light rounded">
                  <h6 className="mb-2">📱 ¿No tienes ATH Móvil?</h6>
                  <small className="text-muted">
                    ATH Móvil es gratuito y fácil de instalar. Descárgalo desde:
                    <br/>
                    📱 <strong>App Store</strong> (iPhone) | 🤖 <strong>Google Play</strong> (Android)
                    <br/>
                    Solo necesitas tu número de teléfono y una cuenta bancaria en Puerto Rico.
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Cancel Confirmation Modal */}
        <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Cancelación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás segura de que deseas cancelar tu reserva? Esta acción no se puede deshacer.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
              No, Mantener Reserva
            </Button>
            <Button variant="danger" onClick={handleCancel}>
              Sí, Cancelar Reserva
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </section>
  )
}

export default Payment