import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap'
import { useEffect } from 'react'

const Home = () => {
  useEffect(() => {
    // Force dark background on the work showcase section
    const showcaseSection = document.querySelector('.work-showcase-section')
    if (showcaseSection) {
      (showcaseSection as HTMLElement).style.cssText = `
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 25%, #2c3e50 50%, #1a252f 100%) !important;
        background-color: #2c3e50 !important;
        min-height: 700px !important;
        padding: 100px 0 120px 0 !important;
        position: relative !important;
        overflow: hidden !important;
      `
    }
  }, [])

  const workSlideImages = [
    { src: '/images/gallery/manicures/manicure2.jpg', caption: 'Diseños Elegantes de Manicura' },
    { src: '/images/gallery/manicures/manicure3.jpg', caption: 'Arte Creativo en Uñas' },
    { src: '/images/gallery/manicures/manicure4.jpg', caption: 'Acabado Profesional' },
    { src: '/images/gallery/manicures/manicure5.jpg', caption: 'Colores Vibrantes' },
    { src: '/images/gallery/manicures/manicureclassic.jpg', caption: 'Manicura Francesa Clásica' },
    { src: '/images/gallery/manicures/manicureengaged.jpg', caption: 'Diseños para Ocasiones Especiales' },
    { src: '/images/gallery/manicures/manicurefresh.jpg', caption: 'Look Fresco de Verano' },
    { src: '/images/gallery/pedicures/pedicure-classic.JPG', caption: 'Pedicura Clásica' },
    { src: '/images/gallery/pedicures/pedicure.JPG', caption: 'Pedicura Profesional' },
    { src: '/images/gallery/pedicures/pedicureRed.JPG', caption: 'Pedicura Roja Elegante' }
  ]

  return (
    <>
      {/* Elegant Welcome Hero Section */}
      <section className="elegant-hero-section">
        <div className="hero-background-overlay"></div>
        <Container className="position-relative hero-container">
          <Row className="min-vh-100 align-items-center">
            <Col lg={6}>
              <div className="hero-content-welcome">
                <h1 className="hero-welcome-title">
                  Bienvenida a Bennett Salon de Beauté
                </h1>
                <p className="hero-welcome-subtitle">
                  Tu destino de belleza en <strong>Aguada, Puerto Rico</strong>. 
                  Donde cada cliente es tratada como una obra de arte y cada servicio 
                  es una experiencia única de elegancia y cuidado personal.
                </p>
                <div className="hero-buttons">
                  <Button href="/booking" size="lg" className="btn-coral-primary me-3">
                    📅 Reservar Cita
                  </Button>
                  <Button href="/gallery" variant="outline-light" size="lg">
                    🖼️ Ver Galería
                  </Button>
                </div>
                <div className="hero-social-links">
                  <p className="mb-2">Síguenos en redes sociales:</p>
                  <div className="social-buttons d-flex gap-3">
                    <a href="https://instagram.com/bennettsalondebeaute" target="_blank" className="btn btn-social-insta">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://facebook.com/bennettsalondebeaute" target="_blank" className="btn btn-social-fb">
                      <i className="fab fa-facebook"></i>
                    </a>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="hero-image-container">
                <div className="floating-card card-1">
                  <img src="/images/gallery/manicures/manicure2.jpg" alt="Manicura" />
                </div>
                <div className="floating-card card-2">
                  <img src="/images/gallery/pedicures/pedicureRed.JPG" alt="Pedicura" />
                </div>
                <div className="floating-card card-3">
                  <img src="/images/gallery/manicures/manicureclassic.jpg" alt="Manicura Clásica" />
                </div>
                <div className="floating-card card-4">
                  <img src="/images/gallery/manicures/manicure3.jpg" alt="Arte en Uñas" />
                </div>
                <div className="floating-card card-5">
                  <img src="/images/gallery/pedicures/pedicure.JPG" alt="Pedicura Profesional" />
                </div>
                <div className="main-hero-image">
                  <img 
                    src="/images/hero/hero.jpg" 
                    alt="Bennett Salon de Beauté Aguada PR" 
                    className="img-fluid rounded-4 shadow-2xl"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Work Showcase Carousel */}
      <section 
        className="work-showcase-section"
        style={{
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 25%, #2c3e50 50%, #1a252f 100%)',
          backgroundColor: '#2c3e50',
          minHeight: '700px',
          padding: '100px 0 120px 0'
        }}
      >
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-4">
              <span className="section-badge-coral">💎 NUESTRO TRABAJO</span>
              <h2 className="display-4 fw-bold mb-3 text-white" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.5)'}}>Resultados que Enamoran</h2>
              <p className="lead text-white mb-4" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.4)'}}>Cada cliente es una obra de arte. Mira lo que podemos crear para ti en Aguada, PR</p>
            </Col>
          </Row>
          <Row>
            <Col lg={11} className="mx-auto">
              <div className="carousel-container">
                <Carousel className="work-carousel" indicators={true} controls={true} interval={4000}>
                  {workSlideImages.map((image, index) => (
                    <Carousel.Item key={index}>
                      <div className="carousel-image-wrapper">
                        <img
                          className="d-block w-100"
                          src={image.src}
                          alt={image.caption}
                          style={{ height: '600px', objectFit: 'cover', borderRadius: '25px' }}
                        />
                        <div className="carousel-overlay">
                          <div className="carousel-content">
                            <h3 className="fw-bold mb-3">{image.caption}</h3>
                            <p className="mb-0">✨ Trabajo profesional realizado en Bennett Salon de Beauté - Aguada, PR</p>
                          </div>
                        </div>
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col className="text-center">
              <Button href="/gallery" size="lg" className="btn-gradient-purple px-5">
                🖼️ VER TODA LA GALERÍA
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Elegant Services Section */}
      <section className="elegant-services-section">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <div className="services-header">
                <h2 className="services-main-title">
                  Nuestros Servicios
                </h2>
                <p className="services-subtitle">
                  Experiencias de belleza personalizadas en el corazón de Aguada, Puerto Rico
                </p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={4} className="mb-5">
              <div className="elegant-service-card">
                <div className="service-number">01</div>
                <h3 className="elegant-service-title">
                  Manicuras Personalizadas de Diseño
                </h3>
                <p className="elegant-service-description">
                  Una sesión colaborativa que mapea las necesidades únicas de tus uñas, 
                  seguida de tratamientos personalizados y combinación de colores para 
                  lograr un acabado impecable y listo para fotografiar.
                </p>
                <div className="service-image-placeholder">
                  <img src="/images/gallery/manicures/manicure2.jpg" alt="Manicura Personalizada" className="img-fluid" />
                </div>
              </div>
            </Col>
            <Col lg={4} className="mb-5">
              <div className="elegant-service-card">
                <div className="service-number">02</div>
                <h3 className="elegant-service-title">
                  Pedicuras de Evento Especial
                </h3>
                <p className="elegant-service-description">
                  Estilismo integral para ocasiones especiales—maquillaje, acabado de cabello ligero, 
                  y soporte en el sitio—adaptado a la atmósfera, iluminación y tema de tu evento.
                </p>
                <div className="service-image-placeholder">
                  <img src="/images/gallery/pedicures/pedicureRed.JPG" alt="Pedicura de Evento" className="img-fluid" />
                </div>
              </div>
            </Col>
            <Col lg={4} className="mb-5">
              <div className="elegant-service-card">
                <div className="service-number">03</div>
                <h3 className="elegant-service-title">
                  Sesiones de Renovación y Brillo
                </h3>
                <p className="elegant-service-description">
                  Tratamientos progresivos enfocados en la vitalidad a largo plazo de tus uñas, 
                  combinando exfoliación avanzada, terapia de hidratación, y orientación de productos 
                  para una luminosidad duradera.
                </p>
                <div className="service-image-placeholder">
                  <img src="/images/gallery/manicures/manicureclassic.jpg" alt="Renovación y Brillo" className="img-fluid" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Location & Contact Section */}
      <section className="location-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <div className="location-content">
                <span className="section-badge-orange">📍 ENCUÉNTRANOS</span>
                <h2 className="display-5 fw-bold mb-3 text-gradient-orange">
                  Estamos en Aguada, PR
                </h2>
                <p className="lead mb-4" style={{fontSize: '1.2rem', fontWeight: 500}}>
                  Ubicados en el corazón de Aguada, Puerto Rico. 
                  ¡Fácil acceso y estacionamiento disponible!
                </p>
                <div className="contact-info mb-4">
                  <div className="contact-item">
                    <i className="fas fa-map-marker-alt text-orange"></i>
                    <span>Aguada, Puerto Rico</span>
                  </div>
                  <div className="contact-item">
                    <i className="fab fa-instagram text-orange"></i>
                    <span>@bennettsalondebeaute</span>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-calendar-check text-orange"></i>
                    <span>Reservas por DM o en línea</span>
                  </div>
                </div>
                <Button 
                  href="https://maps.google.com/?q=Aguada,PR+Bennett+Salon" 
                  target="_blank"
                  size="lg" 
                  className="btn-gradient-orange px-5"
                >
                  🗺️ ABRIR EN GOOGLE MAPS
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <div className="map-container">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.8!2d-67.1847!3d18.3831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c037f6d1b1b1b1b%3A0x1b1b1b1b1b1b1b1b!2sAguada%2C%20PR!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
                  width="100%" 
                  height="400" 
                  style={{ border: 0, borderRadius: '25px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bennett Salon de Beauté - Aguada, PR"
                ></iframe>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <Row className="text-center">
            <Col lg={10} className="mx-auto">
              <div className="cta-content">
                <span className="section-badge-pink">✨ LISTA PARA BRILLAR</span>
                <h2 className="display-4 fw-bold mb-3 text-white" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.5)'}}>
                  ¡Tu Transformación Te Espera!
                </h2>
                <p className="lead mb-4 text-white" style={{fontSize: '1.2rem', fontWeight: 500, textShadow: '1px 1px 4px rgba(0,0,0,0.4)'}}>
                  Únete a las cientos de clientas satisfechas en Aguada, PR. 
                  Reserva tu cita hoy y descubre por qué somos el salón #1 de la zona.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-4 mb-5">
                  <Button href="/booking" size="lg" className="btn-gradient-pink px-5 py-3">
                    📅 RESERVAR AHORA
                  </Button>
                  <Button href="/testimonials" size="lg" className="btn-outline-white px-5 py-3">
                    ⭐ VER TESTIMONIOS
                  </Button>
                </div>
                <div className="social-proof">
                  <p className="mb-3 text-white">🌟 Síguenos y mantente al día con nuestros trabajos</p>
                  <div className="d-flex justify-content-center gap-4">
                    <a href="https://instagram.com/bennettsalondebeaute" target="_blank" className="btn btn-social-lg btn-social-insta-lg">
                      <i className="fab fa-instagram"></i> Instagram
                    </a>
                    <a href="https://facebook.com/bennettsalondebeaute" target="_blank" className="btn btn-social-lg btn-social-fb-lg">
                      <i className="fab fa-facebook"></i> Facebook
                    </a>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Home