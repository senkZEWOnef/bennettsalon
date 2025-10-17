import { useState } from 'react'
import { Container, Row, Col, Card, Nav, Button } from 'react-bootstrap'
import { useAdmin } from '../contexts/AdminContextNew'
import { useNavigate } from 'react-router-dom'
import AdminBookings from '../components/admin/AdminBookings'
import AdminGallery from '../components/admin/AdminGallery'
import AdminSchedule from '../components/admin/AdminSchedule'
import AdminCalendar from '../components/admin/AdminCalendar'
import AdminWhatsApp from '../components/admin/AdminWhatsApp'
import AdminATHMovil from '../components/admin/AdminATHMovil'

type AdminTab = 'overview' | 'bookings' | 'gallery' | 'schedule' | 'calendar' | 'whatsapp' | 'athm'

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
      case 'calendar':
        return <AdminCalendar />
      case 'whatsapp':
        return <AdminWhatsApp />
      case 'athm':
        return <AdminATHMovil />
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
    <div style={{ 
      paddingTop: '120px', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%),
                          radial-gradient(circle at 40% 80%, rgba(255,255,255,0.03) 0%, transparent 50%)`,
        zIndex: 1,
        pointerEvents: 'none'
      }}></div>
      
      <Container fluid style={{ position: 'relative', zIndex: 10 }}>
        <Row>
          {/* Modern Sidebar */}
          <Col lg={3} xl={2} style={{ 
            background: 'rgba(255,255,255,0.95)', 
            backdropFilter: 'blur(20px)',
            minHeight: '100vh',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            borderRight: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div className="p-4">
              <div className="text-center mb-4">
                <div style={{ 
                  fontSize: '2.5rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }} className="mb-3">💅</div>
                <h5 className="mb-0" style={{ fontWeight: '700', color: '#2d3748' }}>Admin Panel</h5>
                <small style={{ 
                  color: '#667eea', 
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontSize: '0.75rem'
                }}>Bennett Salon</small>
              </div>

              <Nav className="flex-column">
                {[
                  { key: 'overview', icon: '📊', label: 'Resumen' },
                  { key: 'bookings', icon: '📅', label: `Citas ${pendingBookings > 0 ? `(${pendingBookings})` : ''}` },
                  { key: 'gallery', icon: '🖼️', label: 'Galería' },
                  { key: 'schedule', icon: '⏰', label: 'Horarios' },
                  { key: 'calendar', icon: '📅', label: 'Calendario' },
                  { key: 'whatsapp', icon: '📱', label: 'WhatsApp' },
                  { key: 'athm', icon: '💳', label: 'ATH Móvil' }
                ].map((item) => (
                  <Nav.Link 
                    key={item.key}
                    onClick={() => setActiveTab(item.key as any)}
                    style={{ 
                      cursor: 'pointer',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      marginBottom: '8px',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      border: 'none',
                      transition: 'all 0.3s ease',
                      background: activeTab === item.key 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                        : 'transparent',
                      color: activeTab === item.key ? 'white' : '#4a5568',
                      boxShadow: activeTab === item.key 
                        ? '0 4px 15px rgba(102, 126, 234, 0.3)' 
                        : 'none',
                      transform: activeTab === item.key ? 'translateX(4px)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== item.key) {
                        (e.target as HTMLElement).style.background = 'rgba(102, 126, 234, 0.1)'
                        ;(e.target as HTMLElement).style.transform = 'translateX(2px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== item.key) {
                        (e.target as HTMLElement).style.background = 'transparent'
                        ;(e.target as HTMLElement).style.transform = 'none'
                      }
                    }}
                  >
                    <span style={{ marginRight: '8px' }}>{item.icon}</span>
                    {item.label}
                    {item.key === 'bookings' && pendingBookings > 0 && (
                      <span style={{
                        background: '#ff6b35',
                        color: 'white',
                        borderRadius: '10px',
                        padding: '2px 6px',
                        fontSize: '0.7rem',
                        marginLeft: '8px',
                        fontWeight: '700'
                      }}>{pendingBookings}</span>
                    )}
                  </Nav.Link>
                ))}
              </Nav>

              <div style={{ 
                height: '1px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.3) 50%, transparent 100%)',
                margin: '24px 0'
              }}></div>

              <div className="text-center">
                <Button 
                  onClick={handleLogout}
                  style={{
                    background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 20px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                    transition: 'all 0.3s ease',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                    ;(e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.transform = 'translateY(0)'
                    ;(e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)'
                  }}
                >
                  🚪 Cerrar Sesión
                </Button>
              </div>
            </div>
          </Col>

          {/* Main Content */}
          <Col lg={9} xl={10}>
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              margin: '16px',
              padding: '32px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              minHeight: 'calc(100vh - 180px)'
            }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h1 style={{ 
                    fontSize: '2rem',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '4px'
                  } as React.CSSProperties}>Panel de Administración</h1>
                  <p style={{ 
                    color: '#718096', 
                    margin: 0,
                    fontSize: '1.1rem',
                    fontWeight: '500'
                  }}>Gestiona tu salón de belleza</p>
                </div>
                <Button 
                  href="/" 
                  target="_blank"
                  style={{
                    background: 'rgba(102, 126, 234, 0.1)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    color: '#667eea',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(102, 126, 234, 0.2)'
                    ;(e.target as HTMLElement).style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(102, 126, 234, 0.1)'
                    ;(e.target as HTMLElement).style.transform = 'translateY(0)'
                  }}
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