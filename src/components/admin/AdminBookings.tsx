import { useState } from 'react'
import { Row, Col, Card, Badge, Button, Table, Modal } from 'react-bootstrap'
import { useAdmin, Booking } from '../../contexts/AdminContext'

const AdminBookings = () => {
  const { bookings, updateBookingStatus, confirmBookingManually } = useAdmin()
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showModal, setShowModal] = useState(false)

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-PR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending')
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed')
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled')

  return (
    <>
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
          <h4 style={{ 
            margin: 0,
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          } as React.CSSProperties}>📅 Todas las Citas</h4>
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
                      <div>{booking.clientPhone}</div>
                      <small className="text-muted">{booking.clientEmail}</small>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        onClick={() => handleViewDetails(booking)}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          fontWeight: '600',
                          fontSize: '0.85rem',
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
                        👁️ Ver Detalles
                      </Button>
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
    </>
  )
}

export default AdminBookings