import { Container, Row, Col, Button, Carousel } from "react-bootstrap";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookingCTASection from "../components/BookingCTASection";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Force dark background on the work showcase section
    const showcaseSection = document.querySelector(".work-showcase-section");
    if (showcaseSection) {
      (showcaseSection as HTMLElement).style.cssText = `
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 25%, #2c3e50 50%, #1a252f 100%) !important;
        background-color: #2c3e50 !important;
        min-height: 700px !important;
        padding: 100px 0 120px 0 !important;
        position: relative !important;
        overflow: hidden !important;
      `;
    }
  }, []);

  const workSlideImages = [
    {
      src: "/images/gallery/manicures/manicure2.jpg",
      caption: "Diseños Elegantes de Manicura",
    },
    {
      src: "/images/gallery/manicures/manicure3.jpg",
      caption: "Arte Creativo en Uñas",
    },
    {
      src: "/images/gallery/manicures/manicure4.jpg",
      caption: "Acabado Profesional",
    },
    {
      src: "/images/gallery/manicures/manicure5.jpg",
      caption: "Colores Vibrantes",
    },
    {
      src: "/images/gallery/manicures/manicureclassic.jpg",
      caption: "Manicura Francesa Clásica",
    },
    {
      src: "/images/gallery/manicures/manicureengaged.jpg",
      caption: "Diseños para Ocasiones Especiales",
    },
    {
      src: "/images/gallery/manicures/manicurefresh.jpg",
      caption: "Look Fresco de Verano",
    },
    {
      src: "/images/gallery/pedicures/pedicure-classic.JPG",
      caption: "Pedicura Clásica",
    },
    {
      src: "/images/gallery/pedicures/pedicure.JPG",
      caption: "Pedicura Profesional",
    },
    {
      src: "/images/gallery/pedicures/pedicureRed.JPG",
      caption: "Pedicura Roja Elegante",
    },
  ];

  return (
    <>
      {/* Elegant Welcome Hero Section */}
      <section className="elegant-hero-section">
        <div className="hero-background-overlay"></div>
        <Container className="position-relative hero-container">
          <Row className="min-vh-100 align-items-center justify-content-center">
            <Col lg={8} className="text-center">
              <div className="hero-content-welcome">
                <h1 className="hero-welcome-title">
                  Bienvenidos a Bennett Salon de Beauté
                </h1>
                <p className="hero-welcome-subtitle" style={{ fontWeight: '800' }}>
                  Tu destino de <span style={{ color: '#ff6b87', fontWeight: '900', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>belleza</span> en <strong style={{ color: '#4ecdc4', fontWeight: '900', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Aguada, Puerto Rico</strong>.
                  <br />
                  <span style={{ color: '#ffd93d', fontWeight: '900', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Donde cada cliente es tratada como una obra de arte</span> y cada
                  servicio es una experiencia única de <strong style={{ color: '#ff8a80', fontWeight: '900', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>elegancia</strong> y <strong style={{ color: '#a8e6cf', fontWeight: '900', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>cuidado
                  personal</strong>.
                </p>
                <div className="hero-buttons">
                  <Button
                    onClick={() => navigate('/booking')}
                    size="lg"
                    className="me-3 mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #ff6b87 0%, #ff8a80 100%)',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '15px 35px',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      boxShadow: '0 8px 25px rgba(255, 107, 135, 0.4)',
                      transition: 'all 0.3s ease',
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.transform = 'translateY(-3px)';
                      (e.target as HTMLElement).style.boxShadow = '0 12px 35px rgba(255, 107, 135, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.transform = 'translateY(0)';
                      (e.target as HTMLElement).style.boxShadow = '0 8px 25px rgba(255, 107, 135, 0.4)';
                    }}
                  >
                    💅 Reservar Cita
                  </Button>
                  <Button
                    href="#gallery-section"
                    size="lg"
                    className="mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '15px 35px',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      boxShadow: '0 8px 25px rgba(78, 205, 196, 0.4)',
                      transition: 'all 0.3s ease',
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.transform = 'translateY(-3px)';
                      (e.target as HTMLElement).style.boxShadow = '0 12px 35px rgba(78, 205, 196, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.transform = 'translateY(0)';
                      (e.target as HTMLElement).style.boxShadow = '0 8px 25px rgba(78, 205, 196, 0.4)';
                    }}
                  >
                    ✨ Ver Galería
                  </Button>
                </div>
                <div className="hero-social-links">
                  <p className="mb-2" style={{ fontWeight: '900', fontSize: '1.2rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)', color: '#ffd93d' }}>Síguenos en redes sociales:</p>
                  <div className="social-buttons d-flex gap-3 justify-content-center">
                    <a
                      href="https://instagram.com/bennettsalondebeaute"
                      target="_blank"
                      className="btn btn-social-insta"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                      </svg>
                    </a>
                    <a
                      href="https://facebook.com/bennettsalondebeaute"
                      target="_blank"
                      className="btn btn-social-fb"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                      </svg>
                    </a>
                    <a
                      href="https://wa.me/17878682382"
                      target="_blank"
                      className="btn btn-social-whatsapp"
                      style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-whatsapp" viewBox="0 0 16 16">
                        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section - Elegant Carousel Style */}
      <section style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        padding: '100px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
          zIndex: 1
        }}></div>

        <Container style={{ position: 'relative', zIndex: 10 }}>
          {/* Header */}
          <Row>
            <Col className="text-center mb-5">
              <h2 style={{ 
                color: 'white', 
                fontSize: '3.5rem', 
                fontWeight: '800',
                textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                marginBottom: '20px'
              }}>
                ✨ Nuestros Servicios ✨
              </h2>
              <p style={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: '1.3rem', 
                fontWeight: '400',
                textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
              }}>
                Experiencias de belleza profesionales en Aguada, Puerto Rico
              </p>
            </Col>
          </Row>

          {/* Services Grid - New Layout */}
          <Row className="g-4 align-items-stretch">
            {/* Left Column - Manicure & Pedicure */}
            <Col lg={6}>
              <Row className="g-3 h-100">
                {/* Manicure */}
                <Col md={12}>
                  <div style={{
                    background: 'linear-gradient(45deg, #ff9a9e 0%, #fecfef 100%)',
                    borderRadius: '25px',
                    padding: '25px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Row className="align-items-center">
                      <Col md={4} className="text-center">
                        <div style={{ 
                          background: 'rgba(255,255,255,0.9)', 
                          borderRadius: '15px', 
                          padding: '15px',
                          marginBottom: '15px'
                        }}>
                          <span style={{ fontSize: '3rem', display: 'block' }}>💅</span>
                          <h5 style={{ color: '#ff6b87', fontWeight: '700', margin: 0 }}>MANICURAS</h5>
                        </div>
                      </Col>
                      <Col md={8}>
                        <p style={{ color: 'white', fontWeight: '600', fontSize: '1rem', margin: 0, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                          Manicuras clásicas, en gel, diseños personalizados y nail art profesional para todas las ocasiones.
                        </p>
                      </Col>
                    </Row>
                    <div className="mt-3">
                      <img 
                        src="/images/gallery/manicures/manicure2.jpg" 
                        alt="Manicuras" 
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '15px' }}
                      />
                    </div>
                  </div>
                </Col>

                {/* Pedicure */}
                <Col md={12}>
                  <div style={{
                    background: 'linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)',
                    borderRadius: '25px',
                    padding: '25px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Row className="align-items-center">
                      <Col md={4} className="text-center">
                        <div style={{ 
                          background: 'rgba(255,255,255,0.9)', 
                          borderRadius: '15px', 
                          padding: '15px',
                          marginBottom: '15px'
                        }}>
                          <span style={{ fontSize: '3rem', display: 'block' }}>🦶</span>
                          <h5 style={{ color: '#4ecdc4', fontWeight: '700', margin: 0 }}>PEDICURAS</h5>
                        </div>
                      </Col>
                      <Col md={8}>
                        <p style={{ color: 'white', fontWeight: '600', fontSize: '1rem', margin: 0, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                          Pedicuras relajantes, spa para pies y tratamientos especiales para la salud y belleza de tus pies.
                        </p>
                      </Col>
                    </Row>
                    <div className="mt-3">
                      <img 
                        src="/images/gallery/pedicures/pedicureRed.JPG" 
                        alt="Pedicuras" 
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '15px' }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>

            {/* Right Column - Combos & Onyfix */}
            <Col lg={6}>
              <Row className="g-3 h-100">
                {/* Combos */}
                <Col md={12}>
                  <div style={{
                    background: 'linear-gradient(45deg, #ffecd2 0%, #fcb69f 100%)',
                    borderRadius: '25px',
                    padding: '25px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Row className="align-items-center">
                      <Col md={4} className="text-center">
                        <div style={{ 
                          background: 'rgba(255,255,255,0.9)', 
                          borderRadius: '15px', 
                          padding: '15px',
                          marginBottom: '15px'
                        }}>
                          <span style={{ fontSize: '3rem', display: 'block' }}>✨</span>
                          <h5 style={{ color: '#ff8a80', fontWeight: '700', margin: 0 }}>COMBOS</h5>
                        </div>
                      </Col>
                      <Col md={8}>
                        <p style={{ color: 'white', fontWeight: '600', fontSize: '1rem', margin: 0, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                          Manicura + Pedicura. Paquetes especiales con descuentos para tu cuidado completo de belleza.
                        </p>
                      </Col>
                    </Row>
                    <div className="mt-3">
                      <img 
                        src="/images/gallery/manicures/manicureclassic.jpg" 
                        alt="Combos" 
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '15px' }}
                      />
                    </div>
                  </div>
                </Col>

                {/* Onyfix Certification */}
                <Col md={12}>
                  <div style={{
                    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '25px',
                    padding: '25px',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                    border: '3px solid #ffd93d',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      background: '#ffd93d',
                      color: '#333',
                      padding: '5px 15px',
                      borderRadius: '0 20px 0 20px',
                      fontSize: '0.8rem',
                      fontWeight: '800'
                    }}>
                      CERTIFICADO
                    </div>
                    
                    <div className="text-center mb-3">
                      <span style={{ fontSize: '2.5rem', color: '#ffd93d' }}>🩺</span>
                      <h4 style={{ color: 'white', fontWeight: '800', margin: '10px 0 5px 0' }}>
                        Servicio Onyfix
                      </h4>
                      <p style={{ color: '#ffd93d', fontWeight: '700', fontSize: '1.1rem', margin: '0 0 10px 0' }}>
                        ¡No más dolor para ti!
                      </p>
                    </div>
                    
                    <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.9rem', textAlign: 'center', lineHeight: '1.4', marginBottom: '15px' }}>
                      En Bennett ofrecemos el servicio correctivo Onyfix. Con este sistema innovador 
                      podemos tratar y corregir uñas encarnadas, onicocriptosis y uñas involutas sin dolor.
                    </p>
                    
                    <div className="text-center">
                      <img 
                        src="/images/onyx.JPG" 
                        alt="Onyfix System" 
                        style={{ width: '80%', height: '120px', objectFit: 'contain', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', padding: '10px' }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Booking CTA Section */}
      <BookingCTASection />

      {/* Work Showcase Carousel */}
      <section
        id="gallery-section"
        className="work-showcase-section"
        style={{
          background:
            "linear-gradient(135deg, #2c3e50 0%, #34495e 25%, #2c3e50 50%, #1a252f 100%)",
          backgroundColor: "#2c3e50",
          minHeight: "700px",
          padding: "100px 0 120px 0",
        }}
      >
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-4">
              <span className="section-badge-coral">💎 NUESTRO TRABAJO</span>
              <h2
                className="display-4 fw-bold mb-3 text-white"
                style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
              >
                Resultados que Enamoran
              </h2>
              <p
                className="lead text-white mb-4"
                style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.4)" }}
              >
                Cada cliente es una obra de arte. Mira lo que podemos crear para
                ti en Aguada, PR
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={11} className="mx-auto">
              <div
                className="carousel-container"
                style={{ cursor: "pointer" }}
                onClick={() => navigate('/gallery')}
              >
                <Carousel
                  className="work-carousel"
                  indicators={true}
                  controls={true}
                  interval={4000}
                >
                  {workSlideImages.map((image, index) => (
                    <Carousel.Item key={index}>
                      <div className="carousel-image-wrapper">
                        <img
                          className="d-block w-100"
                          src={image.src}
                          alt={image.caption}
                          style={{
                            height: "600px",
                            objectFit: "cover",
                            borderRadius: "25px",
                          }}
                        />
                        <div className="carousel-overlay">
                          <div className="carousel-content">
                            <h3 className="fw-bold mb-3">{image.caption}</h3>
                            <p className="mb-0">
                              ✨ Trabajo profesional realizado en Bennett Salon
                              de Beauté - Aguada, PR
                            </p>
                            <p className="mt-2">
                              <small>
                                👆 Haz clic para ver toda la galería
                              </small>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>
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
                <p
                  className="lead mb-4"
                  style={{ fontSize: "1.2rem", fontWeight: 500 }}
                >
                  Ubicados en el corazón de Aguada, Puerto Rico. ¡Fácil acceso y
                  estacionamiento disponible!
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
                  style={{
                    border: 0,
                    borderRadius: "25px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bennett Salon de Beauté - Aguada, PR"
                ></iframe>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;
