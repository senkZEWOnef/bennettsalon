import { useState } from 'react'
import { Container, Row, Col, Button, Form, Alert, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useAdmin } from '../contexts/AdminContextNew'

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

const BookingCTASection = () => {
  const navigate = useNavigate()
  const { scheduleSettings, addBooking } = useAdmin()
  const [selectedDate, setSelectedDate] = useState<Value>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedService, setSelectedService] = useState<string>('')
  const [clientName, setClientName] = useState<string>('')
  const [clientEmail, setClientEmail] = useState<string>('')
  const [clientPhone, setClientPhone] = useState<string>('')
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const services = [
    'Manicura Clásica',
    'Manicura en Gel',
    'Manicura Rusa',
    'Diseños Personalizados',
    'Gel Tips',
    'Hard Gel',
    'Pedicura Clásica',
    'Pedicura Spa',
    'Combo Manicura & Pedicura',
    'Tratamiento Especial'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setValidationErrors([])
    
    // Validation
    const errors: string[] = []
    if (!selectedDate) errors.push('Por favor selecciona una fecha')
    if (!selectedService) errors.push('Por favor selecciona un servicio')
    if (!selectedTime) errors.push('Por favor selecciona una hora')
    if (!clientName.trim()) errors.push('Por favor ingresa tu nombre')
    if (!clientEmail.trim()) errors.push('Por favor ingresa tu email')
    if (!clientPhone.trim()) errors.push('Por favor ingresa tu teléfono')
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (clientEmail.trim() && !emailRegex.test(clientEmail.trim())) {
      errors.push('Por favor ingresa un email válido')
    }
    
    // Phone validation
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/
    if (clientPhone.trim() && !phoneRegex.test(clientPhone.trim())) {
      errors.push('Por favor ingresa un teléfono válido')
    }
    
    if (errors.length > 0) {
      setValidationErrors(errors)
      setIsSubmitting(false)
      return
    }
    
    try {
      const bookingDate = Array.isArray(selectedDate) ? selectedDate[0] : selectedDate
      
      if (bookingDate) {
        console.log('Creating booking...', {
          date: bookingDate,
          time: selectedTime,
          service: selectedService,
          clientName: clientName.trim()
        })

        const bookingId = await addBooking({
          date: bookingDate,
          time: selectedTime,
          service: selectedService,
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          clientPhone: clientPhone.trim(),
          status: 'pending'
        })

        console.log('Booking created with ID:', bookingId)

        // Create booking object for payment page
        const newBooking = {
          id: bookingId,
          date: bookingDate, // Keep as Date object
          time: selectedTime,
          service: selectedService,
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          clientPhone: clientPhone.trim()
        }

        setShowAlert(true)
        setValidationErrors([]) // Clear any previous errors
        
        console.log('Navigating to payment page with booking:', newBooking)
        
        // Redirect to payment page with booking data after a short delay
        setTimeout(() => {
          console.log('Executing navigation to payment page')
          navigate('/payment', { 
            state: { booking: newBooking }
          })
        }, 1500)
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      setValidationErrors(['Error al crear la reserva. Por favor intenta de nuevo.'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const tileDisabled = ({ date }: { date: Date }) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const isPastDate = date < today
    const dateString = date.toISOString().split('T')[0]
    
    // Check new calendar system first
    const daySchedule = scheduleSettings.yearSchedule?.find(d => d.date === dateString)
    if (daySchedule) {
      return isPastDate || !daySchedule.isOpen
    }
    
    // Fallback to legacy system
    const isUnavailableDay = !scheduleSettings.availableDays.includes(date.getDay())
    const isBlockedDate = scheduleSettings.blockedDates.includes(dateString)
    
    return isPastDate || isUnavailableDay || isBlockedDate
  }

  // Get available hours for selected date
  const getAvailableHours = () => {
    if (!selectedDate) return []
    
    const date = Array.isArray(selectedDate) ? selectedDate[0] : selectedDate
    if (!date) return []
    
    const dateString = date.toISOString().split('T')[0]
    const daySchedule = scheduleSettings.yearSchedule?.find(d => d.date === dateString)
    
    if (daySchedule && daySchedule.isOpen) {
      // Use new calendar system - convert 24h to 12h format
      return daySchedule.timeSlots
        .filter(slot => slot.available)
        .map(slot => {
          const [hours, minutes] = slot.time.split(':').map(Number)
          const period = hours >= 12 ? 'PM' : 'AM'
          const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
          return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
        })
    }
    
    // Fallback to legacy system
    return scheduleSettings.availableHours
  }

  return (
    <section id="booking-section" className="cta-section">
      <Container>
        <Row className="text-center mb-5">
          <Col lg={10} className="mx-auto">
            <div className="cta-content">
              <span className="section-badge-pink">✨ LISTA PARA BRILLAR</span>
              <h2 className="display-4 fw-bold mb-3 text-dark" style={{textShadow: '2px 2px 4px rgba(255,255,255,0.8)'}}>
                ¡Tu Transformación Te Espera!
              </h2>
              <p className="lead mb-4 text-dark" style={{fontSize: '1.2rem', fontWeight: 500, textShadow: '1px 1px 2px rgba(255,255,255,0.6)'}}>
                Únete a las cientos de clientas satisfechas en Aguada, PR. 
                Reserva tu cita hoy y descubre por qué somos el salón #1 de la zona.
              </p>
            </div>
          </Col>
        </Row>

        {/* Booking Form */}
        <Row className="justify-content-center">
          <Col lg={10}>
            {showAlert && (
              <Alert variant="success" className="mb-4">
                <strong>¡Solicitud de Cita Enviada!</strong> Redirigiendo al pago para confirmar tu cita...
              </Alert>
            )}
            
            {validationErrors.length > 0 && (
              <Alert variant="danger" className="mb-4">
                <strong>Por favor corrige los siguientes errores:</strong>
                <ul className="mb-0 mt-2">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}
            
            <Card className="salon-card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6} className="mb-4">
                      <h5 className="mb-3 text-center">📅 Selecciona tu Fecha</h5>
                      <div className="d-flex justify-content-center mb-4">
                        <Calendar
                          onChange={setSelectedDate}
                          value={selectedDate}
                          tileDisabled={tileDisabled}
                          className="booking-calendar"
                        />
                      </div>
                      <small className="text-muted d-block text-center">
                        * Solo se muestran fechas disponibles
                      </small>
                    </Col>

                    <Col lg={6}>
                      <h5 className="mb-3">✨ Detalles de tu Cita</h5>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Servicio</Form.Label>
                        <Form.Select 
                          value={selectedService} 
                          onChange={(e) => setSelectedService(e.target.value)}
                          required
                        >
                          <option value="">Elige un servicio...</option>
                          {services.map((service) => (
                            <option key={service} value={service}>
                              {service}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Hora</Form.Label>
                        <Form.Select 
                          value={selectedTime} 
                          onChange={(e) => setSelectedTime(e.target.value)}
                          required
                        >
                          <option value="">Elige una hora...</option>
                          {getAvailableHours().map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Row>
                        <Col sm={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Tu nombre"
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                              type="tel"
                              placeholder="Tu teléfono"
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-4">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Tu email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Button 
                        type="submit" 
                        className="btn-gradient-pink w-100" 
                        size="lg"
                        disabled={isSubmitting}
                        style={{
                          background: isSubmitting 
                            ? 'linear-gradient(135deg, #999 0%, #666 100%)' 
                            : 'linear-gradient(135deg, #ff6b87 0%, #ff8a80 100%)',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            PROCESANDO...
                          </>
                        ) : (
                          '📞 RESERVAR MI CITA'
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Social Proof */}
        <Row className="mt-5">
          <Col className="text-center">
            <div className="social-proof">
              <p className="mb-3 text-dark" style={{textShadow: '1px 1px 2px rgba(255,255,255,0.6)'}}>🌟 Síguenos y mantente al día con nuestros trabajos</p>
              <div className="d-flex justify-content-center gap-4">
                <a href="https://www.instagram.com/bennettsalon/" target="_blank" className="btn btn-social-lg btn-social-insta-lg">
                  <i className="fab fa-instagram"></i> Instagram
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default BookingCTASection