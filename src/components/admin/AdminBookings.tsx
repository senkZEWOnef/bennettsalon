import { useState } from 'react'
import { Row, Col, Card, Badge, Button, Table, Modal, Form, Alert, InputGroup } from 'react-bootstrap'
import { useAdmin, Booking } from '../../contexts/AdminContextNew'

const AdminBookings = () => {
  const { bookings, updateBookingStatus, updateBookingPrice, confirmBookingManually, addBooking, getActiveServices } = useAdmin()
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState<'success' | 'danger'>('success')
  const [editingPrice, setEditingPrice] = useState({ totalPrice: '', notes: '' })
  
  // New booking form state
  const [newBooking, setNewBooking] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    service: '',
    date: '',
    time: ''
  })

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pendiente</Badge>
      case 'confirmed':
        return <Badge bg="success">Confirmada</Badge>
      case 'cancelled':
        return <Badge bg="danger">Cancelada</Badge>
      default:
        return <Badge bg="secondary">Desconocido</Badge>
    }
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  const handleStatusUpdate = (id: string, newStatus: Booking['status']) => {
    updateBookingStatus(id, newStatus)
    setShowModal(false)
  }

  const handleEditPrice = (booking: Booking) => {
    setSelectedBooking(booking)
    setEditingPrice({
      totalPrice: booking.totalPrice ? (booking.totalPrice / 100).toString() : '',
      notes: booking.notes || ''
    })
    setShowPriceModal(true)
  }

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBooking) return

    try {
      const priceInCents = Math.round(parseFloat(editingPrice.totalPrice) * 100)
      await updateBookingPrice(selectedBooking.id, priceInCents, editingPrice.notes)
      
      setShowPriceModal(false)
      setAlertMessage('Precio actualizado exitosamente')
      setAlertType('success')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 5000)
    } catch (error) {
      setAlertMessage('Error al actualizar el precio')
      setAlertType('danger')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 5000)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-PR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addBooking({
        date: new Date(newBooking.date),
        time: newBooking.time,
        service: newBooking.service,
        clientName: newBooking.clientName,
        clientEmail: newBooking.clientEmail,
        clientPhone: newBooking.clientPhone,
        status: 'confirmed', // Admin bookings are automatically confirmed
        paymentMethod: 'admin_override'
      })
      
      setShowAddModal(false)
      setNewBooking({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        service: '',
        date: '',
        time: ''
      })
      
      setAlertMessage('Cita agregada exitosamente')
      setAlertType('success')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 5000)
    } catch (error) {
      setAlertMessage('Error al agregar la cita')
      setAlertType('danger')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 5000)
    }
  }

  // Generate time slots for dropdown
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(time)
      }
    }
    return slots
  }

  // Get active services for dropdown
  const activeServices = getActiveServices()

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  const pendingBookings = bookings.filter(b => b.status === 'pending')
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed')
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled')

  return (
    <>
      {showAlert && (
        <Alert variant={alertType} className="mb-4">
          {alertMessage}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card style={{ 
            background: 'rgba(255, 193, 7, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(255, 193, 7, 0.2)',
            transition: 'all 0.3s ease'
          }} className="text-center h-100">
            <Card.Body className="p-4">
              <div style={{ 
                fontSize: '3rem',
                background: 'linear-gradient(135deg, #ffc107 0%, #ff8f00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              } as React.CSSProperties} className="mb-3">⏳</div>
              <h2 style={{ 
                color: '#ffc107',
                fontWeight: '700',
                fontSize: '2.5rem'
              }}>{pendingBookings.length}</h2>
              <p style={{ 
                margin: 0,
                fontWeight: '600',
                color: '#666',
                fontSize: '1.1rem'
              }}>Citas Pendientes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card style={{ 
            background: 'rgba(40, 167, 69, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(40, 167, 69, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(40, 167, 69, 0.2)',
            transition: 'all 0.3s ease'
          }} className="text-center h-100">
            <Card.Body className="p-4">
              <div style={{ 
                fontSize: '3rem',
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              } as React.CSSProperties} className="mb-3">✅</div>
              <h2 style={{ 
                color: '#28a745',
                fontWeight: '700',
                fontSize: '2.5rem'
              }}>{confirmedBookings.length}</h2>
              <p style={{ 
                margin: 0,
                fontWeight: '600',
                color: '#666',
                fontSize: '1.1rem'
              }}>Citas Confirmadas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card style={{ 
            background: 'rgba(220, 53, 69, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(220, 53, 69, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(220, 53, 69, 0.2)',
            transition: 'all 0.3s ease'
          }} className="text-center h-100">
            <Card.Body className="p-4">
              <div style={{ 
                fontSize: '3rem',
                background: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              } as React.CSSProperties} className="mb-3">❌</div>
              <h2 style={{ 
                color: '#dc3545',
                fontWeight: '700',
                fontSize: '2.5rem'
              }}>{cancelledBookings.length}</h2>
              <p style={{ 
                margin: 0,
                fontWeight: '600',
                color: '#666',
                fontSize: '1.1rem'
              }}>Citas Canceladas</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card style={{ 
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Card.Header style={{ 
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '20px 20px 0 0',
          padding: '24px 32px'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <h4 style={{ 
              margin: 0,
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            } as React.CSSProperties}>📅 Todas las Citas</h4>
            <Button 
              onClick={() => setShowAddModal(true)}
              style={{
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                fontWeight: '600',
                fontSize: '0.9rem',
                color: 'white',
                boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                ;(e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.4)'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)'
                ;(e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)'
              }}
            >
              ➕ Agregar Cita
            </Button>
          </div>
        </Card.Header>
        <Card.Body style={{ padding: '32px' }}>
          {bookings.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem' }} className="mb-3">📭</div>
              <h5>No hay citas aún</h5>
              <p className="text-muted">Las nuevas citas aparecerán aquí cuando los clientes hagan reservas.</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Fecha & Hora</th>
                  <th>Servicio</th>
                  <th>Estado</th>
                  <th>Precio</th>
                  <th>Contacto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <strong>{booking.clientName}</strong>
                    </td>
                    <td>
                      <div>{formatDate(booking.date)}</div>
                      <small className="text-muted">{booking.time}</small>
                    </td>
                    <td>{booking.service}</td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td>
                      {booking.totalPrice ? (
                        <div>
                          <strong>${(booking.totalPrice / 100).toFixed(2)}</strong>
                          {booking.notes && (
                            <div>
                              <small className="text-muted">{booking.notes}</small>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted">Sin precio</span>
                      )}
                    </td>
                    <td>
                      <div>{booking.clientPhone}</div>
                      <small className="text-muted">{booking.clientEmail}</small>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleViewDetails(booking)}
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontWeight: '500',
                            fontSize: '0.8rem',
                            color: 'white'
                          }}
                        >
                          👁️ Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-success"
                          onClick={() => handleEditPrice(booking)}
                          style={{
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontWeight: '500',
                            fontSize: '0.8rem'
                          }}
                        >
                          💰 Precio
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Booking Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '12px 12px 0 0',
          color: 'white'
        }}>
          <Modal.Title style={{ 
            fontWeight: '700',
            color: 'white'
          }}>✨ Detalles de la Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ 
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          padding: '32px'
        }}>
          {selectedBooking && (
            <Row>
              <Col md={6}>
                <h6>Información del Cliente</h6>
                <p><strong>Nombre:</strong> {selectedBooking.clientName}</p>
                <p><strong>Email:</strong> {selectedBooking.clientEmail}</p>
                <p><strong>Teléfono:</strong> {selectedBooking.clientPhone}</p>
              </Col>
              <Col md={6}>
                <h6>Detalles de la Cita</h6>
                <p><strong>Fecha:</strong> {formatDate(selectedBooking.date)}</p>
                <p><strong>Hora:</strong> {selectedBooking.time}</p>
                <p><strong>Servicio:</strong> {selectedBooking.service}</p>
                <p><strong>Estado:</strong> {getStatusBadge(selectedBooking.status)}</p>
                <p><strong>Solicitada:</strong> {selectedBooking.createdAt.toLocaleDateString('es-PR')}</p>
                {selectedBooking.status === 'pending' && selectedBooking.paymentDeadline && (
                  <p><strong>Límite de Pago:</strong> {
                    new Date(selectedBooking.paymentDeadline).toLocaleString('es-PR')
                  }</p>
                )}
                {selectedBooking.depositAmount && (
                  <p><strong>Depósito Requerido:</strong> ${selectedBooking.depositAmount}</p>
                )}
                {selectedBooking.paymentMethod && (
                  <p><strong>Método de Pago:</strong> {
                    selectedBooking.paymentMethod === 'ath' ? '📱 ATH Móvil' : 
                    selectedBooking.paymentMethod === 'admin_override' ? '👩‍💼 Confirmación Manual' :
                    selectedBooking.paymentMethod
                  }</p>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer style={{ 
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          borderRadius: '0 0 12px 12px',
          padding: '24px 32px'
        }}>
          {selectedBooking && selectedBooking.status === 'pending' && (
            <>
              <Button 
                onClick={() => {
                  confirmBookingManually(selectedBooking.id)
                  setShowModal(false)
                }}
                style={{
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                  ;(e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.4)'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(0)'
                  ;(e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)'
                }}
              >
                ✅ Confirmar Manualmente
              </Button>
              <Button 
                onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                style={{
                  background: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                  ;(e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.4)'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(0)'
                  ;(e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.3)'
                }}
              >
                ❌ Cancelar Cita
              </Button>
            </>
          )}
          {selectedBooking && selectedBooking.status === 'confirmed' && (
            <Button 
              onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
              style={{
                background: 'linear-gradient(135deg, #ffc107 0%, #ff8f00 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                fontWeight: '600',
                fontSize: '0.9rem',
                color: 'white',
                boxShadow: '0 4px 15px rgba(255, 193, 7, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                ;(e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(255, 193, 7, 0.4)'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)'
                ;(e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(255, 193, 7, 0.3)'
              }}
            >
              ❌ Cancelar Cita
            </Button>
          )}
          <Button 
            onClick={() => setShowModal(false)}
            style={{
              background: 'rgba(108, 117, 125, 0.1)',
              border: '1px solid rgba(108, 117, 125, 0.3)',
              borderRadius: '12px',
              padding: '10px 20px',
              fontWeight: '600',
              fontSize: '0.9rem',
              color: '#6c757d',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = 'rgba(108, 117, 125, 0.2)'
              ;(e.target as HTMLElement).style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = 'rgba(108, 117, 125, 0.1)'
              ;(e.target as HTMLElement).style.transform = 'translateY(0)'
            }}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Booking Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton style={{ 
          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
          border: 'none',
          borderRadius: '12px 12px 0 0',
          color: 'white'
        }}>
          <Modal.Title style={{ fontWeight: '700', color: 'white' }}>
            ➕ Agregar Nueva Cita
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddBooking}>
          <Modal.Body style={{ 
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            padding: '32px'
          }}>
            <Row>
              <Col md={6}>
                <h6 className="mb-3" style={{ 
                  fontWeight: '700',
                  color: '#667eea'
                }}>Información del Cliente</h6>
                
                <Form.Group className="mb-3">
                  <Form.Label>Nombre Completo *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: María González"
                    value={newBooking.clientName}
                    onChange={(e) => setNewBooking({ ...newBooking, clientName: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="cliente@ejemplo.com"
                    value={newBooking.clientEmail}
                    onChange={(e) => setNewBooking({ ...newBooking, clientEmail: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Teléfono *</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="787-123-4567"
                    value={newBooking.clientPhone}
                    onChange={(e) => setNewBooking({ ...newBooking, clientPhone: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <h6 className="mb-3" style={{ 
                  fontWeight: '700',
                  color: '#667eea'
                }}>Detalles de la Cita</h6>

                <Form.Group className="mb-3">
                  <Form.Label>Servicio *</Form.Label>
                  <Form.Select
                    value={newBooking.service}
                    onChange={(e) => setNewBooking({ ...newBooking, service: e.target.value })}
                    required
                  >
                    <option value="">Selecciona un servicio...</option>
                    {activeServices.map((service) => (
                      <option key={service.id} value={service.name}>
                        {service.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fecha *</Form.Label>
                  <Form.Control
                    type="date"
                    min={today}
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Hora *</Form.Label>
                  <Form.Select
                    value={newBooking.time}
                    onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                    required
                  >
                    <option value="">Selecciona una hora...</option>
                    {generateTimeSlots().map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <div style={{
              background: 'rgba(40, 167, 69, 0.1)',
              border: '1px solid rgba(40, 167, 69, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginTop: '20px'
            }}>
              <div className="d-flex align-items-center">
                <div style={{ fontSize: '1.5rem', marginRight: '12px' }}>ℹ️</div>
                <div>
                  <strong>Cita de Administrador</strong>
                  <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
                    Esta cita será confirmada automáticamente sin requerir pago.
                    Ideal para clientes frecuentes o arreglos especiales.
                  </p>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ 
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            border: 'none',
            borderRadius: '0 0 12px 12px',
            padding: '24px 32px'
          }}>
            <Button 
              type="button"
              onClick={() => setShowAddModal(false)}
              style={{
                background: 'rgba(108, 117, 125, 0.1)',
                border: '1px solid rgba(108, 117, 125, 0.3)',
                borderRadius: '12px',
                padding: '10px 20px',
                fontWeight: '600',
                color: '#6c757d'
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                fontWeight: '600',
                color: 'white',
                boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
              }}
            >
              ➕ Crear Cita
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Price Edit Modal */}
      <Modal show={showPriceModal} onHide={() => setShowPriceModal(false)}>
        <Form onSubmit={handleSavePrice}>
          <Modal.Header closeButton style={{ 
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            border: 'none',
            borderRadius: '12px 12px 0 0',
            color: 'white'
          }}>
            <Modal.Title style={{ 
              fontWeight: '700',
              color: 'white'
            }}>
              💰 Editar Precio - {selectedBooking?.clientName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '30px' }}>
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '600', color: '#2d3748' }}>
                Precio Total del Servicio
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="35.00"
                  value={editingPrice.totalPrice}
                  onChange={(e) => setEditingPrice(prev => ({ ...prev, totalPrice: e.target.value }))}
                  required
                  style={{
                    borderRadius: '0 8px 8px 0',
                    border: '1px solid #e2e8f0',
                    padding: '12px',
                    fontSize: '16px'
                  }}
                />
              </InputGroup>
              <Form.Text className="text-muted">
                Ingresa el precio total que se cobró por este servicio
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '600', color: '#2d3748' }}>
                Notas (Opcional)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ej: Incluye gel extra, diseño especial, etc."
                value={editingPrice.notes}
                onChange={(e) => setEditingPrice(prev => ({ ...prev, notes: e.target.value }))}
                style={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  padding: '12px',
                  resize: 'none'
                }}
              />
              <Form.Text className="text-muted">
                Detalles adicionales sobre el servicio o precio
              </Form.Text>
            </Form.Group>

            {selectedBooking && (
              <div style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '20px'
              }}>
                <h6 style={{ color: '#495057', marginBottom: '8px' }}>Información de la Cita:</h6>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  <strong>Servicio:</strong> {selectedBooking.service}
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  <strong>Fecha:</strong> {formatDate(selectedBooking.date)} a las {selectedBooking.time}
                </p>
                <p style={{ margin: '0', fontSize: '14px' }}>
                  <strong>Estado:</strong> {getStatusBadge(selectedBooking.status)}
                </p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer style={{ 
            padding: '20px 30px',
            borderTop: '1px solid #e9ecef'
          }}>
            <Button 
              variant="secondary" 
              onClick={() => setShowPriceModal(false)}
              style={{
                borderRadius: '12px',
                padding: '10px 20px',
                fontWeight: '600',
                backgroundColor: '#6c757d',
                border: 'none'
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                fontWeight: '600',
                color: 'white',
                boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
              }}
            >
              💾 Guardar Precio
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default AdminBookings