import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useAdmin } from '../contexts/AdminContext'

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

const Booking = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { scheduleSettings, addBooking, bookings, isTimeSlotAvailable } = useAdmin()
  const [selectedDate, setSelectedDate] = useState<Value>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedService, setSelectedService] = useState<string>('')
  const [clientName, setClientName] = useState<string>('')
  const [clientEmail, setClientEmail] = useState<string>('')
  const [clientPhone, setClientPhone] = useState<string>('')
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [alertType, setAlertType] = useState<'success' | 'info' | 'warning'>('success')

  const services = [
    'Manicura Clásica',
    'Manicura en Gel',
    'Pedicura Clásica',
    'Pedicura Spa',
    'Combo Manicura & Pedicura',
    'Tratamiento Especial'
  ]

  // Handle messages from payment page redirects
  useEffect(() => {
    if (location.state?.message) {
      setAlertMessage(location.state.message)
      setAlertType(location.state.type || 'success')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 6000)
      
      // Clear the state
      navigate(location.pathname, { replace: true })
    }
  }, [location.state, navigate, location.pathname])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedDate && selectedTime && selectedService && clientName && clientEmail && clientPhone) {
      const bookingDate = Array.isArray(selectedDate) ? selectedDate[0] : selectedDate
      
      if (bookingDate) {
        const bookingId = addBooking({
          date: bookingDate,
          time: selectedTime,
          service: selectedService,
          clientName,
          clientEmail,
          clientPhone,
          status: 'pending'
        })

        // Create booking object for payment page
        const newBooking = {
          id: bookingId,
          date: bookingDate,
          time: selectedTime,
          service: selectedService,
          clientName,
          clientEmail,
          clientPhone,
          status: 'pending' as const,
          createdAt: new Date(),
          paymentDeadline: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
          depositAmount: 25
        }

        // Redirect to payment page with booking data
        navigate('/payment', { 
          state: { booking: newBooking }
        })
      }
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
    <section className="services-section" style={{ minHeight: '100vh' }}>
      <Container style={{ paddingTop: '120px', paddingBottom: '60px' }}>
      <Row>
        <Col lg={8} className="mx-auto">
          <h1 className="display-4 fw-bold text-center mb-5">📅 Reserva tu Cita</h1>
          
          {showAlert && (
            <Alert variant={alertType} className="mb-4">
              <div dangerouslySetInnerHTML={{ __html: alertMessage }} />
            </Alert>
          )}

          <Card className="salon-card">
            <Card.Body className="p-5">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <h4 className="mb-3">📅 Selecciona Fecha</h4>
                    <div className="mb-4">
                      <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        tileDisabled={tileDisabled}
                        className="w-100"
                      />
                      <small className="text-muted mt-2 d-block">
                        * Solo se muestran fechas disponibles según la configuración del salón.
                      </small>
                    </div>
                  </Col>

                  <Col md={6}>
                    <h4 className="mb-3">✨ Detalles de la Cita</h4>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Selecciona Servicio</Form.Label>
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
                      <Form.Label>Selecciona Hora</Form.Label>
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

                    <hr className="my-4" />

                    <h5 className="mb-3">👤 Tu Información</h5>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre Completo</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingresa tu nombre completo"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Ingresa tu email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Número de Teléfono</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Ingresa tu número de teléfono"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Button 
                      type="submit" 
                      className="btn-primary w-100" 
                      size="lg"
                    >
                      📞 Solicitar Cita
                    </Button>

                    <small className="text-muted d-block mt-3 text-center">
                      * Todas las citas están sujetas a confirmación. Te contactaremos dentro de 24 horas.
                    </small>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Meet Your Stylist Section */}
      <Row className="mt-5">
        <Col lg={8} className="mx-auto">
          <Card className="salon-card">
            <Card.Body className="p-5">
              <Row className="align-items-center">
                <Col md={4} className="text-center mb-4 mb-md-0">
                  <img 
                    src="/images/hero/boss.jpg" 
                    alt="Bennett - Owner & Master Stylist" 
                    className="img-fluid rounded-circle shadow-lg"
                    style={{ maxWidth: '200px', width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                </Col>
                <Col md={8}>
                  <h3 className="mb-3">💅 Conoce a Bennett</h3>
                  <p className="lead mb-3">
                    Propietaria y Especialista Maestra en Belleza
                  </p>
                  <p className="mb-0">
                    Con años de experiencia y una pasión por hacer que cada clienta se sienta hermosa, 
                    Bennett se asegura personalmente de que cada visita a nuestro salón supere tus expectativas. 
                    Cuando reservas con nosotras, no solo obtienes un servicio - recibes 
                    atención personalizada y cuidado que marca la diferencia.
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </Container>
    </section>
  )
}

export default Booking