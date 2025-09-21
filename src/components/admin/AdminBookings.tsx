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
        <Col md={4}>
          <Card className="text-center border-warning">
            <Card.Body>
              <h3 className="text-warning">{pendingBookings.length}</h3>
              <p className="mb-0">Citas Pendientes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-success">
            <Card.Body>
              <h3 className="text-success">{confirmedBookings.length}</h3>
              <p className="mb-0">Citas Confirmadas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-danger">
            <Card.Body>
              <h3 className="text-danger">{cancelledBookings.length}</h3>
              <p className="mb-0">Citas Canceladas</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5 className="mb-0">📅 Todas las Citas</h5>
        </Card.Header>
        <Card.Body>
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
                        variant="outline-primary"
                        onClick={() => handleViewDetails(booking)}
                      >
                        Ver Detalles
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
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        <Modal.Footer>
          {selectedBooking && selectedBooking.status === 'pending' && (
            <>
              <Button 
                variant="success"
                onClick={() => {
                  confirmBookingManually(selectedBooking.id)
                  setShowModal(false)
                }}
              >
                ✅ Confirmar Manualmente
              </Button>
              <Button 
                variant="danger"
                onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
              >
                ❌ Cancelar Cita
              </Button>
            </>
          )}
          {selectedBooking && selectedBooking.status === 'confirmed' && (
            <Button 
              variant="warning"
              onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
            >
              ❌ Cancelar Cita
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AdminBookings