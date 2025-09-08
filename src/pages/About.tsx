import { Container, Row, Col, Card } from 'react-bootstrap'

const About = () => {
  return (
    <>
      {/* Hero Section with About Image */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-100" style={{ paddingTop: '80px' }}>
            <Col lg={6}>
              <h1 className="display-3 fw-bold mb-4">
                Acerca de Bennett Salon de Beauté
              </h1>
              <p className="lead mb-4">
                Bienvenida a nuestro mundo de belleza y elegancia. En Bennett Salon de Beauté, 
                creemos que cada cliente merece sentirse hermosa, segura y consentida.
              </p>
              <p className="mb-4">
                Fundado con una pasión por la excelencia y un compromiso de brindar servicios 
                de belleza de la más alta calidad, nos hemos convertido en un destino confiable 
                para quienes buscan cuidado profesional de uñas y tratamientos de belleza.
              </p>
            </Col>
            <Col lg={6} className="text-center">
              <img 
                src="/images/hero/about.jpg" 
                alt="Bennett Salon de Beauté Interior" 
                className="img-fluid rounded-4 shadow-lg"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Our Story Section */}
      <section className="services-section">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center mb-5">
              <h2 className="display-4 fw-bold mb-4">Nuestra Historia</h2>
              <p className="lead">
                Lo que comenzó como un sueño de crear un espacio acogedor para la belleza y el autocuidado 
                se ha convertido en un salón querido donde las clientas se vuelven familia.
              </p>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col md={6}>
              <Card className="salon-card">
                <Card.Body className="p-4">
                  <h4 className="mb-3">Nuestra Misión</h4>
                  <p className="mb-3">
                    Brindar servicios excepcionales de belleza en un ambiente cálido y profesional 
                    donde cada cliente se siente valorada y se va sintiéndose más segura y hermosa 
                    de lo que llegó.
                  </p>
                  <p className="mb-0">
                    Estamos comprometidas a usar productos de alta calidad, mantener los más altos 
                    estándares de limpieza y seguridad, y mejorar continuamente nuestras habilidades 
                    para ofrecer las últimas tendencias y técnicas en cuidado de uñas y belleza.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="salon-card">
                <Card.Body className="p-4">
                  <h4 className="mb-3">¿Por Qué Elegirnos?</h4>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <strong>✨ Excelencia Profesional:</strong> Años de experiencia y capacitación continua
                    </li>
                    <li className="mb-2">
                      <strong>🌟 Atención Personal:</strong> Cada cliente recibe cuidado individualizado
                    </li>
                    <li className="mb-2">
                      <strong>🧼 Estándares de Higiene:</strong> Protocolos estrictos de sanitización y seguridad
                    </li>
                    <li className="mb-2">
                      <strong>💎 Productos de Calidad:</strong> Solo las mejores marcas y materiales
                    </li>
                    <li className="mb-0">
                      <strong>🏠 Ambiente Acogedor:</strong> Un entorno cómodo y relajante
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Values Section */}
      <section className="testimonials-section">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2 className="display-4 fw-bold">Nuestros Valores</h2>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="salon-card text-center h-100">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ fontSize: '3rem', color: '#667eea' }}>
                    💖
                  </div>
                  <Card.Title>Pasión</Card.Title>
                  <Card.Text>
                    Somos apasionadas por la belleza y nos dedicamos a ayudar a nuestras clientas 
                    a lucir y sentirse en su mejor momento.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="salon-card text-center h-100">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ fontSize: '3rem', color: '#667eea' }}>
                    🎯
                  </div>
                  <Card.Title>Precisión</Card.Title>
                  <Card.Text>
                    Atención al detalle y precisión en cada servicio que brindamos, 
                    garantizando resultados impecables cada vez.
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
                  <Card.Title>Respeto</Card.Title>
                  <Card.Text>
                    Cada cliente es tratada con respeto, cuidado y la atención individual 
                    que merece en nuestro salón.
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