import { useState } from 'react'
import { Row, Col, Card, Button, Form, Alert, Badge, ListGroup } from 'react-bootstrap'
import { useAdmin, ScheduleSettings } from '../../contexts/AdminContext'

const AdminSchedule = () => {
  const { scheduleSettings, updateScheduleSettings } = useAdmin()
  const [tempSettings, setTempSettings] = useState<ScheduleSettings>(scheduleSettings)
  const [showAlert, setShowAlert] = useState(false)
  const [newBlockedDate, setNewBlockedDate] = useState('')

  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const allHours = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
  ]

  const handleSaveSettings = () => {
    updateScheduleSettings(tempSettings)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const toggleDay = (dayIndex: number) => {
    const updatedDays = tempSettings.availableDays.includes(dayIndex)
      ? tempSettings.availableDays.filter(d => d !== dayIndex)
      : [...tempSettings.availableDays, dayIndex].sort()
    
    setTempSettings({
      ...tempSettings,
      availableDays: updatedDays
    })
  }

  const toggleHour = (hour: string) => {
    const updatedHours = tempSettings.availableHours.includes(hour)
      ? tempSettings.availableHours.filter(h => h !== hour)
      : [...tempSettings.availableHours, hour].sort()
    
    setTempSettings({
      ...tempSettings,
      availableHours: updatedHours
    })
  }

  const addBlockedDate = () => {
    if (newBlockedDate && !tempSettings.blockedDates.includes(newBlockedDate)) {
      setTempSettings({
        ...tempSettings,
        blockedDates: [...tempSettings.blockedDates, newBlockedDate].sort()
      })
      setNewBlockedDate('')
    }
  }

  const removeBlockedDate = (date: string) => {
    setTempSettings({
      ...tempSettings,
      blockedDates: tempSettings.blockedDates.filter(d => d !== date)
    })
  }

  return (
    <>
      {showAlert && (
        <Alert variant="success" className="mb-4">
          ¡Configuración de horarios actualizada exitosamente!
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4>⏰ Gestionar Horarios</h4>
          <p className="text-muted mb-0">Configura tus días y horas disponibles para citas</p>
        </div>
        <Button variant="success" onClick={handleSaveSettings}>
          💾 Guardar Cambios
        </Button>
      </div>

      <Row>
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Header>
              <h6 className="mb-0">📅 Días Disponibles</h6>
            </Card.Header>
            <Card.Body>
              {dayNames.map((dayName, index) => (
                <Form.Check
                  key={index}
                  type="checkbox"
                  id={`day-${index}`}
                  label={dayName}
                  checked={tempSettings.availableDays.includes(index)}
                  onChange={() => toggleDay(index)}
                  className="mb-2"
                />
              ))}
              <small className="text-muted">
                Selecciona los días en los que aceptas citas
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-4">
          <Card>
            <Card.Header>
              <h6 className="mb-0">🕒 Horarios Disponibles</h6>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {allHours.map((hour) => (
                <Form.Check
                  key={hour}
                  type="checkbox"
                  id={`hour-${hour}`}
                  label={hour}
                  checked={tempSettings.availableHours.includes(hour)}
                  onChange={() => toggleHour(hour)}
                  className="mb-2"
                />
              ))}
              <small className="text-muted">
                Selecciona las horas en las que aceptas citas
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-4">
          <Card>
            <Card.Header>
              <h6 className="mb-0">🚫 Fechas Bloqueadas</h6>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Añadir fecha bloqueada:</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="date"
                    value={newBlockedDate}
                    onChange={(e) => setNewBlockedDate(e.target.value)}
                  />
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={addBlockedDate}
                  >
                    ➕
                  </Button>
                </div>
              </Form.Group>

              {tempSettings.blockedDates.length > 0 ? (
                <ListGroup variant="flush">
                  {tempSettings.blockedDates.map((date) => (
                    <ListGroup.Item 
                      key={date}
                      className="d-flex justify-content-between align-items-center px-0"
                    >
                      <span>
                        {new Date(date + 'T00:00:00').toLocaleDateString('es-PR', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeBlockedDate(date)}
                      >
                        ❌
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <small className="text-muted">
                  No hay fechas bloqueadas
                </small>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">📊 Resumen de Configuración Actual</h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <h6>Días Disponibles:</h6>
                  <div className="mb-3">
                    {tempSettings.availableDays.length > 0 ? (
                      tempSettings.availableDays.map(dayIndex => (
                        <Badge key={dayIndex} bg="primary" className="me-1 mb-1">
                          {dayNames[dayIndex]}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted">Ningún día seleccionado</span>
                    )}
                  </div>
                </Col>
                <Col md={4}>
                  <h6>Horarios Disponibles:</h6>
                  <div className="mb-3">
                    {tempSettings.availableHours.length > 0 ? (
                      <span className="text-muted">
                        {tempSettings.availableHours.length} horarios seleccionados
                        <br />
                        <small>
                          {tempSettings.availableHours[0]} - {tempSettings.availableHours[tempSettings.availableHours.length - 1]}
                        </small>
                      </span>
                    ) : (
                      <span className="text-muted">Ningún horario seleccionado</span>
                    )}
                  </div>
                </Col>
                <Col md={4}>
                  <h6>Fechas Bloqueadas:</h6>
                  <div className="mb-3">
                    <span className="text-muted">
                      {tempSettings.blockedDates.length} fechas bloqueadas
                    </span>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default AdminSchedule