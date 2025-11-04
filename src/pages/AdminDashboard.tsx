import { useState, useEffect } from 'react'
import { Row, Col, Card, Nav, Button, Offcanvas } from 'react-bootstrap'
import { useAdmin } from '../contexts/AdminContextNew'
import { useNavigate } from 'react-router-dom'
import AdminBookings from '../components/admin/AdminBookings'
import AdminGallery from '../components/admin/AdminGallery'
import AdminSchedule from '../components/admin/AdminSchedule'
import AdminCalendar from '../components/admin/AdminCalendar'
import AdminWhatsApp from '../components/admin/AdminWhatsApp'
import AdminATHMovil from '../components/admin/AdminATHMovil'
import AdminServices from '../components/admin/AdminServices'
import AdminJobApplications from '../components/admin/AdminJobApplications'
import AdminSocialSnapshots from '../components/admin/AdminSocialSnapshots'

type AdminTab = 'overview' | 'bookings' | 'gallery' | 'services' | 'schedule' | 'calendar' | 'whatsapp' | 'athm' | 'jobs' | 'social'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [showSidebar, setShowSidebar] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { logout, bookings, galleryImages, getActiveServices } = useAdmin()
  const navigate = useNavigate()

  // Check for mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setShowSidebar(false)
      }
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Real-time statistics from database
  const pendingBookings = bookings.filter(b => b.status === 'pending').length
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
  const totalBookings = bookings.length
  const totalGalleryImages = galleryImages?.length || 0
  const activeServices = getActiveServices()
  const totalActiveServices = activeServices.length
  
  // Calculate real monthly revenue from actual booking prices
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date)
    return bookingDate.getMonth() === currentMonth && 
           bookingDate.getFullYear() === currentYear &&
           booking.status === 'confirmed'
  })
  
  // Calculate actual revenue from bookings with prices
  const actualMonthlyRevenue = monthlyBookings.reduce((total, booking) => {
    return total + (booking.totalPrice ? booking.totalPrice / 100 : 0)
  }, 0)
  
  // Count bookings with prices vs without prices for insights
  const bookingsWithPrices = monthlyBookings.filter(b => b.totalPrice).length
  const bookingsWithoutPrices = monthlyBookings.length - bookingsWithPrices

  const renderTabContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <AdminBookings />
      case 'gallery':
        return <AdminGallery />
      case 'services':
        return <AdminServices />
      case 'jobs':
        return <AdminJobApplications />
      case 'schedule':
        return <AdminSchedule />
      case 'calendar':
        return <AdminCalendar />
      case 'whatsapp':
        return <AdminWhatsApp />
      case 'athm':
        return <AdminATHMovil />
      case 'social':
        return <AdminSocialSnapshots />
      default:
        return (
          <>
            {/* Statistics Cards */}
            <Row className="mb-4">
              <Col lg={3} md={6} className="mb-3">
                <Card style={{
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
                onClick={() => setActiveTab('bookings')}>
                  <Card.Body className="text-center p-4">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 15px auto'
                    }}>
                      <i className="fas fa-calendar-alt" style={{ fontSize: '24px' }}></i>
                    </div>
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0' }}>{pendingBookings}</h3>
                    <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Citas Pendientes</p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={3} md={6} className="mb-3">
                <Card style={{
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
                onClick={() => setActiveTab('bookings')}>
                  <Card.Body className="text-center p-4">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 15px auto'
                    }}>
                      <i className="fas fa-check-circle" style={{ fontSize: '24px' }}></i>
                    </div>
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0' }}>{confirmedBookings}</h3>
                    <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Citas Confirmadas</p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={3} md={6} className="mb-3">
                <Card style={{
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #F39C12 0%, #E67E22 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
                onClick={() => setActiveTab('gallery')}>
                  <Card.Body className="text-center p-4">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 15px auto'
                    }}>
                      <i className="fas fa-images" style={{ fontSize: '24px' }}></i>
                    </div>
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0' }}>{totalGalleryImages}</h3>
                    <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Fotos en Galería</p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={3} md={6} className="mb-3">
                <Card style={{
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
                onClick={() => setActiveTab('services')}>
                  <Card.Body className="text-center p-4">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 15px auto'
                    }}>
                      <i className="fas fa-cut" style={{ fontSize: '24px' }}></i>
                    </div>
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0' }}>{totalActiveServices}</h3>
                    <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Servicios Activos</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Monthly Revenue Card */}
            <Row className="mb-4">
              <Col lg={6} md={6} className="mb-3">
                <Card style={{
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
                onClick={() => setActiveTab('athm')}>
                  <Card.Body className="text-center p-4">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 15px auto'
                    }}>
                      <i className="fas fa-dollar-sign" style={{ fontSize: '24px' }}></i>
                    </div>
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0' }}>${actualMonthlyRevenue.toFixed(2)}</h3>
                    <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
                      Ingresos del Mes
                      {bookingsWithoutPrices > 0 && (
                        <div style={{ fontSize: '11px', opacity: 0.7 }}>
                          ({bookingsWithoutPrices} sin precio)
                        </div>
                      )}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={6} md={6} className="mb-3">
                <Card style={{
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
                onClick={() => setActiveTab('bookings')}>
                  <Card.Body className="text-center p-4">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 15px auto'
                    }}>
                      <i className="fas fa-calendar-week" style={{ fontSize: '24px' }}></i>
                    </div>
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0' }}>{monthlyBookings.length}</h3>
                    <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Citas Este Mes</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Quick Actions */}
            <Row className="mb-4">
              <Col lg={6} className="mb-3">
                <Card style={{
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  background: 'white'
                }}>
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#667eea',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px'
                      }}>
                        <i className="fas fa-qrcode" style={{ color: 'white', fontSize: '18px' }}></i>
                      </div>
                      <div>
                        <h5 style={{ margin: '0', fontWeight: '600' }}>Código QR de Reservas</h5>
                        <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>Comparte con clientes</p>
                      </div>
                    </div>
                    <Button 
                      style={{
                        backgroundColor: '#667eea',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                      size="sm"
                      onClick={() => window.open('/', '_blank')}
                    >
                      <i className="fas fa-external-link-alt me-2"></i>
                      Ver Página de Reservas
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={6} className="mb-3">
                <Card style={{
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  background: 'white'
                }}>
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#3498DB',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px'
                      }}>
                        <i className="fas fa-bolt" style={{ color: 'white', fontSize: '18px' }}></i>
                      </div>
                      <div>
                        <h5 style={{ margin: '0', fontWeight: '600' }}>Acciones Rápidas</h5>
                        <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>Gestiona tu negocio</p>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <Button 
                        style={{
                          backgroundColor: '#E67E22',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px'
                        }}
                        size="sm"
                        onClick={() => setActiveTab('services')}
                      >
                        <i className="fas fa-plus me-1"></i>
                        Servicio
                      </Button>
                      <Button 
                        style={{
                          backgroundColor: '#9B59B6',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px'
                        }}
                        size="sm"
                        onClick={() => setActiveTab('gallery')}
                      >
                        <i className="fas fa-upload me-1"></i>
                        Foto
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Recent Activity */}
            <Row>
              <Col lg={12}>
                <Card style={{
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  background: 'white'
                }}>
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#764ba2',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '15px'
                        }}>
                          <i className="fas fa-calendar-check" style={{ color: 'white', fontSize: '18px' }}></i>
                        </div>
                        <div>
                          <h5 style={{ margin: '0', fontWeight: '600' }}>Citas Recientes</h5>
                          <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>Última actividad de reservas</p>
                        </div>
                      </div>
                      <Button 
                        variant="link" 
                        style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}
                        onClick={() => setActiveTab('bookings')}
                      >
                        <i className="fas fa-external-link-alt me-1"></i>
                        Ver Todas
                      </Button>
                    </div>
                    
                    {totalBookings === 0 ? (
                      <div className="text-center py-5">
                        <div style={{
                          width: '80px',
                          height: '80px',
                          backgroundColor: '#F8F9FA',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 20px auto'
                        }}>
                          <i className="fas fa-calendar-alt" style={{ fontSize: '32px', color: '#BDC3C7' }}></i>
                        </div>
                        <h6 style={{ color: '#7F8C8D', fontWeight: '500' }}>No hay citas aún</h6>
                        <p style={{ color: '#BDC3C7', fontSize: '14px' }}>Las nuevas reservas aparecerán aquí</p>
                      </div>
                    ) : (
                      <div>
                        {/* Show last 3 bookings */}
                        {bookings
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .slice(0, 3)
                          .map((booking) => (
                            <div key={booking.id} style={{
                              padding: '12px 0',
                              borderBottom: '1px solid #F8F9FA',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <div className="d-flex align-items-center">
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  backgroundColor: booking.status === 'pending' ? '#FFF3CD' : 
                                                  booking.status === 'confirmed' ? '#D1ECF1' : '#F8D7DA',
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginRight: '12px'
                                }}>
                                  <i className={`fas ${booking.status === 'pending' ? 'fa-clock' : 
                                                    booking.status === 'confirmed' ? 'fa-check' : 'fa-times'}`} 
                                     style={{ 
                                       color: booking.status === 'pending' ? '#856404' : 
                                              booking.status === 'confirmed' ? '#0C5460' : '#721C24',
                                       fontSize: '16px' 
                                     }}></i>
                                </div>
                                <div>
                                  <div style={{ fontWeight: '500', fontSize: '14px', color: '#2C3E50' }}>
                                    {booking.clientName}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#95A5A6' }}>
                                    {booking.service} • {new Date(booking.date).toLocaleDateString('es-ES')} a las {booking.time}
                                  </div>
                                </div>
                              </div>
                              <span style={{
                                backgroundColor: booking.status === 'pending' ? '#FFF3CD' : 
                                                booking.status === 'confirmed' ? '#D1ECF1' : '#F8D7DA',
                                color: booking.status === 'pending' ? '#856404' : 
                                       booking.status === 'confirmed' ? '#0C5460' : '#721C24',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '500',
                                textTransform: 'capitalize'
                              }}>
                                {booking.status === 'pending' ? 'Pendiente' : 
                                 booking.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                              </span>
                            </div>
                          ))}
                        
                        {totalBookings > 3 && (
                          <div className="text-center mt-3">
                            <p style={{ color: '#95A5A6', fontSize: '12px', margin: '0' }}>
                              Y {totalBookings - 3} cita{totalBookings - 3 !== 1 ? 's' : ''} más...
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )
    }
  }

  // Sidebar component for reuse
  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      {/* Logo Section */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="d-flex align-items-center">
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>💅</span>
          </div>
          <div>
            <h5 style={{ 
              margin: '0', 
              color: 'white', 
              fontWeight: '600',
              fontSize: '16px'
            }}>Bennett</h5>
            <small style={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: '12px'
            }}>by Bennett Salon</small>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ padding: '20px 0' }}>
        <Nav className="flex-column">
          {[
            { key: 'overview', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
            { key: 'calendar', icon: 'fas fa-calendar-alt', label: 'Calendar' },
            { key: 'bookings', icon: 'fas fa-clock', label: 'Bookings', badge: pendingBookings },
            { key: 'services', icon: 'fas fa-cut', label: 'Services' },
            { key: 'gallery', icon: 'fas fa-images', label: 'Gallery' },
            { key: 'social', icon: 'fas fa-camera', label: 'Social Media' },
            { key: 'whatsapp', icon: 'fab fa-whatsapp', label: 'WhatsApp' },
            { key: 'schedule', icon: 'fas fa-business-time', label: 'Schedule' },
            { key: 'athm', icon: 'fas fa-credit-card', label: 'Payments' },
            { key: 'jobs', icon: 'fas fa-briefcase', label: 'Jobs' }
          ].map((item) => (
            <Nav.Link 
              key={item.key}
              onClick={() => {
                setActiveTab(item.key as any)
                if (onItemClick) onItemClick()
              }}
              style={{ 
                cursor: 'pointer',
                padding: '12px 20px',
                margin: '2px 0',
                fontWeight: '500',
                fontSize: '14px',
                border: 'none',
                color: activeTab === item.key ? '#667eea' : 'rgba(255,255,255,0.8)',
                backgroundColor: activeTab === item.key ? 'white' : 'transparent',
                borderRadius: activeTab === item.key ? '0 25px 25px 0' : '0',
                marginRight: activeTab === item.key ? '0' : '0',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== item.key) {
                  (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.key) {
                  (e.target as HTMLElement).style.backgroundColor = 'transparent'
                }
              }}
            >
              <div className="d-flex align-items-center">
                <i className={item.icon} style={{ 
                  marginRight: '12px', 
                  fontSize: '16px'
                }} />
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 && (
                <span style={{
                  backgroundColor: '#ff6b87',
                  color: 'white',
                  fontSize: '11px',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontWeight: '600'
                }}>
                  {item.badge}
                </span>
              )}
            </Nav.Link>
          ))}
        </Nav>
        
        {/* Logout Button */}
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '20px' }}>
          <Button 
            variant="outline-light" 
            onClick={handleLogout}
            className="w-100"
            style={{
              borderRadius: '8px',
              borderColor: 'rgba(255,255,255,0.3)',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            <i className="fas fa-sign-out-alt me-2"></i>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F8F9FA'
    }}>
      {/* Mobile Header with Menu Button */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 1050,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div className="d-flex align-items-center">
            <span style={{ fontSize: '20px', marginRight: '10px' }}>💅</span>
            <h5 style={{ margin: '0', color: 'white', fontWeight: '600' }}>Bennett Admin</h5>
          </div>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => setShowSidebar(true)}
            style={{ border: 'none' }}
          >
            <i className="fas fa-bars"></i>
          </Button>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div style={{
          width: '250px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 1000,
          boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
        }}>
          <SidebarContent />
        </div>
      )}

      {/* Mobile Offcanvas Sidebar */}
      <Offcanvas 
        show={showSidebar} 
        onHide={() => setShowSidebar(false)} 
        placement="start"
        style={{ width: '280px' }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh'
        }}>
          <SidebarContent onItemClick={() => setShowSidebar(false)} />
        </div>
      </Offcanvas>

      {/* Main Content */}
      <div style={{
        marginLeft: isMobile ? '0' : '250px',
        paddingTop: isMobile ? '60px' : '0',
        minHeight: '100vh',
        background: '#F8F9FA'
      }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #E9ECEF',
          padding: '20px 30px',
          position: 'sticky',
          top: isMobile ? '60px' : '0',
          zIndex: 100
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 style={{ 
                margin: '0', 
                fontSize: isMobile ? '1.5rem' : '2rem',
                fontWeight: '700',
                color: '#2C3E50'
              }}>
                {(() => {
                  switch (activeTab) {
                    case 'overview': return '📊 Dashboard'
                    case 'calendar': return '📅 Calendar'
                    case 'bookings': return '🕐 Bookings'
                    case 'services': return '✂️ Services'
                    case 'gallery': return '🖼️ Gallery'
                    case 'social': return '📸 Social Media'
                    case 'whatsapp': return '📱 WhatsApp'
                    case 'schedule': return '⏰ Schedule'
                    case 'athm': return '💳 Payments'
                    case 'jobs': return '💼 Jobs'
                    default: return '📊 Dashboard'
                  }
                })()}
              </h1>
              <p style={{ 
                margin: '5px 0 0 0', 
                color: '#6C757D',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}>
                Gestiona tu salón con facilidad
              </p>
            </div>
            <Button
              variant="outline-primary"
              size={isMobile ? "sm" : "lg"}
              onClick={() => window.open('/booking', '_blank')}
              style={{
                borderRadius: '8px',
                fontWeight: '500',
                color: '#667eea',
                borderColor: '#667eea'
              }}
            >
              <i className="fas fa-external-link-alt me-2"></i>
              {isMobile ? 'Ver Sitio' : 'View Booking Page'}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ padding: '20px 0' }}>
          <Nav className="flex-column">
            {[
              { key: 'overview', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
              { key: 'calendar', icon: 'fas fa-calendar-alt', label: 'Calendar' },
              { key: 'bookings', icon: 'fas fa-clock', label: 'Bookings', badge: pendingBookings },
              { key: 'services', icon: 'fas fa-cut', label: 'Services' },
              { key: 'gallery', icon: 'fas fa-images', label: 'Gallery' },
              { key: 'social', icon: 'fas fa-camera', label: 'Social Media' },
              { key: 'whatsapp', icon: 'fab fa-whatsapp', label: 'WhatsApp' },
              { key: 'schedule', icon: 'fas fa-business-time', label: 'Schedule' },
              { key: 'athm', icon: 'fas fa-credit-card', label: 'Payments' },
              { key: 'jobs', icon: 'fas fa-briefcase', label: 'Jobs' }
            ].map((item) => (
              <Nav.Link 
                key={item.key}
                onClick={() => setActiveTab(item.key as any)}
                style={{ 
                  cursor: 'pointer',
                  padding: '12px 20px',
                  margin: '2px 0',
                  fontWeight: '500',
                  fontSize: '14px',
                  border: 'none',
                  color: activeTab === item.key ? '#667eea' : 'rgba(255,255,255,0.8)',
                  backgroundColor: activeTab === item.key ? 'white' : 'transparent',
                  borderRadius: activeTab === item.key ? '0 25px 25px 0' : '0',
                  marginRight: activeTab === item.key ? '0' : '0',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== item.key) {
                    (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item.key) {
                    (e.target as HTMLElement).style.backgroundColor = 'transparent'
                  }
                }}
              >
                <div className="d-flex align-items-center">
                  <i className={item.icon} style={{ 
                    marginRight: '12px', 
                    fontSize: '16px',
                    width: '16px'
                  }}></i>
                  {item.label}
                </div>
                {item.badge && item.badge > 0 && (
                  <span style={{
                    backgroundColor: activeTab === item.key ? '#ff6b87' : 'rgba(255,255,255,0.3)',
                    color: activeTab === item.key ? 'white' : 'white',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: '600',
                    minWidth: '20px',
                    textAlign: 'center'
                  }}>{item.badge}</span>
                )}
              </Nav.Link>
            ))}
          </Nav>
        </div>

        {/* User Profile */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '12px'
          }}>
            <div className="d-flex align-items-center">
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '8px'
              }}>
                <i className="fas fa-user" style={{ color: 'white', fontSize: '14px' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  color: 'white', 
                  fontSize: '12px',
                  fontWeight: '600'
                }}>Bennett Admin</div>
                <div style={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  fontSize: '10px'
                }}>admin@bennett.com</div>
              </div>
              <Button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.8)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.1)'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'transparent'
                }}
              >
                <i className="fas fa-sign-out-alt"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: '250px',
        width: 'calc(100% - 250px)',
        padding: '20px',
        backgroundColor: '#F8F9FA'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          minHeight: 'calc(100vh - 40px)'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px 30px',
            borderBottom: '1px solid #E9ECEF',
            backgroundColor: 'white',
            borderRadius: '12px 12px 0 0'
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 style={{ 
                  margin: '0',
                  fontWeight: '600',
                  color: '#2C3E50'
                }}>Dashboard</h4>
                <p style={{ 
                  margin: '4px 0 0 0',
                  color: '#95A5A6',
                  fontSize: '14px'
                }}>Welcome back, manage your salon bookings</p>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  onClick={() => setActiveTab('bookings')}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white'
                  }}
                >
                  <i className="fas fa-plus me-2"></i>
                  Quick Action
                </Button>
                <Button 
                  href="/" 
                  target="_blank"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #E9ECEF',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#6C757D'
                  }}
                >
                  <i className="fas fa-external-link-alt me-2"></i>
                  View Booking Page
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ 
            padding: isMobile ? '15px' : '30px',
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard