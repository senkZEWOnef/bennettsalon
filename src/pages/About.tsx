import { Container, Row, Col, Card } from 'react-bootstrap'

const About = () => {
  return (
    <>
      {/* Hero Section with Rules Image */}
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center min-vh-100" style={{ paddingTop: '80px' }}>
            <Col lg={8} className="text-center">
              <h1 className="display-3 fw-bold mb-4" style={{ 
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0px 0px 8px rgba(0,0,0,0.6)',
                color: 'white',
                fontWeight: '900'
              }}>
                Reglas del Salón
              </h1>
              <p className="lead mb-4" style={{ 
                textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0px 0px 6px rgba(0,0,0,0.5)',
                color: 'white',
                fontWeight: '600'
              }}>
                Para garantizar una experiencia placentera y profesional para todas nuestras clientas, 
                por favor lee y respeta nuestras políticas del salón.
              </p>
              <p className="mb-4" style={{ 
                textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0px 0px 6px rgba(0,0,0,0.5)',
                color: 'white',
                fontWeight: '500'
              }}>
                Estas reglas nos ayudan a mantener un ambiente cómodo, seguro y de calidad 
                para todas nuestras visitantes en Bennett Salon de Beauté.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Appointment Rules Section */}
      <section className="services-section">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center mb-5">
              <h2 className="display-4 fw-bold mb-4">Políticas de Citas</h2>
              <p className="lead">
                Para brindar el mejor servicio posible, seguimos estas políticas que 
                benefician tanto a nuestras clientas como a nuestro equipo.
              </p>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col md={6}>
              <Card className="salon-card">
                <Card.Body className="p-4">
                  <h4 className="mb-3">📅 Reservas y Cancelaciones</h4>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <strong>⏰ Puntualidad:</strong> Llegar 15 minutos antes de la cita para registro
                    </li>
                    <li className="mb-2">
                      <strong>❌ Cancelaciones:</strong> Mínimo 24 horas de anticipación
                    </li>
                    <li className="mb-2">
                      <strong>⌛ Tardanzas:</strong> Más de 15 minutos tarde puede requerir reagendar
                    </li>
                    <li className="mb-2">
                      <strong>🚫 No Shows:</strong> Tres ausencias sin aviso pueden requerir depósito
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="salon-card">
                <Card.Body className="p-4">
                  <h4 className="mb-3">💳 Pagos y Depósitos</h4>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <strong>💸 Formas de Pago:</strong> Efectivo, ATH Móvil, tarjetas principales
                    </li>
                    <li className="mb-2">
                      <strong>💰 Depósitos:</strong> Pueden requerirse para servicios largos
                    </li>
                    <li className="mb-2">
                      <strong>💎 Propinas:</strong> Se aprecian pero no son obligatorias
                    </li>
                    <li className="mb-2">
                      <strong>🧾 Precios:</strong> Sujetos a cambio, confirma al agendar
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Salon Rules Section */}
      <section className="testimonials-section">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2 className="display-4 fw-bold">Reglas del Salón</h2>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="salon-card text-center h-100">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ fontSize: '3rem', color: '#667eea' }}>
                    🧼
                  </div>
                  <Card.Title>Higiene y Salud</Card.Title>
                  <Card.Text>
                    Por favor ven con manos y pies limpios. Si tienes alguna infección o 
                    condición de salud, informa antes de la cita para todos estar seguros.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="salon-card text-center h-100">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ fontSize: '3rem', color: '#667eea' }}>
                    👶
                  </div>
                  <Card.Title>Niños</Card.Title>
                  <Card.Text>
                    Los niños son bienvenidos pero deben estar supervisados en todo momento. 
                    Por seguridad, no pueden correr o tocar equipos del salón.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="salon-card text-center h-100">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ fontSize: '3rem', color: '#667eea' }}>
                    📱
                  </div>
                  <Card.Title>Teléfonos</Card.Title>
                  <Card.Text>
                    Mantén el teléfono en silencio o vibración durante los servicios. 
                    Las llamadas largas pueden afectar la calidad de tu servicio.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="salon-card text-center h-100">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ fontSize: '3rem', color: '#667eea' }}>
                    🍽️
                  </div>
                  <Card.Title>Comida y Bebidas</Card.Title>
                  <Card.Text>
                    Solo agua está permitida en el área de servicios. 
                    Comida y otras bebidas pueden consumirse en el área de espera.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="salon-card text-center h-100">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ fontSize: '3rem', color: '#667eea' }}>
                    🤝
                  </div>
                  <Card.Title>Respeto Mutuo</Card.Title>
                  <Card.Text>
                    Tratamos a todas con respeto y esperamos lo mismo. 
                    Comportamiento ofensivo resultará en terminación del servicio.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="salon-card text-center h-100">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ fontSize: '3rem', color: '#667eea' }}>
                    📸
                  </div>
                  <Card.Title>Fotografías</Card.Title>
                  <Card.Text>
                    Pregunta antes de tomar fotos. Respetamos la privacidad de todas 
                    nuestras clientas y esperamos que hagas lo mismo.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default About