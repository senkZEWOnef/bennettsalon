import React, { useState } from 'react'
import { Container, Row, Col, Card, Nav, Button } from 'react-bootstrap'
import { useAdmin } from '../contexts/AdminContext'
import { useNavigate } from 'react-router-dom'
import AdminBookings from '../components/admin/AdminBookings'
import AdminGallery from '../components/admin/AdminGallery'
import AdminSchedule from '../components/admin/AdminSchedule'

type AdminTab = 'overview' | 'bookings' | 'gallery' | 'schedule'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const { logout, bookings } = useAdmin()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending').length
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length

  const renderTabContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <AdminBookings />
      case 'gallery':
        return <AdminGallery />
      case 'schedule':
        return <AdminSchedule />
      default:
        return (
          <Row>
            <Col md={4} className="mb-4">
              <Card className="text-center h-100">
                <Card.Body>
                  <div style={{ fontSize: '3rem' }} className="mb-3">📅</div>
                  <Card.Title>Citas Pendientes</Card.Title>
                  <h2 className="text-warning">{pendingBookings}</h2>
                  <Button 
                    variant="outline-warning" 
                    size="sm"
                    onClick={() => setActiveTab('bookings')}
                  >
                    Ver Citas
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="text-center h-100">
                <Card.Body>
                  <div style={{ fontSize: '3rem' }} className="mb-3">✅</div>
                  <Card.Title>Citas Confirmadas</Card.Title>
                  <h2 className="text-success">{confirmedBookings}</h2>
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    onClick={() => setActiveTab('bookings')}
                  >
                    Gestionar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="text-center h-100">
                <Card.Body>
                  <div style={{ fontSize: '3rem' }} className="mb-3">🖼️</div>
                  <Card.Title>Galería Total</Card.Title>
                  <h2 className="text-info">{bookings.length} fotos</h2>
                  <Button 
                    variant="outline-info" 
                    size="sm"
                    onClick={() => setActiveTab('gallery')}
                  >
                    Administrar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )
    }
  }

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col lg={3} xl={2} className="bg-white shadow-sm" style={{ minHeight: '100vh' }}>
            <div className="p-4">
              <div className="text-center mb-4">
                <div style={{ fontSize: '2rem' }} className="mb-2">💅</div>
                <h5 className="mb-0">Admin Panel</h5>
                <small className="text-muted">Bennett Salon</small>
              </div>

              <Nav className="flex-column">
                <Nav.Link 
                  className={activeTab === 'overview' ? 'active bg-primary text-white rounded mb-2' : 'mb-2'}
                  onClick={() => setActiveTab('overview')}
                  style={{ cursor: 'pointer' }}
                >
                  📊 Resumen
                </Nav.Link>
                <Nav.Link 
                  className={activeTab === 'bookings' ? 'active bg-primary text-white rounded mb-2' : 'mb-2'}
                  onClick={() => setActiveTab('bookings')}
                  style={{ cursor: 'pointer' }}
                >
                  📅 Citas ({pendingBookings} pendientes)
                </Nav.Link>
                <Nav.Link 
                  className={activeTab === 'gallery' ? 'active bg-primary text-white rounded mb-2' : 'mb-2'}
                  onClick={() => setActiveTab('gallery')}
                  style={{ cursor: 'pointer' }}
                >
                  🖼️ Galería
                </Nav.Link>
                <Nav.Link 
                  className={activeTab === 'schedule' ? 'active bg-primary text-white rounded mb-2' : 'mb-2'}
                  onClick={() => setActiveTab('schedule')}
                  style={{ cursor: 'pointer' }}
                >
                  ⏰ Horarios
                </Nav.Link>
              </Nav>

              <hr />

              <div className="text-center">
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={handleLogout}
                  className="w-100"
                >
                  🚪 Cerrar Sesión
                </Button>
              </div>
            </div>
          </Col>

          {/* Main Content */}
          <Col lg={9} xl={10}>
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h1 className="h3 mb-1">Panel de Administración</h1>
                  <p className="text-muted mb-0">Gestiona tu salón de belleza</p>
                </div>
                <Button 
                  variant="outline-primary" 
                  href="/" 
                  target="_blank"
                >
                  👁️ Ver Sitio Web
                </Button>
              </div>

              {renderTabContent()}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AdminDashboard