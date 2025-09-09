import React, { useState, useMemo } from 'react'
import { Container, Row, Col, Card, Button, Form, Modal, Alert, ButtonGroup, Badge } from 'react-bootstrap'
import { useAdmin } from '../../contexts/AdminContext'

const AdminCalendar = () => {
  const { 
    scheduleSettings, 
    updateTimeSlot, 
    updateDayStatus, 
    updateMultipleDays, 
    updateTimeSlotBulk,
    generateDefaultSchedule 
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
    const lastDay = new Date(year, month + 1, 0)
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
          <h3>📅 Gestión de Calendar Completo</h3>
          <p className="text-muted">Control total sobre cada día y horario del año</p>
        </Col>
        <Col lg={6} className="text-end">
          <ButtonGroup className="me-3">
            <Button 
              variant={viewMode === 'calendar' ? 'primary' : 'outline-primary'}
              onClick={() => setViewMode('calendar')}
            >
              📅 Calendar
            </Button>
            <Button 
              variant={viewMode === 'timeline' ? 'primary' : 'outline-primary'}
              onClick={() => setViewMode('timeline')}
            >
              ⏰ Timeline
            </Button>
          </ButtonGroup>
          <Button variant="success" onClick={() => setShowBulkModal(true)}>
            ⚡ Operaciones en Lote
          </Button>
        </Col>
      </Row>

      <Row>
        {/* Calendar View */}
        <Col lg={8}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Button variant="outline-secondary" onClick={() => navigateMonth('prev')}>
                ← Anterior
              </Button>
              <h5 className="mb-0">
                {currentMonth.toLocaleString('es', { month: 'long', year: 'numeric' })}
              </h5>
              <Button variant="outline-secondary" onClick={() => navigateMonth('next')}>
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
          <Card>
            <Card.Header>
              <h6 className="mb-0">
                Editar: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es')}
              </h6>
              <div className="mt-2">
                <Form.Check
                  type="switch"
                  id="day-status"
                  label={selectedDay?.isOpen ? "Día Abierto" : "Día Cerrado"}
                  checked={selectedDay?.isOpen || false}
                  onChange={(e) => handleDayToggle(e.target.checked)}
                />
              </div>
            </Card.Header>
            <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {selectedDay?.isOpen && (
                <div className="time-slots">
                  <div className="mb-3">
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={() => timeSlots.forEach(time => handleTimeSlotToggle(time, true))}
                    >
                      ✅ Activar Todos
                    </Button>
                    {' '}
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => timeSlots.forEach(time => handleTimeSlotToggle(time, false))}
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