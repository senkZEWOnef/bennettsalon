import { useState } from 'react'
import { Row, Col, Card, Button, Form, Alert, Badge, ListGroup } from 'react-bootstrap'
import { useAdmin, ScheduleSettings } from '../../contexts/AdminContextNew'

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
        <Alert 
          variant="success" 
          className="mb-4"
          style={{ 
            background: 'rgba(40, 167, 69, 0.1)',
            border: '1px solid rgba(40, 167, 69, 0.3)',
            borderRadius: '15px',
            color: '#28a745',
            fontWeight: '600'
          }}
        >
          ✅ ¡Configuración de horarios actualizada exitosamente!
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 style={{ 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          } as React.CSSProperties}>⏰ Gestionar Horarios</h3>
          <p style={{ 
            color: '#718096',
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>Configura tus días y horas disponibles para citas</p>
        </div>
        <Button 
          onClick={handleSaveSettings}
          style={{
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            border: 'none',
            borderRadius: '15px',
            padding: '12px 24px',
            fontWeight: '700',
            fontSize: '1rem',
            color: 'white',
            boxShadow: '0 6px 20px rgba(40, 167, 69, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.transform = 'translateY(-3px)'
            ;(e.target as HTMLElement).style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.4)'
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.transform = 'translateY(0)'
            ;(e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.3)'
          }}
        >
          💾 Guardar Cambios
        </Button>
      </div>

      <Row>
        <Col lg={4} className="mb-4">
          <Card style={{ 
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }} className="h-100">
            <Card.Header style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '20px 20px 0 0',
              padding: '20px 24px'
            }}>
              <h5 style={{ 
                margin: 0,
                fontWeight: '700',
                color: 'white'
              }}>📅 Días Disponibles</h5>
            </Card.Header>
            <Card.Body style={{ padding: '24px' }}>
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
              <small style={{ color: '#718096', fontWeight: '500' }}>
                Selecciona los días en los que aceptas citas
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-4">
          <Card style={{ 
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }} className="h-100">
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
              }}>🕒 Horarios Disponibles</h5>
            </Card.Header>
            <Card.Body style={{ 
              maxHeight: '400px', 
              overflowY: 'auto',
              padding: '24px'
            }}>
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
              <small style={{ color: '#718096', fontWeight: '500' }}>
                Selecciona las horas en las que aceptas citas
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-4">
          <Card style={{ 
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }} className="h-100">
            <Card.Header style={{ 
              background: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)',
              border: 'none',
              borderRadius: '20px 20px 0 0',
              padding: '20px 24px'
            }}>
              <h5 style={{ 
                margin: 0,
                fontWeight: '700',
                color: 'white'
              }}>🚫 Fechas Bloqueadas</h5>
            </Card.Header>
            <Card.Body style={{ padding: '24px' }}>
              <Form.Group className="mb-3">
                <Form.Label>Añadir fecha bloqueada:</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="date"
                    value={newBlockedDate}
                    onChange={(e) => setNewBlockedDate(e.target.value)}
                  />
                  <Button 
                    size="sm"
                    onClick={addBlockedDate}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '8px 16px',
                      fontWeight: '600',
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                      ;(e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.transform = 'translateY(0)'
                      ;(e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)'
                    }}
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
                        size="sm"
                        onClick={() => removeBlockedDate(date)}
                        style={{
                          background: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '4px 8px',
                          fontWeight: '600',
                          color: 'white',
                          boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.transform = 'scale(1.1)'
                          ;(e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)'
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.transform = 'scale(1)'
                          ;(e.target as HTMLElement).style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.3)'
                        }}
                      >
                        ❌
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <small style={{ color: '#718096', fontWeight: '500' }}>
                  No hay fechas bloqueadas
                </small>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card style={{ 
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
              padding: '20px 32px'
            }}>
              <h4 style={{ 
                margin: 0,
                fontWeight: '700',
                color: 'white'
              }}>📊 Resumen de Configuración Actual</h4>
            </Card.Header>
            <Card.Body style={{ padding: '32px' }}>
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