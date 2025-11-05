import { useState, useRef } from 'react'
import { Row, Col, Card, Button, Form, Badge } from 'react-bootstrap'
import { useAdmin } from '../../contexts/AdminContextNew'
import html2canvas from 'html2canvas'

type ViewType = 'daily' | 'weekly' | 'monthly'

const AdminSocialSnapshots = () => {
  const { bookings, scheduleSettings } = useAdmin()
  const [viewType, setViewType] = useState<ViewType>('daily')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const snapshotRef = useRef<HTMLDivElement>(null)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  const getAvailableHoursForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    
    // Get schedule for this date
    const daySchedule = scheduleSettings.yearSchedule?.find(d => d.date === dateString)
    
    if (!daySchedule || !daySchedule.isOpen) {
      return []
    }

    // Get booked times for this date
    const bookedTimes = bookings
      .filter(booking => {
        const bookingDate = new Date(booking.date).toISOString().split('T')[0]
        return bookingDate === dateString && booking.status !== 'cancelled'
      })
      .map(booking => booking.time)

    // Return available slots
    return daySchedule.timeSlots
      .filter(slot => slot.available && !bookedTimes.includes(slot.time))
      .map(slot => slot.time)
  }

  const getWeekDates = (startDate: Date) => {
    const dates = []
    const current = new Date(startDate)
    current.setDate(current.getDate() - current.getDay()) // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return dates
  }

  const getMonthDates = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const dates = []

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d))
    }
    return dates
  }

  const downloadSnapshot = async () => {
    if (!snapshotRef.current) return

    try {
      const canvas = await html2canvas(snapshotRef.current, {
        background: '#ffffff',
        useCORS: true
      } as any)
      
      const link = document.createElement('a')
      link.download = `bennett-salon-${viewType}-${selectedDate.toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('Error generating snapshot:', error)
    }
  }

  const renderDailyView = () => {
    const availableHours = getAvailableHoursForDate(selectedDate)
    
    return (
      <div 
        ref={snapshotRef}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
          borderRadius: '20px',
          color: 'white',
          textAlign: 'center',
          minHeight: '600px',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '10px' }}>
            💅 Bennett Salon de Beauté
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Aguada, Puerto Rico
          </p>
        </div>

        {/* Date */}
        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '1.8rem', margin: '0', textTransform: 'capitalize' }}>
            {formatDate(selectedDate)}
          </h2>
        </div>

        {/* Available Hours */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
            ✨ Horarios Disponibles
          </h3>
          
          {availableHours.length === 0 ? (
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '20px'
            }}>
              <p style={{ fontSize: '1.2rem', margin: '0' }}>
                😔 No hay horarios disponibles
              </p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '15px',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              {availableHours.map((time) => (
                <div key={time} style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  padding: '15px 10px',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}>
                  {formatTime(time)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '0',
          right: '0',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '1rem', opacity: 0.8, margin: '0' }}>
            📞 Reserva tu cita | 📱 WhatsApp | 📧 DM
          </p>
          <p style={{ fontSize: '0.9rem', opacity: 0.7, margin: '5px 0 0 0' }}>
            @bennettsalondebeaute
          </p>
        </div>
      </div>
    )
  }

  const renderWeeklyView = () => {
    const weekDates = getWeekDates(selectedDate)
    
    return (
      <div 
        ref={snapshotRef}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px',
          borderRadius: '20px',
          color: 'white',
          minHeight: '700px'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '10px' }}>
            💅 Bennett Salon de Beauté
          </h1>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>
            Semana del {weekDates[0].getDate()} - {weekDates[6].getDate()} de{' '}
            {weekDates[0].toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h2>
          <p style={{ fontSize: '1rem', opacity: 0.9 }}>Aguada, Puerto Rico</p>
        </div>

        {/* Weekly Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '15px'
        }}>
          {weekDates.map((date, index) => {
            const availableHours = getAvailableHoursForDate(date)
            const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' })
            
            return (
              <div key={index} style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '15px 10px',
                textAlign: 'center'
              }}>
                <h4 style={{ 
                  fontSize: '0.9rem', 
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  fontWeight: '700'
                }}>
                  {dayName}
                </h4>
                <p style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>
                  {date.getDate()}
                </p>
                
                {availableHours.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Cerrado</p>
                ) : (
                  <div style={{ fontSize: '0.7rem' }}>
                    {availableHours.slice(0, 3).map((time, i) => (
                      <div key={i} style={{ marginBottom: '3px' }}>
                        {formatTime(time)}
                      </div>
                    ))}
                    {availableHours.length > 3 && (
                      <div style={{ opacity: 0.7 }}>
                        +{availableHours.length - 3} más
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <p style={{ fontSize: '1rem', opacity: 0.9 }}>
            ✨ Reserva tu cita | 📱 WhatsApp | 📧 DM
          </p>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            @bennettsalondebeaute
          </p>
        </div>
      </div>
    )
  }

  const renderMonthlyView = () => {
    const monthDates = getMonthDates(selectedDate)
    const monthName = selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    
    return (
      <div 
        ref={snapshotRef}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px',
          borderRadius: '20px',
          color: 'white',
          minHeight: '800px'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>
            💅 Bennett Salon de Beauté
          </h1>
          <h2 style={{ 
            fontSize: '1.4rem', 
            marginBottom: '5px',
            textTransform: 'capitalize'
          }}>
            {monthName}
          </h2>
          <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Aguada, Puerto Rico</p>
        </div>

        {/* Monthly Calendar Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          marginBottom: '20px'
        }}>
          {/* Day headers */}
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} style={{
              textAlign: 'center',
              fontSize: '0.8rem',
              fontWeight: '700',
              padding: '8px',
              opacity: 0.8
            }}>
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {monthDates.map((date, index) => {
            const availableHours = getAvailableHoursForDate(date)
            const hasAvailability = availableHours.length > 0
            
            return (
              <div key={index} style={{
                backgroundColor: hasAvailability 
                  ? 'rgba(255,255,255,0.2)' 
                  : 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center',
                minHeight: '60px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: hasAvailability ? '700' : '400',
                  marginBottom: '2px'
                }}>
                  {date.getDate()}
                </div>
                {hasAvailability && (
                  <div style={{ 
                    fontSize: '0.6rem', 
                    opacity: 0.8,
                    lineHeight: '1.2'
                  }}>
                    {availableHours.length} slot{availableHours.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px',
          marginBottom: '20px',
          fontSize: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '3px'
            }}></div>
            Disponible
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '3px'
            }}></div>
            Cerrado
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: '0' }}>
            📞 Reserva tu cita | 📱 WhatsApp | 📧 DM
          </p>
          <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: '5px 0 0 0' }}>
            @bennettsalondebeaute
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Row className="mb-4">
        <Col lg={12}>
          <Card style={{
            background: 'white',
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 style={{ margin: '0', fontWeight: '600', color: '#2C3E50' }}>
                    📱 Snapshots para Redes Sociales
                  </h4>
                  <p style={{ margin: '4px 0 0 0', color: '#95A5A6', fontSize: '14px' }}>
                    Genera imágenes de horarios disponibles para Instagram
                  </p>
                </div>
                <Button
                  onClick={downloadSnapshot}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontWeight: '500',
                    color: 'white'
                  }}
                >
                  📷 Descargar Imagen
                </Button>
              </div>

              <Row className="mb-4">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: '500', color: '#2C3E50' }}>
                      Tipo de Vista
                    </Form.Label>
                    <Form.Select
                      value={viewType}
                      onChange={(e) => setViewType(e.target.value as ViewType)}
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #E9ECEF',
                        padding: '10px'
                      }}
                    >
                      <option value="daily">📅 Diaria</option>
                      <option value="weekly">📋 Semanal</option>
                      <option value="monthly">🗓️ Mensual</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: '500', color: '#2C3E50' }}>
                      Fecha
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={selectedDate.toISOString().split('T')[0]}
                      onChange={(e) => {
                        // Create date in local timezone to avoid timezone issues
                        const [year, month, day] = e.target.value.split('-').map(Number)
                        setSelectedDate(new Date(year, month - 1, day))
                      }}
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #E9ECEF',
                        padding: '10px'
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: '500', color: '#2C3E50' }}>
                      Vista Previa
                    </Form.Label>
                    <div style={{ padding: '10px 0' }}>
                      <Badge bg="primary" style={{ fontSize: '0.9rem' }}>
                        {viewType === 'daily' && `${formatDate(selectedDate)}`}
                        {viewType === 'weekly' && `Semana del ${selectedDate.toLocaleDateString('es-ES')}`}
                        {viewType === 'monthly' && `${selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`}
                      </Badge>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card style={{
            background: 'white',
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <Card.Body className="p-4">
              <div 
                className="social-snapshot-container"
                style={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  overflow: 'auto',
                  width: '100%',
                  padding: '10px'
                }}
              >
                {viewType === 'daily' && renderDailyView()}
                {viewType === 'weekly' && renderWeeklyView()}
                {viewType === 'monthly' && renderMonthlyView()}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default AdminSocialSnapshots