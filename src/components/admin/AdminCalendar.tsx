import { useState, useMemo } from 'react'
import { Container, Row, Col, Card, Button, Form, Modal, ButtonGroup, Badge } from 'react-bootstrap'
import { useAdmin } from '../../contexts/AdminContext'

const AdminCalendar = () => {
  const { 
    scheduleSettings, 
    updateTimeSlot, 
    updateDayStatus, 
    updateMultipleDays, 
    updateTimeSlotBulk,
    
  } = useAdmin()

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkOperation, setBulkOperation] = useState<'vacation' | 'hours' | ''>('')
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [bulkTimeSlots, setBulkTimeSlots] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar')

  // Generate time slots for display (6am to 9pm)
  const timeSlots = useMemo(() => {
    const slots: string[] = []
    for (let hour = 6; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 21 && minute > 0) break
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
      }
    }
    return slots
  }, [])

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    for (let i = 0; i < 42; i++) { // 6 weeks
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      days.push(date)
    }
    return days
  }, [currentMonth])

  const selectedDay = scheduleSettings.yearSchedule.find(day => day.date === selectedDate)

  const handleTimeSlotToggle = (time: string, available: boolean) => {
    updateTimeSlot(selectedDate, time, available)
  }

  const handleDayToggle = (isOpen: boolean) => {
    updateDayStatus(selectedDate, isOpen)
  }

  const handleBulkOperation = () => {
    if (bulkOperation === 'vacation') {
      updateMultipleDays(selectedDates, false)
    } else if (bulkOperation === 'hours' && bulkTimeSlots.length > 0) {
      updateTimeSlotBulk(selectedDates, bulkTimeSlots, true)
    }
    setShowBulkModal(false)
    setSelectedDates([])
    setBulkTimeSlots([])
    setBulkOperation('')
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  const getDayStatus = (date: string) => {
    const day = scheduleSettings.yearSchedule.find(d => d.date === date)
    if (!day) return { isOpen: false, availableSlots: 0 }
    return {
      isOpen: day.isOpen,
      availableSlots: day.timeSlots.filter(slot => slot.available).length
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }

  return (
    <Container fluid className="p-0">
      {/* Header Controls */}
      <Row className="mb-4">
        <Col lg={6}>
          <h2 style={{ 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          } as React.CSSProperties}>📅 Gestión de Calendario Completo</h2>
          <p style={{ 
            color: '#718096',
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>Control total sobre cada día y horario del año</p>
        </Col>
        <Col lg={6} className="text-end">
          <ButtonGroup className="me-3" style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <Button 
              onClick={() => setViewMode('calendar')}
              style={{
                background: viewMode === 'calendar' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '0',
                padding: '10px 16px',
                fontWeight: '600',
                fontSize: '0.9rem',
                color: viewMode === 'calendar' ? 'white' : '#667eea',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== 'calendar') {
                  (e.target as HTMLElement).style.background = 'rgba(102, 126, 234, 0.2)'
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'calendar') {
                  (e.target as HTMLElement).style.background = 'rgba(102, 126, 234, 0.1)'
                }
              }}
            >
              📅 Calendario
            </Button>
            <Button 
              onClick={() => setViewMode('timeline')}
              style={{
                background: viewMode === 'timeline' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '0',
                padding: '10px 16px',
                fontWeight: '600',
                fontSize: '0.9rem',
                color: viewMode === 'timeline' ? 'white' : '#667eea',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== 'timeline') {
                  (e.target as HTMLElement).style.background = 'rgba(102, 126, 234, 0.2)'
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'timeline') {
                  (e.target as HTMLElement).style.background = 'rgba(102, 126, 234, 0.1)'
                }
              }}
            >
              ⏰ Timeline
            </Button>
          </ButtonGroup>
          <Button 
            onClick={() => setShowBulkModal(true)}
            style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
              border: 'none',
              borderRadius: '15px',
              padding: '10px 20px',
              fontWeight: '700',
              fontSize: '0.9rem',
              color: 'white',
              boxShadow: '0 5px 15px rgba(255, 107, 53, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-2px)'
              ;(e.target as HTMLElement).style.boxShadow = '0 7px 20px rgba(255, 107, 53, 0.4)'
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)'
              ;(e.target as HTMLElement).style.boxShadow = '0 5px 15px rgba(255, 107, 53, 0.3)'
            }}
          >
            ⚡ Operaciones en Lote
          </Button>
        </Col>
      </Row>

      <Row>
        {/* Calendar View */}
        <Col lg={8}>
          <Card style={{ 
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <Card.Header style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '20px 20px 0 0',
              padding: '20px 24px'
            }} className="d-flex justify-content-between align-items-center">
              <Button 
                onClick={() => navigateMonth('prev')}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.3)'
                  ;(e.target as HTMLElement).style.transform = 'translateX(-2px)'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.2)'
                  ;(e.target as HTMLElement).style.transform = 'translateX(0)'
                }}
              >
                ← Anterior
              </Button>
              <h4 style={{
                margin: 0,
                fontWeight: '700',
                color: 'white',
                textTransform: 'capitalize'
              }}>
                {currentMonth.toLocaleString('es', { month: 'long', year: 'numeric' })}
              </h4>
              <Button 
                onClick={() => navigateMonth('next')}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.3)'
                  ;(e.target as HTMLElement).style.transform = 'translateX(2px)'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.2)'
                  ;(e.target as HTMLElement).style.transform = 'translateX(0)'
                }}
              >
                Siguiente →
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {/* Calendar Grid */}
              <div className="calendar-grid">
                {/* Day headers */}
                <div className="calendar-row header">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="calendar-cell header-cell">{day}</div>
                  ))}
                </div>
                
                {/* Calendar days */}
                {Array.from({ length: 6 }).map((_, weekIndex) => (
                  <div key={weekIndex} className="calendar-row">
                    {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map(date => {
                      const dateString = date.toISOString().split('T')[0]
                      const status = getDayStatus(dateString)
                      const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                      const isSelected = dateString === selectedDate
                      const isToday = dateString === new Date().toISOString().split('T')[0]
                      
                      return (
                        <div
                          key={dateString}
                          className={`calendar-cell day-cell ${
                            isCurrentMonth ? '' : 'other-month'
                          } ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                          onClick={() => setSelectedDate(dateString)}
                        >
                          <div className="day-number">{date.getDate()}</div>
                          <div className="day-status">
                            {status.isOpen ? (
                              <Badge bg="success" className="small">
                                {status.availableSlots} slots
                              </Badge>
                            ) : (
                              <Badge bg="secondary" className="small">Cerrado</Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Time Slot Editor */}
        <Col lg={4}>
          <Card style={{ 
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <Card.Header style={{
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              border: 'none',
              borderRadius: '20px 20px 0 0',
              padding: '20px 24px'
            }}>
              <h5 style={{
                margin: 0,
                fontWeight: '700',
                color: 'white'
              }}>
                ✏️ Editar: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es')}
              </h5>
              <div className="mt-3">
                <Form.Check
                  type="switch"
                  id="day-status"
                  label={selectedDay?.isOpen ? "Día Abierto" : "Día Cerrado"}
                  checked={selectedDay?.isOpen || false}
                  onChange={(e) => handleDayToggle(e.target.checked)}
                  style={{
                    color: 'white',
                    fontWeight: '600'
                  }}
                />
              </div>
            </Card.Header>
            <Card.Body style={{ 
              maxHeight: '600px', 
              overflowY: 'auto',
              padding: '24px'
            }}>
              {selectedDay?.isOpen && (
                <div className="time-slots">
                  <div className="mb-3 d-flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => timeSlots.forEach(time => handleTimeSlotToggle(time, true))}
                      style={{
                        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        fontWeight: '600',
                        fontSize: '0.8rem',
                        color: 'white',
                        boxShadow: '0 3px 10px rgba(40, 167, 69, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(-1px)'
                        ;(e.target as HTMLElement).style.boxShadow = '0 5px 15px rgba(40, 167, 69, 0.4)'
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(0)'
                        ;(e.target as HTMLElement).style.boxShadow = '0 3px 10px rgba(40, 167, 69, 0.3)'
                      }}
                    >
                      ✅ Activar Todos
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => timeSlots.forEach(time => handleTimeSlotToggle(time, false))}
                      style={{
                        background: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        fontWeight: '600',
                        fontSize: '0.8rem',
                        color: 'white',
                        boxShadow: '0 3px 10px rgba(220, 53, 69, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(-1px)'
                        ;(e.target as HTMLElement).style.boxShadow = '0 5px 15px rgba(220, 53, 69, 0.4)'
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(0)'
                        ;(e.target as HTMLElement).style.boxShadow = '0 3px 10px rgba(220, 53, 69, 0.3)'
                      }}
                    >
                      ❌ Desactivar Todos
                    </Button>
                  </div>
                  
                  {timeSlots.map(time => {
                    const slot = selectedDay.timeSlots.find(s => s.time === time)
                    return (
                      <div key={time} className="time-slot-row">
                        <Form.Check
                          type="switch"
                          id={`slot-${time}`}
                          label={formatTime(time)}
                          checked={slot?.available || false}
                          onChange={(e) => handleTimeSlotToggle(time, e.target.checked)}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
              
              {!selectedDay?.isOpen && (
                <div className="text-center text-muted py-4">
                  <p>Día cerrado. Activa el día para configurar horarios.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bulk Operations Modal */}
      <Modal show={showBulkModal} onHide={() => setShowBulkModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>⚡ Operaciones en Lote</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <h6>Tipo de Operación</h6>
              <Form.Select 
                value={bulkOperation} 
                onChange={(e) => setBulkOperation(e.target.value as any)}
              >
                <option value="">Seleccionar operación...</option>
                <option value="vacation">🏖️ Cerrar días (Vacaciones)</option>
                <option value="hours">⏰ Configurar horarios múltiples</option>
              </Form.Select>
              
              {bulkOperation === 'hours' && (
                <div className="mt-3">
                  <h6>Horarios a Activar</h6>
                  <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #dee2e6', padding: '10px', borderRadius: '4px' }}>
                    {timeSlots.map(time => (
                      <Form.Check
                        key={time}
                        type="checkbox"
                        id={`bulk-${time}`}
                        label={formatTime(time)}
                        checked={bulkTimeSlots.includes(time)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkTimeSlots([...bulkTimeSlots, time])
                          } else {
                            setBulkTimeSlots(bulkTimeSlots.filter(t => t !== time))
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Col>
            <Col md={6}>
              <h6>Fechas a Modificar</h6>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Ingresa fechas en formato YYYY-MM-DD, una por línea"
                value={selectedDates.join('\n')}
                onChange={(e) => setSelectedDates(e.target.value.split('\n').filter(Boolean))}
              />
              <small className="text-muted">
                Ejemplo: 2024-12-25, 2024-01-01, etc.
              </small>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBulkModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleBulkOperation}
            disabled={!bulkOperation || selectedDates.length === 0}
          >
            Aplicar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default AdminCalendar