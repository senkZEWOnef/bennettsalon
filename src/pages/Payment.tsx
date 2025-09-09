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
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'ath' | null>(null)
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
      updateBookingStatus(booking.id, 'confirmed')
      navigate('/booking', {
        state: { 
          message: '¡Pago con ATH Móvil confirmado! Tu cita ha sido reservada exitosamente.',
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
      publicToken: "sandbox", // Replace with actual public token in production
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

  const handlePayment = (method: 'stripe' | 'ath') => {
    setPaymentMethod(method)
    setIsProcessing(true)
    
    if (method === 'ath' && window.ATHM_Checkout && athMobilReady) {
      // Trigger ATH Móvil payment
      window.ATHM_Checkout.checkout()
    } else if (method === 'stripe') {
      // Simulate Stripe payment processing
      setTimeout(() => {
        if (booking) {
          updateBookingStatus(booking.id, 'confirmed')
          navigate('/booking', {
            state: { 
              message: '¡Pago con tarjeta confirmado! Tu cita ha sido reservada exitosamente.',
              type: 'success'
            }
          })
        }
      }, 2000)
    } else {
      setIsProcessing(false)
      setPaymentMethod(null)
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
                <h3 className="mb-4">💳 Confirma tu Cita con el Depósito</h3>
                
                <div className="text-center mb-4">
                  <div className="display-6 fw-bold text-primary mb-2">
                    ${depositAmount} USD
                  </div>
                  <p className="text-muted">
                    Depósito requerido para confirmar tu cita
                  </p>
                </div>

                <Row>
                  <Col md={6} className="mb-3">
                    <Card 
                      className={`payment-option ${paymentMethod === 'stripe' ? 'selected' : ''}`}
                      style={{ 
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        border: paymentMethod === 'stripe' ? '2px solid #007bff' : '1px solid #ddd'
                      }}
                      onClick={() => !isProcessing && handlePayment('stripe')}
                    >
                      <Card.Body className="text-center p-4">
                        <div className="mb-3">
                          <div style={{ fontSize: '3rem' }}>💳</div>
                        </div>
                        <h5>Tarjeta de Crédito/Débito</h5>
                        <p className="text-muted mb-3">
                          Visa, Mastercard, American Express
                        </p>
                        <Button 
                          variant={paymentMethod === 'stripe' ? 'primary' : 'outline-primary'}
                          disabled={isProcessing}
                          className="w-100"
                        >
                          {isProcessing && paymentMethod === 'stripe' ? 'Procesando...' : 'Pagar con Stripe'}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Card 
                      className={`payment-option ${paymentMethod === 'ath' ? 'selected' : ''}`}
                      style={{ 
                        cursor: (isProcessing || !athMobilReady) ? 'not-allowed' : 'pointer',
                        border: paymentMethod === 'ath' ? '2px solid #ff6b35' : '1px solid #ddd',
                        opacity: athMobilReady ? 1 : 0.7
                      }}
                      onClick={() => !isProcessing && athMobilReady && handlePayment('ath')}
                    >
                      <Card.Body className="text-center p-4">
                        <div className="mb-3">
                          <div style={{ fontSize: '3rem' }}>📱</div>
                        </div>
                        <h5>ATH Móvil</h5>
                        <p className="text-muted mb-3">
                          Pago local de Puerto Rico
                        </p>
                        <Button 
                          variant={paymentMethod === 'ath' ? 'warning' : 'outline-warning'}
                          disabled={isProcessing || !athMobilReady}
                          className="w-100"
                        >
                          {isProcessing && paymentMethod === 'ath' ? 'Procesando...' : 
                           !athMobilReady ? 'Cargando ATH Móvil...' : 'Pagar con ATH Móvil'}
                        </Button>
                        {/* ATH Móvil Button Container */}
                        <div id="ATHMovil_Checkout_Button_payment" style={{ display: 'none' }}></div>
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
                <ul className="mb-0">
                  <li>El depósito se aplicará al costo total de tu servicio</li>
                  <li>Tienes 30 minutos para completar el pago</li>
                  <li>Una vez confirmada, recibirás una notificación por email</li>
                  <li>Para cambios o cancelaciones, contacta al salón directamente</li>
                </ul>
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