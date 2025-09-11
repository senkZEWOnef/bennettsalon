import { useState } from 'react'
import { Container, Row, Col, Button, Form, Alert, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useAdmin } from '../contexts/AdminContext'

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
  const [showAlert] = useState<boolean>(false)

  const services = [
    'Manicura Clásica',
    'Manicura en Gel',
    'Pedicura Clásica',
    'Pedicura Spa',
    'Combo Manicura & Pedicura',
    'Tratamiento Especial'
  ]

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
                <strong>¡Solicitud de Cita Enviada!</strong> Te contactaremos pronto para confirmar tu cita.
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
                      >
                        📞 RESERVAR MI CITA
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
                <a href="https://instagram.com/bennettsalondebeaute" target="_blank" className="btn btn-social-lg btn-social-insta-lg">
                  <i className="fab fa-instagram"></i> Instagram
                </a>
                <a href="https://facebook.com/bennettsalondebeaute" target="_blank" className="btn btn-social-lg btn-social-fb-lg">
                  <i className="fab fa-facebook"></i> Facebook
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